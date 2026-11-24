// Shared by the site and by scripts/check.mjs, so keep it dependency-free.

// Shorthand available in every problem. Add more here if needed.
export const MACROS = {
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\R': '\\mathbb{R}',
  '\\C': '\\mathbb{C}',
  '\\F': '\\mathbb{F}',
  '\\eps': '\\varepsilon',
  '\\lcm': '\\operatorname{lcm}',
  '\\ord': '\\operatorname{ord}',
  '\\rank': '\\operatorname{rank}',
  '\\nullity': '\\operatorname{nullity}',
  '\\tr': '\\operatorname{tr}',
  '\\Span': '\\operatorname{span}',
  '\\im': '\\operatorname{im}',
  '\\Var': '\\operatorname{Var}',
  '\\Cov': '\\operatorname{Cov}',
  '\\E': '\\mathbb{E}',
  '\\P': '\\mathbb{P}',
  '\\abs': '\\left|#1\\right|',
  '\\norm': '\\left\\lVert#1\\right\\rVert',
  '\\floor': '\\left\\lfloor#1\\right\\rfloor',
  '\\ceil': '\\left\\lceil#1\\right\\rceil',
  '\\set': '\\left\\{#1\\right\\}',
}

// Matches $$display$$, an escaped \$, or $inline$ (in that order of priority).
const MATH_RE = /\$\$([\s\S]+?)\$\$|\\\$|\$((?:\\.|[^$\\\n])+?)\$/g

/**
 * Pull maths out of a Markdown string so the Markdown parser can't mangle it.
 * Returns the text with placeholders and the list of maths pieces.
 */
export function extractMath(src) {
  const pieces = []
  const text = src.replace(MATH_RE, (m, display, inline) => {
    if (m === '\\$') return '\\$'
    pieces.push({ tex: display ?? inline, display: display !== undefined })
    return `${pieces.length - 1}`
  })
  return { text, pieces }
}

export const PLACEHOLDER_RE = /(\d+)/g
