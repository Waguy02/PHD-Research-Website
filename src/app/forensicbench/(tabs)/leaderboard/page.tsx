import type { Metadata } from "next";
import { LeaderboardTable, SubmitForm } from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "ForensicBench Leaderboard",
  description: "Open leaderboard for ForensicBench: submit the flags of your agent and get automatic scores.",
};

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {children}
    </pre>
  );
}

export default function LeaderboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Leaderboard</h1>
      <p className="mb-8 max-w-3xl text-gray-600 dark:text-slate-400">
        Entries are ranked by Entry-F1, then Type-F1, Recall, Precision, Coverage and Consistency. There is no
        composite score. Rows using the reference harness are the paper results.
      </p>

      <section className="mb-14">
        <LeaderboardTable />
      </section>

      <div className="mx-auto max-w-4xl">
      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Submission formats</h2>
        <p className="mb-4 text-gray-600 dark:text-slate-400">
          Run your agent on the five unlabelled ledgers and upload one CSV of flags, one row per flagged journal
          entry. A file must cover all five sectors.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
            <h3 className="mb-1 font-semibold">Single run</h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-slate-400">
              One run per sector. Scores are reported without a standard deviation or Consistency, and the entry is
              marked as 1 run.
            </p>
            <Code>{`sector,document_id,scheme_type\nenergy,9f2c...,fictitious_ap_disbursements`}</Code>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
            <h3 className="mb-1 font-semibold">Multi run</h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-slate-400">
              Several replicates per sector, the same ones in every sector (the full protocol uses 5, so 25 runs).
              Reports the mean, the standard deviation across replicates and Consistency.
            </p>
            <Code>{`sector,replicate,document_id,scheme_type\nenergy,1,9f2c...,fictitious_ap_disbursements`}</Code>
          </div>
        </div>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-slate-400">
          <li>Scheme types: fictitious_ap_disbursements, revenue_manipulation, vendor_collusion, shadow_payroll, inventory_manipulation. Use unknown when the type is not decided (the entry still counts for Entry-F1).</li>
          <li>Sectors: energy, healthcare, luxurygoods, manufacturing, transport.</li>
          <li>Rows with the same sector, replicate and document are counted once.</li>
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Labels</h2>
        <p className="text-gray-600 dark:text-slate-400">
          The ground-truth labels are held out so that the ranking stays meaningful, and scoring is automatic. If you need
          them for research evaluation or reproduction, write to{" "}
          <a href="mailto:guywaffo@gmail.com" className="font-medium text-blue-700 underline dark:text-blue-300">guywaffo@gmail.com</a>.
        </p>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Harness code and verification</h2>
        <p className="mb-3 text-gray-600 dark:text-slate-400">
          Every submission must name its harness and include its code: a repository URL with the commit hash, or an
          archive. Entries start as unverified. A maintainer reviews the harness before an entry is
          marked verified.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-slate-400">
          <li>Automatic checks: valid identifiers, duplicate rows, share of the ledger flagged per run, identical replicates, implausibly high precision and recall. A flagged file goes to review.</li>
          <li>The harness must only use the read-only ledger. Labels, ledger-specific lookups and hand-labelling are not allowed.</li>
          <li>Rate limit: 3 submissions per email per day.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Submit</h2>
        <SubmitForm />
      </section>
      </div>
    </div>
  );
}
