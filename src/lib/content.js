// Loads every content/*.yaml at build time. No code changes needed to add problems or topics.
const modules = import.meta.glob('../../content/*.{yaml,yml}', { eager: true, import: 'default' })

export const topics = Object.values(modules)
  .map(({ topic, problems }) => ({ ...topic, subtopics: topic.subtopics ?? [], problems: problems ?? [] }))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))

export const problems = topics.flatMap((t, ti) =>
  t.problems.map((p, pi) => ({
    tags: [],
    hints: [],
    related: [],
    ...p,
    topicId: t.id,
    topicName: t.name,
    number: `${ti + 1}.${pi + 1}`,
    haystack: [p.title, p.statement, p.subtopic, p.source, ...(p.tags ?? [])].join(' ').toLowerCase(),
  })),
)

export const byId = new Map(problems.map((p) => [p.id, p]))
export const topicById = new Map(topics.map((t) => [t.id, t]))
export const problemsOf = (topicId) => problems.filter((p) => p.topicId === topicId)

export const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
export const TYPE_LABEL = { proof: 'Proof', compute: 'Compute' }

/** Applies list filters (all optional) from a URLSearchParams-like object. */
export function applyFilters(list, f, progress) {
  const q = (f.get('q') ?? '').trim().toLowerCase()
  const terms = q ? q.split(/\s+/) : []
  const d = f.get('difficulty')
  const ty = f.get('type')
  const sub = f.get('subtopic')
  const tag = f.get('tag')
  const st = f.get('status')
  return list.filter(
    (p) =>
      (!d || p.difficulty === d) &&
      (!ty || p.type === ty) &&
      (!sub || p.subtopic === sub) &&
      (!tag || p.tags.includes(tag)) &&
      (!st ||
        (st === 'unsolved' ? progress.status(p.id) !== 'solved' : st === 'bookmarked' ? progress.isBookmarked(p.id) : progress.status(p.id) === st)) &&
      terms.every((t) => p.haystack.includes(t)),
  )
}
