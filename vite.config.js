import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { load } from 'js-yaml'

// Turns content/*.yaml into plain JS objects at build time.
const yaml = () => ({
  name: 'yaml',
  transform(code, id) {
    if (!/\.ya?ml$/.test(id)) return null
    return { code: `export default ${JSON.stringify(load(code))}`, map: null }
  },
})

export default defineConfig({
  plugins: [react(), yaml()],
  // The problem bank is bundled on purpose, so the main chunk is large by design.
  build: { chunkSizeWarningLimit: 4000 },
})
