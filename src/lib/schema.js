// Validates parsed topic files. Used by scripts/check.mjs before every build.

export const DIFFICULTIES = ['easy', 'medium', 'hard']
export const TYPES = ['proof', 'compute']
const TEXT_FIELDS = ['statement', 'solution']

export function validate(files) {
  const errors = []
  const ids = new Map()
  const topicIds = new Set()
  const err = (file, id, msg) => errors.push(`${file}${id ? ` [${id}]` : ''}: ${msg}`)

  for (const { name, data } of files) {
    const t = data?.topic
    if (!t) { err(name, null, 'missing `topic:` block'); continue }
    for (const f of ['id', 'name', 'order', 'prefix']) if (t[f] === undefined) err(name, null, `topic.${f} is required`)
    if (topicIds.has(t.id)) err(name, null, `duplicate topic id "${t.id}"`)
    topicIds.add(t.id)
    if (!Array.isArray(data.problems)) { err(name, null, '`problems:` must be a list'); continue }

    for (const p of data.problems) {
      const id = p?.id
      if (!id) { err(name, null, `a problem is missing its id (title: ${p?.title ?? '?'})`); continue }
      if (ids.has(id)) err(name, id, `duplicate id (also in ${ids.get(id)})`)
      ids.set(id, name)
      if (t.prefix && !id.startsWith(`${t.prefix}-`)) err(name, id, `id should start with "${t.prefix}-"`)
      for (const f of ['title', ...TEXT_FIELDS]) if (typeof p[f] !== 'string' || !p[f].trim()) err(name, id, `\`${f}\` is required`)
      if (!DIFFICULTIES.includes(p.difficulty)) err(name, id, `difficulty must be one of ${DIFFICULTIES.join(', ')}`)
      if (!TYPES.includes(p.type)) err(name, id, `type must be one of ${TYPES.join(', ')}`)
      if (p.subtopic && t.subtopics && !t.subtopics.includes(p.subtopic)) err(name, id, `subtopic "${p.subtopic}" is not listed in topic.subtopics`)
      for (const f of ['tags', 'hints', 'related']) if (p[f] !== undefined && !Array.isArray(p[f])) err(name, id, `\`${f}\` must be a list`)
    }
  }

  for (const { name, data } of files)
    for (const p of data?.problems ?? [])
      for (const r of p.related ?? []) if (!ids.has(r)) err(name, p.id, `related id "${r}" does not exist`)

  return errors
}

/** Every piece of Markdown+LaTeX text in a problem, labelled for error messages. */
export function texts(p) {
  return [
    ['statement', p.statement],
    ['solution', p.solution],
    ...(p.hints ?? []).map((h, i) => [`hint ${i + 1}`, h]),
  ].filter(([, s]) => typeof s === 'string')
}
