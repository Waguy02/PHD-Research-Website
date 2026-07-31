import Link from "next/link";
import { papers } from "@/lib/data";

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  published: { bg: "bg-emerald-50 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", label: "Published" },
  accepted: { bg: "bg-amber-50 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", label: "Accepted" },
  in_review: { bg: "bg-purple-50 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300", label: "Under Review" },
  in_progress: { bg: "bg-gray-100 dark:bg-slate-800", text: "text-gray-600 dark:text-slate-400", label: "In Progress" },
};

const basePath =
  process.env.NODE_ENV === "production" ? "/PHD-Research-Website" : "";

export default function Home() {
  const sortedPapers = [...papers].sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      {/* Hero */}
      <section className="mb-20">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <img
              src={`${basePath}/images/guy-profile.png`}
              alt="Guy Stephane Waffo Dzuyo"
              className="h-56 w-56 rounded-2xl object-cover shadow-lg sm:h-64 sm:w-64"
            />
          </div>
          <div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Guy Stephane{" "}
              <span className="gradient-text">Waffo Dzuyo</span>
            </h1>
            <p className="mb-2 text-xl text-gray-500 dark:text-slate-400">
              PhD Candidate in Artificial Intelligence
            </p>
            <p className="mb-6 text-gray-400 dark:text-slate-500">
              <a href="https://www.loria.fr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">LORIA</a>, CNRS, <a href="https://www.univ-lorraine.fr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Universite de Lorraine</a> &middot; <a href="https://www.forvismazars.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Forvis Mazars</a>
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-gray-600 dark:text-slate-400">
              My research sits at the intersection of Natural Language Processing
              and Financial Analysis. I develop AI methods for auditing -
              classifying companies by industry sector and detecting financial
              fraud through multimodal LLM-based analysis.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:guy.stephane.waffo@forvismazars.com"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get in touch
              </a>
              <a
                href="https://github.com/Waguy02"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/waguy02"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a
                href="https://scholar.google.com/citations?hl=fr&user=j21NBlEAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
                Scholar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Research areas */}
      <section className="mb-20">
        <h2 className="mb-6 text-2xl font-semibold dark:text-slate-100">Research Focus</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-slate-100">Time Series Forecasting</h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              Leveraging state space models and deep learning architectures for
              financial time series prediction and trend analysis.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-slate-100">Journal Entries Anomaly Detection</h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              Detecting irregular and fraudulent journal entries using graph-based
              and sequential anomaly detection methods in audit data.
            </p>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold dark:text-slate-100">Publications</h2>
          <Link
            href="/publications"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="space-y-4">
          {sortedPapers.map((paper) => {
            const badge = statusBadge[paper.status];
            return (
              <Link
                key={paper.id}
                href={`/publications/${paper.id}`}
                className="card-hover block rounded-xl border border-gray-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {paper.venue}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>
                <h3 className="mb-1 font-medium text-gray-900 dark:text-slate-100">{paper.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{paper.authors.join(", ")}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mt-20">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 dark:border-slate-700 dark:bg-slate-800/50">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-slate-100">Get in Touch</h2>
          <p className="mb-6 text-gray-500 dark:text-slate-400">
            Interested in collaborating or have questions about my research? Feel free to reach out.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-slate-100">Email</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                <a href="mailto:guy.stephane.waffo@forvismazars.com" className="text-blue-600 hover:underline dark:text-blue-400">
                  guy.stephane.waffo@forvismazars.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-slate-100">Affiliations</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-slate-400">
                <li>
                  <a href="https://www.loria.fr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline text-blue-600 dark:text-blue-400">
                    <span className="logo-wrapper"><img src={`${basePath}/images/logos/logo-loria-new.png`} alt="LORIA" className="h-5 object-contain" /></span>
                    LORIA, CNRS, <a href="https://www.univ-lorraine.fr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline text-blue-600 dark:text-blue-400"><span className="logo-wrapper"><img src={`${basePath}/images/logos/logo-university-new.png`} alt="Universite de Lorraine" className="h-4 object-contain" /></span>Universite de Lorraine</a>
                  </a>
                </li>
                <li>
                  <a href="https://www.forvismazars.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline text-blue-600 dark:text-blue-400">
                    <span className="logo-wrapper"><img src={`${basePath}/images/logos/logo-forvis-mazars-new.png`} alt="Forvis Mazars" className="h-5 object-contain" /></span>
                    Forvis Mazars
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-slate-100">GitHub</h3>
              <a
                href="https://github.com/Waguy02"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                github.com/Waguy02
              </a>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-slate-100">Scholar</h3>
              <a
                href="https://scholar.google.com/citations?hl=fr&user=j21NBlEAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Google Scholar Profile
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
