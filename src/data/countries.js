/**
 * Countries barrel — loads all individual country files via glob.
 * Edit individual countries in src/data/countries/<id>.json
 */

const modules = import.meta.glob('./countries/*.json', { eager: true })

export const countries = Object.values(modules)

export function getCountryCover(country) {
  return `/images/countries/${country.id}.jpg`
}

export default countries
