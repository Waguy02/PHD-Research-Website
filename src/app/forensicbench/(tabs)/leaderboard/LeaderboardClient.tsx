"use client";

import { useEffect, useMemo, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const CONNECTED = SUPABASE_URL !== "" && SUPABASE_ANON_KEY !== "";

type Row = {
  rank: number;
  id: string;
  team: string;
  model: string;
  model_type: "open-weight" | "api";
  params: string | null;
  harness_name: string | null;
  harness_url: string | null;
  format: "single" | "multi";
  n_replicates: number;
  status: "unverified" | "needs_review" | "verified" | "rejected";
  is_reference: boolean;
  entry_f1: number | null;
  entry_f1_std: number | null;
  type_f1: number | null;
  recall: number | null;
  precision: number | null;
  coverage: number | null;
  consistency: number | null;
};

// Used until the Supabase project is connected: the paper results (reference harness, 25 runs).
const FALLBACK: [string, string, number, number, number, number, number, number][] = [
  ["MiniMax-M2.7", "230B", 34.7, 21.7, 29.0, 48.4, 21.7, 50.7],
  ["Qwen3.5-397B", "397B", 26.3, 14.1, 20.5, 41.3, 18.0, 61.4],
  ["Qwen3.5-122B", "122B", 25.2, 13.5, 19.8, 40.6, 14.2, 46.9],
  ["Qwen3.6-35B", "35B", 15.0, 9.4, 9.8, 36.6, 9.3, 28.1],
  ["Mistral-Medium-3.5-128B", "128B", 13.6, 9.1, 10.3, 21.8, 9.5, 43.8],
  ["Gemma-4-31B", "31B", 12.1, 8.7, 7.5, 37.4, 6.8, 76.1],
  ["Gemma-4-E4B", "4B", 8.5, 3.8, 5.2, 29.5, 4.2, 31.2],
  ["GPT-OSS-120B", "120B", 8.0, 5.2, 4.6, 39.9, 4.4, 55.8],
  ["Mistral-Small-4-119B", "119B", 3.8, 2.4, 2.3, 13.4, 2.1, 28.5],
  ["Qwen3.5-9B", "9B", 3.5, 2.2, 2.0, 18.5, 2.0, 18.0],
  ["Granite-30B", "30B", 2.8, 1.5, 1.5, 16.9, 1.6, 38.4],
  ["Llama-3.3-70B", "70B", 0.3, 0.0, 0.1, 3.2, 0.2, 80.4],
];
const fallbackRows: Row[] = FALLBACK.map(([model, params, e, t, r, p, c, cons], i) => ({
  rank: i + 1, id: `ref-${i}`, team: "ForensicBench authors", model, model_type: "open-weight", params,
  harness_name: "Reference harness", harness_url: "https://github.com/WaguyMz/Forensic_Bench", format: "multi", n_replicates: 5,
  status: "verified", is_reference: true, entry_f1: e, entry_f1_std: null, type_f1: t, recall: r, precision: p,
  coverage: c, consistency: cons,
}));

const fmt = (v: number | null, d = 1) => (v === null || v === undefined ? "-" : v.toFixed(d));

function StatusBadge({ row }: { row: Row }) {
  const map = {
    verified: ["Verified", "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800"],
    unverified: ["Unverified", "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"],
    needs_review: ["In review", "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800"],
    rejected: ["Rejected", "bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-800"],
  } as const;
  const [label, cls] = map[row.status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-none px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${cls}`}>
      {row.status === "verified" && (
        <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </span>
  );
}

const medal = [
  "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950",
  "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800",
  "bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950",
];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-sm ${medal[rank - 1]}`}>
        {rank}
      </span>
    );
  }
  return <span className="inline-flex h-7 w-7 items-center justify-center text-sm tabular-nums text-gray-400 dark:text-slate-500">{rank}</span>;
}

type TypeFilter = "all" | "open-weight" | "api";

