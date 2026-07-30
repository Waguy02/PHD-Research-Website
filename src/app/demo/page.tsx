"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Tab = "pipeline" | "dataset" | "prompt" | "architecture" | "results";

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: "pipeline", label: "Data Pipeline", description: "From raw SEC filings to cleaned dataset" },
  { id: "dataset", label: "Dataset Samples", description: "Real data from the CI-FSFD benchmark" },
  { id: "prompt", label: "Summarization Prompts", description: "How we transformed MD&A text into insights" },
  { id: "architecture", label: "Fine-tuning Architecture", description: "LoRA fine-tuning with softmax classifier" },
  { id: "results", label: "Results & Benchmark", description: "Model performance comparison" },
];

// ─── 10 full MDA + AAER slides (with corresponding SMD&A) ──────────
interface MDASlide {
  id: number;
  company: string;
  cik: string;
  quarter: string;
  industry: string;
  fraud: boolean;
  misstatements: string[];
  aaerSummary: string;
  redFlags: string[];
  rawMDA: string;
  smda: string;
}

let mdaSlides: MDASlide[] = [];

const nikeSlide = (): MDASlide | undefined => mdaSlides[1];

// ─── Summarization prompt ──────────────────────────────────────────
const systemPrompt = `You are a highly skilled financial analyst with deep expertise in evaluating corporate disclosures.
You will be provided with the 'Management's Discussion and Analysis' (MD&A) section of a financial report.

Your task is to extract and present the **100 most important and distinct insights, observations, and factual statements** from the MD&A. Focus on:
– Strategic priorities and initiatives
– Operational and segment performance
– Financial results and key trends
– Identified risks and uncertainties
– Forward-looking statements and guidance
– Significant changes, events, or developments

Present as a bulleted list using dash (–). Be clear, specific, concise. Avoid redundancy.
Do not include introduction, conclusion, or extra commentary.
Only output the finalized bullet list.`;

// ─── Fine-tuning prompt ────────────────────────────────────────────
const finPrompt = `The company operates in the {industry} sector.

Financial features:
• Total Revenue: $2,400M (+12% YoY)
• Gross Margin: 68.5%
• Operating Cash Flow: $890M
• Total Assets: $15,200M
• Total Liabilities: $8,900M
• Debt-to-Equity: 0.52
• Current Ratio: 1.8

Below is the summary of the Management Discussion and Analysis (MDA) section:
{mda_summary}

Based on these informations and your knowledge of typical red flags in financial reporting,
assess whether there is a high likelihood that this company is Financial Manipulation Fraud.

Do you think this company is engaging Fraud? Answer with "YES" or "NO"?`;

const completionInstruction = "\n## My answer is:\n";

// ─── Benchmark data by split method ────────────────────────────────
// Company-Isolated (CI-FSFD) — the correct evaluation
const cifdfdData = [
  { model: "Fino1-8B (SMD&A)", auc: 0.74, color: "#2563eb", desc: "Finance-specialized LLM on summarized MD&A text" },
  { model: "Llama-3.1 8B (SMD&A)", auc: 0.73, color: "#3b82f6", desc: "General LLM on summarized MD&A text" },
  { model: "Fino1-8B (FIN+SMD&A)", auc: 0.72, color: "#6366f1", desc: "Finance LLM on combined financial + text data" },
  { model: "Fino1-8B (FIN)", auc: 0.70, color: "#8b5cf6", desc: "Finance LLM on financial indicators only" },
  { model: "LightGBM", auc: 0.69, color: "#a78bfa", desc: "Tree-based ML baseline" },
  { model: "Zero-shot LLM", auc: 0.50, color: "#9ca3af", desc: "Zero-shot LLM (baseline)" },
];

// Random Split — shows data leakage
const randomSplitData = [
  { model: "Fino1-8B (SMD&A)", auc: 0.92, color: "#2563eb", desc: "Finance-specialized LLM (inflated)" },
  { model: "Llama-3.1 8B (SMD&A)", auc: 0.91, color: "#3b82f6", desc: "General LLM (inflated)" },
  { model: "Fino1-8B (FIN+SMD&A)", auc: 0.90, color: "#6366f1", desc: "Finance LLM (inflated)" },
  { model: "Fino1-8B (FIN)", auc: 0.88, color: "#8b5cf6", desc: "Finance LLM (inflated)" },
  { model: "LightGBM", auc: 0.87, color: "#a78bfa", desc: "Tree-based ML (inflated)" },
];

