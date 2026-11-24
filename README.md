# proveit

a bank of proof problems for undergrads, with hints and model solutions.

```
npm install
npm run dev
```

## adding problems

append to a file in `content/`, or drop in a new `<topic>.yaml`. no code changes needed. full guide in [CONTRIBUTING.md](CONTRIBUTING.md).

```yaml
  - id: nt-031            # unique, starts with the topic's prefix
    title: Something to prove
    subtopic: Primes      # optional, must be listed in topic.subtopics
    difficulty: medium    # easy | medium | hard
    type: proof           # proof | compute
    tags: [primes]        # optional
    source: Putnam 1990   # optional
    hints:                # optional, shown one at a time
      - |
        Try contradiction.
    related: [nt-005]     # optional
    statement: |
      Markdown with $inline$ and $$display$$ LaTeX.
    solution: |
      ...
```

`npm run check` validates everything (ids, fields, links, LaTeX). it also runs before every build. shorthand macros like `\N`, `\R`, `\abs{x}` live in `src/lib/math.js`.

## deploy

cloudflare workers, static assets (`wrangler.jsonc`). connect the github repo in the cloudflare dashboard with build command `npm run build`, or run `npm run deploy`.

not affiliated with the university of sydney.
