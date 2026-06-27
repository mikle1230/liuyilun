/**
 * Minimal frontmatter parser — zero dependencies.
 * Handles the YAML subset used in this project's markdown files.
 * Replaces gray-matter/js-yaml to avoid Node.js Buffer issues in the browser.
 */
const FRONTMATTER_RE = /^---[\t ]*\r?\n([\s\S]*?)\r?\n---[\t ]*\r?\n?([\s\S]*)$/

function parseValue(val) {
  val = val.trim()
  // Boolean
  if (val === 'true') return true
  if (val === 'false') return false
  // Array: ["a", "b"]
  if (val.startsWith('[') && val.endsWith(']')) {
    const inner = val.slice(1, -1)
    if (inner.trim() === '') return []
    return inner.split(',').map((s) => {
      s = s.trim()
      if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        return s.slice(1, -1)
      }
      return s
    })
  }
  // Quoted string
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }
  // Number
  const num = Number(val)
  if (!isNaN(num) && val !== '') return num
  // Plain string
  return val
}

export default function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) {
    return { data: {}, content: raw }
  }
  try {
    const yamlBlock = match[1]
    const data = {}
    const lines = yamlBlock.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) continue

      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1)
      data[key] = parseValue(value)
    }
    return { data, content: match[2] }
  } catch {
    return { data: {}, content: raw }
  }
}
