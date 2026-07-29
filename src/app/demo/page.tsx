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

const fraudPaper = papers.find((p) => p.id === "ijcai-2026-finllm");

const chartColors = [
  "#3b82f6", // blue
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#f87171", // red for random split
  "#6b7280", // gray for baseline
];

export default function DemoPage() {
  const [sortBy, setSortBy] = useState<"aucScore" | "model">("aucScore");

  const sortedData = [...benchmarkData].sort((a, b) => {
    if (sortBy === "aucScore") return b.aucScore - a.aucScore;
    return a.model.localeCompare(b.model);
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        CI-FSFD Benchmark Explorer
      </h1>
      <p className="mb-4 text-lg text-gray-400">
        Interactive exploration of the benchmark from our IJCAI 2026 FINLLM
        paper on Financial Statement Fraud Detection.
      </p>
      <a
        href="/publications/ijcai-2026-finllm"
        className="mb-12 inline-block text-sm text-blue-400 transition-colors hover:text-blue-300"
      >
        View paper details →
      </a>

      {/* What is CI-FSFD? */}
      <section className="mb-12 rounded-xl border border-gray-800 bg-[#111827] p-6">
        <h2 className="mb-3 text-lg font-semibold text-white">
          What is CI-FSFD?
        </h2>
        <p className="leading-relaxed text-gray-400">
          <strong className="text-gray-300">Company-Isolated Financial Statement Fraud Detection</strong>{" "}
          is a benchmark that prevents data leakage by ensuring all financial
          data from the same company appears exclusively in either the training
          or test set — never both. This addresses a critical flaw in prior work
          where random splits artificially inflated performance (up to 0.96 AUC)
          compared to realistic generalization (~0.70–0.74 AUC).
        </p>
      </section>

      {/* Dataset Stats */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Dataset Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {datasetStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-800 bg-[#111827] p-4 text-center"
            >
              <div className="text-2xl font-bold text-blue-400">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{stat.unit}</div>
              <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benchmark Chart */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Model Performance (AUC)</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "aucScore" | "model")}
            className="rounded-lg border border-gray-700 bg-[#111827] px-3 py-1.5 text-sm text-gray-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="aucScore">Sort by AUC</option>
            <option value="model">Sort by model</option>
          </select>
        </div>

        <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                type="number"
                domain={[0, 1]}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <YAxis
                type="category"
                dataKey="model"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
                formatter={(value) => [Number(value).toFixed(2), "AUC"]}
                labelFormatter={(label) => `Model: ${label}`}
              />
              <Bar dataKey="aucScore" radius={[0, 4, 4, 0]} barSize={28}>
                {sortedData.map((entry, index) => (
                  <Cell
                    key={entry.model}
                    fill={chartColors[index % chartColors.length]}
                    fillOpacity={entry.model === "Zero-shot LLM" ? 0.5 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sortedData.map((entry) => (
            <div
              key={entry.model}
              className="rounded-lg border border-gray-800 bg-[#111827] p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {entry.model}
                </span>
                <span className="text-sm font-bold text-blue-400">
                  {entry.aucScore.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500">{entry.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Insight */}
      <section className="rounded-xl border border-amber-800/40 bg-amber-900/10 p-6">
        <h2 className="mb-3 text-lg font-semibold text-amber-300">
          Key Insight
        </h2>
        <p className="leading-relaxed text-amber-200/80">
          Classic random splitting inflates AUC to <strong>0.96</strong> due to
          data leakage (same company appearing in train and test). When using
          company-isolated evaluation, the best model achieves{" "}
          <strong>0.74 AUC</strong>. Remarkably, text-only SMD&A data outperforms
          combined financial + text data, suggesting a{" "}
          <strong>&ldquo;noise bottleneck&rdquo;</strong> from naive numerical-text
          concatenation.
        </p>
      </section>
    </div>
  );
}
