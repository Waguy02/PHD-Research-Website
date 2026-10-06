"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const basePath = process.env.NODE_ENV === "production" ? "/PHD-Research-Website" : "";

type NavChild = { href: string; label: string; description: string };
type NavItem = { href: string; label: string; children?: NavChild[] };

const navLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/publications", label: "Publications" },
  {
    href: "/apps",
    label: "Apps",
    children: [
      { href: "/forensicbench", label: "ForensicBench", description: "Agentic LLMs on journal-entry fraud" },
      { href: "/demo", label: "CI-FSFD Demo", description: "Financial statement fraud explorer" },
    ],
  },
  { href: "/team", label: "Team" },
  { href: "/cv", label: "CV" },
];

function itemActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  const hrefs = [item.href, ...(item.children ?? []).map((c) => c.href)];
  return hrefs.some((h) => pathname.startsWith(h));
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b-4 border-blue-600 bg-blue-800 transition-shadow ${
        scrolled ? "shadow-lg" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white transition-colors hover:text-blue-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/images/guy-profile.png`}
            alt=""
            className="h-9 w-9 rounded-full object-cover object-top shadow-[0_2px_8px_rgba(0,10,30,0.6)] outline outline-1 -outline-offset-1 outline-white/20"
          />
          <span>G.S. Waffo Dzuyo</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = itemActive(pathname, link);
            const linkClass = `relative text-sm font-medium transition-colors ${
              isActive ? "text-white" : "text-white/70 hover:text-white"
            }`;
            const underline = isActive && (
              <span className="absolute -bottom-4 left-0 right-0 h-1 bg-white" />
            );
            if (!link.children) {
              return (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                  {underline}
                </Link>
              );
            }
            return (
              <div key={link.href} className="group relative">
                <Link href={link.href} className={`${linkClass} inline-flex items-center gap-1`}>
                  {link.label}
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {underline}
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-5 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    {link.children.map((child) => {
                      const childActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 ${
                            childActive ? "bg-blue-50 dark:bg-slate-800" : ""
                          }`}
                        >
                          <div className={`text-sm font-medium ${childActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-slate-100"}`}>
                            {child.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400">{child.description}</div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/80 md:hidden hover:text-white"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <svg
            className="h-6 w-6 transition-transform duration-200"
            style={{ transform: mobileOpen ? "rotate(90deg)" : "none" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile links */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-blue-700 bg-blue-800 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = itemActive(pathname, link);
              const rowClass = (active: boolean) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-blue-700 text-white" : "text-white/80 hover:bg-blue-700 hover:text-white"
                }`;
              return (
                <div key={link.href} className="flex flex-col gap-1">
                  <Link href={link.href} onClick={() => setMobileOpen(false)} className={rowClass(isActive && !link.children)}>
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={`ml-4 ${rowClass(pathname.startsWith(child.href))}`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            })}
            <div className="flex items-center justify-between border-t border-blue-700 pt-3">
              <span className="text-sm text-white/70">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}