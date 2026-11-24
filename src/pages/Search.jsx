import { useSearchParams } from 'react-router-dom'
import { problems, applyFilters } from '../lib/content.js'
import { useProgress } from '../lib/store.js'
import Filters from '../components/Filters.jsx'
import ProblemList from '../components/ProblemList.jsx'

export default function Search() {
  const [params] = useSearchParams()
  const progress = useProgress()
  const q = (params.get('q') ?? '').trim()
  const items = q ? applyFilters(problems, params, progress) : []
  return (
    <article className="page">
      <h1>Search</h1>
      {q ? (
        <>
          <Filters />
          <p className="list-summary ui">
            {items.length} result{items.length === 1 ? '' : 's'} for “{q}”
          </p>
          <ProblemList items={items} showTopic empty="Nothing matches. Try fewer or different words." />
        </>
      ) : (
        <p className="empty ui">Type in the search box above. Searches titles, statements, subtopics and tags.</p>
      )}
    </article>
  )
}
