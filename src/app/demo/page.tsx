"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { benchmarkData, datasetStats, papers } from "@/lib/data";
import { useState } from "react";
import Link from "next/link";

const COLORS = ["#2563eb", "#3b82f6", "#6366f1", "#8b5cf6", "#ef4444", "#9ca3af"];

export default function DemoPage() {
  const [sortBy, setSortBy] = useState<"aucScore" | "model">("aucScore");
  const sorted = [...benchmarkData].sort((a, b) =>
    sortBy === "aucScore" ? b.aucScore - a.aucScore : a.model.localeCompare(b.model)
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        CI-FSFD Benchmark Explorer
      </h1>
      <p className="mb-2 text-gray-500">
        Interactive exploration of the benchmark from our IJCAI 2026 FINLLM paper.
      </p>
      <Link
        href="/publications/ijcai-2026-finllm"
        className="mb-12 inline-block text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        View paper details &rarr;
      </Link>

      {/* What is CI-FSFD */}
      <section className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">What is CI-FSFD?</h2>
        <p className="leading-relaxed text-gray-600">
          <strong className="text-gray-800">Company-Isolated Financial Statement Fraud Detection</strong>{" "}
          prevents data leakage by ensuring all data from the same company appears in
          either training or test set — never both. This reveals that prior random-split
          evaluations (up to 0.96 AUC) drastically overestimate real generalization
          (~0.70&ndash;0.74 AUC).
        </p>
      </section>

      {/* Dataset stats */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Dataset Overview</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {datasetStats.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{s.value.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{s.unit}</div>
              <div className="mt-1 text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Model Performance (AUC)</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-blue-400 focus:outline-none"
          >
            <option value="aucScore">Sort by AUC</option>
            <option value="model">Sort by model</option>
          </select>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 24, left: 120, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 1]} tick={{ fill: "#6b7280", fontSize: 12 }} tickFormatter={(v: number) => v.toFixed(2)} />
              <YAxis type="category" dataKey="model" tick={{ fill: "#6b7280", fontSize: 12 }} width={120} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#111827" }}
                formatter={(value: any) => [Number(value).toFixed(2), "AUC"]}
                labelFormatter={(label: any) => `Model: ${label}`}
              />
              <Bar dataKey="aucScore" radius={[0, 4, 4, 0]} barSize={28}>
                {sorted.map((entry, i) => (
                  <Cell key={entry.model} fill={COLORS[i % COLORS.length]} fillOpacity={entry.model === "Zero-shot LLM" ? 0.4 : 0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {sorted.map((e) => (
            <div key={e.model} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{e.model}</span>
                <span className="text-sm font-bold text-blue-600">{e.aucScore.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Insight */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-amber-800">Key Insight</h2>
        <p className="leading-relaxed text-amber-700">
          Classic random splitting inflates AUC to <strong>0.96</strong> due to data leakage.
          Company-isolated evaluation drops to <strong>0.74 AUC</strong>. Text-only SMD&A
          data outperforms combined financial + text data, suggesting a &ldquo;noise bottleneck&rdquo;
          from naive numerical-text concatenation.
        </p>
      </section>
    </div>
  );
}
