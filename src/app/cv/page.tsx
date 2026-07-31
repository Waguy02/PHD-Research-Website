import { timelineEvents } from "@/lib/data";

const typeConfig: Record<string, { dot: string; badge: string }> = {
  paper: { dot: "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-slate-800", badge: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  education: { dot: "border-emerald-300 bg-emerald-50 dark:border-emerald-600 dark:bg-slate-800", badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  milestone: { dot: "border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-slate-800", badge: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  presentation: { dot: "border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-slate-800", badge: "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
};

const typeLabels: Record<string, string> = {
  paper: "Paper",
  education: "Education",
  milestone: "Milestone",
  presentation: "Presentation",
};

export default function CVPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-100">Research Timeline</h1>
      <p className="mb-12 text-gray-600 dark:text-slate-400">Academic journey and research milestones.</p>

      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-slate-100">Timeline</h2>
        <div className="relative">
          <div className="absolute left-[19px] top-2 h-[calc(100%-1.5rem)] w-px bg-gray-200 dark:bg-slate-700" />
          <div className="space-y-6">
            {timelineEvents.map((event, i) => {
              const cfg = typeConfig[event.type] || typeConfig.milestone;
              return (
                <div key={i} className="relative flex gap-5">
                  <div className={`relative z-10 mt-1 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border ${cfg.dot}`}>
                    <span className="text-[10px] font-bold leading-none text-gray-500 dark:text-slate-400">{event.year}</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 card-hover dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">{event.title}</h3>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${cfg.badge}`}>
                        {typeLabels[event.type] || event.type}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-slate-100">Skills & Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Machine Learning", items: ["PyTorch", "Transformers", "Mamba/SSM", "LightGBM", "XGBoost"] },
            { title: "NLP & LLMs", items: ["Fine-tuning", "vLLM", "RAG", "Prompt Engineering", "Llama", "Fino1"] },
            { title: "Engineering", items: ["Python", "TypeScript", "Rust", "Docker", "Git", "Next.js"] },
          ].map((group) => (
            <div key={group.title} className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-slate-100">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-slate-100">Education</h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-slate-100">PhD in Artificial Intelligence</h3>
            <p className="mb-2 text-sm text-gray-500 dark:text-slate-400"><a href="https://www.loria.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">LORIA</a>, CNRS, <a href="https://www.univ-lorraine.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">Universite de Lorraine</a> / <a href="https://www.forvismazars.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">Forvis Mazars</a></p>
            <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">CIFRE Agreement &middot; 2024 - Present</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Researching AI methods for financial auditing, combining NLP and structured data analysis for industry classification and fraud detection using multimodal LLMs.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-slate-100">
              Engineering Degree - Mathematical Modelling, Data Science & AI
            </h3>
            <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">Grenoble INP - Ensimag</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Graduated with a diploma in mathematical modelling, data science and artificial intelligence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
