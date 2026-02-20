import os
import tempfile
import json
import logging
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from analyze import compute_scores, load_resume_text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Allowed file extensions
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "AI Resume Analysis Service",
        "version": "1.0.0"
    })

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    """Main analysis endpoint"""
    try:
        # Check if request contains file and job description
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400
        
        if 'jobDescription' not in request.form:
            return jsonify({"error": "No job description provided"}), 400
        
        file = request.files['resume']
        job_description = request.form['jobDescription']
        use_llm = request.form.get('use_llm', 'true').lower() == 'true'
        
        # Validate file
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                "error": "File type not allowed. Allowed types: txt, pdf, doc, docx"
            }), 400
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        with tempfile.NamedTemporaryFile(delete=False, suffix=filename) as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            # Load resume text
            resume_text = load_resume_text(temp_path)
            
            if not resume_text.strip():
                return jsonify({"error": "Could not extract text from resume file"}), 400
            
            # Perform analysis
            logger.info(f"Analyzing resume: {filename}")
            result = compute_scores(resume_text, job_description, use_llm=use_llm)
            
            logger.info(f"Analysis completed. Overall match: {result['overallMatch']}%")
            return jsonify(result)
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_path)
            except OSError:
                pass
                
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return jsonify({"error": "Internal server error during analysis"}), 500

@app.route('/analyze-text', methods=['POST'])
def analyze_text():
    """Analyze resume text directly (no file upload)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        resume_text = data.get('resumeText', '')
        job_description = data.get('jobDescription', '')
        use_llm = data.get('use_llm', True)
        
        if not resume_text.strip():
            return jsonify({"error": "Resume text is required"}), 400
        
        if not job_description.strip():
            return jsonify({"error": "Job description is required"}), 400
        
        # Perform analysis
        logger.info("Analyzing resume text")
        result = compute_scores(resume_text, job_description, use_llm=use_llm)
        
        logger.info(f"Analysis completed. Overall match: {result['overallMatch']}%")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error during text analysis: {str(e)}")
        return jsonify({"error": "Internal server error during analysis"}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16MB"}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'false').lower() == 'true'
    
    logger.info(f"Starting AI Resume Analysis Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
