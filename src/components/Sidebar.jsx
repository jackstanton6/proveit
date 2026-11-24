import { NavLink, useLocation } from 'react-router-dom'
import { topics } from '../lib/content.js'
import { useProgress } from '../lib/store.js'

export default function Sidebar() {
  const progress = useProgress()
  const { bookmarks } = progress.counts()
  // On small screens, problem/print/settings pages hide the topic list so content comes first.
  const minor = /^\/(p|print|settings)\b/.test(useLocation().pathname)
  return (
    <nav className={`sidebar ui no-print${minor ? ' sidebar-minor' : ''}`} aria-label="Topics">
      <h2 className="sidebar-heading">Topics</h2>
      <ul>
        {topics.map((t) => {
          const solved = t.problems.filter((p) => progress.status(p.id) === 'solved').length
          return (
            <li key={t.id}>
              <NavLink to={`/t/${t.id}`}>
                <span>{t.name}</span>
                <span className="count" title={`${solved} of ${t.problems.length} solved`}>
                  {solved ? `${solved}/` : ''}{t.problems.length}
                </span>
              </NavLink>
            </li>
          )
        })}
      </ul>
      <ul className="sidebar-secondary">
        <li>
          <NavLink to="/bookmarks">
            <span>Bookmarks</span>
            {bookmarks ? <span className="count">{bookmarks}</span> : null}
          </NavLink>
        </li>
        <li><NavLink to="/print">Print a sheet</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
      </ul>
    </nav>
  )
}
