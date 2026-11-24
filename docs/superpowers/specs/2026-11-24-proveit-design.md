# ProveIt — design

## Intent
A large, extensible bank of proof and maths problems for 1st–3rd year undergrads, each with hints and a revealable model solution. Lowkey, academic, almost plain. Built by and for a first-year student; more problems will be added over time without touching code.

## Goals
- ~300 starting problems, 30 per topic, across 10 topics; ~70% proof / 30% compute; easy/medium/hard.
- Adding problems or topics = editing/adding YAML only.
- LaTeX rendered with KaTeX.
- Progress (attempted/solved), bookmarks, notes in localStorage; JSON export/import.
- 4 themes (light, dark, usyd-light, usyd-dark) × 2 font styles (academic serif, terminal lowercase mono).
- Search, random problem, printable problem sheets.

## Non-goals / anti-goals
- No accounts, no server, no analytics.
- No decorative design: no gradients, shadows, illustrations, or animation beyond what's functional.
- No USYD crest/logo or implied affiliation (footer disclaimer).
- README stays minimal and lowkey.

## Approaches
1. **Build-time YAML → bundled JSON (chosen).** Vite plugin parses `content/*.yaml`; validator runs before build and fails on bad ids, missing fields, broken `related` refs, or LaTeX KaTeX can't parse.
2. Runtime fetch of YAML — rejected: errors surface only in the browser.
3. JS data files — rejected: user wants no code to add problems.

## Data schema (`content/<topic>.yaml`)
```yaml
topic:
  id: number-theory        # slug, used in URLs
  name: Number theory
  order: 3
  prefix: nt               # problem id prefix
  blurb: Divisibility, primes, congruences.
  subtopics: [Divisibility, Primes, Congruences]
problems:
  - id: nt-001             # unique, stable
    title: Infinitely many primes
    subtopic: Primes
    difficulty: easy       # easy | medium | hard
    type: proof            # proof | compute
    tags: [primes, contradiction]
    source: Euclid         # optional
    hints: [ ... ]         # optional, markdown+LaTeX
    related: [nt-004]      # optional ids
    statement: |
      Markdown with $inline$ and $$display$$ maths.
    solution: |
      ...
```

## Stack
Vite + React (JSX), react-router-dom, KaTeX, marked (+ math extension), js-yaml. Plain CSS with custom properties. Deployed as a Cloudflare Worker serving static assets (`wrangler.jsonc`, SPA fallback), synced from GitHub.

## UI
- Header: wordmark, search, random, theme select, font toggle.
- Sidebar: topics with solved/total counts; "bookmarked" view.
- List: filters (difficulty, type, subtopic, tag, status), compact rows.
- Problem page `/p/:id`: statement, hints one-by-one, show solution, status, bookmark, notes, related, prev/next.
- Print `/print?...`: current filter as a sheet, solutions optional.
- Settings: export/import progress JSON.
- Terminal font mode lowercases UI chrome only, never problem content.

## Left to the builder
Exact palette values, spacing scale, routes for search results, validator output format.
