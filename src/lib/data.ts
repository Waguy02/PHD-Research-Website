export interface Paper {
  id: string;
  title: string;
  venue: string;
  year: number;
  status: "published" | "accepted" | "in_review" | "in_progress";
  tags: string[];
  authors: string[];
  abstract: string;
  links: { label: string; url: string }[];
  keyResults?: string[];
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  website?: string;
  email?: string;
  bio: string;
  isMainAuthor?: boolean;
  image?: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  type: "paper" | "education" | "milestone" | "presentation";
}

export interface BenchmarkResult {
  model: string;
  aucScore: number;
  description: string;
  dataset: string;
}

export interface DatasetStat {
  label: string;
  value: number;
  unit: string;
}

export const papers: Paper[] = [
  {
    id: "aaai-2025",
    title:
      "Linking Industry Sectors and Financial Statements: A Hybrid Approach for Company Classification",
    venue: "AAAI 2025",
    year: 2025,
    status: "published",
    tags: ["published", "AAAI", "industry classification", "financial NLP"],
    authors: [
      "Guy Stephane Waffo Dzuyo",
      "Gaël Guibon",
      "Christophe Cerisara",
      "Luis Belmar-Letelier",
    ],
    abstract:
      "We explore the potential of machine learning algorithms and language models to analyze the relationship between industry sector categories and companies' financial statements. We propose a supervised company classification methodology analyzing several types of representations for financial statements. We show that textual information in financial records can be leveraged by language models to match decision tree-based classifier performance while providing better explainability. Our proposed Text-Numeric Transformer - a fusion of tag embeddings with amounts via a gating mechanism - achieves the best MCC of 0.71. LLM-gen (generative classification) with FinLLaMA3 achieves MCC 0.66 and provides explainable predictions, while LightGBM establishes strong baselines with MCC 0.69.",
    links: [
      {
        label: "Code (GitHub)",
        url: "https://github.com/WaguyMz/company_classification",
      },
      {
        label: "Proceedings (AAAI)",
        url: "https://ojs.aaai.org/index.php/AAAI/article/view/33806",
      },
      {
        label: "DOI",
        url: "https://doi.org/10.1609/aaai.v39i16.33806",
      },
    ],
    keyResults: [
      "Text-Numeric Transformer achieves MCC 0.71 - best overall performance",
      "LLM-gen with FinLLaMA3 provides explainable predictions at MCC 0.66",
      "LightGBM baseline reaches MCC 0.69 as a strong non-neural baseline",
      "Textual information matches numerical performance with added explainability",
    ],
  },
  {
    id: "ijcai-2026-finllm",
    title:
      "Benchmarking Generalization in Financial Statement Fraud Detection: Robust Evaluation and Novel Tasks",
    venue: "IJCAI-ECAI 2026, FINLLM Workshop",
    year: 2026,
    status: "accepted",
    tags: ["accepted", "IJCAI", "FINLLM", "fraud detection", "benchmark"],
    authors: [
      "Guy Stephane Waffo Dzuyo",
      "Gaël Guibon",
      "Christophe Cerisara",
      "Luis Belmar-Letelier",
    ],
    abstract:
      "We address financial statement fraud detection (FSFD) by proposing a robust evaluation framework leveraging LLMs to integrate structured financial data and unstructured textual information (MD&A). We introduce the Company-Isolated FSFD (CI-FSFD) benchmark task for more realistic evaluation, constructing and releasing a comprehensive U.S. company dataset combining financial statements, summarized MD&A text, and AAER-derived fraud labels. We demonstrate that Fino1-8B with SMD&A text data achieves best performance (AUC 0.74) on CI-FSFD. Our results show that classic random splitting inflates performance (up to 0.96 AUC), while company-isolated evaluation drops dramatically (~0.70-0.74 AUC), revealing that previous work significantly overestimates generalization.",
    links: [
      {
        label: "arXiv",
        url: "https://arxiv.org/abs/2607.19259",
      },
      {
        label: "Code & Dataset (GitHub)",
        url: "https://github.com/WaguyMz/Financial-Statements-Fraud-Detection",
      },
    ],
    keyResults: [
      "Fino1-8B with SMD&A text achieves best CI-FSFD AUC of 0.74",
      "Random split inflates AUC to 0.96 - company-isolated evaluation is essential",
      "Text-only SMD&A outperforms combined FIN+SMD&A (noise bottleneck)",
      "Zero-shot LLMs perform at chance (~0.50 AUC)",
    ],
  },
  {
    id: "semmamba-neurips-2026",
    title:
      "SemMamba: State Space Models for Financial Statement Analysis",
    venue: "NeurIPS 2026",
    year: 2026,
    status: "in_review",
    tags: ["under_review", "NeurIPS", "state space models", "financial NLP", "Mamba"],
    authors: [
      "Guy Stephane Waffo Dzuyo",
      "Gaël Guibon",
      "Christophe Cerisara",
      "Luis Belmar-Letelier",
    ],
    abstract:
      "We introduce SemMamba, a novel architecture leveraging State Space Models (SSMs) - specifically the Mamba architecture - for financial statement analysis. Unlike Transformers, Mamba models achieve linear-time inference and selective sequence modeling, making them ideal for long financial documents. We adapt Mamba to jointly process structured financial indicators and unstructured MD&A text, enabling efficient fraud detection at scale. Our experiments show competitive performance against LLM-based approaches while significantly reducing computational cost.",
    links: [],
    keyResults: [
      "Mamba architecture adapted for financial statement analysis",
      "Linear-time inference vs quadratic in Transformers",
      "Selective sequence modeling for long financial documents",
      "Joint processing of structured + unstructured financial data",
    ],
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "guy",
    name: "Guy Stephane Waffo Dzuyo",
    role: "PhD Candidate",
    affiliation: "LORIA, CNRS, Universite de Lorraine / Forvis Mazars",
    email: "guy.stephane.waffo@forvismazars.com",
    bio: "PhD candidate researching AI for financial auditing at the intersection of NLP and financial statement analysis. Focused on industry classification and fraud detection using multimodal LLMs.",
    isMainAuthor: true,
    image: "guy-profile.png",
  },
  {
    id: "christophe",
    name: "Christophe Cerisara",
    role: "Research Supervisor",
    affiliation: "LORIA, CNRS, Universite de Lorraine / Forvis Mazars",
    email: "christophe.cerisara@loria.fr",
    website: "https://members.loria.fr/CCerisara/",
    image: "christophe-cerisara.png",
    bio: "Senior researcher at LORIA, CNRS. Expert in natural language processing, neural networks, and multimodal learning.",
  },
  {
    id: "gael",
    name: "Gaël Guibon",
    role: "Research Supervisor",
    affiliation:
      "LORIA, CNRS, Universite de Lorraine / LIPN, Universite Sorbonne Paris Nord",
    email: "gael.guibon@lipn.fr",
    website: "https://gguibon.github.io/",
    image: "gael-guibon.png",
    bio: "Researcher specializing in NLP and financial text analysis. Affiliated with both LORIA and LIPN.",
  },
  {
    id: "luis",
    name: "Luis Belmar-Letelier",
    role: "Industry Supervisor",
    affiliation: "Forvis Mazars",
    email: "luis.belmar-letelier@mazars.fr",
    website: "https://fr.linkedin.com/in/luisbelmarletelier",
    image: "luis-belmar.png",
    bio: "Industry expert at Forvis Mazars, bringing domain expertise in financial auditing and company analysis.",
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    year: 2023,
    title: "Engineering Degree - Grenoble INP - Ensimag",
    description:
      "Graduated with a diploma in Mathematical Modelling, Data Science and Artificial Intelligence from Grenoble INP - Ensimag.",
    type: "education",
  },
  {
    year: 2024,
    title: "Started CIFRE PhD at LORIA / Forvis Mazars",
    description:
      "Began PhD research on AI for financial auditing, combining NLP and structured data analysis for industry classification and fraud detection.",
    type: "education",
  },
  {
    year: 2025,
    title: "AAAI 2025 - Industry Sector Classification",
    description:
      "Published at AAAI 2025: A hybrid approach combining Text-Numeric Transformers and LLMs for company classification by industry sector.",
    type: "paper",
  },
  {
    year: 2026,
    title: "IJCAI 2026 FINLLM - Fraud Detection Benchmark",
    description:
      "Accepted at IJCAI-ECAI 2026 FINLLM Workshop: CI-FSFD benchmark for robust evaluation of financial statement fraud detection.",
    type: "paper",
  },
  {
    year: 2026,
    title: "SemMamba @ NeurIPS 2026 (Under Review)",
    description:
      "Submitted to NeurIPS 2026: State Space Models (Mamba) for efficient financial statement analysis and fraud detection.",
    type: "paper",
  },
];

