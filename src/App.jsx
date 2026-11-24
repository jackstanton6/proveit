import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Topic from './pages/Topic.jsx'
import Problem from './pages/Problem.jsx'
import Search from './pages/Search.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import Print from './pages/Print.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="shell">
      <a className="skip ui" href="#main">Skip to content</a>
      <Header />
      <div className="layout">
        <Sidebar />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/t/:topicId" element={<Topic />} />
            <Route path="/p/:id" element={<Problem />} />
            <Route path="/search" element={<Search />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/print" element={<Print />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <footer className="footer ui no-print">
        ProveIt is an independent study resource. It is not affiliated with or endorsed by the University of Sydney.
      </footer>
    </div>
  )
}
