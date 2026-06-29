/**
 * Wallpaper URL utilities.
 *
 * Two-tier source system:
 *   1. Unsplash (photoId present) — premium source
 *   2. Picsum.photos (seed fallback) — always accessible, no API key, China-friendly
 *
 * Download dimensions:
 *   Inner screen (Vivo X Fold 5 unfolded): 5120 × 4542
 *   Outer screen (Vivo X Fold 5 folded):    1080 × 2640
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
  // Fallback to Picsum with deterministic seed
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
  // Picsum doesn't support arbitrary download sizes, use max reasonable
  return picsumUrl(item.title || item.id, width, height)
}

/** Inner screen (unfolded): 5120 × 4542 */
export function getInnerDownloadUrl(item) {
  return getDownloadUrl(item, 5120, 4542)
}

/** Outer screen (folded): 1080 × 2640 */
export function getOuterDownloadUrl(item) {
  return getDownloadUrl(item, 1080, 2640)
}
