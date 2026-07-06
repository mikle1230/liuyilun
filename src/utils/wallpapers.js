/**
 * Wallpaper URL utilities.
 *
 * Source: Picsum.photos (deterministic seed, no API key, China-friendly).
 * Optional Unsplash support when photoId is present.
 *
 * Download dimensions: Vivo X200 Pro — 2160 × 4800
 */

const UNSPLASH_BASE = 'https://images.unsplash.com'
const PICSUM_BASE = 'https://picsum.photos/seed'

/**
 * Unsplash URL with auto-format and crop.
 */
function unsplashUrl(photoId, w, h, quality = 80) {
  return `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=${quality}`
}

/**
 * Picsum.photos URL (deterministic seed, no API key needed, works in China).
 */
function picsumUrl(seed, w, h) {
  const encoded = encodeURIComponent(seed.replace(/\s+/g, '-').toLowerCase())
  return `${PICSUM_BASE}/${encoded}/${w}${h ? `/${h}` : ''}`
}

/**
 * Pick the best available URL for wallpaper display.
 * Falls back to Picsum when no Unsplash photoId is set.
 */
export function getDisplayUrl(item, w, h, quality = 80) {
  if (item.photoId) {
    return unsplashUrl(item.photoId, w, h, quality)
  }
  return picsumUrl(item.title || item.id, w, h)
}

/** 400px thumbnail — used in masonry grid */
export function getThumbnailUrl(item) {
  return getDisplayUrl(item, 400, 0, 60)
}

/** 1920px preview — used in lightbox */
export function getPreviewUrl(item) {
  return getDisplayUrl(item, 1920, 0, 80)
}

/** Custom size download */
export function getDownloadUrl(item, width, height) {
  if (item.photoId) {
    return unsplashUrl(item.photoId, width, height, 90)
  }
  return picsumUrl(item.title || item.id, width, height)
}

/** Full resolution download: 2160 × 4800 (Vivo X Fold 5) */
export function getFullDownloadUrl(item) {
  return getDownloadUrl(item, 2160, 4800)
}
