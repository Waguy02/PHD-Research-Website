import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ForensicBench",
  description:
    "ForensicBench: evaluating agentic LLMs on scheme-level journal-entry fraud detection. EMNLP 2026 Industry Track.",
};

// Public Hugging Face dataset with the unlabelled ledgers. Set to null to show
// a "coming soon" state instead of a link.
const DATASET_URL: string | null = "https://huggingface.co/datasets/WaguyMZ/ForensicBench";

const PAPER_URL = "https://openreview.net/forum?id=587";

type SizeClass = "Small" | "Mid-size" | "Large" | "Frontier-scale";

const classColor: Record<SizeClass, string> = {
  Small: "bg-slate-400",
  "Mid-size": "bg-blue-500",
  Large: "bg-blue-700",
  "Frontier-scale": "bg-blue-950 dark:bg-blue-300",
};

const models: { name: string; params: string; cls: SizeClass; entry: number; type: number }[] = [
  { name: "MiniMax-M2.7", params: "230B", cls: "Frontier-scale", entry: 34.7, type: 21.7 },
  { name: "Qwen3.5-397B", params: "397B", cls: "Frontier-scale", entry: 26.3, type: 14.1 },
  { name: "Qwen3.5-122B", params: "122B", cls: "Large", entry: 25.2, type: 13.5 },
  { name: "Qwen3.6-35B", params: "35B", cls: "Mid-size", entry: 15.0, type: 9.4 },
  { name: "Mistral-Medium-3.5", params: "128B", cls: "Large", entry: 13.6, type: 9.1 },
  { name: "Gemma-4-31B", params: "31B", cls: "Mid-size", entry: 12.1, type: 8.7 },
  { name: "Gemma-4-E4B", params: "4B", cls: "Small", entry: 8.5, type: 3.8 },
  { name: "GPT-OSS-120B", params: "120B", cls: "Large", entry: 8.0, type: 5.2 },
  { name: "Mistral-Small-4", params: "119B", cls: "Large", entry: 3.8, type: 2.4 },
  { name: "Qwen3.5-9B", params: "9B", cls: "Small", entry: 3.5, type: 2.2 },
  { name: "Granite-30B", params: "30B", cls: "Mid-size", entry: 2.8, type: 1.5 },
  { name: "Llama-3.3-70B", params: "70B", cls: "Large", entry: 0.3, type: 0.0 },
];

const stats = [
  { value: "1.51M", label: "journal entries" },
  { value: "5", label: "sector ledgers" },
  { value: "5", label: "fraud scheme types" },
  { value: "12", label: "open-weight models" },
  { value: "34.7%", label: "best Entry-F1" },
];

const schemes = [
  "Fictitious AP disbursements",
  "Vendor collusion",
  "Revenue manipulation",
  "Inventory manipulation",
  "Shadow payroll",
];

const contributions = [
  {
    title: "Forensic Ledger",
    text: "Realistic synthetic ledgers across five sectors, with five injected multi-entry fraud schemes and labels at both entry and scheme level.",
  },
  {
    title: "Evaluation protocol",
    text: "Entry-F1, Type-F1, Coverage and Consistency, over 25 runs per model, with no composite score.",
  },
  {
    title: "Reference agent",
    text: "A plan-then-investigate agent that queries the ledger with SQL and Python, reproducible and released as a baseline.",
  },
  {
    title: "Open leaderboard",
    text: "A public ranking of open-weight models, with a hidden label store and an automatic scorer for new submissions.",
  },
];

function SectionTitle({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <div id={id} className="mb-6 scroll-mt-24">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
        {kicker}
      </p>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover dark:border-slate-800 dark:bg-slate-800/60">
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
      <div className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">{children}</div>
    </div>
  );
}

