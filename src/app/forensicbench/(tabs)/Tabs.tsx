"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/forensicbench", label: "Paper" },
  { href: "/forensicbench/harness", label: "Base Harness" },
  { href: "/forensicbench/leaderboard", label: "Leaderboard" },
];

export default function Tabs() {
  const path = (usePathname() || "").replace(/\/$/, "");
  return (
    <nav aria-label="ForensicBench sections" className="flex gap-1 border-b border-gray-200 dark:border-slate-800">
      {tabs.map((t) => {
        const exact = t.href === "/forensicbench" ? path.endsWith("/forensicbench") : path.endsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={exact ? "page" : undefined}
            className={`-mb-px border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              exact
                ? "border-blue-600 text-blue-800 dark:border-blue-400 dark:text-blue-300"
                : "border-transparent text-gray-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
