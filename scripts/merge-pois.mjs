/**
 * Merge pois.json into europe-travel.json
 *
 * - Matches existing attractions by Chinese name
 * - Adds `image_search_url` to matched attractions
 * - Adds new cities/countries for unmatched POIs
 * - Generates consistent image IDs for new attractions
 */

import fs from 'fs'
import { createHash } from 'crypto'

const pois = JSON.parse(fs.readFileSync('pois.json', 'utf-8'))
const travel = JSON.parse(fs.readFileSync('src/data/europe-travel.json', 'utf-8'))

// Map Chinese country name → country id
const countryNameToId = Object.fromEntries(
  travel.countries.map((c) => [c.name, c.id])
)

// Map Chinese city name → { countryId, city index } for fast lookup
const cityIndex = {}
travel.countries.forEach((c) => {
  c.cities.forEach((city) => {
    cityIndex[city.name] = { countryId: c.id, city }
  })
})

// Helper: generate a stable "Unsplash-like" image ID from text
function imgHash(text) {
  return 'place-' + createHash('md5').update(text).digest('hex').slice(0, 12)
}

let matchedCount = 0
let newAttractionCount = 0
let newCityCount = 0
let newCountryCount = 0

for (const poi of pois) {
  const { country, city, name_cn, name_en, image_search_url } = poi

  // Find or create country
  let countryObj = travel.countries.find((c) => c.name === country)
  if (!countryObj) {
    const id = country.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')
    countryObj = {
      id, name: country, nameEn: name_en.split(' ').slice(-1)[0] || country,
      description: '',
      cities: [],
    }
    travel.countries.push(countryObj)
    countryNameToId[country] = id
    newCountryCount++
  }

  // Find or create city
  let cityObj = countryObj.cities.find((c) => c.name === city)
  if (!cityObj) {
    const cityId = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 20)
    cityObj = {
      id: cityId + '-' + createHash('md5').update(country + city).digest('hex').slice(0, 4),
      name: city, nameEn: name_en.split(' ').slice(-1)[0] || city,
      lat: 48, lng: 10,
      attractions: [],
    }
    countryObj.cities.push(cityObj)
    newCityCount++
  }

  // Try to match attraction by Chinese name
  const existing = cityObj.attractions.find((a) => a.name === name_cn)

  if (existing) {
    // Found match — add Bing search URL but keep existing image
    existing.image_search_url = image_search_url
    matchedCount++
  } else {
    // New attraction
    const id = name_en.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)
    cityObj.attractions.push({
      id: id + '-' + Math.random().toString(36).slice(2, 6),
      name: name_cn,
      nameEn: name_en,
      type: 'landmark',
      image: imgHash(name_en),
      image_search_url,
      description: `${name_cn}（${name_en}）是${country}${city}的著名景点。`,
      tips: '',
    })
    newAttractionCount++
  }
}

fs.writeFileSync('src/data/europe-travel.json', JSON.stringify(travel, null, 2) + '\n', 'utf-8')

console.log(`✅ Merge complete:
   Matched: ${matchedCount} existing attractions
   Added:   ${newAttractionCount} new attractions
   Added:   ${newCityCount} new cities
   Added:   ${newCountryCount} new countries
   Total:   ${travel.countries.length} countries
`)
