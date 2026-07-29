import Link from "next/link";
import { papers } from "@/lib/data";

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  published: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Published" },
  accepted: { bg: "bg-amber-50", text: "text-amber-700", label: "Accepted" },
  in_review: { bg: "bg-purple-50", text: "text-purple-700", label: "Under Review" },
  in_progress: { bg: "bg-gray-100", text: "text-gray-600", label: "In Progress" },
};

const basePath =
  process.env.NODE_ENV === "production" ? "/PHD-Research-Website" : "";

export default function Home() {
  const sortedPapers = [...papers].sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      {/* Hero */}
      <section className="mb-20">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <img
              src={`${basePath}/images/guy-profile.png`}
              alt="Guy Stephane Waffo Dzuyo"
              className="h-48 w-48 rounded-2xl object-cover shadow-lg sm:h-56 sm:w-56"
            />
          </div>
          <div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Guy Stephane{" "}
              <span className="gradient-text">Waffo Dzuyo</span>
            </h1>
            <p className="mb-2 text-xl text-gray-500">
              PhD Candidate in Artificial Intelligence
            </p>
            <p className="mb-6 text-gray-400">
              LORIA, CNRS, Universite de Lorraine &middot; Forvis Mazars
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-gray-600">
              My research sits at the intersection of Natural Language Processing,
              Financial Analysis, and Time-Series Forecasting. I develop AI methods
              for auditing — classifying companies by industry sector, detecting
              financial fraud through multimodal analysis, and controlling
              state-space models with semantic cues.
            </p>
          </div>
        </div>
      </section>

      {/* Research areas */}
      <section className="mb-20">
        <h2 className="mb-6 text-2xl font-semibold">Research Focus</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover">
            <h3 className="mb-2 font-semibold text-gray-900">NLP for Auditing</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              LLM fine-tuning and hybrid models for industry sector
              classification from financial statements.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover">
            <h3 className="mb-2 font-semibold text-gray-900">Fraud Detection</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Robust evaluation frameworks for financial statement fraud
              detection using LLMs and multimodal data.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover">
            <h3 className="mb-2 font-semibold text-gray-900">Time-Series Forecasting</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Semantic control of state-space models for multimodal
              forecasting at linear-time complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Publications</h2>
          <Link
            href="/publications"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="space-y-4">
          {sortedPapers.map((paper) => {
            const badge = statusBadge[paper.status];
            return (
              <Link
                key={paper.id}
                href={`/publications/${paper.id}`}
                className="card-hover block rounded-xl border border-gray-200 bg-white p-5 transition-colors"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {paper.venue}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>
                <h3 className="mb-1 font-medium text-gray-900">{paper.title}</h3>
                <p className="text-sm text-gray-500">{paper.authors.join(", ")}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