function EntryCard({ date, label, tone, rows }: { date: string; label: string; tone: "blue" | "red"; rows: [string, string, string, string][] }) {
  const border = tone === "blue" ? "border-blue-300 dark:border-blue-800" : "border-red-300 dark:border-red-900";
  const head = tone === "blue" ? "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  return (
    <div className={`overflow-hidden rounded-lg border ${border} bg-white dark:bg-slate-900`}>
      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${head}`}>
        {date} · {label}
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([acct, name, side, amount]) => (
            <tr key={acct} className="border-t border-gray-100 dark:border-slate-800">
              <td className="px-3 py-1.5 font-mono text-xs text-gray-500 dark:text-slate-400">{acct}</td>
              <td className="px-3 py-1.5 text-gray-700 dark:text-slate-300">{name}</td>
              <td className="px-3 py-1.5 text-gray-500 dark:text-slate-400">{side}</td>
              <td className="px-3 py-1.5 text-right tabular-nums text-gray-700 dark:text-slate-300">{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-blue-600 text-sm font-bold text-white dark:bg-blue-500">
        {n}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-slate-100">{title}</h4>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">{children}</p>
      </div>
    </div>
  );
}

export default function ForensicBenchPage() {
  const maxEntry = 35;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-12 flex flex-wrap gap-3">
        <a
          href={PAPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Read the paper
        </a>
      </div>

      {/* Stats */}
      <section className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/60">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </section>

      {/* The task */}
      <section className="mb-16">
        <SectionTitle id="task" kicker="The task" title="Find the scheme, not just the entry" />
        <p className="mb-6 leading-relaxed text-gray-600 dark:text-slate-400">
          An LLM agent gets read-only SQL access to a company ledger. It must flag the fraudulent journal
          entries and assign each one a scheme type. Nothing in the data says which entries are fraudulent:
          the agent has to build the evidence itself.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <EntryCard
            date="Jan 14"
            label="Fictitious invoice"
            tone="blue"
            rows={[
              ["606300", "Purchases", "Dr", "42,000"],
              ["401000", "Supplier", "Cr", "42,000"],
            ]}
          />
          <EntryCard
            date="Feb 03"
            label="Matched disbursement"
            tone="red"
            rows={[
              ["401000", "Supplier", "Dr", "42,000"],
              ["512000", "Bank", "Cr", "42,000"],
            ]}
          />
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
          Both entries balance and look routine on their own. Only their joint structure (same supplier, same
          amount, weeks apart) reveals the scheme.
        </p>
      </section>

      {/* Why it matters */}
      <section className="mb-16">
        <SectionTitle id="why" kicker="Why it matters" title="Fraud is a pattern, audits need patterns" />
        <ul className="space-y-3 text-gray-600 dark:text-slate-400">
          {[
            "Real accounting fraud rarely shows up as one suspicious posting. It is a coordinated sequence of entries, each individually plausible.",
            "Auditors search for scheme-level evidence and name the process behind it, such as fictitious vendors or ghost-employee payroll.",
            "Agentic LLMs can query databases, run code and keep investigative state, so they could assist this work. Whether they can is an open question.",
            "Real ledgers are confidential. A synthetic, label-rich ledger makes the question testable and reproducible.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* The problem */}
      <section className="mb-16">
        <SectionTitle id="problem" kicker="The problem" title="No benchmark covers this setting" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Financial-statement datasets">
            Fraud is labelled at company-year level, far above the scheme level needed to investigate a ledger.
          </Card>
          <Card title="Entry-level detectors">
            They flag isolated statistical outliers, with no scheme type and no accounting-process context.
          </Card>
          <Card title="General agent benchmarks">
            They cover web and code tasks, and contain no forensic accounting setting.
          </Card>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
          No existing work combines scheme-level granularity with a live relational ledger, which is what an
          auditor works with.
        </p>
      </section>

      {/* Contributions */}
      <section className="mb-16">
        <SectionTitle id="contributions" kicker="Contributions" title="What we release" />
        <div className="grid gap-4 sm:grid-cols-2">
          {contributions.map((c, i) => (
            <div key={c.title} className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover dark:border-slate-800 dark:bg-slate-800/60">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white dark:bg-blue-500">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100">{c.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Method */}
      <section className="mb-16">
        <SectionTitle id="method" kicker="Method" title="Ledger, agent and protocol" />

        <h3 className="mb-2 text-lg font-semibold">The Forensic Ledger</h3>
        <p className="mb-3 leading-relaxed text-gray-600 dark:text-slate-400">
          We build on DataSynth, an open-source enterprise data generator that produces balanced entries,
          Benford-compliant amounts and realistic calendars under the French chart of accounts (PCG). Its labels
          mark single entries and it ships only two multi-stage schemes, so we add a scheme-injection layer.
          Schemes run as multi-stage processes with forensic traces, and every injected entry gets a label that
          links its document to a scheme type and a scheme instance.
        </p>
        <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">
          Five sectors (Energy, Healthcare, Luxury Goods, Manufacturing, Transport), about 300K entries each
          over three years, and five scheme types:
        </p>
        <div className="mb-10 flex flex-wrap gap-2">
          {schemes.map((s) => (
            <span key={s} className="rounded-none border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {s}
            </span>
          ))}
        </div>

        <h3 className="mb-3 text-lg font-semibold">The reference agent</h3>
        <p className="mb-4 leading-relaxed text-gray-600 dark:text-slate-400">
          One common harness runs every model, so scores are comparable. It is deliberately simple, with no
          replanning and no reflection, which means the leaderboard measures a model together with its scaffold.
        </p>
        <div className="mb-10 grid gap-5 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-800/60">
          <Step n={1} title="Orient">
            The agent profiles the ledger with SQL before any fraud reasoning, using about 10% of the budget.
          </Step>
          <Step n={2} title="Plan, once">
            A single call produces ranked, falsifiable hypotheses with exit criteria and a token budget each.
            The plan is then fixed.
          </Step>
          <Step n={3} title="Investigate each hypothesis">
            A worker runs a bounded loop of reasoning, tool calls (SQL, Python) and observation until its exit
            criteria are met or its budget is spent, then returns a verdict.
          </Step>
          <Step n={4} title="Report">
            Suspicious entries are flagged with a scheme type through <code className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-slate-700">report_suspicion</code>.
            Each run has a fixed 20M-token budget.
          </Step>
        </div>

        <h3 className="mb-2 text-lg font-semibold">Evaluation protocol</h3>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <Card title="Entry-F1 (primary)">Did the agent flag the right entries?</Card>
          <Card title="Type-F1">Right entry and right scheme type. Always at most Entry-F1.</Card>
          <Card title="Coverage">Share of each fraud family recovered, averaged over families.</Card>
          <Card title="Consistency">Stability across the five replicates.</Card>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Each model runs on 5 sectors with 5 replicates each, so 25 runs per model and 300 in total. Models are
          ranked lexicographically, with no composite score.
        </p>
      </section>

      {/* Results */}
      <section className="mb-16">
        <SectionTitle id="results" kicker="Results" title="Even the best model recovers about a third" />
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Entry-F1 (%) by model
            </h3>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-slate-400">
              {(Object.keys(classColor) as SizeClass[]).map((c) => (
                <span key={c} className="inline-flex items-center gap-1">
                  <span className={`h-2.5 w-2.5 rounded-sm ${classColor[c]}`} />
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {models.map((m) => (
              <div key={m.name} className="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3 text-sm sm:grid-cols-[11rem_1fr_3.5rem]">
                <div className="truncate text-gray-700 dark:text-slate-300">
                  {m.name} <span className="text-xs text-gray-400 dark:text-slate-500">{m.params}</span>
                </div>
                <div className="h-5 rounded bg-gray-100 dark:bg-slate-800">
                  <div
                    className={`h-5 rounded ${classColor[m.cls]}`}
                    style={{ width: `${Math.max((m.entry / maxEntry) * 100, 0.6)}%` }}
                  />
                </div>
                <div className="text-right font-semibold tabular-nums text-gray-800 dark:text-slate-200">
                  {m.entry.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
            Macro-average over 25 runs per model. Type-F1 for the best model is 21.7, and it trails Entry-F1 on
            every model, by up to 13 points.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="A low ceiling">
            The best model, MiniMax-M2.7, reaches 34.7% Entry-F1. More than two thirds of fraudulent entries are
            missed.
          </Card>
          <Card title="Detecting is not typing">
            Agents often flag fraud entries but misidentify the coordinated pattern they belong to.
          </Card>
          <Card title="Some schemes are hard">
            Revenue manipulation is the accessible scheme (11 of 12 models detect it). Fictitious AP and shadow
            payroll set the ranking, and seven models score 0% recall on shadow payroll.
          </Card>
          <Card title="The task is solvable">
            A hand-written rule oracle recovers 78 to 91% of the schemes with the same database access, while an
            uninformed audit-test battery reaches only 0.36% Entry-F1. The gap is model capability, not label noise.
          </Card>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mb-16">
        <SectionTitle id="leaderboard" kicker="Leaderboard" title="Submit your agent" />
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-900/20">
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-slate-300">
            The unlabelled ledgers are released on Hugging Face and scoring is automatic. Run your own agent on
            the ledgers, upload your flags (document id, scheme type) as a single run or as several replicates,
            and get your Entry-F1, Type-F1 and Coverage. Labels stay private, and each entry comes with the code of
            its harness for verification.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/forensicbench/leaderboard"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Open the leaderboard
            </Link>
            {DATASET_URL ? (
              <a
                href={DATASET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-5 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300"
              >
                Dataset on Hugging Face
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 px-5 py-2.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:text-blue-300">
                Hugging Face dataset: coming soon
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Citation */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Citation</h2>
        <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
{`@inproceedings{waffo2026forensicbench,
  title={ForensicBench: Evaluating Agentic LLMs on Journal-Entry Fraud Detection},
  author={Waffo Dzuyo, Guy Stephane and Guibon, Ga{\\"{e}}l and Cerisara, Christophe and Belmar-Letelier, Luis},
  booktitle={EMNLP 2026, Industry Track},
  year={2026}
}`}
        </pre>
      </section>
    </div>
  );
}
