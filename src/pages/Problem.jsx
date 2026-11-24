import { Link, useParams } from 'react-router-dom'
import { byId, problemsOf, DIFFICULTY_LABEL, TYPE_LABEL } from '../lib/content.js'
import { useProgress } from '../lib/store.js'
import Prose from '../components/Prose.jsx'
import NotFound from './NotFound.jsx'

export default function Problem() {
  const { id } = useParams()
  const p = byId.get(id)
  if (!p) return <NotFound />
  // Keyed by id so hints and the solution start hidden on every problem.
  return <ProblemView key={id} p={p} />
}

function ProblemView({ p }) {
  const progress = useProgress()
  const status = progress.status(p.id)
  const siblings = problemsOf(p.topicId)
  const i = siblings.findIndex((s) => s.id === p.id)
  const prev = siblings[i - 1]
  const next = siblings[i + 1]
  const related = p.related.map((r) => byId.get(r)).filter(Boolean)

  const toggle = (value) => progress.setStatus(p.id, status === value ? null : value)

  return (
    <article className="page problem">
      <p className="crumbs ui">
        <Link to={`/t/${p.topicId}`}>{p.topicName}</Link>
        {p.subtopic && <> · <Link to={`/t/${p.topicId}?subtopic=${encodeURIComponent(p.subtopic)}`}>{p.subtopic}</Link></>}
      </p>
      <h1>
        <span className="num">{p.number}</span> <Prose src={p.title} inline />
      </h1>
      <p className="meta ui">
        <span>{DIFFICULTY_LABEL[p.difficulty]}</span>
        <span>{TYPE_LABEL[p.type]}</span>
        {p.source && <span>{p.source}</span>}
      </p>

      <section aria-label="Problem statement" className="statement">
        <Prose src={p.statement} />
      </section>

      {p.hints.map((h, n) => (
        <details key={n} className="reveal">
          <summary className="ui">{p.hints.length > 1 ? `Hint ${n + 1}` : 'Hint'}</summary>
          <Prose src={h} />
        </details>
      ))}
      <details className="reveal solution">
        <summary className="ui">Solution</summary>
        <Prose src={p.solution} />
      </details>

      <div className="actions ui no-print">
        <button type="button" aria-pressed={status === 'attempted'} onClick={() => toggle('attempted')}>
          Attempted
        </button>
        <button type="button" aria-pressed={status === 'solved'} onClick={() => toggle('solved')}>
          Solved
        </button>
        <button type="button" aria-pressed={progress.isBookmarked(p.id)} onClick={() => progress.toggleBookmark(p.id)}>
          {progress.isBookmarked(p.id) ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      <div className="notes no-print">
        <label htmlFor="notes" className="ui">Your notes</label>
        <textarea
          id="notes"
          rows={4}
          value={progress.note(p.id)}
          onChange={(e) => progress.setNote(p.id, e.target.value)}
          placeholder="Saved in this browser."
        />
      </div>

      {p.tags.length > 0 && (
        <p className="tags ui">
          <span className="label">Tags</span>
          {p.tags.map((t) => (
            <Link key={t} to={`/t/${p.topicId}?tag=${encodeURIComponent(t)}`}>{t}</Link>
          ))}
        </p>
      )}

      {related.length > 0 && (
        <section className="related ui">
          <h2>Related</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                <Link to={`/p/${r.id}`}>
                  <span className="num">{r.number}</span> <Prose src={r.title} inline />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="pager ui no-print" aria-label="Problems in this topic">
        {prev ? <Link to={`/p/${prev.id}`} rel="prev">← {prev.number}</Link> : <span />}
        {next ? <Link to={`/p/${next.id}`} rel="next">{next.number} →</Link> : <span />}
      </nav>
    </article>
  )
}
