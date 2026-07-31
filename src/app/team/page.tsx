"use client";
import { teamMembers } from "@/lib/data";

export default function TeamPage() {
  const basePath = typeof window !== "undefined" && window.location.pathname.startsWith("/PHD-Research-Website")
    ? "/PHD-Research-Website"
    : "";
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold tracking-tight dark:text-slate-100">Research Team</h1>
      <p className="mb-12 text-gray-500 dark:text-slate-400">Collaborators and supervisors across academia and industry.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {teamMembers.map((member) => (
          <div key={member.id} className="rounded-xl border border-gray-200 bg-white p-6 card-hover dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center gap-4">
              {member.image ? (
                <img
                  src={`${basePath}/images/${member.image}`}
                  alt={member.name}
                  className="h-24 w-24 rounded-full object-cover shadow-md sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-500 dark:bg-slate-700 dark:text-slate-400">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <div>
                <h3 className={`text-lg font-semibold ${member.isMainAuthor ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-slate-100"}`}>
                  {member.name}
                  {member.isMainAuthor && (
                    <span className="ml-2 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">Me</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{member.role}</p>
              </div>
            </div>
            <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">{member.affiliation}</p>
            <p className="mb-4 text-sm leading-relaxed text-gray-400 dark:text-slate-500">{member.bio}</p>
            <div className="flex flex-wrap gap-3">
              {member.email && (
                <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              )}
              {member.website && (
                <a href={member.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400">
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
        <h2 className="mb-4 text-xl font-semibold dark:text-slate-100">Affiliations</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "LORIA", url: "https://www.loria.fr", desc: "Laboratoire Lorrain de Recherche en Informatique et ses Applications", sub: "CNRS, Universite de Lorraine", logo: "/images/logos/logo-loria-new.png" },
            { name: "Forvis Mazars", url: "https://www.forvismazars.com", desc: "Global audit, tax, and advisory firm", sub: "Industry Partner", logo: "/images/logos/logo-forvis-mazars-new.png" },
            { name: "LIPN", url: "https://www-lipn.univ-paris13.fr", desc: "Laboratoire d'Informatique de Paris Nord", sub: "Universite Sorbonne Paris Nord, CNRS", logo: "/images/logos/logo-loria-new.png" },
          ].map((aff) => (
            <a key={aff.name} href={aff.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-gray-200 bg-gray-50 p-5 card-hover dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mb-3 flex justify-center">
                <img src={aff.logo} alt={aff.name} className="h-12 object-contain" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-slate-100">{aff.name}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{aff.desc}</p>
              <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">{aff.sub}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
