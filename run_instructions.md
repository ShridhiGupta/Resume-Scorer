# Resume-Matcher Development Setup & Run Instructions

Complete guide to run the Resume-Matcher project in development mode with all components including the enhanced AI service with Ollama integration.

## Project Architecture

```
Resume-Matcher/
├── frontend/          # Next.js React application (Port 3000)
├── backend/           # Node.js Express API (Port 4000)
├── ai-service/        # Python AI analysis service (Port 8000)
└── Ollama Server      # Local LLM server (Port 11434)
```

## Prerequisites

### System Requirements
- **Node.js**: 18+ (for frontend/backend)
- **Python**: 3.8+ (for ai-service)
- **GPU**: NVIDIA GPU with CUDA 11.0+ (for Ollama)
- **RAM**: 16GB+ recommended
- **Storage**: 10GB+ free space

### Required Software
1. **Node.js & npm** - [Download here](https://nodejs.org/)
2. **Python** - [Download here](https://python.org/)
3. **Git** - [Download here](https://git-scm.com/)

---

## Method 1: Quick Start (Recommended)

### Step 1: Install Ollama (for Enhanced AI Analysis)

#### Option A: Windows Installer (Easiest)
1. Download from [https://ollama.com/](https://ollama.com/)
2. Run the installer
3. Restart your terminal

#### Option B: PowerShell Command
```powershell
# Run as Administrator
winget install Ollama.Ollama
```

### Step 2: Setup Ollama Model
```powershell
# Pull the Llama 3.2 model (4.7GB download)
ollama pull llama3.2

# Start Ollama server (runs in background)
ollama serve
```

### Step 3: Run All Services
```powershell
# Navigate to project root
cd "c:\Users\HP\Downloads\Resume-Matcher"

# Start frontend and backend (run in separate terminals)
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev

# Terminal 3: AI Service (optional - uses traditional analysis if not running)
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python analyze.py --resume test.txt --jd "job description"
```

### Step 4: Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **AI Service**: Standalone (called by backend)

---

## Method 2: Manual Setup (Full Control)

### 1. AI Service Setup

#### Create Virtual Environment
```powershell
cd ai-service
python -m venv .venv
.venv\Scripts\activate
```

#### Install Dependencies
```powershell
pip install -r requirements.txt
```

#### Configure AI Service
```powershell
# Copy environment configuration
copy .env.example .env

# Edit .env file with your settings:
# LLM_SERVER_TYPE=ollama
# LLM_BASE_URL=http://localhost:11434
# LLM_MODEL=llama3.2
# ENABLE_LLM=true
```

#### Test AI Service
```powershell
# Test with sample resume
python analyze.py --resume resume_clean.txt --jd "We are looking for an AI Engineer..."

# Test without LLM (fallback mode)
python analyze.py --resume resume_clean.txt --jd "job description" --no-llm
```

### 2. Backend Setup

#### Install Dependencies
```powershell
cd backend
npm install
```

#### Start Backend Server
```powershell
npm run dev
# Server runs on http://localhost:4000
```

#### Test Backend API
```powershell
# Test health endpoint
curl http://localhost:4000/health

# Test resume upload (if available)
curl -X POST -F "resume=@resume_clean.txt" http://localhost:4000/analyze
```

### 3. Frontend Setup

#### Install Dependencies
```powershell
cd frontend
npm install
```

#### Start Frontend Development Server
```powershell
npm run dev
# Application runs on http://localhost:3000
```

---

## Method 3: Development Script (Linux/macOS Style)

For Windows PowerShell users, create this script:

### Create dev.ps1
```powershell
# dev.ps1 - Windows PowerShell version of dev.sh

$ROOT_DIR = Get-Location
Write-Host "Using project root: $ROOT_DIR"

Write-Host "Ensuring Python AI service dependencies are installed..."
if (Test-Path "$ROOT_DIR\ai-service\.venv") {
    & "$ROOT_DIR\ai-service\.venv\Scripts\pip.exe" install -r "$ROOT_DIR\ai-service\requirements.txt" 2>$null
} else {
    Write-Host "Warning: Python virtualenv not found at ai-service\.venv"
    Write-Host "Create it before running: python -m venv .venv"
}

Write-Host "Starting backend on http://localhost:4000 ..."
Start-Job -ScriptBlock {
    cd "$using:ROOT_DIR\backend"
    npm install
    npm run dev
}

Write-Host "Starting frontend on http://localhost:3000 ..."
cd "$ROOT_DIR\frontend"
npm install
npm run dev

# Keep script running
Wait-Job *
```

### Run Development Script
```powershell
.\dev.ps1
```

---

## Method 4: Docker Setup (Advanced)

### Create docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./backend:/app
      - /app/node_modules

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    volumes:
      - ./ai-service:/app
    environment:
      - LLM_SERVER_TYPE=ollama
      - LLM_BASE_URL=http://host.docker.internal:11434

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0

volumes:
  ollama_data:
```

### Run with Docker
```powershell
docker-compose up --build
```

---

## Ollama Integration Testing

### Test Ollama Connection
```powershell
# Check Ollama is running
ollama list

# Test model
ollama run llama3.2 "Hello, how are you?"

# Check server status
curl http://localhost:11434/api/tags
```

### Test Enhanced AI Analysis
```powershell
cd ai-service

# With Ollama (enhanced analysis)
python analyze.py --resume resume_clean.txt --jd "AI Engineer position requiring Python, LLM experience"

# Without Ollama (traditional analysis)
python analyze.py --resume resume_clean.txt --jd "AI Engineer position" --no-llm
```

### Expected Output Comparison

#### Traditional Analysis
```json
{
  "overallMatch": 67.7,
  "semanticMatch": 70.0,
  "skillsMatch": 100.0,
  "analysisMethod": "traditional"
}
```

#### Enhanced LLM Analysis
```json
{
  "overallMatch": 72.5,
  "semanticMatch": 70.0,
  "skillsMatch": 100.0,
  "analysisMethod": "enhanced_llm",
  "llmAnalysis": {
    "overall_assessment": "Strong candidate with excellent AI/ML background",
    "key_strengths": ["LLM experience", "Python proficiency", "Automation skills"],
    "improvement_areas": ["Add more quantifiable achievements"],
    "recommendation_score": 85,
    "detailed_feedback": "Candidate demonstrates strong technical foundation..."
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Ollama Not Found
```powershell
# Solution: Use full path or restart terminal
& "C:\Users\HP\AppData\Local\Programs\Ollama\ollama.exe" pull llama3.2
```

#### 2. Python Virtual Environment Issues
```powershell
# Solution: Recreate virtual environment
cd ai-service
rmdir .venv /s /q
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

#### 3. Port Conflicts
```powershell
# Check what's using ports
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :11434

# Kill processes if needed
taskkill /PID <PID> /F
```

#### 4. Node.js Dependencies
```powershell
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 5. GPU Memory Issues with Ollama
```powershell
# Use smaller model
ollama pull llama3.2:3b
# Or reduce context size in .env
LLM_MAX_TOKENS=500
```

### Debug Mode

#### Enable Verbose Logging
```powershell
# AI Service debug
$env:PYTHONPATH = "."
python -v analyze.py --resume resume.txt --jd "test"

# Backend debug
$env:DEBUG = "*"
npm run dev

# Frontend debug
npm run dev -- --verbose
```

---

## Development Workflow

### 1. Daily Development Setup
```powershell
# Terminal 1: Start Ollama (once per session)
ollama serve

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend  
npm run dev

# Terminal 4: AI Service (when testing)
cd ai-service
.venv\Scripts\activate
python analyze.py --resume test.txt --jd "test jd"
```

### 2. Testing Workflow
```powershell
# Test AI service independently
cd ai-service
python analyze.py --resume resume_clean.txt --jd "Software Engineer role"

# Test backend API
curl -X POST http://localhost:4000/analyze -H "Content-Type: application/json" -d '{"resume":"...","jd":"..."}'

# Test frontend in browser
# Navigate to http://localhost:3000
# Upload resume and enter job description
```

### 3. Production Build Test
```powershell
# Build frontend
cd frontend
npm run build

# Test backend with production frontend
cd backend
NODE_ENV=production npm start
```

---

## Performance Optimization

### 1. Ollama Optimization
```powershell
# Use quantized models for better performance
ollama pull llama3.2:3b-q4_K_M

# Set environment variables for GPU optimization
$env:OLLAMA_GPU_LAYERS = "35"
$env:OLLAMA_MAX_LOADED_MODELS = "1"
```

### 2. AI Service Optimization
```powershell
# Edit .env for performance
LLM_TIMEOUT=15
LLM_MAX_TOKENS=500
LLM_TEMPERATURE=0.2
```

### 3. Frontend Optimization
```powershell
# Enable Next.js optimizations
cd frontend
npm run build
npm run start
```

---

## Security Notes

### 1. Local Development Only
- Ollama server runs locally (no external API calls)
- Resume data stays on your machine
- Configure firewall to block external access to ports 3000, 4000, 11434

### 2. Environment Variables
```powershell
# Never commit .env files with real data
# Use .env.example as template
# Keep API keys and sensitive data out of code
```

---

## Monitoring & Logs

### 1. Service Status Check
```powershell
# Check all services are running
curl http://localhost:3000  # Frontend
curl http://localhost:4000  # Backend  
curl http://localhost:11434/api/tags  # Ollama
```

### 2. Log Locations
- **Frontend**: Terminal output + `.next` folder
- **Backend**: Terminal output
- **AI Service**: Terminal output + Python logs
- **Ollama**: `~/.ollama/logs` on Linux/Mac, `%USERPROFILE%\.ollama\logs` on Windows

---

## Quick Reference Commands

```powershell
# Start everything (3 terminals)
# Terminal 1:
ollama serve

# Terminal 2:
cd backend && npm run dev

# Terminal 3:  
cd frontend && npm run dev

# Test AI service
cd ai-service && .venv\Scripts\activate && python analyze.py --resume resume_clean.txt --jd "test"

# Stop all services
Ctrl+C in each terminal
```

---

## Next Steps

1. **Run the quick start** method first
2. **Test with sample resume** provided
3. **Verify Ollama integration** is working
4. **Explore the frontend** application
5. **Customize job descriptions** for testing
6. **Experiment with different Ollama models**

## Support

For issues:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Ensure ports are not blocked by firewall
4. Check system resources (GPU memory, RAM)

---

**Happy Resume Matching! 🚀**
