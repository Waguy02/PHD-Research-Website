# PhD Research Website — Guy Stephane Waffo Dzuyo

Personal research website showcasing publications, demos, and research in AI for financial auditing.

**Tech Stack:** Next.js (static export) + TypeScript + Tailwind CSS + Recharts

**Hosting:** GitHub Pages via GitHub Actions

## Sections

- **Home** — Research overview and latest publications
- **Publications** — Accepted papers at AAAI 2025, IJCAI 2026 FINLLM, SemMamba @ NeurIPS 2026
- **Demo** — Interactive CI-FSFD benchmark explorer for financial fraud detection
- **Team** — Research group members and affiliations
- **CV** — Research timeline, skills, and education

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static output is in the `out/` directory, ready for GitHub Pages deployment.

## Project Structure

```
src/
  app/
    page.tsx            # Home page
    publications/
      page.tsx          # Publications list
      [id]/page.tsx     # Individual paper detail pages
    demo/page.tsx       # FINLLM benchmark explorer
    team/page.tsx       # Research team
    cv/page.tsx         # CV / timeline
    layout.tsx          # Root layout with Navbar & Footer
    globals.css         # Global styles & theme
  components/
    Navbar.tsx          # Navigation bar
    Footer.tsx          # Footer with social links
  lib/
    data.ts             # All content data (papers, team, timeline, demo)
```

## Adding a New Publication

1. Add the paper metadata to `src/lib/data.ts` in the `papers` array
2. The publication detail page and list will auto-update (uses `[id]/page.tsx`)

## Deployment

Pushes to `main` trigger GitHub Actions, which builds and deploys to:

`https://Waguy02.github.io/PHD-Research-Website/`
