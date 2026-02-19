export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      {/* Heading */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Help &amp; <span className="text-sky-600">Support</span>
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Find quick actions, answers, and tips to get the most out of{" "}
          <span className="font-semibold">Resume Scorer</span>.
        </p>
      </section>

      {/* Quick actions */}
      <section className="space-y-4">
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-400">
          Search for help… (coming soon)
        </div>
        <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 text-lg">
              ↑
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Upload Resume
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Start by uploading your latest resume file.
            </p>
            <a
              href="/analyze"
              className="mt-3 inline-block text-xs font-semibold text-sky-600"
            >
              Go to Analyze →
            </a>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600 text-lg">
              ⓘ
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Sample Job Description
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              See an example of a clear, detailed job description.
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-fuchsia-600">
              View examples (soon)
            </span>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-lg">
              ▶
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Quick Tutorial
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Learn the fastest way to run an effective analysis.
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-emerald-600">
              Watch tutorial (soon)
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-700">
            Getting Started
          </h3>
          <div className="space-y-2">
            <details className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100">
              <summary className="cursor-pointer text-slate-900">
                What file formats does Resume Scorer support?
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                You can upload PDF, DOC, DOCX, or TXT files. For the cleanest
                analysis, a simple, text‑based PDF or TXT file works best.
              </p>
            </details>
            <details className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100">
              <summary className="cursor-pointer text-slate-900">
                How do I upload a resume for analysis?
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                Go to the Analyze page, click on the resume upload card, choose
                your file, paste the job description, and click{" "}
                <span className="font-semibold">Analyze Match</span>.
              </p>
            </details>
            <details className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100">
              <summary className="cursor-pointer text-slate-900">
                What information do I need to provide?
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                At minimum you need a resume file and a reasonably detailed job
                description (a few paragraphs) to get meaningful results.
              </p>
            </details>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-700">
            Analysis &amp; Results
          </h3>
          <div className="space-y-2">
            <details className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100">
              <summary className="cursor-pointer text-slate-900">
                How accurate is the analysis?
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                Resume Scorer uses heuristic NLP‑style matching. It is designed
                for guidance and learning, not as a final hiring decision tool.
              </p>
            </details>
            <details className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100">
              <summary className="cursor-pointer text-slate-900">
                What do the different scores mean?
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                Each score reflects a different aspect: wording similarity,
                skills overlap, experience alignment, education mentions, and
                important keywords found in your resume.
              </p>
            </details>
            <details className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-100">
              <summary className="cursor-pointer text-slate-900">
                Why do my scores look lower than expected?
              </summary>
              <p className="mt-2 text-xs text-slate-600">
                Low scores often come from missing keywords or very short job
                descriptions. Try expanding the JD and mirroring some of its
                language in your resume.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">
          Still Need Help?
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          Can&apos;t find what you&apos;re looking for? Reach out and{" "}
          <span className="font-semibold">Shridhi Gupta</span> will be happy to
          hear your feedback about Resume Scorer.
        </p>
        <button className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-600">
          Email Support (placeholder)
        </button>
      </section>
    </div>
  );
}

