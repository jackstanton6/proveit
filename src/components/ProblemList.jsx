import { Link } from 'react-router-dom'
import Prose from './Prose.jsx'
import { DIFFICULTY_LABEL, TYPE_LABEL } from '../lib/content.js'
import { useProgress } from '../lib/store.js'

const STATUS_MARK = { solved: ['✓', 'Solved'], attempted: ['~', 'Attempted'] }

export default function ProblemList({ items, showTopic = false, empty = 'No problems match.' }) {
  const progress = useProgress()
  if (!items.length) return <p className="empty ui">{empty}</p>
  return (
    <ol className="plist">
      {items.map((p) => {
        const status = progress.status(p.id)
        const mark = STATUS_MARK[status]
        return (
          <li key={p.id}>
            <span className="num">{p.number}</span>
            <Link to={`/p/${p.id}`} className="ptitle">
              <Prose src={p.title} inline />
            </Link>
            <span className="meta ui">
              {showTopic && <span className="topic-name">{p.topicName}</span>}
              <span>{DIFFICULTY_LABEL[p.difficulty]}</span>
              <span>{TYPE_LABEL[p.type]}</span>
              <span className="marks">
                {progress.isBookmarked(p.id) && <span title="Bookmarked"><span aria-hidden="true">★</span><span className="sr-only">Bookmarked</span></span>}
                {mark && <span title={mark[1]} className={`status-${status}`}><span aria-hidden="true">{mark[0]}</span><span className="sr-only">{mark[1]}</span></span>}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
