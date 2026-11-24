import { memo, useMemo } from 'react'
import { marked } from 'marked'
import katex from 'katex'
import { extractMath, MACROS, PLACEHOLDER_RE } from '../lib/math.js'

const macros = { ...MACROS }

function render(src) {
  const { text, pieces } = extractMath(src)
  const html = marked.parse(text, { gfm: true, breaks: false })
  return html.replace(PLACEHOLDER_RE, (_, i) => {
    const { tex, display } = pieces[i]
    return katex.renderToString(tex, { displayMode: display, macros, throwOnError: false, strict: 'ignore' })
  })
}

/** Markdown with $inline$ and $$display$$ LaTeX. Content is authored in-repo, so HTML is trusted. */
function Prose({ src, inline = false }) {
  const html = useMemo(() => {
    const out = render(src ?? '')
    return inline ? out.replace(/^<p>|<\/p>\s*$/g, '') : out
  }, [src, inline])
  const Tag = inline ? 'span' : 'div'
  return <Tag className="prose" dangerouslySetInnerHTML={{ __html: html }} />
}

export default memo(Prose)
