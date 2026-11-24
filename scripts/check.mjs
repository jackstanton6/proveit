// Validates every file in content/. Run with `npm run check`; also runs before `npm run build`.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'
import katex from 'katex'
import { validate, texts } from '../src/lib/schema.js'
import { extractMath, MACROS } from '../src/lib/math.js'

const dir = fileURLToPath(new URL('../content/', import.meta.url))
const files = []
const errors = []

for (const name of readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).sort()) {
  try {
    files.push({ name, data: load(readFileSync(join(dir, name), 'utf8')) })
  } catch (e) {
    errors.push(`${name}: YAML error: ${e.message.split('\n')[0]}`)
  }
}

errors.push(...validate(files))

for (const { name, data } of files)
  for (const p of data?.problems ?? [])
    for (const [field, src] of texts(p)) {
      const { text, pieces } = extractMath(src)
      if (text.replace(/\\\$/g, '').includes('$')) errors.push(`${name} [${p.id}] ${field}: unmatched $ (write \\$ for a literal dollar sign)`)
      for (const { tex, display } of pieces) {
        try {
          katex.renderToString(tex, { displayMode: display, macros: { ...MACROS }, throwOnError: true, strict: 'ignore' })
        } catch (e) {
          errors.push(`${name} [${p.id}] ${field}: ${e.message}`)
        }
      }
    }

const count = files.reduce((n, f) => n + (f.data?.problems?.length ?? 0), 0)
if (errors.length) {
  console.error(errors.map((e) => `  ✗ ${e}`).join('\n'))
  console.error(`\n${errors.length} error(s) found across ${files.length} topic file(s).`)
  process.exit(1)
}
console.log(`✓ ${count} problems in ${files.length} topics, all valid.`)
