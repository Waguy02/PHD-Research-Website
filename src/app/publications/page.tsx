import Link from "next/link";
import { papers } from "@/lib/data";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  published: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Published" },
  accepted: { bg: "bg-amber-50", text: "text-amber-700", label: "Accepted" },
  in_review: { bg: "bg-purple-50", text: "text-purple-700", label: "Under Review" },
  in_progress: { bg: "bg-gray-100", text: "text-gray-600", label: "In Progress" },
};

export default function PublicationsPage() {
  const sorted = [...papers].sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Publications</h1>
      <p className="mb-12 text-gray-500">
        Research papers in AI for auditing, financial NLP, and time-series forecasting.
      </p>

      <div className="space-y-6">
        {sorted.map((paper) => {
          const badge = statusStyles[paper.status];
          return (
            <Link
              key={paper.id}
              href={`/publications/${paper.id}`}
              className="card-hover block rounded-xl border border-gray-200 bg-white p-6 transition-colors"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {paper.venue}
                </span>
                <span className={`rounded px-2.5 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-gray-400">{paper.year}</span>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900">{paper.title}</h2>
              <p className="mb-3 text-sm text-gray-500">{paper.authors.join(", ")}</p>
              <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                {paper.abstract}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
