import Link from "next/link";
import GLVisual from "./GLVisual";
import Tabs from "./Tabs";

const basePath = process.env.NODE_ENV === "production" ? "/PHD-Research-Website" : "";

export default function ForensicBenchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14">
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            EMNLP 2026 Industry Track
          </span>
          <span className="rounded bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            Published
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">ForensicBench</span>
        </h1>
        <p className="mb-3 text-xl text-gray-600 dark:text-slate-300">
          Evaluating agentic LLMs on journal-entry fraud detection
        </p>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Guy Stephane Waffo Dzuyo, Gael Guibon, Christophe Cerisara, Luis Belmar-Letelier
          <br />
          LORIA, CNRS, Universite de Lorraine · LIPN, CNRS · Forvis Mazars
        </p>
      </header>

      <section className="mb-10 grid items-stretch gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <GLVisual />
        <figure className="m-0 flex flex-col border border-gray-200 bg-white dark:border-slate-800">
          <figcaption className="bg-blue-800 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white">
            Benchmark architecture
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/forensicbench/architecture.svg`}
            alt="ForensicBench architecture: ledger, agent harness, flags, scorer with private labels, leaderboard"
            className="h-full w-full object-contain"
          />
        </figure>
      </section>

      <Tabs />
      <div className="py-12">{children}</div>
      <p className="pb-16">
        <Link href="/apps" className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200">
          Back to apps
        </Link>
      </p>
    </div>
  );
}
