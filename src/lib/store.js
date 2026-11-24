import { useSyncExternalStore } from 'react'

// Tiny localStorage-backed store with React subscription.
function createStore(key, initial) {
  let state
  try {
    state = { ...initial, ...JSON.parse(localStorage.getItem(key) || '{}') }
  } catch {
    state = { ...initial }
  }
  const listeners = new Set()
  return {
    get: () => state,
    set(next) {
      state = typeof next === 'function' ? next(state) : next
      try {
        localStorage.setItem(key, JSON.stringify(state))
      } catch {
        /* storage full or disabled: keep in memory */
      }
      listeners.forEach((l) => l())
    },
    subscribe(l) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

const progressStore = createStore('proveit:progress', { status: {}, bookmarks: {}, notes: {} })
const settingsStore = createStore('proveit:settings', {})

const omit = (obj, k) => {
  const { [k]: _, ...rest } = obj
  return rest
}

export function useProgress() {
  const s = useSyncExternalStore(progressStore.subscribe, progressStore.get)
  const set = progressStore.set
  return {
    status: (id) => s.status[id] ?? null,
    setStatus: (id, v) => set((p) => ({ ...p, status: v ? { ...p.status, [id]: v } : omit(p.status, id) })),
    isBookmarked: (id) => !!s.bookmarks[id],
    toggleBookmark: (id) =>
      set((p) => ({ ...p, bookmarks: p.bookmarks[id] ? omit(p.bookmarks, id) : { ...p.bookmarks, [id]: true } })),
    note: (id) => s.notes[id] ?? '',
    setNote: (id, text) => set((p) => ({ ...p, notes: text ? { ...p.notes, [id]: text } : omit(p.notes, id) })),
    counts: () => ({
      solved: Object.values(s.status).filter((v) => v === 'solved').length,
      bookmarks: Object.keys(s.bookmarks).length,
    }),
    exportJSON: () => JSON.stringify({ app: 'proveit', version: 1, exported: new Date().toISOString(), ...s }, null, 2),
    importJSON(text) {
      let data
      try {
        data = JSON.parse(text)
      } catch {
        return { ok: false, error: 'That file is not valid JSON.' }
      }
      const isMap = (o) => o && typeof o === 'object' && !Array.isArray(o)
      if (data?.app !== 'proveit' || !isMap(data.status) || !isMap(data.bookmarks) || !isMap(data.notes))
        return { ok: false, error: 'That file is not a ProveIt progress export.' }
      set({ status: data.status, bookmarks: data.bookmarks, notes: data.notes })
      return { ok: true }
    },
    reset: () => set({ status: {}, bookmarks: {}, notes: {} }),
  }
}

export const THEMES = [
  ['light', 'Light'],
  ['dark', 'Dark'],
  ['usyd-light', 'USYD light'],
  ['usyd-dark', 'USYD dark'],
]
export const FONTS = [
  ['academic', 'Academic'],
  ['terminal', 'Terminal'],
]

export function useSettings() {
  const s = useSyncExternalStore(settingsStore.subscribe, settingsStore.get)
  const root = document.documentElement
  const theme = s.theme ?? root.dataset.theme ?? 'light'
  const font = s.font ?? root.dataset.font ?? 'academic'
  return {
    theme,
    font,
    setTheme(t) {
      root.dataset.theme = t
      settingsStore.set((p) => ({ ...p, theme: t }))
    },
    setFont(f) {
      root.dataset.font = f
      settingsStore.set((p) => ({ ...p, font: f }))
    },
  }
}
