import { problems } from '../lib/content.js'
import { useProgress } from '../lib/store.js'
import ProblemList from '../components/ProblemList.jsx'

export default function Bookmarks() {
  const progress = useProgress()
  const items = problems.filter((p) => progress.isBookmarked(p.id))
  return (
    <article className="page">
      <h1>Bookmarks</h1>
      <ProblemList items={items} showTopic empty="No bookmarks yet. Use the Bookmark button on any problem." />
    </article>
  )
}
