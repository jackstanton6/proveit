# contributing

problems live in `content/`, one yaml file per topic. adding a problem means adding an entry to a file. no code changes needed.

## add a problem

append to the `problems:` list of the right topic file:

```yaml
  - id: nt-031
    title: Infinitely many primes of the form 6k+5
    subtopic: Primes
    difficulty: hard
    type: proof
    tags: [primes, contradiction]
    source: Classical
    hints:
      - |
        Mimic Euclid with $N = 6p_1 \cdots p_k - 1$.
    related: [nt-005, lg-014]
    statement: |
      Prove that there are infinitely many primes $p \equiv 5 \pmod 6$.
    solution: |
      Suppose there are finitely many, $p_1, \dots, p_k$...

      ... a contradiction. $\blacksquare$
```

| field | required | notes |
|---|---|---|
| `id` | yes | unique and permanent. topic prefix + next number (`nt-031`). never reuse or renumber, since bookmarks and links depend on it |
| `title` | yes | short, sentence case. may contain `$maths$` |
| `difficulty` | yes | `easy`, `medium` or `hard` |
| `type` | yes | `proof` or `compute` |
| `statement` | yes | markdown + latex |
| `solution` | yes | markdown + latex |
| `subtopic` | no | must be one of the topic's `subtopics` |
| `tags` | no | lowercase, reuse existing tags where possible |
| `hints` | no | list, revealed one at a time |
| `source` | no | e.g. `Putnam 1990 A1`, `Euler`, a textbook |
| `related` | no | ids of similar problems, in any topic |

the order of problems in a file is the order they appear on the site (`3.31` = topic 3, problem 31).

## writing maths

- `$...$` inline, `$$...$$` display. rendered with katex, so most of standard latex works (`align`, `pmatrix`, `cases`, ...).
- always use `|` block scalars for `statement`, `solution` and hints. then backslashes need no escaping.
- a literal dollar sign is `\$`.
- shorthand: `\N \Z \Q \R \C`, `\eps`, `\abs{x}`, `\norm{v}`, `\floor{x}`, `\ceil{x}`, `\set{...}`, `\gcd`, `\lcm`, `\rank`, `\tr`, `\Span`, `\im`, `\E`, `\P`, `\Var`, `\Cov`. add more in `src/lib/math.js`.
- markdown works: blank lines between paragraphs, `**bold**`, lists, tables.

## style

- aim at 1st–3rd year undergrads.
- **easy**: one idea, a few lines. **medium**: needs a trick or several steps. **hard**: a named theorem or a genuinely clever argument.
- solutions should be complete, as you'd want them marked. end proofs with `$\blacksquare$`.
- for compute problems, show the working and state the answer clearly.
- hints nudge without giving the game away.
- if a statement relies on an earlier result, say so ("you may use Bézout's identity").

## add a topic

create `content/<topic>.yaml`:

```yaml
topic:
  id: group-theory        # url slug
  name: Group theory
  order: 14               # position in the sidebar
  prefix: gp              # id prefix for its problems
  blurb: One sentence shown on the home page.
  subtopics: [Subgroups, Homomorphisms]

problems:
  - id: gp-001
    ...
```

## check

```
npm run check
```

this validates ids, required fields, subtopics, `related` links and every piece of latex, and tells you the file and id of anything wrong. it also runs before every build, so a broken problem never reaches the site. then `npm run dev` to see it rendered.
