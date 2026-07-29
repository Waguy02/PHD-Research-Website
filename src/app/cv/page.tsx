import { timelineEvents } from "@/lib/data";

const typeStyles: Record<string, string> = {
  paper: "border-blue-500/50 bg-blue-600/10",
  education: "border-emerald-500/50 bg-emerald-600/10",
  milestone: "border-amber-500/50 bg-amber-600/10",
  presentation: "border-purple-500/50 bg-purple-600/10",
};

const typeLabels: Record<string, string> = {
  paper: "Paper",
  education: "Education",
  milestone: "Milestone",
  presentation: "Presentation",
};

export default function CVPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        Research Timeline
      </h1>
      <p className="mb-12 text-gray-400">
        Academic journey and research milestones.
      </p>

      {/* Timeline */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-semibold">Timeline</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 h-[calc(100%-1.5rem)] w-px bg-gray-800" />

          <div className="space-y-8">
            {timelineEvents.map((event, i) => (
              <div key={i} className="relative flex gap-6">
                {/* Dot */}
                <div
                  className={`relative z-10 mt-1.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${typeStyles[event.type] || typeStyles.milestone} border`}
                >
                  <span className="text-[10px] font-bold leading-none text-gray-400">
                    {event.year}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl border border-gray-800 bg-[#111827] p-5 card-hover">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-medium text-white">{event.title}</h3>
                    <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      {typeLabels[event.type] || event.type}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold">Skills & Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
            <h3 className="mb-3 font-medium text-white">Machine Learning</h3>
            <div className="flex flex-wrap gap-2">
              {["PyTorch", "Transformers", "Mamba/SSM", "LightGBM", "XGBoost"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-gray-700 px-2.5 py-1 text-xs text-gray-400"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
            <h3 className="mb-3 font-medium text-white">NLP & LLMs</h3>
            <div className="flex flex-wrap gap-2">
              {["Fine-tuning", "vLLM", "RAG", "Prompt Engineering", "Llama", "Fino1"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-gray-700 px-2.5 py-1 text-xs text-gray-400"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
            <h3 className="mb-3 font-medium text-white">Engineering</h3>
            <div className="flex flex-wrap gap-2">
              {["Python", "TypeScript", "Rust", "Docker", "Git", "Next.js"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-gray-700 px-2.5 py-1 text-xs text-gray-400"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Education</h2>
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
          <h3 className="mb-1 font-medium text-white">
            PhD in Artificial Intelligence
          </h3>
          <p className="mb-2 text-sm text-gray-400">
            LORIA, CNRS, Universite de Lorraine / Forvis Mazars
          </p>
          <p className="text-sm text-gray-500">
            Researching AI methods for financial auditing, combining NLP,
            structured data analysis, and time-series forecasting.
          </p>
        </div>
      </section>
    </div>
  );
}
