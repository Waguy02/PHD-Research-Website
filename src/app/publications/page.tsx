import Link from "next/link";
import { papers } from "@/lib/data";

const statusColors: Record<string, string> = {
  published: "bg-emerald-600/20 text-emerald-400",
  accepted: "bg-amber-600/20 text-amber-400",
  in_review: "bg-purple-600/20 text-purple-400",
  in_progress: "bg-gray-700 text-gray-400",
};

const statusLabels: Record<string, string> = {
  published: "Published",
  accepted: "Accepted",
  in_review: "Under Review",
  in_progress: "In Progress",
};

export default function PublicationsPage() {
  const sorted = [...papers].sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Publications</h1>
      <p className="mb-12 text-gray-400">
        Research papers in AI for auditing, financial NLP, and time-series
        forecasting.
      </p>

      <div className="space-y-6">
        {sorted.map((paper) => (
          <Link
            key={paper.id}
            href={`/publications/${paper.id}`}
            className="card-hover block rounded-xl border border-gray-800 bg-[#111827] p-6 transition-colors hover:border-gray-700"
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded bg-blue-600/20 px-2.5 py-1 text-xs font-medium text-blue-400">
                {paper.venue}
              </span>
              <span
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  statusColors[paper.status]
                }`}
              >
                {statusLabels[paper.status]}
              </span>
              <span className="text-xs text-gray-500">{paper.year}</span>
            </div>
            <h2 className="mb-2 text-xl font-medium text-white">
              {paper.title}
            </h2>
            <p className="mb-3 text-sm text-gray-400">
              {paper.authors.join(", ")}
            </p>
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
              {paper.abstract}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
