"use client";

import { useState } from "react";

type AnalysisResult = {
  overallMatch: number;
  semanticMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordsMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  strengths: string[];
};

export default function AnalyzePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeFile || jobDescription.trim().length < 20) {
      setError(
        "Please upload a resume and provide a meaningful job description (at least 20 characters)."
      );
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:4000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Analysis failed. Please try again.");
      }

      const data = (await response.json()) as AnalysisResult;
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please retry."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    setError(null);
  };

  const renderScoreBar = (label: string, value: number, color: string) => (
    <div className="space-y-1" key={label}>
      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
        <span>{label}</span>
        <span className={color}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${color.replace(
            "text-",
            "bg-"
          )}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <section className="text-center space-y-3">
        <div className="inline-flex items-center rounded-full bg-sky-50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
          AI-Powered Resume Analysis
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          AI-Powered <span className="text-sky-600">Resume</span>{" "}
          <span className="text-fuchsia-600">Scoring</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Upload your resume and job description to instantly see compatibility
          scores, skill matching, and personalized suggestions from Resume
          Scorer.
        </p>
      </section>

      <section className="flex flex-col items-center gap-4 text-xs font-medium text-slate-600 md:flex-row md:justify-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            1
          </div>
          <span>Upload Resume</span>
        </div>
        <span className="hidden text-slate-300 md:inline">→</span>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            2
          </div>
          <span>Job Description</span>
        </div>
        <span className="hidden text-slate-300 md:inline">→</span>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            3
          </div>
          <span>AI Analysis</span>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
          <button className="rounded-full bg-white px-4 py-1.5 text-slate-900 shadow-sm">
            Single Resume
          </button>
          <button className="cursor-not-allowed rounded-full px-4 py-1.5 text-slate-400">
            Batch Analysis (coming soon)
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            Upload Resume
          </h2>
          <p className="text-[11px] text-slate-500">
            Add your latest resume for this role. For best results, use a clean
            PDF or TXT export.
          </p>
          <label className="flex cursor-pointer flex-col items-start gap-2 rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-3 text-xs text-slate-600 hover:border-sky-400">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setResumeFile(file);
                }
              }}
            />
            <span className="font-semibold text-sky-700">
              {resumeFile ? resumeFile.name : "Click to upload your resume"}
            </span>
            <span className="text-[11px] text-slate-500">
              Supports PDF, DOC, DOCX, TXT (recommended size &lt; 5 MB).
            </span>
          </label>
        </div>

        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            Job Description
          </h2>
          <p className="text-[11px] text-slate-500">
            Paste the full job description including responsibilities and
            requirements for accurate scoring.
          </p>
          <textarea
            className="min-h-[170px] w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-800 outline-none ring-sky-100 focus:border-sky-400 focus:bg-white focus:ring-2"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{jobDescription.length} characters</span>
            <span>Minimum 100 characters recommended</span>
          </div>
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-3xl rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-center text-[11px] text-rose-700">
          {error}
        </div>
      )}

      <section className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
          disabled={isAnalyzing}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-orange-400 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-300/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Match"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          New Analysis
        </button>
      </section>

      <section className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            Match Analysis Results
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Overall compatibility between your resume and this job, based on
            AI-powered text comparison.
          </p>

          {!result && (
            <p className="mt-6 text-xs text-slate-500">
              No assessment available yet. Upload your resume and job
              description above, then select{" "}
              <span className="font-semibold text-sky-600">Analyze Match</span>{" "}
              to view your scores.
            </p>
          )}

          {result && (
            <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex flex-col items-center justify-center rounded-full border-[6px] border-slate-100 bg-slate-50 p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                  Overall Match
                </div>
                <div className="mt-1 text-4xl font-bold text-slate-900">
                  {result.overallMatch.toFixed(1)}%
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-sky-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, result.overallMatch)
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Aim for{" "}
                  <span className="font-semibold text-emerald-600">70%+</span>{" "}
                  by tailoring your summary, skills, and experience bullet
                  points to this specific role.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            Detailed Analysis
          </h2>

          {result ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderScoreBar(
                  "Semantic Match",
                  result.semanticMatch,
                  "text-sky-500"
                )}
                {renderScoreBar(
                  "Skills Match",
                  result.skillsMatch,
                  "text-fuchsia-500"
                )}
                {renderScoreBar(
                  "Experience Match",
                  result.experienceMatch,
                  "text-emerald-500"
                )}
                {renderScoreBar(
                  "Education Match",
                  result.educationMatch,
                  "text-amber-500"
                )}
                {renderScoreBar(
                  "Keywords Match",
                  result.keywordsMatch,
                  "text-indigo-500"
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <h3 className="text-xs font-semibold text-slate-800">
                    Matched Skills ({result.matchedSkills.length})
                  </h3>
                  {result.matchedSkills.length === 0 ? (
                    <p className="mt-2 text-[11px] text-slate-500">
                      No explicit skill overlap detected yet. Try emphasizing
                      the technologies and tools highlighted in the job
                      description.
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {result.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <h3 className="text-xs font-semibold text-slate-800">
                    Missing Skills ({result.missingSkills.length})
                  </h3>
                  {result.missingSkills.length === 0 ? (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Great — we couldn&apos;t find major missing skills. Focus
                      on writing strong, result-oriented bullet points.
                    </p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {result.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700 ring-1 ring-rose-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-emerald-50/60 p-4">
                  <h3 className="text-xs font-semibold text-emerald-800">
                    Strengths
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[11px] text-emerald-800">
                    {result.strengths.map((s, idx) => (
                      <li
                        key={idx}
                        className="rounded-xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100"
                      >
                        {idx + 1}. {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <h3 className="text-xs font-semibold text-slate-800">
                    Recommendations
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700">
                    {result.recommendations.map((r, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2 rounded-xl bg-sky-50 px-3 py-2 ring-1 ring-sky-100"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-semibold text-white">
                          {idx + 1}
                        </span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-4 text-xs text-slate-500">
              Once you run an analysis, you&apos;ll see a detailed breakdown of
              how your resume compares to this job across different dimensions.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

