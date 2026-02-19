export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      {/* Heading */}
      <section className="text-center space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">

        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Resume <span className="text-fuchsia-600">Scorer</span>
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Resume Scorer is an AI‑powered resume analysis project by{" "}
          <span className="font-semibold">Shridhi Gupta</span> that uses modern
          web technologies and lightweight NLP techniques to compare resumes
          with job descriptions.
        </p>
      </section>

      {/* Mission card */}
      <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">Our Mission</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The goal of Resume Scorer is to make resume screening more transparent
          and candidate‑friendly. Instead of a black‑box score, candidates can
          see exactly how their skills, experience, education, and keywords line
          up with a role and get practical ideas to improve their profile.
        </p>
      </section>

      {/* Platform features grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 text-center">
          Platform Features
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Text Processing
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Cleans and tokenizes resume and job description content to extract
              useful signals for scoring.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Similarity Analysis
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Compares wording and important keywords across both documents to
              estimate semantic and keyword match.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Multi‑Format Support
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Works with PDF and plain‑text resumes, making it easy to test your
              existing CV without special formatting.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Component Scoring
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Breaks the analysis into semantic, skills, experience, education,
              and keyword scores for clearer feedback.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Skill Insights
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Highlights matched and missing skills so you know what to
              emphasize or learn next.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Actionable Suggestions
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Generates practical recommendations to tailor your resume for each
              opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* CTA / note */}
      <section className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">
          Built for Learning &amp; Portfolio
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          Resume Scorer is meant for experimentation and self‑improvement, not
          as a production hiring filter. Use the insights to refine how you
          present your experience, and always review the suggestions with your
          own judgment.
        </p>
      </section>
    </div>
  );
}

