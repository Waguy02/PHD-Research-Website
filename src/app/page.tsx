import Link from "next/link";
import { papers } from "@/lib/data";

export default function Home() {
  const latestPapers = papers.filter(
    (p) => p.status === "published" || p.status === "accepted"
  );
  const inReviewPapers = papers.filter((p) => p.status === "in_review");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero Section */}
      <section className="mb-24">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Guy Stephane{" "}
            <span className="gradient-text">Waffo Dzuyo</span>
          </h1>
          <p className="text-xl text-gray-400">
            PhD Candidate in Artificial Intelligence for Auditing
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 text-sm text-gray-500">
          <span className="rounded-full border border-gray-700 px-3 py-1">
            LORIA, CNRS, Universite de Lorraine
          </span>
          <span className="rounded-full border border-gray-700 px-3 py-1">
            Forvis Mazars
          </span>
        </div>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-400">
          My research sits at the intersection of Natural Language Processing,
          Financial Analysis, and Time-Series Forecasting. I work on developing
          AI methods for auditing — from classifying companies by industry
          sector using financial statements, to detecting fraud through
          multimodal data analysis, to controlling state-space models with
          semantic cues for forecasting.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/publications"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            View Publications
          </Link>
          <Link
            href="/demo"
            className="rounded-lg border border-gray-700 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Try the Demo
          </Link>
          <Link
            href="/cv"
            className="rounded-lg border border-gray-700 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Research Timeline
          </Link>
        </div>
      </section>

      {/* Research Areas */}
      <section className="mb-24">
        <h2 className="mb-8 text-2xl font-semibold">Research Focus</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glow rounded-xl border border-gray-800 bg-[#111827] p-6 card-hover">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-medium text-white">
              NLP for Financial Auditing
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              LLM fine-tuning and hybrid models for industry sector
              classification from financial statements. Text-Numeric Transformers
              for company classification.
            </p>
          </div>

          <div className="glow rounded-xl border border-gray-800 bg-[#111827] p-6 card-hover">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20">
              <svg
                className="h-5 w-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-medium text-white">
              Financial Fraud Detection
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Robust evaluation frameworks (CI-FSFD) and LLM-based fraud
              detection combining structured financial data with MD&A text.
              Benchmarking generalization.
            </p>
          </div>

          <div className="glow rounded-xl border border-gray-800 bg-[#111827] p-6 card-hover">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20">
              <svg
                className="h-5 w-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-medium text-white">
              Multimodal Time-Series Forecasting
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              SemMamba: Semantic control of state-space dynamics. Text-conditioned
              operator modulation for multimodal forecasting at linear time
              complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Publications */}
      <section className="mb-24">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Publications</h2>
          <Link
            href="/publications"
            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {latestPapers.map((paper) => (
            <Link
              key={paper.id}
              href={`/publications/${paper.id}`}
              className="card-hover block rounded-xl border border-gray-800 bg-[#111827] p-6 transition-colors hover:border-gray-700"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded bg-blue-600/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                  {paper.venue}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    paper.status === "published"
                      ? "bg-emerald-600/20 text-emerald-400"
                      : "bg-amber-600/20 text-amber-400"
                  }`}
                >
                  {paper.status === "published" ? "Published" : "Accepted"}
                </span>
              </div>
              <h3 className="mb-2 font-medium text-white">{paper.title}</h3>
              <p className="text-sm text-gray-400">
                {paper.authors.join(", ")}
              </p>
            </Link>
          ))}
          {inReviewPapers.map((paper) => (
            <Link
              key={paper.id}
              href={`/publications/${paper.id}`}
              className="card-hover block rounded-xl border border-gray-800 bg-[#111827] p-6 transition-colors hover:border-gray-700"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded bg-purple-600/20 px-2 py-0.5 text-xs font-medium text-purple-400">
                  {paper.venue}
                </span>
                <span className="rounded bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-400">
                  Under Review
                </span>
              </div>
              <h3 className="mb-2 font-medium text-white">{paper.title}</h3>
              <p className="text-sm text-gray-400">
                {paper.authors.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
