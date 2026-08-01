"use client";
import Link from "next/link";
import { papers } from "@/lib/data";
import { useState } from "react";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  published: { bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", text: "", label: "Published" },
  accepted: { bg: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", text: "", label: "Accepted" },
  in_review: { bg: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", text: "", label: "Under Review" },
  in_progress: { bg: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400", text: "", label: "In Progress" },
};

export default function PublicationsPage() {
  const [activeTag, setActiveTag] = useState<string>("all");

  const allTags = Array.from(new Set(papers.flatMap((p) => p.tags)));

  const filtered =
    activeTag === "all"
      ? papers
      : papers.filter((p) => p.tags.includes(activeTag));

  const sorted = [...filtered].sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Publications</h1>
      <p className="mb-8 text-gray-500 dark:text-slate-400">
        Research papers in AI for auditing, financial NLP, and fraud detection.
      </p>

      {/* Tag filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag("all")}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
            activeTag === "all"
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              activeTag === tag
                ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {sorted.length === 0 ? (
          <p className="text-gray-400 dark:text-slate-500">No papers match the selected tag.</p>
        ) : (
          sorted.map((paper) => {
            const badge = statusStyles[paper.status];
            return (
              <Link
                key={paper.id}
                href={`/publications/${paper.id}`}
                className="card-hover block rounded-xl border border-gray-200 bg-white p-6 transition-colors dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {paper.venue}
                  </span>
                  <span className={`rounded px-2.5 py-1 text-xs font-medium ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500">{paper.year}</span>
                </div>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-slate-100">{paper.title}</h2>
                <p className="mb-3 text-sm text-gray-500 dark:text-slate-400">{paper.authors.join(", ")}</p>
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-400 dark:text-slate-500">
                  {paper.abstract}
                </p>
                <div className="flex flex-wrap gap-3">
                  {paper.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {link.label}
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}