// ─── LoRA config ───────────────────────────────────────────────────
const loraConfig = {
  r: 8,
  alpha: 8,
  dropout: 0.05,
  targetModules: ["q_proj", "v_proj", "up_proj", "down_proj", "gate_proj", "lm_head"],
  baseModels: ["Fino1-8B (4-bit NF4)", "Llama-3.1-8B", "FinO-8B", "FinO-14B"],
  epochs: 10,
  learningRate: "1e-4",
  batchSize: 8,
};

// ─── Training pipeline steps ───────────────────────────────────────
const pipelineSteps = [
  {
    step: 1,
    title: "Data Collection",
    description: "SEC filings (10-K/10-Q) via SEC-API, AAER enforcement releases, XBRL financial data",
    icon: "📥",
  },
  {
    step: 2,
    title: "MDA Extraction",
    description: "Extract Management Discussion & Analysis sections (Item 7 for 10-K, Part 1 Item 2 for 10-Q)",
    icon: "📝",
  },
  {
    step: 3,
    title: "XBRL Financials",
    description: "Parse US-GAAP 2024 taxonomy, extract 122 financial features per company/quarter",
    icon: "📊",
  },
  {
    step: 4,
    title: "Fraud Labeling",
    description: "Link AAER enforcement actions to quarterly filings via CIK + fiscal quarter matching",
    icon: "🏷️",
  },
  {
    step: 5,
    title: "MDA Summarization",
    description: "Qwen3-32B extracts key insights per MD&A section (~3,800 tokens avg)",
    icon: "🤖",
  },
  {
    step: 6,
    title: "Feature Engineering",
    description: "Aggregate, diff, ratio features; Beneish M-score; Dechow accruals",
    icon: "⚙️",
  },
  {
    step: 7,
    title: "Cross-Validation",
    description: "5-fold stratified split by SIC industry + time period to prevent data leakage",
    icon: "🔄",
  },
  {
    step: 8,
    title: "Model Training",
    description: "LoRA fine-tuning with softmax classifier, per-epoch threshold optimization",
    icon: "🎯",
  },
];

// ─── Misstatement types ────────────────────────────────────────────
const misstatementTypes = [
  { type: "Revenue", count: 412, pct: 28.4 },
  { type: "Accounts Receivable", count: 287, pct: 19.8 },
  { type: "Assets Valuation", count: 198, pct: 13.6 },
  { type: "Inventory", count: 156, pct: 10.7 },
  { type: "COGS", count: 134, pct: 9.2 },
  { type: "Reserve Account", count: 98, pct: 6.8 },
  { type: "Liabilities", count: 87, pct: 6.0 },
  { type: "Payables", count: 65, pct: 4.5 },
  { type: "Other/Equity", count: 42, pct: 2.9 },
  { type: "Capitalized Costs", count: 23, pct: 1.6 },
  { type: "Allowance Bad Debt", count: 15, pct: 1.0 },
  { type: "Marketable Securities", count: 11, pct: 0.8 },
];

