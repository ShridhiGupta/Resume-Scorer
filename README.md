# Resume Scorer

AI-powered resume analysis app by **Shridhi Gupta**. It compares a candidate's resume with a job description and returns an overall compatibility score plus detailed component scores (semantic, skills, experience, education, keywords), matched/missing skills, strengths, and recommendations.

The project is split into three parts:

- **frontend** – Next.js + React + TypeScript + Tailwind UI
- **backend** – Node.js + Express API for file upload and orchestration
- **ai-service** – Python script that does the text processing and scoring

---

## Features

- **Home page**
  - Bright marketing-style hero section for **Resume Scorer**.
  - Highlights for AI-powered text analysis, multi-format support, and clear recommendations.

- **Analyze page**
  - Upload a resume (PDF/DOC/DOCX/TXT) and paste a job description.
  - Single-resume analysis flow (batch analysis planned as a future enhancement).
  - Shows:
    - Overall match percentage
    - Semantic / Skills / Experience / Education / Keywords match
    - Matched and missing skills
    - Strengths and recommendations

- **About page**
  - Describes the purpose of Resume Scorer and how it helps candidates.

- **Help page**
  - Help & Support layout with quick actions, FAQ-style accordions, and a contact hint.

- **Footer shortcuts**
  - **Source Code** → `https://github.com/ShridhiGupta/Resume-Scorer`
  - **Documentation** → Help page
  - **About Project** → About page
  - Navigation links and a `mailto:guptashridhi11@gmail.com` contact button

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS (Next.js `app` router)
- **Backend**: Node.js, Express, Multer, CORS
- **AI / Scoring**: Python, PyPDF2 (for PDF parsing), basic NLP-style heuristics

---

## Getting Started

Clone the repository (or open the folder where this project lives):

```bash
git clone https://github.com/ShridhiGupta/Resume-Scorer.git
cd Resume-Scorer
```

> Paths below assume the root is `Resume-Matcher/` (as in this workspace).

### 1. AI service (Python)

```bash
cd ai-service
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt  # Windows
```

This sets up a virtual environment and installs `PyPDF2` and any other dependencies.

### 2. Backend (Node API)

```bash
cd ../backend
npm install
npm run dev
```

The backend:

- listens on **`http://localhost:4000`**
- exposes `POST /analyze` for resume + JD analysis

### 3. Frontend (Next.js app)

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs on **`http://localhost:3000`** by default.

Open that URL in your browser to use Resume Scorer.

---

## How Analysis Works (High Level)

1. The frontend sends a `multipart/form-data` request to `/analyze` with:
   - `resume`: uploaded file
   - `jobDescription`: text
2. The backend saves the resume to `backend/uploads/` and spawns Python:
   - `python ai-service/analyze.py --resume <filepath> --jd "<job description>"`
3. The Python script:
   - Extracts text from the resume (PDF or plain text)
   - Tokenizes resume and JD text
   - Computes multiple scores:
     - token overlap (semantic)
     - skill overlaps using a curated list of keywords
     - experience (based on “X years” patterns)
     - education (degree keyword hits)
     - keyword coverage for top JD terms
   - Aggregates these into an **overallMatch** score and returns JSON.
4. The backend returns that JSON to the frontend, which renders the analysis UI.

The scoring logic is intentionally simple and explainable, meant for **learning and portfolio** rather than production hiring decisions.

---

## Scripts

From the project root (`Resume-Matcher/`), there is a helper script:

```bash
./dev.sh
```

This (on a bash-compatible shell) will:

- ensure Python dependencies are installed (if `.venv` exists)
- start the backend (`npm run dev` in `backend`)
- start the frontend (`npm run dev` in `frontend`)

On Windows, you can run it via Git Bash or WSL. Otherwise, you can start backend and frontend manually as shown above.

---

## Environment & Notes

- The app currently does not require external API keys.
- `.env` files are ignored by git (see `.gitignore`), so you can add secrets later if needed.
- Uploads are stored under `backend/uploads/` (also git-ignored).

---

## Credits

Resume Scorer is designed and implemented by **Shridhi Gupta** as an educational and portfolio project, inspired by modern resume-matching UIs like ResuMatch but with a custom design and stack.

