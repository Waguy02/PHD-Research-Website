import Link from "next/link";
import { papers } from "@/lib/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return papers.map((paper) => ({ id: paper.id }));
}

const bibtexMap: Record<string, string> = {
  "aaai-2025": `@article{waffo2025linking,
  title={Linking Industry Sectors and Financial Statements: A Hybrid Approach for Company Classification},
  author={Waffo Dzuyo, Guy Stephane and Guibon, Ga{\"{e}}l and Cerisara, Christophe and Belmar-Letelier, Luis},
  journal={Proceedings of the AAAI Conference on Artificial Intelligence},
  volume={39},
  number={16},
  pages={16444--16452},
  year={2025},
  doi={10.1609/aaai.v39i16.33806},
  url={https://ojs.aaai.org/index.php/AAAI/article/view/33806}
}`,
  "ijcai-2026-finllm": `@inproceedings{waffo2026benchmarking,
  title={Benchmarking Generalization in Financial Statement Fraud Detection: Robust Evaluation and Novel Tasks},
  author={Waffo Dzuyo, Guy Stephane and Guibon, Ga{\"{e}}l and Cerisara, Christophe and Belmar-Letelier, Luis},
  booktitle={IJCAI-ECAI 2026, FINLLM Workshop},
  year={2026}
}`,
  "semmamba-neurips-2026": `@inproceedings{waffo2026semmamba,
  title={SemMamba: Semantic Control by Dynamic Modulation for Time-Series Forecasting},
  author={Waffo Dzuyo, Guy Stephane and Guibon, Ga{\"{e}}l and Cerisara, Christophe and Belmar-Letelier, Luis},
  booktitle={NeurIPS 2026},
  year={2026},
  note={Under review}
}`,
};

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = papers.find((p) => p.id === id);
  if (!paper) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/publications"
        className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to publications
      </Link>

      <article>
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {paper.venue}
            </span>
            <span className="rounded bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              {paper.year}
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {paper.title}
          </h1>
          <p className="mb-6 text-base text-gray-500">{paper.authors.join(", ")}</p>

          <div className="flex flex-wrap gap-2">
            {paper.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-700"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">Abstract</h2>
          <p className="leading-relaxed text-gray-600">{paper.abstract}</p>
        </section>

        {paper.keyResults && paper.keyResults.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold">Key Results</h2>
            <ul className="space-y-2">
              {paper.keyResults.map((result, i) => (
                <li key={i} className="flex gap-3 text-gray-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-lg font-semibold">Citation</h2>
          <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            {bibtexMap[paper.id] || `@inproceedings{waffo${paper.year},
  title={${paper.title}},
  author={${paper.authors.join(" and ")}},
  booktitle={${paper.venue}},
  year={${paper.year}}
}`}
          </pre>
        </section>
      </article>
    </div>
  );
}