function Segmented({ value, onChange }: { value: TypeFilter; onChange: (v: TypeFilter) => void }) {
  const opts: [TypeFilter, string][] = [["all", "All"], ["open-weight", "Open-weight"], ["api", "API"]];
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-xs font-medium dark:bg-slate-800">
      {opts.map(([k, label]) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={`rounded-md px-3 py-1.5 transition-colors ${
            value === k
              ? "bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-blue-300"
              : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function LeaderboardTable() {
  const [rows, setRows] = useState<Row[]>(fallbackRows);
  const [state, setState] = useState<"loading" | "live" | "fallback" | "error">(CONNECTED ? "loading" : "fallback");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [type, setType] = useState<TypeFilter>("all");

  useEffect(() => {
    if (!CONNECTED) return;
    fetch(`${SUPABASE_URL}/rest/v1/public_leaderboard?select=*&order=rank.asc`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Row[]) => { setRows(data); setState("live"); })
      .catch(() => { setRows(fallbackRows); setState("error"); });
  }, []);

  const shown = useMemo(
    () => rows.filter((r) => (!verifiedOnly || r.status === "verified") && (type === "all" || r.model_type === type)),
    [rows, verifiedOnly, type],
  );
  const best = useMemo(() => {
    const m = (k: keyof Row) => Math.max(...shown.map((r) => (typeof r[k] === "number" ? (r[k] as number) : -Infinity)));
    return { entry_f1: m("entry_f1"), type_f1: m("type_f1"), recall: m("recall"), precision: m("precision"), coverage: m("coverage"), consistency: m("consistency") };
  }, [shown]);
  const barMax = Math.max(40, best.entry_f1);

  const metric = (v: number | null, bestV: number) => (
    <span className={v !== null && v === bestV ? "rounded bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "text-gray-700 dark:text-slate-300"}>
      {fmt(v)}
    </span>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 px-4 py-3 dark:border-slate-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <Segmented value={type} onChange={setType} />
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600 dark:text-slate-400">
            <input type="checkbox" className="h-3.5 w-3.5 accent-blue-600" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
            Verified only
          </label>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
          <span className={`h-2 w-2 rounded-full ${state === "live" ? "bg-emerald-500" : state === "loading" ? "animate-pulse bg-amber-400" : "bg-gray-400"}`} />
          {state === "live" && `Live, ${rows.length} entries`}
          {state === "loading" && "Loading..."}
          {state === "fallback" && "Paper results (database not connected)"}
          {state === "error" && "Database unreachable, showing paper results"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-sm">
          <thead>
            <tr className="border-b-2 border-blue-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-slate-700 dark:text-slate-400">
              <th className="w-14 px-4 py-3 text-center">#</th>
              <th className="min-w-[210px] px-3 py-3">Model</th>
              <th className="min-w-[210px] px-3 py-3">Harness</th>
              <th className="px-3 py-3">Runs</th>
              <th className="w-44 px-3 py-3">Entry-F1</th>
              <th className="whitespace-nowrap px-3 py-3 text-right">Type-F1</th>
              <th className="px-3 py-3 text-right">Recall</th>
              <th className="px-3 py-3 text-right">Prec.</th>
              <th className="px-3 py-3 text-right">Cover.</th>
              <th className="px-4 py-3 text-right">Consist.</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-gray-50 transition-colors hover:bg-blue-50/50 dark:border-slate-800/60 dark:hover:bg-slate-800/50 ${
                  i % 2 ? "bg-gray-50/40 dark:bg-slate-900" : ""
                }`}
              >
                <td className="px-4 py-2.5 text-center"><RankBadge rank={r.rank} /></td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="font-semibold text-gray-900 dark:text-slate-100">{r.model}</span>
                    {r.params && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-slate-800 dark:text-slate-400">{r.params}</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 whitespace-nowrap text-xs text-gray-500 dark:text-slate-400">
                    <span>{r.model_type === "api" ? "API" : "Open-weight"}</span>
                    <StatusBadge row={r} />
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="whitespace-nowrap font-medium text-gray-800 dark:text-slate-200">{r.harness_name ?? "Not specified"}</div>
                  <div className="mt-1 flex items-center gap-2 whitespace-nowrap text-xs text-gray-500 dark:text-slate-400">
                    <span>{r.team}</span>
                    {r.harness_url && (
                      <a
                        href={r.harness_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        code
                        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </a>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <span className="rounded-none border border-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:border-slate-700 dark:text-slate-400">
                    {r.format === "single" ? "1 run" : `${r.n_replicates * 5} runs`}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold tabular-nums text-gray-900 dark:text-slate-100">{fmt(r.entry_f1)}</span>
                    {r.entry_f1_std !== null && r.entry_f1_std !== undefined && (
                      <span className="text-[11px] tabular-nums text-gray-400">±{fmt(r.entry_f1_std)}</span>
                    )}
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-none bg-gray-100 dark:bg-slate-800">
                    <div
                      className="h-1.5 rounded-none bg-gradient-to-r from-blue-500 to-violet-500"
                      style={{ width: `${Math.max(((r.entry_f1 ?? 0) / barMax) * 100, 1)}%` }}
                    />
                  </div>
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{metric(r.type_f1, best.type_f1)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{metric(r.recall, best.recall)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{metric(r.precision, best.precision)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{metric(r.coverage, best.coverage)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{metric(r.consistency, best.consistency)}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-500 dark:text-slate-400">No entry matches these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 text-[11px] text-gray-400 dark:border-slate-800 dark:text-slate-500">
        Scores in %, macro-averaged over sectors. Best value per column highlighted. The reference harness is the plan-then-investigate agent used for the paper results.
      </div>
    </div>
  );
}

const field = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900";

export function SubmitForm() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; text: string }>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!CONNECTED) return;
    setBusy(true);
    setResult(null);
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/submit`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: new FormData(e.currentTarget),
      });
      const body = await resp.json();
      if (body.ok) {
        const s = body.scores;
        setResult({
          ok: true,
          text: `Scored. Entry-F1 ${s.entry_f1}${s.entry_f1_std !== null ? ` ± ${s.entry_f1_std}` : ""}, Type-F1 ${s.type_f1}, Recall ${s.recall}, Precision ${s.precision}, Coverage ${s.coverage}. Status: ${body.status}. ${(body.warnings ?? []).join(" ")}`,
        });
      } else {
        setResult({ ok: false, text: (body.errors ?? ["submission failed"]).join(" ") });
      }
    } catch {
      setResult({ ok: false, text: "Network error." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="team" required placeholder="Team / author(s)" className={field} />
        <input name="contact_email" type="email" required placeholder="Contact email (kept private)" className={field} />
        <input name="model" required placeholder="Model name" className={field} />
        <input name="params" placeholder="Parameters (e.g. 70B)" className={field} />
        <select name="model_type" required className={field} defaultValue="open-weight">
          <option value="open-weight">Open-weight model</option>
          <option value="api">API model</option>
        </select>
        <select name="declared_format" required className={field} defaultValue="multi">
          <option value="multi">Multi run (5 replicates per sector)</option>
          <option value="single">Single run (one run per sector)</option>
        </select>
        <input name="harness_name" required placeholder="Harness name (e.g. my-agent v1)" className={field} />
        <input name="harness_url" placeholder="Harness repository URL (https://...)" className={field} />
        <input name="harness_commit" placeholder="Commit hash of the harness" className={field} />
        <input name="token_budget" placeholder="Token budget per run (optional)" className={field} />
      </div>
      <textarea name="notes" placeholder="Notes (tools, prompts, changes to the reference harness)" rows={2} className={field} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-gray-600 dark:text-slate-400">
          Flags file (CSV)
          <input name="file" type="file" accept=".csv" required className={`${field} mt-1`} />
        </label>
        <label className="text-sm text-gray-600 dark:text-slate-400">
          Harness archive (optional, max 20 MB)
          <input name="harness_archive" type="file" className={`${field} mt-1`} />
        </label>
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-400">
        Give the harness repository URL with its commit hash, or upload an archive. Entries stay unverified until a
        maintainer has reviewed the harness code.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy || !CONNECTED}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500"
        >
          {busy ? "Scoring..." : "Submit"}
        </button>
        {!CONNECTED && <span className="text-xs text-gray-500 dark:text-slate-400">Submissions open once the leaderboard database is connected.</span>}
      </div>
      {result && (
        <p className={`rounded-lg p-3 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
          {result.text}
        </p>
      )}
    </form>
  );
}
