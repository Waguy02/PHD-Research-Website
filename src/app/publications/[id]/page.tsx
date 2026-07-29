import Link from "next/link";
import { papers } from "@/lib/data";
import { notFound } from "next/navigation";

// Generate static paths for all papers
export function generateStaticParams() {
  return papers.map((paper) => ({
    id: paper.id,
  }));
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = papers.find((p) => p.id === id);

  if (!paper) {
    notFound();
  }

  const authorString = paper.authors.join(", ");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/publications"
        className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to publications
      </Link>

      <article>
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
              {paper.venue}
            </span>
            <span className="rounded bg-green-600/20 px-3 py-1 text-sm font-medium text-green-400">
              {paper.year}
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {paper.title}
          </h1>
          <p className="mb-6 text-lg text-gray-400">{authorString}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {paper.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Abstract */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Abstract</h2>
          <p className="leading-relaxed text-gray-400">{paper.abstract}</p>
        </section>

        {/* Key Results */}
        {paper.keyResults && paper.keyResults.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">Key Results</h2>
            <ul className="space-y-3">
              {paper.keyResults.map((result, i) => (
                <li key={i} className="flex gap-3 text-gray-400">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                  <span className="leading-relaxed">{result}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* BibTeX */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Citation</h2>
          <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-[#0d1117] p-4 text-sm text-gray-400">
            {`@inproceedings{waffo${paper.year}${paper.id.split("-")[0]},
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
