export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-20">
      {/* Hero */}
      <section className="flex flex-col items-center text-center space-y-7">
        <span className="inline-flex items-center rounded-full bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
          AI-Powered Resume Scoring
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Find the{" "}
            <span className="text-sky-600">Perfect Match</span>{" "}
            <span className="text-fuchsia-600">Every Time</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
            Upload your resume and job description to get instant compatibility
            analysis with detailed scoring, skill matching, and personalized
            recommendations from <span className="font-semibold">Resume Scorer</span>.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
          <a
            href="/analyze"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-sky-600"
          >
            Start Analyzing Now
          </a>
        </div>
      </section>

      {/* Highlight cards */}
      <section className="grid gap-6 text-sm text-slate-700 sm:grid-cols-3">
        <div className="rounded-2xl bg-white px-5 py-6 text-center shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-semibold text-sky-600">AI-Powered</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            Text Analysis
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Smart comparison of resume and job description content.
          </p>
        </div>
        <div className="rounded-2xl bg-white px-5 py-6 text-center shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-semibold text-fuchsia-600">
            Multi-Format
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            File Support
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Works with common resume formats like PDF and DOCX.
          </p>
        </div>
        <div className="rounded-2xl bg-white px-5 py-6 text-center shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-semibold text-emerald-600">
            Insightful
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            Recommendations
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Clear guidance to improve your resume for each role.
          </p>
        </div>
      </section>

      {/* Features section */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">
            Advanced Features for{" "}
            <span className="text-sky-600">Smart Recruitment</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">
            This demo shows how AI techniques can be used to analyze and match
            resume content with job requirements using simple, explainable
            scoring.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              AI-Powered Analysis
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Processes resume and JD text to highlight overlaps and gaps.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Precise Matching
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Breaks down scores across skills, experience, education, and
              keywords.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Multi-Format Support
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Handles PDF and text resumes so you can test your existing CV.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Component Scoring
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              See exactly which areas are strong and where to improve.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
