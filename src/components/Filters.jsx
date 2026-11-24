import { useSearchParams } from 'react-router-dom'
import { DIFFICULTY_LABEL, TYPE_LABEL } from '../lib/content.js'

const KEYS = ['difficulty', 'type', 'subtopic', 'tag', 'status']

/** Filter controls backed by the URL query string. */
export default function Filters({ subtopics = [], tags = [], showStatus = true }) {
  const [params, setParams] = useSearchParams()
  const set = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true })
  }
  const clear = () => {
    const next = new URLSearchParams(params)
    KEYS.forEach((k) => next.delete(k))
    setParams(next, { replace: true })
  }

  const field = (key, label, options) => (
    <label>
      <span>{label}</span>
      <select value={params.get(key) ?? ''} onChange={(e) => set(key, e.target.value)}>
        <option value="">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )

  return (
    <div className="filters ui no-print">
      {field('difficulty', 'Difficulty', Object.entries(DIFFICULTY_LABEL))}
      {field('type', 'Type', Object.entries(TYPE_LABEL))}
      {subtopics.length > 0 && field('subtopic', 'Subtopic', subtopics.map((s) => [s, s]))}
      {tags.length > 0 && field('tag', 'Tag', tags.map((t) => [t, t]))}
      {showStatus &&
        field('status', 'Status', [
          ['unsolved', 'Not solved'],
          ['attempted', 'Attempted'],
          ['solved', 'Solved'],
          ['bookmarked', 'Bookmarked'],
        ])}
      {KEYS.some((k) => params.get(k)) && (
        <button type="button" className="link-button" onClick={clear}>Clear filters</button>
      )}
    </div>
  )
}
