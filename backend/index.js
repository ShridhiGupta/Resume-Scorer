const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB max file size
  },
});

app.post("/analyze", upload.single("resume"), async (req, res) => {
  const jobDescription = req.body.jobDescription || "";

  if (!req.file || !jobDescription.trim()) {
    return res.status(400).json({
      error: "Resume file and job description are required.",
    });
  }

  try {
    // Create form data to send to AI service
    const formData = new FormData();
    formData.append("resume", req.file.buffer, req.file.originalname);
    formData.append("jobDescription", jobDescription);
    formData.append("use_llm", "true"); // Enable LLM enhancement

    // Call AI service web API
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:5000";
    const response = await axios.post(`${aiServiceUrl}/analyze`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 60000, // 60 second timeout
    });

    // Return the analysis result
    return res.json(response.data);

  } catch (error) {
    console.error("AI service error:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: "AI service is unavailable. Please ensure the AI service is running on port 5000.",
      });
    }
    
    if (error.response) {
      // AI service returned an error
      return res.status(error.response.status).json(error.response.data);
    }
    
    return res.status(500).json({
      error: "Analysis failed.",
      details: error.message,
    });
  }
});

app.get("/", (_req, res) => {
  res.json({ status: "Resume Scorer backend running" });
});

app.listen(port, () => {
  console.log(`Resume Scorer backend listening on port ${port}`);
});

