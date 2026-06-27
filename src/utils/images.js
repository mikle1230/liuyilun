/**
 * Shared image utilities for Explore module.
 * Sources: Unsplash (main), Picsum.photos (placeholder fallback, no API key needed).
 */

/**
 * Generate inline style for an attraction image.
 *
 * Priority: direct HTTP URL → Unsplash ID → Picsum (placeholder) → gradient.
 *
 * @param {string} img  - Image identifier (Unsplash ID, HTTP URL, or "place-xxx")
 * @param {number} w    - Desired width
 * @param {string} name - Attraction name (used as Picsum seed for placeholders)
 * @returns {object} CSS style object with backgroundImage or background
 */
export function imgStyle(img, w = 800, name = '') {
  if (img && img.startsWith('http')) {
    return { backgroundImage: `url(${img})` }
  }
  if (img && !img.startsWith('place-')) {
    return {
      backgroundImage: `url(https://images.unsplash.com/${img}?auto=format&fit=crop&w=${w}&q=80)`,
    }
  }
  // Placeholder — Picsum.photos (free, no API key, accessible in China)
  if (name) {
    const seed = encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase())
    return {
      backgroundImage: `url(https://picsum.photos/seed/${seed}/${w}/${Math.round(w * 0.6)})`,
    }
  }
  // Final fallback — gradient from name hash
  const hue = [...(name || 'A')].reduce((s, c) => s + c.charCodeAt(0), 0) % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 30%, 30%), hsl(${(hue + 60) % 360}, 25%, 20%))`,
  }
}

/**
 * Generate Picsum.photos URL for a placeholder image.
 * Uses the attraction name as a seed for deterministic results.
 */
export function picsumUrl(name, w = 800, h = 480) {
  const seed = encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase())
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}
