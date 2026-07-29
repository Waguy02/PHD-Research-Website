"use client";
import { teamMembers } from "@/lib/data";

export default function TeamPage() {
  const basePath = typeof window !== "undefined" && window.location.pathname.startsWith("/PHD-Research-Website")
    ? "/PHD-Research-Website"
    : "";
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Research Team</h1>
      <p className="mb-12 text-gray-500">Collaborators and supervisors across academia and industry.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {teamMembers.map((member) => (
          <div key={member.id} className="rounded-xl border border-gray-200 bg-white p-6 card-hover">
            <div className="mb-4 flex items-center gap-4">
              {member.image ? (
                <img
                  src={`${basePath}/images/${member.image}`}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-500">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <div>
                <h3 className={`text-lg font-semibold ${member.isMainAuthor ? "text-blue-700" : "text-gray-900"}`}>
                  {member.name}
                  {member.isMainAuthor && (
                    <span className="ml-2 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">Me</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <p className="mb-2 text-sm text-gray-500">{member.affiliation}</p>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">{member.bio}</p>
            <div className="flex flex-wrap gap-3">
              {member.email && (
                <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              )}
              {member.website && (
                <a href={member.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-semibold">Affiliations</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "LORIA", desc: "Laboratoire Lorrain de Recherche en Informatique et ses Applications", sub: "CNRS, Universite de Lorraine" },
            { name: "Forvis Mazars", desc: "Global audit, tax, and advisory firm", sub: "Industry Partner" },
            { name: "LIPN", desc: "Laboratoire d'Informatique de Paris Nord", sub: "Universite Sorbonne Paris Nord, CNRS" },
          ].map((aff) => (
            <div key={aff.name} className="rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover">
              <h3 className="mb-1 font-semibold text-gray-900">{aff.name}</h3>
              <p className="text-sm text-gray-500">{aff.desc}</p>
              <p className="mt-2 text-xs text-gray-400">{aff.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
