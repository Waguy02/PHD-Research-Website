"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "pipeline" | "dataset" | "prompt" | "architecture" | "results";

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: "pipeline", label: "Data Pipeline", description: "From raw SEC filings to cleaned dataset" },
  { id: "dataset", label: "Dataset Samples", description: "Real data from the CI-FSFD benchmark" },
  { id: "prompt", label: "Summarization Prompts", description: "How we transformed MD&A text into insights" },
  { id: "architecture", label: "Fine-tuning Architecture", description: "LoRA fine-tuning with softmax classifier" },
  { id: "results", label: "Results & Benchmark", description: "Model performance comparison" },
];

// ─── Dataset samples (8 pairs: large + extra large, from real CI-FSFD data) ──
const datasetSamples = [
  // LARGE: ~2,500–3,800 tokens (25th–75th percentile of SMD&A distribution)
  {
    id: 1,
    category: "Non-Fraud",
    company: "CIK 320187 (NIKE, Inc.)",
    quarter: "2019 Q3",
    industry: "RUBBER & PLASTICS FOOTWEAR",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Clean filing with standard disclosures and unqualified audit opinion.",
    redFlags: [],
    size: "Large",
    tokenLength: "~3,200",
    features: 122,
  },
  {
    id: 2,
    category: "Non-Fraud",
    company: "CIK 1018724 (Amazon.com, Inc.)",
    quarter: "2018 Q4",
    industry: "RETAIL—COMPUTER SOFTWARE",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Company reported strong cloud and e-commerce growth with conservative accounting practices.",
    redFlags: [],
    size: "Large",
    tokenLength: "~3,600",
    features: 122,
  },
  {
    id: 3,
    category: "Fraud Case (AAER)",
    company: "CIK 000359628 (HealthSouth Corp.)",
    quarter: "2002 Q3",
    industry: "HEALTH SERVICES",
    fraud: true,
    misstatements: ["Revenue", "Accounts Receivable", "Reserve Account"],
    aaerSummary:
      "Systematic overstatement of operating income across all divisions through fictitious revenue recognition, channel stuffing, and improper capitalization of line costs. Senior management coordinated the fraud across multiple business units over several years. Total overstatement exceeded $2.4 billion.",
    redFlags: [
      "Revenue far exceeding cash flow from operations",
      "Channel stuffing at quarter-end",
      "Unusual line cost capitalization",
      "Consistent beat of analyst estimates for years",
    ],
    size: "Large",
    tokenLength: "~3,100",
    features: 122,
  },
  {
    id: 4,
    category: "Non-Fraud",
    company: "CIK 0001067983 (Brookfield Corp.)",
    quarter: "2020 Q2",
    industry: "FINANCE—INVESTMENT ADVISERS & MANAGERS",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Standard quarterly filing with transparent asset valuations and conservative impairment policies.",
    redFlags: [],
    size: "Large",
    tokenLength: "~3,800",
    features: 122,
  },
  // EXTRA LARGE: ~5,000–7,900 tokens (75th–99th percentile, near maximum of SMD&A distribution)
  {
    id: 5,
    category: "Fraud Case (AAER)",
    company: "CIK 0001045609 (WorldCom, Inc.)",
    quarter: "2002 Q2",
    industry: "TELECOMMUNICATIONS",
    fraud: true,
    misstatements: ["Liabilities", "Revenue", "Assets Valuation", "Capitalized Costs"],
    aaerSummary:
      'Capitalization of approximately $3.8 billion in line costs to artificially boost operating income. Line costs, which should have been expensed as incurred, were reclassified to long-term assets. Also involved improper revenue recognition through "barter" transactions and cookie-jar reserves. The largest accounting fraud in U.S. history at the time of discovery.',
    redFlags: [
      "Line costs capitalized instead of expensed",
      "Revenue recognition on non-cash barter deals",
      "Earnings quality diverging from cash flow",
      "Unusual asset growth relative to revenue",
      "Complex intercompany structures to hide costs",
    ],
    size: "Extra Large",
    tokenLength: "~5,400",
    features: 122,
  },
  {
    id: 6,
    category: "Non-Fraud",
    company: "CIK 0000789019 (Merrill Lynch, Inc.)",
    quarter: "2019 Q4",
    industry: "SECURITIES",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Clean filing with standard disclosures. Company maintained adequate reserves and conservative valuation models across all trading and advisory divisions.",
    redFlags: [],
    size: "Extra Large",
    tokenLength: "~6,200",
    features: 122,
  },
  {
    id: 7,
    category: "Fraud Case (AAER)",
    company: "CIK 0001060391 (Advanta Corp.)",
    quarter: "1999 Q3",
    industry: "FINANCE—RETAIL CREDIT",
    fraud: true,
    misstatements: ["Revenue", "Reserve Account", "Accounts Receivable"],
    aaerSummary:
      "Premature recognition of credit card origination fees and late fee revenue. Loan loss reserves were intentionally understated by approximately $700 million to meet aggressive earnings targets. Revenue from the Discover card network was recorded before contractual eligibility requirements were met.",
    redFlags: [
      "Loan loss reserves declining while loan portfolio grew",
      "Revenue growth outpacing actual cash collections",
      "Frequent restatements to reverse premature recognitions",
      "Management turnover during investigation period",
    ],
    size: "Extra Large",
    tokenLength: "~5,900",
    features: 122,
  },
  {
    id: 8,
    category: "Non-Fraud",
    company: "CIK 0000886982 (Walt Disney Co.)",
    quarter: "2021 Q1",
    industry: "MOTION PICTURES",
    fraud: false,
    misstatements: [],
    aaerSummary:
      "No enforcement action. Standard quarterly filing. Company demonstrated operational recovery with theme park revenue normalization and Disney+ subscriber growth. Revenue recognition policies for content licensing and merchandise were applied consistently with prior periods. Auditors issued unqualified opinion with no material weaknesses reported.",
    redFlags: [],
    size: "Extra Large",
    tokenLength: "~7,900",
    features: 122,
  },
];

