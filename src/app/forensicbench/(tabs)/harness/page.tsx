import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForensicBench Base Harness",
  description: "The reference agent harness of ForensicBench: orient, plan once, investigate with SQL and Python, report.",
};

const DATASET_URL = "https://huggingface.co/datasets/WaguyMZ/ForensicBench";
const HARNESS_URL = "https://github.com/WaguyMz/Forensic_Bench";
const basePath = process.env.NODE_ENV === "production" ? "/PHD-Research-Website" : "";

function Figure({ src, alt, title, children }: { src: string; alt: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mb-4 leading-relaxed text-gray-600 dark:text-slate-400">{children}</p>
      <figure className="m-0 border border-gray-200 bg-white dark:border-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${basePath}/forensicbench/${src}`} alt={alt} className="w-full" />
      </figure>
    </section>
  );
}

export default function HarnessPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="mb-8 max-w-3xl text-gray-600 dark:text-slate-400">
        One common harness runs every model of the paper, so scores are comparable. It is deliberately simple,
        with no replanning and no reflection: the leaderboard measures a model together with its scaffold. Use it
        as a baseline, or plug in your own harness and submit the flags.
      </p>
      <div className="mb-12 flex flex-wrap gap-3">
        <a
          href={HARNESS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Harness code on GitHub
        </a>
      </div>

      <Figure src="harness_phases.svg" alt="Four phases of the base harness" title="Four phases, one budget">
        The agent orients itself on the ledger, plans once, investigates every hypothesis with a dedicated worker,
        then reports. Each run has a fixed 20M-token budget.
      </Figure>
      <Figure src="react_loop.svg" alt="Bounded ReAct loop of an investigation worker" title="Inside an investigation worker">
        A worker receives one hypothesis with its exit criteria and budget. It alternates reasoning, tool calls (SQL,
        Python) and observation until the criteria are met or the budget is spent, then returns a verdict.
      </Figure>
      <section className="mb-14">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Fraud catalogue and prompts</h2>
        <p className="mb-4 leading-relaxed text-gray-600 dark:text-slate-400">
          The harness gives the agent a conceptual catalogue of the five scheme types: the normal business process and the
          kinds of breakdown that can indicate manipulation. It names no GL account and no injection parameter, and contains
          no label. The catalogue and the prompts of the reference harness are downloadable with the data.
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            ["Fraud catalogue (Markdown)", "catalogue/fraud_catalogue.md"],
            ["Fraud catalogue (JSON)", "catalogue/fraud_catalogue.json"],
            ["Prompts of the reference harness", "prompts"],
          ].map(([label, path]) => (
            <a
              key={path}
              href={`${DATASET_URL}/${path.includes(".") ? "blob" : "tree"}/main/${path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <Figure src="architecture.svg" alt="Benchmark architecture" title="Where the harness fits">
        The harness only sees the read-only ledger. Its flags are scored against labels that never leave the private
        store.
      </Figure>
    </div>
  );
}
