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
  baseModels: ["Llama-3.1-8B (4-bit)", "FinO-8B", "FinO-14B", "Qwen-32B"],
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
                Scroll for full text &darr; · {slide.rawMDA.split(" ").length} words
              </div>
            </div>

            {/* Right: SMD&A + AAER */}
            <div className="flex min-w-0 flex-col gap-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-blue-700">
                  SMD&A (Qwen3-32B Summary)
                </h3>
                <div className="max-h-[360px] overflow-y-auto rounded-lg border border-blue-200 bg-white p-4">
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                    {slide.smda}
                  </pre>
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
        <h2 className="mb-6 text-center text-xl font-semibold">LoRA Fine-tuning Architecture — Schematic Overview</h2>
        <svg viewBox="0 0 1160 960" className="w-full max-w-5xl mx-auto" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          <defs>
            <filter id="shadow1" x="-4%" y="-4%" width="108%" height="112%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
            </filter>
            <filter id="shadow2" x="-4%" y="-4%" width="108%" height="112%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15"/>
            </filter>
            <marker id="arrowDown" markerWidth="10" markerHeight="8" refX="5" refY="4" orient="auto">
              <path d="M0,0 L10,4 L0,8" fill="#64748b"/>
            </marker>
            <marker id="arrowDownBlue" markerWidth="10" markerHeight="8" refX="5" refY="4" orient="auto">
              <path d="M0,0 L10,4 L0,8" fill="#2563eb"/>
            </marker>
            <marker id="arrowRight" markerWidth="10" markerHeight="8" refX="3" refY="4" orient="auto">
              <path d="M0,0 L10,4 L0,8" fill="#64748b"/>
            </marker>
            <linearGradient id="gradInput" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dbeafe"/>
              <stop offset="100%" stopColor="#bfdbfe"/>
            </linearGradient>
            <linearGradient id="gradLLM" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0e7ff"/>
              <stop offset="100%" stopColor="#c7d2fe"/>
            </linearGradient>
            <linearGradient id="gradLora" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fce7f3"/>
              <stop offset="100%" stopColor="#fbcfe8"/>
            </linearGradient>
            <linearGradient id="gradHead" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d1fae5"/>
              <stop offset="100%" stopColor="#a7f3d0"/>
            </linearGradient>
            <linearGradient id="gradOutput" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef3c7"/>
              <stop offset="100%" stopColor="#fde68a"/>
            </linearGradient>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="1160" height="960" rx="16" fill="white"/>

          {/* ====== SECTION 1: INPUT (top-left) ====== */}
          <rect x="30" y="40" width="340" height="190" rx="12" fill="url(#gradInput)" stroke="#93c5fd" strokeWidth="1.5" filter="url(#shadow1)"/>
          <text x="200" y="65" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">INPUT PREPARATION</text>

          {/* Financial features */}
          <rect x="50" y="80" width="300" height="44" rx="6" fill="white" stroke="#bfdbfe" strokeWidth="1"/>
          <text x="60" y="100" fontSize="10" fontWeight="600" fill="#475569">Financial Indicators (FIN)</text>
          <text x="60" y="115" fontSize="9" fill="#94a3b8">122 engineered features: ratios, M-score, accruals, R&amp;D intensity</text>

          {/* Text features */}
          <rect x="50" y="132" width="300" height="44" rx="6" fill="white" stroke="#bfdbfe" strokeWidth="1"/>
          <text x="60" y="152" fontSize="10" fontWeight="600" fill="#475569">Summarized MD&amp;A (SMD&amp;A)</text>
          <text x="60" y="167" fontSize="9" fill="#94a3b8">Qwen3-32B summary (avg ~3,800 tokens, 11 sections)</text>

          {/* Serialized prompt */}
          <rect x="50" y="184" width="300" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4,3"/>
          <text x="60" y="202" fontSize="10" fontWeight="600" fill="#1d4ed8">Serialized Prompt</text>
          <text x="60" y="215" fontSize="9" fill="#64748b">{"\"Industry: {s} | Financials: {122 features} | {SMDA}\""}</text>

          {/* Arrow input&#8594;LLM */}
          <line x1="200" y1="230" x2="200" y2="265" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>

          {/* ====== SECTION 2: BASE LLM (center) ====== */}
          <rect x="30" y="270" width="480" height="220" rx="12" fill="url(#gradLLM)" stroke="#a5b4fc" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="270" y="295" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4338ca">BASE LLM — Pretrained Backbone</text>

          {/* Model selector */}
          <rect x="50" y="310" width="140" height="70" rx="8" fill="white" stroke="#c7d2fe" strokeWidth="1"/>
          <text x="120" y="330" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4338ca">Base Models</text>
          <text x="120" y="347" textAnchor="middle" fontSize="9" fill="#64748b">Fino1-8B</text>
          <text x="120" y="360" textAnchor="middle" fontSize="9" fill="#64748b">Llama-3.1 8B</text>
          <text x="120" y="373" textAnchor="middle" fontSize="9" fill="#64748b">Qwen3-32B</text>

          {/* 4-bit */}
          <rect x="210" y="310" width="120" height="70" rx="8" fill="white" stroke="#c7d2fe" strokeWidth="1"/>
          <text x="270" y="330" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4338ca">Quantization</text>
          <text x="270" y="350" textAnchor="middle" fontSize="11" fontWeight="700" fill="#059669">4-bit NF4</text>
          <text x="270" y="368" textAnchor="middle" fontSize="9" fill="#64748b">GPTQ quantization</text>

          {/* Hidden layers */}
          <rect x="50" y="390" width="440" height="90" rx="8" fill="white" stroke="#c7d2fe" strokeWidth="1"/>
          <text x="270" y="410" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4338ca">Transformer Layers (Hidden)</text>

          {/* Layer blocks */}
          {[0,1,2,3].map((i) => (
            <rect key={i} x={65 + i*106} y={420} width="96" height="24" rx="4" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1"/>
          ))}
          <text x="270" y="434" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6366f1">self-attn</text>
          {[0,1,2,3].map((i) => (
            <text key={i} x={65 + i*106 + 48} y="450" textAnchor="middle" fontSize="8" fill="#94a3b8">Layer {i+1}</text>
          ))}
          <text x="462" y="440" fontSize="10" fill="#94a3b8">...</text>

          {/* ====== SECTION 3: LORA ADAPTERS (right, beside LLM) ====== */}
          <rect x="530" y="270" width="340" height="220" rx="12" fill="url(#gradLora)" stroke="#f9a8d4" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="700" y="295" textAnchor="middle" fontSize="12" fontWeight="700" fill="#be185d">LoRA ADAPTERS (Trainable)</text>

          {/* LoRA params */}
          <rect x="550" y="310" width="300" height="50" rx="8" fill="white" stroke="#fbcfe8" strokeWidth="1"/>
          <text x="560" y="328" fontSize="10" fontWeight="600" fill="#be185d">LoRA Hyperparameters</text>
          <text x="560" y="345" fontSize="9" fill="#64748b">r = 8 | &#x3b1; = 8 | dropout = 0.05 | lr = 1e-4</text>

          {/* Target modules */}
          <rect x="550" y="370" width="300" height="110" rx="8" fill="white" stroke="#fbcfe8" strokeWidth="1"/>
          <text x="700" y="390" textAnchor="middle" fontSize="10" fontWeight="600" fill="#be185d">Target Modules (Linear Layers)</text>

          {["q_proj", "v_proj", "gate_proj", "up_proj", "down_proj", "lm_head"].map((mod, i) => (
            <rect key={i} x={560 + (i%2)*140} y={400 + Math.floor(i/2)*24} width="130" height="20" rx="4" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1"/>
          ))}
          <text x="562" y="414" fontSize="8" fontWeight="600" fill="#be185d">q_proj</text>
          <text x="702" y="414" fontSize="8" fontWeight="600" fill="#be185d">v_proj</text>
          <text x="562" y="438" fontSize="8" fontWeight="600" fill="#be185d">gate_proj</text>
          <text x="702" y="438" fontSize="8" fontWeight="600" fill="#be185d">up_proj</text>
          <text x="562" y="462" fontSize="8" fontWeight="600" fill="#be185d">down_proj</text>
          <text x="702" y="462" fontSize="8" fontWeight="600" fill="#be185d">lm_head</text>

          {/* Arrow LLM &#8594; LoRA */}
          <line x1="510" y1="380" x2="530" y2="380" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowRight)"/>

          {/* Arrow LLM+LoRA &#8594; Head */}
          <line x1="510" y1="480" x2="510" y2="510" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>
          <line x1="510" y1="480" x2="700" y2="510" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>

          {/* ====== SECTION 4: CLASSIFICATION HEAD (center-bottom) ====== */}
          <rect x="240" y="515" width="460" height="130" rx="12" fill="url(#gradHead)" stroke="#6ee7b7" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="470" y="540" textAnchor="middle" fontSize="12" fontWeight="700" fill="#059669">CLASSIFICATION HEAD</text>

          {/* Softmax */}
          <rect x="260" y="555" width="200" height="80" rx="8" fill="white" stroke="#a7f3d0" strokeWidth="1"/>
          <text x="360" y="575" textAnchor="middle" fontSize="10" fontWeight="600" fill="#059669">Softmax Classification</text>
          <text x="360" y="595" textAnchor="middle" fontSize="9" fill="#64748b">Last token only (YES / NO)</text>
          <text x="360" y="612" textAnchor="middle" fontSize="9" fill="#64748b">Cross-entropy loss on last logit</text>
          <text x="360" y="627" textAnchor="middle" fontSize="8" fill="#94a3b8">All other tokens masked</text>

          {/* Mechanisms panel */}
          <rect x="480" y="555" width="200" height="80" rx="8" fill="white" stroke="#a7f3d0" strokeWidth="1"/>
          <text x="580" y="575" textAnchor="middle" fontSize="10" fontWeight="600" fill="#059669">Training Mechanisms</text>
          <text x="580" y="595" textAnchor="middle" fontSize="9" fill="#64748b">Per-epoch undersampling (5%)</text>
          <text x="580" y="612" textAnchor="middle" fontSize="9" fill="#64748b">Feature dropout (random)</text>
          <text x="580" y="627" textAnchor="middle" fontSize="8" fill="#94a3b8">Gradient checkpointing</text>

          {/* Arrow &#8594; Output */}
          <line x1="470" y1="645" x2="470" y2="680" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>

          {/* ====== SECTION 5: OUTPUT (bottom) ====== */}
          <rect x="240" y="685" width="460" height="100" rx="12" fill="url(#gradOutput)" stroke="#fcd34d" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="470" y="710" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b45309">OUTPUT &amp; EVALUATION</text>

          {/* Binary output */}
          <rect x="260" y="723" width="180" height="48" rx="8" fill="white" stroke="#fde68a" strokeWidth="1"/>
          <text x="350" y="745" textAnchor="middle" fontSize="12" fontWeight="700" fill="#dc2626">YES (Fraud)</text>
          <text x="350" y="760" textAnchor="middle" fontSize="9" fill="#64748b">or</text>

          {/* Metrics */}
          <rect x="500" y="723" width="180" height="48" rx="8" fill="white" stroke="#fde68a" strokeWidth="1"/>
          <text x="590" y="743" textAnchor="middle" fontSize="12" fontWeight="700" fill="#16a34a">NO (Clean)</text>

          {/* Threshold optimization hint */}
          <rect x="50" y="723" width="180" height="48" rx="8" fill="#fffbeb" stroke="#fde68a" strokeWidth="1"/>
          <text x="140" y="745" textAnchor="middle" fontSize="10" fontWeight="600" fill="#b45309">F1-max threshold</text>
          <text x="140" y="760" textAnchor="middle" fontSize="9" fill="#64748b">AUC optimization</text>

          {/* ====== RIGHT PANEL: Evaluation split (sidebar) ====== */}
          <rect x="890" y="40" width="240" height="250" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow1)"/>
          <text x="1010" y="65" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">EVALUATION SPLIT</text>

          {/* CI-FSFD */}
          <rect x="905" y="80" width="210" height="90" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="1010" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="#16a34a">CI-FSFD (Recommended)</text>
          <text x="1010" y="118" textAnchor="middle" fontSize="9" fill="#64748b">Company-isolated split</text>
          <text x="1010" y="133" textAnchor="middle" fontSize="9" fill="#64748b">5-fold stratified</text>
          <text x="1010" y="148" textAnchor="middle" fontSize="9" fill="#64748b">Preserves industry + time</text>
          <text x="1010" y="163" textAnchor="middle" fontSize="8" fill="#94a3b8">~0.50–0.74 AUC range</text>

          {/* Random split */}
          <rect x="905" y="185" width="210" height="90" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
          <text x="1010" y="205" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">Random Split (Leaky)</text>
          <text x="1010" y="223" textAnchor="middle" fontSize="9" fill="#64748b">Same company in both sets</text>
          <text x="1010" y="238" textAnchor="middle" fontSize="9" fill="#64748b">Memorization artifact</text>
          <text x="1010" y="253" textAnchor="middle" fontSize="9" fill="#64748b">~0.87–0.96 AUC (inflated)</text>
          <text x="1010" y="268" textAnchor="middle" fontSize="8" fill="#94a3b8">DO NOT USE</text>

          {/* ====== BOTTOM INFO PANEL ====== */}
          <rect x="890" y="310" width="240" height="180" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow1)"/>
          <text x="1010" y="335" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">TRAINING CONFIG</text>

          {[
            { l: "Batch Size", v: "8" },
            { l: "Learning Rate", v: "1e-4" },
            { l: "Epochs", v: "10" },
            { l: "Optimizer", v: "AdamW" },
            { l: "Precision", v: "Mixed (bfloat16)" },
            { l: "GPU", v: "NVIDIA H100" },
            { l: "Time per fold", v: "~4 hours" },
            { l: "LoRA rank r", v: "8" },
          ].map((row, i) => (
            <g key={i}>
              <text x="910" y={360 + i*18} fontSize="9" fill="#64748b">{row.l}</text>
              <text x="1110" y={360 + i*18} textAnchor="end" fontSize="9" fontWeight="600" fill="#334155">{row.v}</text>
            </g>
          ))}

          {/* Legend */}
          <rect x="30" y="840" width="1100" height="100" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
          <text x="580" y="862" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">Legend</text>

          {[
            { c: "#bfdbfe", t: "Input Data (FIN + SMD&A)" },
            { c: "#c7d2fe", t: "Base LLM Backbone (frozen)" },
            { c: "#fbcfe8", t: "LoRA Adapters (trainable parameters)" },
            { c: "#a7f3d0", t: "Classification Head (softmax + training mechanics)" },
            { c: "#fde68a", t: "Output & Evaluation (binary + metrics)" },
          ].map((item, i) => (
            <g key={i}>
              <rect x={60 + i*215} y={880} width="205" height="16" rx="4" fill={item.c} stroke="#e2e8f0" strokeWidth="1"/>
              <text x={162 + i*215} y="892" textAnchor="middle" fontSize="8" fontWeight="500" fill="#334155">{item.t}</text>
            </g>
          ))}
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
                <span key={m} className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{m}</span>
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
      fetch("/mda_data.json")
        .then((r) => r.json())
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