// ─── Component: Simple bar chart ───────────────────────────────────
function BarChart({ data, valueKey, labelKey, color = "#2563eb" }: {
  data: any[];
  valueKey: string;
  labelKey: string;
  color?: string;
}) {
  const maxValue = Math.max(...data.map((d: any) => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-32 text-xs text-right text-gray-600 shrink-0">{item[labelKey]}</span>
          <div className="flex-1 h-6 rounded bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${(item[valueKey] / maxValue) * 100}%`,
                backgroundColor: color,
                opacity: item[valueKey] === maxValue ? 1 : 0.85,
              }}
            />
          </div>
          <span className="w-16 text-xs font-medium text-gray-800">
            {typeof item[valueKey] === "number" && item[valueKey] % 1 !== 0
              ? item[valueKey].toFixed(2)
              : item[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Component: Tabbed sections ────────────────────────────────────
function TabContent({ activeTab }: { activeTab: Tab }) {
  if (activeTab === "pipeline") {
    return (
      <section className="space-y-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold">End-to-End Data Pipeline</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-xs font-bold text-blue-600">Step {step.step}</span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">{step.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key stats */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">Pipeline Configuration</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="text-sm text-blue-700">Taxonomy: </span>
              <span className="text-sm font-medium text-blue-900">US-GAAP 2024</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Features extracted: </span>
              <span className="text-sm font-medium text-blue-900">122 per quarter</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Misstatement types: </span>
              <span className="text-sm font-medium text-blue-900">11 (excl. Marketable Securities)</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Fraud categories: </span>
              <span className="text-sm font-medium text-blue-900">4 (Financial, Regulatory, Ethical, Market)</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Summarizer: </span>
              <span className="text-sm font-medium text-blue-900">Qwen3-32B (open-source)</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Max insights: </span>
              <span className="text-sm font-medium text-blue-900">100 per section</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (activeTab === "dataset") {
    return <DatasetSlideshow />;
  }

  if (activeTab === "prompt") {
    return (
      <section className="space-y-8">
        {/* System prompt */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-blue-900">MD&A Summarization Prompt (System)</h2>
          <div className="rounded-lg border border-blue-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
              {systemPrompt}
            </pre>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded bg-white p-3 text-center">
              <div className="text-lg font-bold text-blue-600">~3,800</div>
              <div className="text-xs text-gray-400">tokens avg per summary</div>
            </div>
            <div className="rounded bg-white p-3 text-center">
              <div className="text-lg font-bold text-blue-600">100</div>
              <div className="text-xs text-gray-400">max insights per section</div>
            </div>
            <div className="rounded bg-white p-3 text-center">
              <div className="text-lg font-bold text-blue-600">Qwen3-32B</div>
              <div className="text-xs text-gray-400">summarization model</div>
            </div>
          </div>
        </div>

        {/* Classification prompt */}
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-purple-900">Classification Prompt (User)</h2>
          <div className="rounded-lg border border-purple-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
              {finPrompt.replace("{industry}", "Technology").replace("{mda_summary}", (nikeSlide()?.smda || "SMD&A not yet loaded. Data fetched on page load.").split("\n").slice(0, 12).join("\n"))}
              {completionInstruction}
            </pre>
          </div>
          <div className="mt-3">
            <span className="rounded bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Output: "YES" or "NO" (Fraud / Not Fraud)
            </span>
          </div>
        </div>

        {/* Misstatement distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Misstatement Type Distribution</h2>
          <p className="mb-4 text-sm text-gray-500">
            Breakdown of 1,451 AAER-linked fraud cases by misstatement type (11 types, Marketable Securities excluded from training)
          </p>
          <BarChart
            data={misstatementTypes}
            valueKey="count"
            labelKey="type"
            color="#2563eb"
          />
        </div>
      </section>
    );
  }

  if (activeTab === "architecture") {
    return <ArchitectureSection />;
  }

  if (activeTab === "results") {
    return <ResultsContent />;
  }

  return null;
}

// ─── Dataset Slideshow (Diaporama) Component ──────────────────────
function DatasetSlideshow() {
  const [slideIdx, setSlideIdx] = useState(0);
  if (mdaSlides.length === 0) {
    return (
      <section className="space-y-8">
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
          <div className="text-center text-gray-500">
            <div className="mb-2 text-lg font-medium">Loading dataset samples...</div>
            <div className="text-sm text-gray-400">Fetching real SEC filing data from the CI-FSFD benchmark.</div>
          </div>
        </div>
      </section>
    );
  }
  const slide = mdaSlides[slideIdx];

  const prevSlide = () => setSlideIdx((s) => (s - 1 + mdaSlides.length) % mdaSlides.length);
  const nextSlide = () => setSlideIdx((s) => (s + 1) % mdaSlides.length);

  return (
    <section className="space-y-8">
      {/* Dataset overview stats */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Dataset Composition</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: "Companies", value: "13,332", sub: "unique" },
            { label: "Firm-Quarters", value: "268,936", sub: "reports" },
            { label: "Final Samples", value: "10,159", sub: "instances" },
            { label: "Fraud Cases", value: "511", sub: "firm-quarters" },
            { label: "Fraud Rate", value: "5.0%", sub: "balanced" },
            { label: "Industries", value: "11", sub: "sectors" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.sub}</div>
              <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide navigation header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sample Explorer — Diaporama</h2>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {slideIdx + 1} / {mdaSlides.length}
          </span>
        </div>
      </div>

      {/* Slide dots */}
      <div className="flex flex-wrap gap-1.5">
        {mdaSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`h-2 rounded-full transition-all ${
              i === slideIdx ? "w-6 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Main slide card with prev/next arrows flanking it */}
      <div className="relative flex items-stretch gap-2 sm:gap-3">
        {/* Previous arrow — left of card */}
        <button
          onClick={prevSlide}
          className="flex shrink-0 items-center justify-center self-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* The card */}
        <div
          className={`min-w-0 flex-1 rounded-xl border-2 p-6 transition-all ${
            slide.fraud ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"
          }`}
        >
          {/* Header row */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-2.5 py-1 text-xs font-bold ${
                  slide.fraud
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {slide.fraud ? "FRAUD CASE (AAER)" : "NON-FRAUD"}
              </span>
              <span className="text-sm font-semibold text-gray-900">{slide.company}</span>
              <span className="text-xs text-gray-500">CIK {slide.cik}</span>
            </div>
            <div className="text-xs text-gray-500">
              {slide.quarter} · {slide.industry}
            </div>
          </div>

          {/* Content grid: Raw MDA (left) + SMD&A (right) */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Raw MD&A — scrollable but full content */}
            <div className="flex min-w-0 flex-col">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Raw MD&A (Original 10-Q Filing)
              </h3>
              <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                  {slide.rawMDA}
                </pre>
              </div>
              <div className="mt-1 text-right text-[10px] text-gray-400">
                Scroll for full text &darr; · {slide.rawMDA.split(" ").length.toLocaleString()} words
              </div>
            </div>

            {/* Right: SMD&A + AAER */}
            <div className="flex min-w-0 flex-col gap-4">
              {/* Compression arrow and stats */}
              <div className="relative -mx-2 mb-2 flex items-center justify-center">
                <svg className="h-12 w-full" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Curved arrow */}
                  <path
                    d="M 10 30 Q 100 -20 190 30"
                    stroke="url(#arrowGradient)"
                    strokeWidth="3"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <marker id="arrowhead" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
                      <path d="M 0 0 L 12 5 L 0 10 Z" fill="#2563eb" />
                    </marker>
                  </defs>
                </svg>
                {/* Compression badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {(slide.rawMDA.split(" ").length / Math.max(slide.smda.split(" ").length, 1)).toFixed(1)}× compression
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-blue-700">
                  SMD&A (Qwen3-32B Summary)
                </h3>
                <div className="max-h-[360px] overflow-y-auto rounded-lg border border-blue-200 bg-white p-4">
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                    {slide.smda}
                  </pre>
                </div>
                <div className="mt-1 text-right text-[10px] text-gray-400">
                  {slide.smda.split(" ").length.toLocaleString()} words · {((slide.rawMDA.split(" ").length - slide.smda.split(" ").length) / slide.rawMDA.split(" ").length * 100).toFixed(0)}% reduction
                </div>
              </div>

              {/* AAER / Fraud details */}
              <div
                className={`rounded-lg border p-4 ${
                  slide.fraud ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                }`}
              >
                <h3 className="mb-2 text-sm font-semibold text-gray-800">AAER Disclosure</h3>
                <p className="mb-2 text-sm leading-relaxed text-gray-700">{slide.aaerSummary}</p>

                {slide.misstatements.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600">Misstatement Types:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {slide.misstatements.map((mis) => (
                        <span key={mis} className="rounded bg-white px-2 py-0.5 text-xs text-gray-700">
                          {mis}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {slide.redFlags.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-red-600">Red Flags:</span>
                    <ul className="mt-1 space-y-0.5 text-sm text-red-700">
                      {slide.redFlags.map((flag) => (
                        <li key={flag} className="flex items-start gap-1.5">
                          <span className="mt-0.5 text-red-500">&#9888;</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!slide.fraud && (
                  <p className="text-sm text-green-700">
                    No misstatements, no enforcement action, clean audit opinion.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next arrow — right of card */}
        <button
          onClick={nextSlide}
          className="flex shrink-0 items-center justify-center self-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip below */}
      <div className="flex flex-wrap gap-1.5">
        {mdaSlides.map((s, i) => (
          <button
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              i === slideIdx
                ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            {s.company.split(/[(,]/)[0].trim().slice(0, 14)}{s.company.length > 14 ? "..." : ""}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500">
        Browse all 10 samples. Raw MDA text is shown in full (no truncation).
        SMD&A preserves the 11-section structure (strategic priorities, operations, financials, risks, etc.).
        Average raw MDA: ~14k tokens; Average SMD&A: ~3,800 tokens.
      </div>
    </section>
  );
}

// ─── Architecture Section with SVG Diagram ─────────────────────────
function ArchitectureSection() {
  return (
    <section className="space-y-8">
      {/* Large SVG architecture schematic */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-8">
        <h2 className="mb-6 text-center text-xl font-semibold">Fine-tuning Architecture — Flow Overview</h2>
        <svg viewBox="0 0 900 560" className="w-full max-w-4xl mx-auto" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          <defs>
            <marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="#94a3b8"/>
            </marker>
          </defs>

          {/* ====== BOX 1: INPUT ====== */}
          <rect x="30" y="30" width="180" height="80" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2"/>
          <text x="120" y="57" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">INPUT</text>
          <text x="120" y="75" textAnchor="middle" fontSize="10" fill="#475569">FIN (122 features)</text>
          <text x="120" y="90" textAnchor="middle" fontSize="10" fill="#475569">+ SMD&amp;A (Qwen summary)</text>
          <text x="120" y="105" textAnchor="middle" fontSize="9" fill="#94a3b8">serialized into prompt</text>

          <line x1="210" y1="70" x2="246" y2="70" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowR)"/>

          {/* ====== BOX 2: Fino1-8B + LoRA ====== */}
          <rect x="250" y="20" width="260" height="100" rx="10" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="2"/>
          <rect x="256" y="26" width="248" height="30" rx="6" fill="#c7d2fe"/>
          <text x="380" y="46" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4338ca">Fino1-8B + LoRA</text>
          <text x="380" y="68" textAnchor="middle" fontSize="10" fill="#475569">Frozen backbone · LoRA adapters</text>
          <text x="380" y="84" textAnchor="middle" fontSize="9" fill="#64748b">r=8, &alpha;=8, dropout=0.05, lr=1e-4</text>
          <text x="380" y="98" textAnchor="middle" fontSize="9" fill="#64748b">Target: q,v,gate,up,down,lm_head</text>
          <text x="380" y="112" textAnchor="middle" fontSize="8" fill="#94a3b8">4-bit NF4 · 8B params</text>

          <line x1="510" y1="70" x2="546" y2="70" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowR)"/>

          {/* ====== BOX 3: CLASSIFICATION HEAD ====== */}
          <rect x="550" y="20" width="180" height="100" rx="10" fill="#f0fdf4" stroke="#6ee7b7" strokeWidth="2"/>
          <rect x="556" y="26" width="168" height="30" rx="6" fill="#a7f3d0"/>
          <text x="640" y="46" textAnchor="middle" fontSize="12" fontWeight="700" fill="#059669">CLASSIFICATION</text>
          <text x="640" y="68" textAnchor="middle" fontSize="10" fill="#475569">Softmax (last token)</text>
          <text x="640" y="84" textAnchor="middle" fontSize="9" fill="#64748b">Cross-entropy loss</text>
          <text x="640" y="98" textAnchor="middle" fontSize="9" fill="#64748b">All other tokens masked</text>
          <text x="640" y="112" textAnchor="middle" fontSize="8" fill="#94a3b8">YES (fraud) / NO (clean)</text>

          <line x1="730" y1="70" x2="766" y2="70" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowR)"/>

          {/* ====== BOX 4: OUTPUT ====== */}
          <rect x="770" y="30" width="110" height="80" rx="10" fill="#fffbeb" stroke="#fcd34d" strokeWidth="2"/>
          <text x="825" y="57" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b45309">OUTPUT</text>
          <text x="825" y="78" textAnchor="middle" fontSize="10" fill="#475569">Fraud / Clean</text>
          <text x="825" y="95" textAnchor="middle" fontSize="9" fill="#64748b">AUC · F1</text>

          {/* ====== MIDDLE ROW: Training Config ====== */}
          <rect x="100" y="160" width="700" height="90" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="450" y="182" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Training Configuration</text>

          {/* Config row */}
          <g>
            <rect x="120" y="194" width="100" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            <text x="170" y="210" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">Batch: 8</text>
            <rect x="232" y="194" width="100" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            <text x="282" y="210" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">LR: 1e-4</text>
            <rect x="344" y="194" width="100" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            <text x="394" y="210" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">Epochs: 10</text>
            <rect x="456" y="194" width="100" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            <text x="506" y="210" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">AdamW</text>
            <rect x="568" y="194" width="100" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            <text x="618" y="210" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">bfloat16</text>
            <rect x="680" y="194" width="100" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            <text x="730" y="210" textAnchor="middle" fontSize="9" fontWeight="600" fill="#475569">H100 GPU</text>
          </g>

          {/* Under-sampling and threshold box */}
          <rect x="120" y="225" width="660" height="18" rx="5" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
          <text x="450" y="238" textAnchor="middle" fontSize="9" fill="#64748b">Per-epoch undersampling (5%) · Feature dropout · Auto-continue checkpoint · Gradient checkpointing (Unsloth)</text>

          {/* ====== BOTTOM ROW: Evaluation ====== */}
          <rect x="100" y="280" width="700" height="105" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="450" y="302" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">Evaluation Strategy</text>

          {/* CI-FSFD */}
          <rect x="120" y="315" width="320" height="55" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="280" y="335" textAnchor="middle" fontSize="10" fontWeight="700" fill="#16a34a">CI-FSFD (Company-Isolated Split)</text>
          <text x="280" y="352" textAnchor="middle" fontSize="9" fill="#64748b">5-fold stratified · preserves industry + time</text>
          <text x="280" y="365" textAnchor="middle" fontSize="9" fill="#64748b">AUC range: 0.50 – 0.74</text>

          {/* Random Split */}
          <rect x="460" y="315" width="320" height="55" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
          <text x="620" y="335" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">Random Split (Leaky)</text>
          <text x="620" y="352" textAnchor="middle" fontSize="9" fill="#64748b">Same company in both sets</text>
          <text x="620" y="365" textAnchor="middle" fontSize="9" fill="#64748b">AUC range: 0.87 – 0.96 (inflated)</text>

          {/* ====== OTHER MODELS COMPARED ====== */}
          <rect x="100" y="405" width="700" height="40" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
          <text x="450" y="423" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">Other base models compared: Llama-3.1 8B · FinO-8B · FinO-14B</text>
          <text x="450" y="455" textAnchor="middle" fontSize="9" fill="#94a3b8">Affiliations: Forvis Mazars · LORIA (CNRS, Universite de Lorraine) · LIPN (CNRS, Universite Sorbonne Paris Nord)</text>

          {/* ====== LOGOS ROW ====== */}
          <image href="/images/logos/logo-forvis-mazars-title.jpeg" x="230" y="480" height="28" preserveAspectRatio="xMidYMid meet"/>
          <image href="/images/logos/logo-loria.png" x="430" y="475" height="36" preserveAspectRatio="xMidYMid meet"/>
          <image href="/images/logos/logo-university.png" x="550" y="475" height="38" preserveAspectRatio="xMidYMid meet"/>
          <text x="450" y="438" textAnchor="middle" fontSize="9" fill="#94a3b8">All use the same LoRA (r=8, &alpha;=8) and softmax head setup</text>
        </svg>
      </div>

      {/* Hyperparams card below */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">LoRA Configuration</h3>
          <div className="space-y-2.5">
            {[
              { label: "Rank (r)", value: loraConfig.r },
              { label: "Alpha", value: loraConfig.alpha },
              { label: "Dropout", value: loraConfig.dropout },
              { label: "Learning Rate", value: loraConfig.learningRate },
              { label: "Batch Size", value: loraConfig.batchSize },
              { label: "Epochs", value: loraConfig.epochs },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Base Models &amp; Target Modules</h3>
          <div className="mb-3">
            <span className="mb-2 block text-xs font-medium text-gray-500">Base Models</span>
            <div className="flex flex-wrap gap-1.5">
              {loraConfig.baseModels.map((m) => (
                <span key={m} className={"rounded-lg border px-2.5 py-1 text-xs font-medium " + (m.includes("Fino1-8B") ? "border-pink-300 bg-pink-50 text-pink-700" : "border-indigo-200 bg-indigo-50 text-indigo-700")}>{m}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-xs font-medium text-gray-500">Target Modules</span>
            <div className="flex flex-wrap gap-1.5">
              {loraConfig.targetModules.map((m) => (
                <span key={m} className="rounded-lg border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Training mechanisms grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Training Mechanisms</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Softmax Classification", desc: "Modified LM head for 2 classes (Fraud/Not Fraud). Loss computed only on last token (YES/NO). All previous tokens ignored during backprop.", icon: "\ud83c\udfaf" },
            { title: "Per-epoch Undersampling", desc: "Dynamic PermutableUndersamplingDataset balances classes each epoch while preserving SIC industry + year distributions. Targets 5% fraud rate.", icon: "\u2696\ufe0f" },
            { title: "Threshold Optimization", desc: "Per-epoch AUC-based threshold optimization on validation set. Best F1-maximizing threshold applied for final metrics computation.", icon: "\ud83d\udcd0" },
            { title: "Feature Dropout", desc: "Randomly drops financial features during training to prevent over-reliance on specific indicators. Improves generalization across companies.", icon: "\ud83c\udf00" },
            { title: "Auto-Continue Training", desc: "Resumes from best checkpoint (by F1 score). Ensures optimal model selection across all epochs without manual intervention.", icon: "\ud83d\udd04" },
            { title: "Gradient Checkpointing", desc: "Unsloth mode for memory-efficient training. Reduces VRAM usage by recomputing activations during backward pass.", icon: "\ud83d\udcbe" },
          ].map((m) => (
            <div key={m.title} className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-200 hover:shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{m.icon}</span>
                <h3 className="text-sm font-semibold text-gray-900">{m.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-gray-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data flow under the diagram */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Data Flow Summary</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {[
            { label: "SEC Filings", color: "bg-blue-100 text-blue-700 border-blue-200" },
            { label: "XBRL Parsing", color: "bg-blue-100 text-blue-700 border-blue-200" },
            { label: "122 Features", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
            { label: "SMD&A Summary", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
            { label: "Prompt Assembly", color: "bg-purple-100 text-purple-700 border-purple-200" },
            { label: "LoRA Fine-tune", color: "bg-pink-100 text-pink-700 border-pink-200" },
            { label: "Softmax Classifier", color: "bg-green-100 text-green-700 border-green-200" },
            { label: "AUC / F1 Eval", color: "bg-amber-100 text-amber-700 border-amber-200" },
          ].map((step, i) => (
            <span key={step.label} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-medium ${step.color}`}>
              {step.label}
              {i < 7 && <span className="text-gray-400">&rarr;</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Results sub-content with subtabs ──────────────────────────────
function ResultsContent() {
  const [splitMethod, setSplitMethod] = useState<"company" | "random">("company");

  return (
    <section className="space-y-8">
      {/* Split method subtabs */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Evaluation Strategy</h2>
        <p className="mb-4 text-sm text-gray-500">
          Choose the split method to see how data leakage affects reported performance.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setSplitMethod("company")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              splitMethod === "company"
                ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">Company-Isolated (CI-FSFD)</div>
            <div className="mt-0.5 text-xs text-gray-500">Correct evaluation — no data leakage</div>
          </button>
          <button
            onClick={() => setSplitMethod("random")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              splitMethod === "random"
                ? "border-red-300 bg-red-50 text-red-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">Random Split</div>
            <div className="mt-0.5 text-xs text-gray-500">Leaky — same company in train & test</div>
          </button>
        </div>
      </div>

      {/* Company-Isolated results */}
      {splitMethod === "company" && (
        <>
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <h3 className="text-lg font-semibold text-green-900">CI-FSFD (Company-Isolated) — Correct Evaluation</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-green-800">
              All data from the same company appears in <strong>either</strong> training <strong>or</strong> test set — never both.
              This prevents data leakage and reveals the true generalization performance.
            </p>
            <div className="space-y-3">
              {cifdfdData.map((model, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-48 shrink-0 text-sm text-gray-700">{model.model}</span>
                  <div className="flex-1 h-8 rounded bg-gray-100 overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all duration-700 flex items-center justify-end pr-2"
                      style={{
                        width: `${(model.auc / 0.80) * 100}%`,
                        backgroundColor: model.color,
                        opacity: model.model.includes("Zero-shot") ? 0.5 : 0.85,
                      }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">
                        {model.auc.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="w-24 text-right text-sm font-bold text-gray-900">
                    {model.auc.toFixed(2)} AUC
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Bars represent AUC scores on the correct CI-FSFD benchmark. Higher is better.
              The maximum scale is set to 0.80 to better visualize real performance differences.
            </div>
          </div>

          {/* Key findings for CI-FSFD */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <h4 className="mb-2 text-base font-semibold text-green-800">Text Dominates</h4>
              <p className="text-sm leading-relaxed text-green-700">
                SMD&A (AUC 0.74) outperforms combined FIN+SMD&A (AUC 0.72), revealing a
                <strong> "noise bottleneck"</strong> from naive numerical-text concatenation.
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h4 className="mb-2 text-base font-semibold text-blue-800">Domain Adaptation Helps</h4>
              <p className="text-sm leading-relaxed text-blue-700">
                Fino1-8B (AUC 0.74) slightly outperforms Llama-3.1 8B (AUC 0.73),
                showing the value of domain-specific pretraining for financial fraud.
              </p>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
              <h4 className="mb-2 text-base font-semibold text-purple-800">Zero-Shot Fails</h4>
              <p className="text-sm leading-relaxed text-purple-700">
                Zero-shot LLMs perform at chance (~0.50 AUC), confirming that fraud detection requires
                <strong> supervised fine-tuning</strong> on domain-specific data.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Random Split results — shown as warning */}
      {splitMethod === "random" && (
        <>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <h3 className="text-lg font-semibold text-red-900">Random Split — Leaky Evaluation</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-red-800">
              When data is split randomly, the <strong>same company's data appears in both</strong> training and test sets.
              The model memorizes company-specific patterns instead of learning generalizable fraud indicators,
              producing <strong>grossly inflated and misleading scores</strong>.
            </p>
            <div className="space-y-3">
              {randomSplitData.map((model, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-48 shrink-0 text-sm text-gray-700">{model.model}</span>
                  <div className="flex-1 h-8 rounded bg-gray-100 overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all duration-700 flex items-center justify-end pr-2"
                      style={{
                        width: `${(model.auc / 1.0) * 100}%`,
                        backgroundColor: model.color,
                        opacity: 0.75,
                      }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">
                        {model.auc.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="w-24 text-right text-sm font-bold text-red-600">
                    {model.auc.toFixed(2)} AUC
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-red-600">
              These scores are <strong>not comparable</strong> to the CI-FSFD benchmark. They reflect memorization,
              not generalization.
            </div>
          </div>

          {/* Leakage comparison */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">How Much Inflation? (Random vs CI-FSFD)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left text-gray-500 font-medium">Model</th>
                    <th className="pb-2 text-right text-gray-500 font-medium">CI-FSFD AUC</th>
                    <th className="pb-2 text-right text-gray-500 font-medium">Random AUC</th>
                    <th className="pb-2 text-right text-red-600 font-medium">Inflation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { model: "Fino1-8B (SMD&A)", cifdfd: 0.74, random: 0.92 },
                    { model: "Llama-3.1 8B (SMD&A)", cifdfd: 0.73, random: 0.91 },
                    { model: "Fino1-8B (FIN+SMD&A)", cifdfd: 0.72, random: 0.90 },
                    { model: "Fino1-8B (FIN)", cifdfd: 0.70, random: 0.88 },
                    { model: "LightGBM", cifdfd: 0.69, random: 0.87 },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 text-gray-700">{row.model}</td>
                      <td className="py-2 text-right font-medium text-green-700">{row.cifdfd.toFixed(2)}</td>
                      <td className="py-2 text-right font-medium text-red-600">{row.random.toFixed(2)}</td>
                      <td className="py-2 text-right font-bold text-red-600">+{(row.random - row.cifdfd).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Random splitting inflates AUC by <strong>0.15–0.19 points</strong> — turning a moderate 0.69–0.74 AUC
              into a misleading 0.87–0.92. This is why CI-FSFD is essential.
            </p>
          </div>
        </>
      )}

      {/* Dataset imbalance note */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-semibold">Class Imbalance & Handling</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Raw dataset has only 0.03% fraud cases. Training uses epoch-level undersampling to achieve 5% fraud
          distribution while preserving industry and time distributions. Threshold optimization via
          validation F1-maximization ensures precision under imbalanced constraints.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">0.03%</div>
            <div className="text-xs text-gray-400">Raw fraud rate</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">5%</div>
            <div className="text-xs text-gray-400">Training fraud rate</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">10,159</div>
            <div className="text-xs text-gray-400">Final samples</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main component ────────────────────────────────────────────────
export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (mdaSlides.length === 0) {
      const basePath = window.location.pathname.replace(/\/demo\/?$/, "");
      fetch(basePath + "/mda_data.json")
        .then((r) => {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then((data: MDASlide[]) => {
          mdaSlides.length = 0;
          mdaSlides.push(...data);
          forceUpdate((n) => n + 1);
        })
        .catch((err) => console.error("Failed to load MDA data:", err));
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
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

      {/* Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <TabContent activeTab={activeTab} />
    </div>
  );
}