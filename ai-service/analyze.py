import argparse
import json
import os
import re
from typing import Dict, List

import torch
from sentence_transformers import SentenceTransformer, util


def load_resume_text(path: str) -> str:
  try:
    if path.lower().endswith(".pdf"):
      try:
        from PyPDF2 import PdfReader  # type: ignore

        reader = PdfReader(path)
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        if text.strip():
          return text
      except Exception:
        pass

    with open(path, "r", encoding="utf-8", errors="ignore") as f:
      return f.read()
  except Exception:
    return ""


def tokenize(text: str) -> List[str]:
  return re.findall(r"[a-zA-Z][a-zA-Z+\-#]*", text.lower())


def extract_skill_tokens(tokens: List[str]) -> List[str]:
  common_skill_keywords = {
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node",
    "node.js",
    "nextjs",
    "next",
    "sql",
    "mongodb",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "ml",
    "machine",
    "learning",
    "nlp",
    "data",
    "analysis",
    "django",
    "flask",
    "rest",
    "api",
  }
  return [t for t in tokens if t in common_skill_keywords]


def ratio(numerator: float, denominator: float) -> float:
  if denominator <= 0:
    return 0.0
  return max(0.0, min(1.0, numerator / denominator))


def compute_scores(resume_text: str, jd_text: str) -> Dict:
  resume_tokens = tokenize(resume_text)
  jd_tokens = tokenize(jd_text)

  resume_set = set(resume_tokens)
  jd_set = set(jd_tokens)

  # ----- Semantic similarity using sentence-transformers (GPU if available) -----
  device = "cuda" if torch.cuda.is_available() else "cpu"
  model = SentenceTransformer("all-MiniLM-L6-v2", device=device)

  with torch.no_grad():
    emb_resume = model.encode(resume_text, convert_to_tensor=True, device=device)
    emb_jd = model.encode(jd_text, convert_to_tensor=True, device=device)
    cosine_sim = util.cos_sim(emb_resume, emb_jd).item()

  semantic_match = max(0.0, min(1.0, cosine_sim)) * 100

  resume_skills = set(extract_skill_tokens(resume_tokens))
  jd_skills = set(extract_skill_tokens(jd_tokens))

  matched_skills = sorted(jd_skills & resume_skills)
  missing_skills = sorted(jd_skills - resume_skills)

  skills_match = ratio(len(matched_skills), max(1, len(jd_skills))) * 100

  def extract_years(text: str) -> int:
    years = 0
    for m in re.finditer(r"(\\d+)[+ ]*years?", text.lower()):
      try:
        years = max(years, int(m.group(1)))
      except ValueError:
        continue
    return years

  resume_years = extract_years(resume_text)
  jd_years = extract_years(jd_text)
  if jd_years == 0:
    experience_match = 100.0 if resume_years > 0 else 0.0
  else:
    experience_match = ratio(resume_years, jd_years) * 100

  education_keywords = [
    "bachelor",
    "master",
    "b.tech",
    "b.e",
    "bsc",
    "msc",
    "phd",
    "degree",
  ]
  resume_edu_hits = sum(1 for kw in education_keywords if kw in resume_text.lower())
  jd_edu_hits = sum(1 for kw in education_keywords if kw in jd_text.lower())
  if jd_edu_hits == 0:
    education_match = 100.0 if resume_edu_hits > 0 else 0.0
  else:
    education_match = ratio(resume_edu_hits, jd_edu_hits) * 100

  jd_freq: Dict[str, int] = {}
  for t in jd_tokens:
    if len(t) <= 4:
      continue
    jd_freq[t] = jd_freq.get(t, 0) + 1
  sorted_keywords = [k for k, _ in sorted(jd_freq.items(), key=lambda x: -x[1])]
  top_keywords = sorted_keywords[:15]
  matched_keywords = [k for k in top_keywords if k in resume_set]
  keywords_match = ratio(len(matched_keywords), max(1, len(top_keywords))) * 100

  overall = (
    0.3 * semantic_match
    + 0.3 * skills_match
    + 0.2 * experience_match
    + 0.1 * education_match
    + 0.1 * keywords_match
  )

  strengths: List[str] = []
  recommendations: List[str] = []

  if experience_match >= 70:
    strengths.append("Strong experience alignment with the job description.")
  if education_match >= 70:
    strengths.append("Education background matches or exceeds the role requirements.")
  if skills_match >= 60:
    strengths.append("Key technical skills overlap well with the job needs.")

  if skills_match < 80:
    if missing_skills:
      recommendations.append(
        "Highlight or acquire these important skills mentioned in the job description: "
        + ", ".join(missing_skills)
      )
    else:
      recommendations.append(
        "Clarify your most relevant skills in a dedicated skills section."
      )
  if keywords_match < 70:
    recommendations.append(
      "Use more of the important phrases and keywords from the job description."
    )
  if semantic_match < 60:
    recommendations.append(
      "Tailor your summary and bullet points to mirror the language of the job description."
    )

  if not strengths:
    strengths.append("Good foundation; can be improved with more targeted tailoring.")
  if not recommendations:
    recommendations.append(
      "Your resume already aligns well. Consider minor polishing for clarity and impact."
    )

  return {
    "overallMatch": round(overall, 1),
    "semanticMatch": round(semantic_match, 1),
    "skillsMatch": round(skills_match, 1),
    "experienceMatch": round(experience_match, 1),
    "educationMatch": round(education_match, 1),
    "keywordsMatch": round(keywords_match, 1),
    "matchedSkills": matched_skills,
    "missingSkills": missing_skills,
    "recommendations": recommendations,
    "strengths": strengths,
  }


def main() -> None:
  parser = argparse.ArgumentParser(description="Resume vs JD analysis")
  parser.add_argument("--resume", required=True, help="Path to resume file")
  parser.add_argument("--jd", required=True, help="Job description text")
  args = parser.parse_args()

  if not os.path.exists(args.resume):
    print(json.dumps({"error": "Resume file not found"}))
    raise SystemExit(1)

  resume_text = load_resume_text(args.resume)
  jd_text = args.jd

  result = compute_scores(resume_text, jd_text)
  print(json.dumps(result))


if __name__ == "__main__":
  main()

