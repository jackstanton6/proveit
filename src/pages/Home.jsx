import { Link } from 'react-router-dom'
import { topics, problems } from '../lib/content.js'
import { useProgress } from '../lib/store.js'

export default function Home() {
  const progress = useProgress()
  const { solved } = progress.counts()
  return (
    <article className="page">
      <h1>ProveIt</h1>
      <p className="lede">
        A bank of {problems.length} proof and problem-solving exercises for first- to third-year undergraduates,
        each with hints and a model solution.
        {solved > 0 && ` You have solved ${solved}.`}
      </p>
      <ol className="topic-index">
        {topics.map((t) => (
          <li key={t.id}>
            <Link to={`/t/${t.id}`}>{t.name}</Link>
            <span className="count ui">{t.problems.length}</span>
            {t.blurb && <p>{t.blurb}</p>}
          </li>
        ))}
      </ol>
    </article>
  )
}
