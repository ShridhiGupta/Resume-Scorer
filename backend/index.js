const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: path.join(__dirname, "uploads"),
});

app.post("/analyze", upload.single("resume"), (req, res) => {
  const jobDescription = req.body.jobDescription || "";

  if (!req.file || !jobDescription.trim()) {
    return res.status(400).json({
      error: "Resume file and job description are required.",
    });
  }

  const resumePath = req.file.path;

  const pythonProcess = spawn("python", [
    path.join(__dirname, "..", "ai-service", "analyze.py"),
    "--resume",
    resumePath,
    "--jd",
    jobDescription,
  ]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Python error:", errorOutput);
      return res.status(500).json({
        error: "Analysis failed.",
        details: errorOutput,
      });
    }

    try {
      const result = JSON.parse(output);
      return res.json(result);
    } catch (err) {
      console.error("Failed to parse analysis output:", err);
      return res.status(500).json({
        error: "Invalid analysis response from AI service.",
      });
    }
  });
});

app.get("/", (_req, res) => {
  res.json({ status: "Resume Scorer backend running" });
});

app.listen(port, () => {
  console.log(`Resume Scorer backend listening on port ${port}`);
});