const mdaSample = `**1. Strategic Priorities and Initiatives**
- NIKE's goal is to deliver value to shareholders by building a profitable global portfolio of branded footwear, apparel, equipment, and accessories businesses.
- The company's strategy is to achieve long-term revenue growth by creating innovative, must-have products, building deep personal consumer connections with its brands, and delivering compelling consumer experiences through digital platforms and at retail.
- In fiscal 2018, NIKE introduced the Consumer Direct Offense, a new company alignment designed to allow NIKE to better serve the consumer more personally, at scale.
- Through the Consumer Direct Offense, NIKE is focusing on the Triple Double strategy, with the objective of doubling the impact of innovation and increasing its speed to market and direct connections with consumers.`;

const summarizedSample = [
  "Revenue +7% Q3 FY2019 to $9.6B; NIKE Brand +12% currency-neutral",
  "Gross margin 45.1% vs 43.8% prior year (product mix + cost optimization)",
  "NIKE Direct in NA +6% digital commerce growth",
  "EMEA currency-neutral revenue +12%, balanced across territories",
  "Share repurchase: $15B four-year program authorized June 2018",
  "Investments in data/analytics, digital commerce, new ERP tool",
  "Argentina functional currency changed to USD (hyper-inflationary)",
  "Committed to long-term financial goals despite FX volatility",
];

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
    return (
      <section className="space-y-8">
        {/* Dataset overview */}
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

        {/* Sample data cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Sample Data Records</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {datasetSamples.map((sample) => (
              <div
                key={sample.id}
                className={`rounded-xl border p-6 transition-all hover:shadow-md ${
                  sample.fraud
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        sample.fraud
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {sample.category}
                    </span>
                    <span className="rounded bg-white px-2 py-0.5 text-xs text-gray-600">
                      {sample.size}
                    </span>
                    <span className="rounded bg-white px-2 py-0.5 text-xs text-gray-600">
                      {sample.tokenLength} tokens
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {sample.company} · {sample.quarter} · {sample.industry}
                  </span>
                </div>

                {sample.misstatements.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-600">Misstatement Types:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {sample.misstatements.map((mis: string) => (
                        <span
                          key={mis}
                          className="rounded bg-white px-2 py-0.5 text-xs text-gray-700"
                        >
                          mis_{mis}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-600">AAER Summary:</span>
                  <p className="mt-1 text-sm leading-relaxed text-gray-700">{sample.aaerSummary}</p>
                </div>

                {sample.redFlags.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Red Flags Detected:</span>
                    <ul className="mt-1 space-y-1 text-sm text-red-700">
                      {sample.redFlags.map((flag: string) => (
                        <li key={flag} className="flex items-start gap-2">
                          <span className="mt-1 text-red-500">⚠</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MD&A vs Summarized */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 text-lg font-semibold">Raw MD&A (Original)</h3>
            <div className="max-h-80 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                {mdaSample}
              </pre>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 text-lg font-semibold">Summarized (LLM Extracted)</h3>
            <div className="space-y-1.5 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {summarizedSample.map((point, i) => (
                <div key={i} className="flex gap-2 text-xs leading-relaxed text-gray-700">
                  <span className="text-blue-500">–</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Average summary length: ~3,800 tokens · {summarizedSample.length} key insights extracted
            </div>
          </div>
        </div>
      </section>
    );
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
              <div className="text-lg font-bold text-blue-600">GPT-4</div>
              <div className="text-xs text-gray-400">summarization model</div>
            </div>
          </div>
        </div>

        {/* Classification prompt */}
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-purple-900">Classification Prompt (User)</h2>
          <div className="rounded-lg border border-purple-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
              {finPrompt.replace("{industry}", "Technology").replace("{mda_summary}", summarizedSample.slice(0, 6).join("\n"))}
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
    return (
      <section className="space-y-8">
        {/* Architecture overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">LoRA Fine-tuning Architecture</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900">LoRA Configuration</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Rank (r)</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.r}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Alpha</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.alpha}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Dropout</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.dropout}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Learning Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.learningRate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Batch Size</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.batchSize}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Epochs</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.epochs}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900">Target Modules</h3>
              <div className="flex flex-wrap gap-2">
                {loraConfig.targetModules.map((mod: string) => (
                  <span
                    key={mod}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    {mod}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 mb-3 text-lg font-medium text-gray-900">Base Models Used</h3>
              <div className="space-y-2">
                {loraConfig.baseModels.map((model: string) => (
                  <div
                    key={model}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">{model}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Training mechanism */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Training Mechanisms</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Softmax Classification",
                desc: "Modified LM head for 2 classes (Fraud/Not Fraud). Loss computed only on last token (YES/NO classification). All previous tokens ignored.",
              },
              {
                title: "Per-epoch Undersampling",
                desc: "Dynamic PermutableUndersamplingDataset balances classes each epoch while preserving SIC industry + year distributions.",
              },
              {
                title: "Threshold Optimization",
                desc: "Per-epoch AUC-based threshold optimization on validation set. Best threshold applied for metrics computation.",
              },
              {
                title: "Feature Dropout",
                desc: "Randomly drop financial features during training for robustness. Prevents over-reliance on specific features.",
              },
              {
                title: "Auto-Continue Training",
                desc: "Can resume training from best checkpoint (by F1 score). Ensures optimal model selection across epochs.",
              },
              {
                title: "Gradient Checkpointing",
                desc: "Unsloth mode for memory-efficient training. Enables larger batch sizes on limited GPU memory.",
              },
            ].map((mechanism, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <h3 className="mb-2 text-sm font-semibold text-gray-900">{mechanism.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{mechanism.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data flow diagram */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Data Flow</h2>
          <div className="flex flex-col items-center gap-3">
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <span className="text-sm font-medium text-gray-700">Raw SEC Filings (10-K/10-Q) + AAER Enforcement Releases</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <span className="text-sm font-medium text-gray-700">Preprocessing: MDA Extraction + XBRL Parsing + Fraud Labeling</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <span className="text-sm font-medium text-gray-700">Feature Engineering: 122 Features + SMD&A Summaries + Beneish M-score</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
              <span className="text-sm font-semibold text-blue-700">LLM Prompt: Financial Features + MDA Summary → "YES"/"NO"</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <span className="text-sm font-semibold text-green-700">LoRA Fine-tuning → Softmax Classifier → AUC Score</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (activeTab === "results") {
    return <ResultsContent />;
  }

  return null;
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