export const benchmarkData: BenchmarkResult[] = [
  {
    model: "Fino1-8B (SMD&A)",
    aucScore: 0.74,
    description: "Finance-specialized LLM on summarized MD&A text",
    dataset: "CI-FSFD",
  },
  {
    model: "Llama-3.1 8B (SMD&A)",
    aucScore: 0.73,
    description: "General LLM on summarized MD&A text",
    dataset: "CI-FSFD",
  },
  {
    model: "Fino1-8B (FIN+SMD&A)",
    aucScore: 0.72,
    description: "Finance LLM on combined financial + text data",
    dataset: "CI-FSFD",
  },
  {
    model: "Fino1-8B (FIN)",
    aucScore: 0.70,
    description: "Finance LLM on financial indicators only",
    dataset: "CI-FSFD",
  },
  {
    model: "Random Split (Best)",
    aucScore: 0.96,
    description: "Classic evaluation (data leakage inflates scores)",
    dataset: "Random Split",
  },
  {
    model: "Zero-shot LLM",
    aucScore: 0.50,
    description: "Zero-shot LLM performance (baseline)",
    dataset: "CI-FSFD",
  },
];

export const datasetStats: DatasetStat[] = [
  { label: "Companies", value: 13332, unit: "unique" },
  { label: "Firm-Quarters", value: 268936, unit: "reports" },
  { label: "Fraud Labels (AAER)", value: 1451, unit: "firm-quarters" },
  { label: "Financial Features", value: 122, unit: "indicators" },
  { label: "Time Span", value: 15, unit: "years (2009-2024)" },
  { label: "Final Samples", value: 10159, unit: "instances" },
];
