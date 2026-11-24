import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <article className="page">
      <h1>Not found</h1>
      <p className="ui">
        There is nothing here. It may have been renamed. <Link to="/">Back to all topics</Link>.
      </p>
    </article>
  )
}
