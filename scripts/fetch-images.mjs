/**
 * Fetch real images from Wikipedia API for attractions with placeholder images.
 * Replaces `place-xxx` image IDs with direct Wikipedia thumbnail URLs.
 */
import fs from 'fs'

const travel = JSON.parse(fs.readFileSync('src/data/europe-travel.json', 'utf-8'))

const pois = JSON.parse(fs.readFileSync('pois.json', 'utf-8'))

// Build a name_en lookup from pois.json
const nameLookup = {}
for (const p of pois) {
  nameLookup[p.name_cn] = p.name_en
}

let total = 0
let success = 0

for (const c of travel.countries) {
  for (const city of c.cities) {
    for (const att of city.attractions) {
      if (!att.image || !att.image.startsWith('place-')) continue
      total++

      // Get English name from pois.json, or use Chinese name via API
      const nameEn = nameLookup[att.name] || att.nameEn || att.name

      if (!nameEn) continue

      // Wikipedia API
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nameEn)}`

      try {
        const res = await fetch(url)
        if (!res.ok) {
          console.log(`  ⚠️ ${att.name}: HTTP ${res.status}`)
          continue
        }
        const data = await res.json()
        const thumb = data.thumbnail?.source
        if (thumb) {
          att.image = thumb // Store direct URL
          success++
          console.log(`  ✅ ${att.name}: ${thumb.slice(0, 60)}...`)
        } else {
          console.log(`  ⚠️ ${att.name}: no thumbnail`)
        }
      } catch (e) {
        console.log(`  ❌ ${att.name}: ${e.message}`)
      }

      // Small delay to be polite
      await new Promise((r) => setTimeout(r, 200))
    }
  }
}

fs.writeFileSync('src/data/europe-travel.json', JSON.stringify(travel, null, 2) + '\n', 'utf-8')
console.log(`\nDone: ${success}/${total} attractions got real images`)
