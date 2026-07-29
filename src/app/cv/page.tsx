import { timelineEvents } from "@/lib/data";

const typeConfig: Record<string, { dot: string; badge: string }> = {
  paper: { dot: "border-blue-300 bg-blue-50", badge: "bg-blue-50 text-blue-700" },
  education: { dot: "border-emerald-300 bg-emerald-50", badge: "bg-emerald-50 text-emerald-700" },
  milestone: { dot: "border-amber-300 bg-amber-50", badge: "bg-amber-50 text-amber-700" },
  presentation: { dot: "border-purple-300 bg-purple-50", badge: "bg-purple-50 text-purple-700" },
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
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Research Timeline</h1>
      <p className="mb-12 text-gray-500">Academic journey and research milestones.</p>

      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold">Timeline</h2>
        <div className="relative">
          <div className="absolute left-[19px] top-2 h-[calc(100%-1.5rem)] w-px bg-gray-200" />
          <div className="space-y-6">
            {timelineEvents.map((event, i) => {
              const cfg = typeConfig[event.type] || typeConfig.milestone;
              return (
                <div key={i} className="relative flex gap-5">
                  <div className={`relative z-10 mt-1 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border ${cfg.dot}`}>
                    <span className="text-[10px] font-bold leading-none text-gray-500">{event.year}</span>
                  </div>
                  <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 card-hover">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${cfg.badge}`}>
                        {typeLabels[event.type] || event.type}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-500">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold">Skills & Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Machine Learning", items: ["PyTorch", "Transformers", "Mamba/SSM", "LightGBM", "XGBoost"] },
            { title: "NLP & LLMs", items: ["Fine-tuning", "vLLM", "RAG", "Prompt Engineering", "Llama", "Fino1"] },
            { title: "Engineering", items: ["Python", "TypeScript", "Rust", "Docker", "Git", "Next.js"] },
          ].map((group) => (
            <div key={group.title} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-3 font-semibold text-gray-900">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Education</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-1 font-semibold text-gray-900">PhD in Artificial Intelligence</h3>
          <p className="mb-2 text-sm text-gray-500">LORIA, CNRS, Universite de Lorraine / Forvis Mazars</p>
          <p className="text-sm text-gray-400">
            Researching AI methods for financial auditing, combining NLP, structured data analysis, and time-series forecasting.
          </p>
        </div>
      </section>
    </div>
  );
}
