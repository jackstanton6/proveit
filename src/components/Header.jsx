import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { problems, problemsOf, applyFilters } from '../lib/content.js'
import { useProgress, useSettings, THEMES, FONTS } from '../lib/store.js'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const progress = useProgress()
  const { theme, setTheme, font, setFont } = useSettings()
  const [q, setQ] = useState(params.get('q') ?? '')

  useEffect(() => {
    if (location.pathname === '/search') setQ(params.get('q') ?? '')
  }, [location.pathname, params])

  function random() {
    // On a topic page, draw from the filtered list; elsewhere, from everything.
    const m = location.pathname.match(/^\/t\/([^/]+)/)
    const pool = m ? applyFilters(problemsOf(m[1]), params, progress) : problems
    const list = pool.length ? pool : problems
    if (list.length) navigate(`/p/${list[Math.floor(Math.random() * list.length)].id}`)
  }

  return (
    <header className="header ui no-print">
      <Link to="/" className="brand">ProveIt</Link>
      <form
        className="search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          navigate(`/search?q=${encodeURIComponent(q.trim())}`)
        }}
      >
        <label htmlFor="q" className="sr-only">Search problems</label>
        <input id="q" type="search" placeholder="Search problems" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>
      <div className="header-tools">
        <button type="button" className="link-button" onClick={random}>Random</button>
        <label className="sr-only" htmlFor="theme">Theme</label>
        <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
          {THEMES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className="sr-only" htmlFor="font">Font style</label>
        <select id="font" value={font} onChange={(e) => setFont(e.target.value)}>
          {FONTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
    </header>
  )
}
