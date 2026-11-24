import { useRef, useState } from 'react'
import { useProgress, useSettings, THEMES, FONTS } from '../lib/store.js'

export default function Settings() {
  const { theme, setTheme, font, setFont } = useSettings()
  const progress = useProgress()
  const file = useRef(null)
  const [message, setMessage] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  function download() {
    const blob = new Blob([progress.exportJSON()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `proveit-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function upload(e) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    const result = progress.importJSON(await f.text())
    setMessage(result.ok ? { ok: true, text: 'Progress imported.' } : { ok: false, text: result.error })
  }

  const { solved, bookmarks } = progress.counts()

  return (
    <article className="page settings ui">
      <h1>Settings</h1>

      <fieldset>
        <legend>Theme</legend>
        {THEMES.map(([v, l]) => (
          <label key={v} className="check">
            <input type="radio" name="theme" value={v} checked={theme === v} onChange={() => setTheme(v)} />
            <span>{l}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Font style</legend>
        {FONTS.map(([v, l]) => (
          <label key={v} className="check">
            <input type="radio" name="font" value={v} checked={font === v} onChange={() => setFont(v)} />
            <span>{l}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Progress</legend>
        <p>
          {solved} solved, {bookmarks} bookmarked. Progress and notes are saved in this browser only. Export a file to move them
          to another device.
        </p>
        <div className="actions">
          <button type="button" onClick={download}>Export</button>
          <button type="button" onClick={() => file.current?.click()}>Import</button>
          <input ref={file} type="file" accept="application/json,.json" onChange={upload} hidden />
          <button
            type="button"
            className={confirmReset ? 'danger' : ''}
            onClick={() => {
              if (!confirmReset) return setConfirmReset(true)
              progress.reset()
              setConfirmReset(false)
              setMessage({ ok: true, text: 'Progress cleared.' })
            }}
            onBlur={() => setConfirmReset(false)}
          >
            {confirmReset ? 'Click again to clear everything' : 'Clear progress'}
          </button>
        </div>
        {message && (
          <p role="status" className={message.ok ? 'note-ok' : 'note-error'}>{message.text}</p>
        )}
      </fieldset>
    </article>
  )
}
