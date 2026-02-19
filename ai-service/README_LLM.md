# Local LLM Integration for Resume Analysis

This document explains how to set up and use local LLM integration for enhanced resume analysis in the ai-service.

## Overview

The ai-service now supports integration with local LLM servers running on your GPU, providing enhanced analysis capabilities beyond traditional scoring methods. The system supports:

- **Ollama** - Easy-to-use local LLM server
- **llama.cpp** - High-performance LLM inference 
- **HuggingFace** - Local inference server

## Setup Instructions

### Option 1: Ollama (Recommended)

1. **Install Ollama**
   ```bash
   # Download and install from https://ollama.com/
   # Or on Linux:
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull a Model**
   ```bash
   # For general analysis
   ollama pull llama3.2
   
   # For code-heavy resumes
   ollama pull codellama
   
   # For balanced performance
   ollama pull mistral
   ```

3. **Start Ollama Server**
   ```bash
   ollama serve
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

### Option 2: llama.cpp

1. **Build llama.cpp with CUDA**
   ```bash
   git clone https://github.com/ggerganov/llama.cpp
   cd llama.cpp
   make LLAMA_CUBLAS=1
   ```

2. **Download a Model**
   ```bash
   # Example: Download Llama 3 8B
   wget https://huggingface.co/MaziyarPanahi/Meta-Llama-3-8B-Instruct-GGUF/resolve/main/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf
   ```

3. **Start Server**
   ```bash
   ./main -m Meta-Llama-3-8B-Instruct.Q4_K_M.gguf --host 0.0.0.0 --port 8080 --ctx-size 4096 -ngl 35
   ```

### Option 3: HuggingFace Inference Server

1. **Install Dependencies**
   ```bash
   pip install transformers accelerate torch
   ```

2. **Create Server Script**
   ```python
   # server.py
   from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
   import json
   from flask import Flask, request, jsonify

   app = Flask(__name__)

   model_name = "microsoft/DialoGPT-medium"
   tokenizer = AutoTokenizer.from_pretrained(model_name)
   model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")
   generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

   @app.route("/generate", methods=["POST"])
   def generate():
       data = request.json
       outputs = generator(data["inputs"], **data.get("parameters", {}))
       return jsonify(outputs)

   if __name__ == "__main__":
       app.run(host="0.0.0.0", port=5000)
   ```

3. **Start Server**
   ```bash
   python server.py
   ```

## Configuration

### Environment Variables

Create a `.env` file in the ai-service directory:

```bash
# Server type: ollama, llamacpp, or huggingface
LLM_SERVER_TYPE=ollama

# Server URL (optional - uses defaults if not specified)
LLM_BASE_URL=http://localhost:11434

# Model name
LLM_MODEL=llama3.2

# Generation parameters
LLM_TIMEOUT=30
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=1000

# Enable/disable LLM enhancement
ENABLE_LLM=true
```

### Default Settings

- **Ollama**: `http://localhost:11434` with `llama3.2` model
- **llama.cpp**: `http://localhost:8080` with `default` model  
- **HuggingFace**: `http://localhost:5000` with `microsoft/DialoGPT-medium`

## Usage

### Command Line

```bash
# Enhanced analysis with LLM (default)
python analyze.py --resume resume.pdf --jd "Job description here"

# Traditional analysis without LLM
python analyze.py --resume resume.pdf --jd "Job description here" --no-llm
```

### Python API

```python
from analyze import compute_scores
from local_llm import get_llm_client

# Traditional + LLM enhanced analysis
result = compute_scores(resume_text, job_description, use_llm=True)

# Check if LLM was used
if result.get("analysisMethod") == "enhanced_llm":
    print("LLM analysis available:")
    print(result.get("llmAnalysis", {}))
```

## Output Format

The enhanced analysis includes additional fields:

```json
{
  "overallMatch": 85.2,
  "semanticMatch": 78.5,
  "skillsMatch": 90.0,
  "experienceMatch": 80.0,
  "educationMatch": 85.0,
  "keywordsMatch": 82.3,
  "matchedSkills": ["python", "react", "aws"],
  "missingSkills": ["kubernetes", "terraform"],
  "recommendations": [
    "Highlight your AWS certifications more prominently",
    "Consider gaining experience with Kubernetes"
  ],
  "strengths": [
    "Strong Python and React skills",
    "Good experience alignment with job requirements"
  ],
  "analysisMethod": "enhanced_llm",
  "llmAnalysis": {
    "overall_assessment": "Strong candidate with good technical foundation",
    "key_strengths": [
      "Extensive Python experience",
      "React proficiency",
      "Cloud computing knowledge"
    ],
    "improvement_areas": [
      "Add more quantifiable achievements",
      "Include DevOps experience"
    ],
    "recommendation_score": 88,
    "detailed_feedback": "The candidate demonstrates strong technical skills..."
  }
}
```

## GPU Requirements

### Minimum Requirements
- **GPU Memory**: 6GB VRAM (for smaller models)
- **System RAM**: 16GB
- **CUDA**: 11.0+ (for NVIDIA GPUs)

### Recommended Requirements
- **GPU Memory**: 12GB+ VRAM
- **System RAM**: 32GB+
- **CUDA**: 12.0+

### Model Sizes
- **Small (2-4B parameters)**: 6-8GB VRAM
- **Medium (7-8B parameters)**: 10-12GB VRAM  
- **Large (13B+ parameters)**: 16GB+ VRAM

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure LLM server is running
   - Check port in configuration
   - Verify firewall settings

2. **Out of Memory**
   - Use smaller model (quantized versions)
   - Reduce context size
   - Close other GPU applications

3. **Slow Response**
   - Check GPU utilization
   - Consider model quantization
   - Adjust batch size

4. **Poor Analysis Quality**
   - Try different model
   - Adjust temperature (0.1-0.5 for more focused output)
   - Increase max_tokens for detailed analysis

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Testing Connection

```python
from local_llm import get_llm_client

client = get_llm_client()
if client:
    print("LLM server connected successfully")
else:
    print("Failed to connect to LLM server")
```

## Performance Tips

1. **Model Selection**: Use quantized models (Q4_K_M) for better performance
2. **Batch Processing**: Process multiple resumes in sequence
3. **Caching**: Cache model loading between analyses
4. **GPU Optimization**: Ensure CUDA is properly configured

## Security Considerations

- LLM server runs locally - no external API calls
- Resume data stays on your machine
- Configure server to bind to localhost only
- Use firewall to restrict external access

## Contributing

To add support for additional LLM servers:

1. Extend `LocalLLMClient` class
2. Add server type to defaults
3. Implement API call method
4. Update documentation

## License

This integration follows the same license as the main project.
