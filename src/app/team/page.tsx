import { teamMembers } from "@/lib/data";

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Research Team</h1>
      <p className="mb-12 text-gray-400">
        Collaborators and supervisors across academia and industry.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-gray-800 bg-[#111827] p-6 card-hover"
          >
            <div className="mb-4 flex items-center gap-4">
              {/* Avatar placeholder with initials */}
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold ${
                  member.isMainAuthor
                    ? "bg-blue-600/20 text-blue-400"
                    : "bg-purple-600/20 text-purple-400"
                }`}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    member.isMainAuthor ? "text-blue-300" : "text-white"
                  }`}
                >
                  {member.name}
                  {member.isMainAuthor && (
                    <span className="ml-2 rounded bg-blue-600/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                      Me
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>

            <p className="mb-3 text-sm leading-relaxed text-gray-400">
              {member.affiliation}
            </p>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              {member.bio}
            </p>

            <div className="flex flex-wrap gap-3">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-blue-400"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </a>
              )}
              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-blue-400"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Affiliations */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold">Affiliations</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-5 card-hover">
            <h3 className="mb-1 font-medium text-white">LORIA</h3>
            <p className="text-sm text-gray-400">
              Laboratoire Lorrain de Recherche en Informatique et ses
              Applications
            </p>
            <p className="mt-2 text-xs text-gray-500">
              CNRS, Universite de Lorraine
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-5 card-hover">
            <h3 className="mb-1 font-medium text-white">Forvis Mazars</h3>
            <p className="text-sm text-gray-400">
              Global audit, tax, and advisory firm
            </p>
            <p className="mt-2 text-xs text-gray-500">Industry Partner</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-5 card-hover">
            <h3 className="mb-1 font-medium text-white">LIPN</h3>
            <p className="text-sm text-gray-400">
              Laboratoire d&apos;Informatique de Paris Nord
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Universite Sorbonne Paris Nord, CNRS
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
