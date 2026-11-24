import { useSearchParams } from 'react-router-dom'
import { problems, problemsOf, topics, topicById, applyFilters } from '../lib/content.js'
import { useProgress } from '../lib/store.js'
import Filters from '../components/Filters.jsx'
import Prose from '../components/Prose.jsx'

const SOLUTION_MODES = [
  ['none', 'No solutions'],
  ['inline', 'After each problem'],
  ['end', 'At the end'],
]

export default function Print() {
  const [params, setParams] = useSearchParams()
  const progress = useProgress()
  const topicId = params.get('topic') ?? ''
  const topic = topicById.get(topicId)
  const solutions = params.get('solutions') ?? 'none'
  const hints = params.get('hints') === '1'
  const items = applyFilters(topic ? problemsOf(topicId) : problems, params, progress)

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    if (key === 'topic') ['subtopic', 'tag'].forEach((k) => next.delete(k))
    setParams(next, { replace: true })
  }

  return (
    <article className="page print-sheet">
      <div className="print-controls ui no-print">
        <h1>Print a sheet</h1>
        <p>Pick what goes on the sheet, then print or save as PDF from the print dialog.</p>
        <div className="filters">
          <label>
            <span>Topic</span>
            <select value={topicId} onChange={(e) => set('topic', e.target.value)}>
              <option value="">All topics</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label>
            <span>Solutions</span>
            <select value={solutions} onChange={(e) => set('solutions', e.target.value === 'none' ? '' : e.target.value)}>
              {SOLUTION_MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={hints} onChange={(e) => set('hints', e.target.checked ? '1' : '')} />
            <span>Include hints</span>
          </label>
        </div>
        <Filters subtopics={topic?.subtopics ?? []} />
        <p className="list-summary">
          {items.length} problem{items.length === 1 ? '' : 's'}{' '}
          <button type="button" onClick={() => window.print()} disabled={!items.length}>Print</button>
        </p>
      </div>

      <header className="sheet-head">
        <h2>{topic ? topic.name : 'Problem sheet'}</h2>
        <p className="ui">ProveIt · {items.length} problems</p>
      </header>

      <ol className="sheet">
        {items.map((p) => (
          <li key={p.id}>
            <h3>
              <span className="num">{p.number}</span> <Prose src={p.title} inline />
              <span className="meta ui">{p.difficulty}</span>
            </h3>
            <Prose src={p.statement} />
            {hints && p.hints.map((h, n) => (
              <div key={n} className="sheet-hint">
                <span className="label ui">Hint{p.hints.length > 1 ? ` ${n + 1}` : ''}.</span> <Prose src={h} />
              </div>
            ))}
            {solutions === 'inline' && (
              <div className="sheet-solution">
                <span className="label ui">Solution.</span>
                <Prose src={p.solution} />
              </div>
            )}
          </li>
        ))}
      </ol>

      {solutions === 'end' && items.length > 0 && (
        <section className="sheet-solutions">
          <h2>Solutions</h2>
          <ol className="sheet">
            {items.map((p) => (
              <li key={p.id}>
                <h3><span className="num">{p.number}</span> <Prose src={p.title} inline /></h3>
                <Prose src={p.solution} />
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  )
}
