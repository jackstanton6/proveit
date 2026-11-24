import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { topicById, problemsOf, applyFilters } from '../lib/content.js'
import { useProgress } from '../lib/store.js'
import Filters from '../components/Filters.jsx'
import ProblemList from '../components/ProblemList.jsx'
import NotFound from './NotFound.jsx'

export default function Topic() {
  const { topicId } = useParams()
  const [params] = useSearchParams()
  const progress = useProgress()
  const topic = topicById.get(topicId)
  const all = useMemo(() => problemsOf(topicId), [topicId])
  const tags = useMemo(() => [...new Set(all.flatMap((p) => p.tags))].sort(), [all])

  if (!topic) return <NotFound />
  const items = applyFilters(all, params, progress)
  const printParams = new URLSearchParams(params)
  printParams.set('topic', topicId)

  return (
    <article className="page">
      <h1>{topic.name}</h1>
      {topic.blurb && <p className="lede">{topic.blurb}</p>}
      <Filters subtopics={topic.subtopics} tags={tags} />
      <p className="list-summary ui">
        {items.length === all.length ? `${all.length} problems` : `${items.length} of ${all.length} problems`}
        {' · '}
        <Link to={`/print?${printParams}`}>Print these</Link>
      </p>
      <ProblemList items={items} />
    </article>
  )
}
