/**
 * Wallpaper URL utilities — generates Unsplash URLs at multiple tiers.
 *
 * Download dimensions:
 *   Inner screen (Vivo X Fold 5 unfolded): 5120 × 4542
 *   Outer screen (Vivo X Fold 5 folded):    1080 × 2640
 */

const U = 'https://images.unsplash.com'

/** Base Unsplash URL with auto-format and crop */
function unsplashUrl(photoId, w, h, quality = 80) {
  return `${U}/${photoId}?auto=format&fit=crop&w=${w}&h=${h || ''}&q=${quality}`
}

/** 400px thumbnail — used in masonry grid */
export function getThumbnailUrl(photoId) {
  return unsplashUrl(photoId, 400, 0, 60)
}

/** 1920px preview — used in lightbox */
export function getPreviewUrl(photoId) {
  return unsplashUrl(photoId, 1920, 0, 80)
}

/** Custom size download */
export function getDownloadUrl(photoId, width, height) {
  return unsplashUrl(photoId, width, height, 90)
}

/** Inner screen (unfolded): 5120 × 4542 */
export function getInnerDownloadUrl(photoId) {
  return getDownloadUrl(photoId, 5120, 4542)
}

/** Outer screen (folded): 1080 × 2640 */
export function getOuterDownloadUrl(photoId) {
  return getDownloadUrl(photoId, 1080, 2640)
}
