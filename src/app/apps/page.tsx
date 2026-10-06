import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apps",
  description: "Interactive apps and benchmarks from my research on AI for financial auditing.",
};

const apps = [
  {
    href: "/forensicbench",
    title: "ForensicBench",
    tag: "EMNLP 2026 Industry Track",
    text: "A benchmark for agentic LLMs on journal-entry fraud detection: the task, the ledgers, the reference agent, the results, and an open leaderboard with automatic scoring.",
    cta: "Open ForensicBench",
    extra: { href: "/forensicbench/leaderboard", label: "Leaderboard" },
  },
  {
    href: "/demo",
    title: "CI-FSFD Demo",
    tag: "IJCAI 2026 FINLLM",
    text: "An interactive explorer for the CI-FSFD benchmark of financial statement fraud detection: data pipeline, dataset samples, prompts, fine-tuning architecture and results.",
    cta: "Open the demo",
    extra: null,
  },
];

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Apps</h1>
      <p className="mb-10 text-gray-500 dark:text-slate-400">
        Interactive companions to my papers.
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {apps.map((app) => (
          <div
            key={app.href}
            className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-6 card-hover dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span className="mb-3 w-fit rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {app.tag}
            </span>
            <h2 className="mb-2 text-xl font-semibold">{app.title}</h2>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-slate-400">{app.text}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={app.href}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                {app.cta}
              </Link>
              {app.extra && (
                <Link
                  href={app.extra.href}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:text-blue-400"
                >
                  {app.extra.label}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
