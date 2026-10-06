const rows: { date: string; doc: string; acct: string; name: string; dr: string; cr: string; fraud?: boolean }[] = [
  { date: "2024-01-12", doc: "JE-80412", acct: "606300", name: "Purchases", dr: "18,250.00", cr: "" },
  { date: "2024-01-12", doc: "JE-80412", acct: "401000", name: "Suppliers", dr: "", cr: "18,250.00" },
  { date: "2024-01-14", doc: "JE-80977", acct: "606300", name: "Purchases", dr: "42,000.00", cr: "", fraud: true },
  { date: "2024-01-14", doc: "JE-80977", acct: "401000", name: "Suppliers", dr: "", cr: "42,000.00", fraud: true },
  { date: "2024-01-31", doc: "JE-81530", acct: "641000", name: "Payroll", dr: "96,400.00", cr: "" },
  { date: "2024-01-31", doc: "JE-81530", acct: "421000", name: "Staff pay", dr: "", cr: "96,400.00" },
  { date: "2024-02-03", doc: "JE-82291", acct: "401000", name: "Suppliers", dr: "42,000.00", cr: "", fraud: true },
  { date: "2024-02-03", doc: "JE-82291", acct: "512000", name: "Bank", dr: "", cr: "42,000.00", fraud: true },
];

export default function GLVisual() {
  return (
    <figure className="m-0 flex h-full flex-col border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <figcaption className="flex items-center justify-between bg-blue-800 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white">
        <span>General ledger</span>
        <span className="font-normal normal-case tracking-normal text-blue-200">what the agent queries</span>
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-xs">
          <thead>
            <tr className="bg-blue-50 text-left text-blue-900 dark:bg-slate-800 dark:text-blue-200">
              <th className="px-2 py-1.5 font-semibold">Date</th>
              <th className="px-2 py-1.5 font-semibold">Doc</th>
              <th className="px-2 py-1.5 font-semibold">Account</th>
              <th className="px-2 py-1.5 text-right font-semibold">Debit</th>
              <th className="px-2 py-1.5 text-right font-semibold">Credit</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((r, i) => (
              <tr
                key={i}
                className={`border-t border-gray-100 dark:border-slate-800 ${
                  r.fraud ? "bg-red-50 text-red-900 dark:bg-red-900/25 dark:text-red-200" : "text-gray-700 dark:text-slate-300"
                }`}
              >
                <td className="px-2 py-1.5">{r.date}</td>
                <td className="px-2 py-1.5 font-mono">{r.doc}</td>
                <td className="px-2 py-1.5">
                  <span className="font-mono text-gray-400 dark:text-slate-500">{r.acct}</span> {r.name}
                </td>
                <td className="px-2 py-1.5 text-right">{r.dr}</td>
                <td className="px-2 py-1.5 text-right">{r.cr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-auto border-t border-gray-100 px-3 py-2 text-xs text-gray-500 dark:border-slate-800 dark:text-slate-400">
        Red rows belong to one fraud scheme. The ledger gives no such marker: the agent has to find them.
      </p>
    </figure>
  );
}
