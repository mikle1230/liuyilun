import { describe, it, expect } from 'vitest'
import {
  getThumbnailUrl,
  getPreviewUrl,
  getDownloadUrl,
  getInnerDownloadUrl,
  getOuterDownloadUrl,
} from '../wallpapers'

const PHOTO_ID = 'abc123'

describe('wallpaper URL helpers', () => {
  it('getThumbnailUrl returns 400px URL', () => {
    const url = getThumbnailUrl(PHOTO_ID)
    expect(url).toContain(PHOTO_ID)
    expect(url).toContain('w=400')
    expect(url).toContain('q=60')
    expect(url).toContain('auto=format')
    expect(url).toContain('fit=crop')
  })

  it('getPreviewUrl returns 1920px URL', () => {
    const url = getPreviewUrl(PHOTO_ID)
    expect(url).toContain('w=1920')
    expect(url).toContain('q=80')
  })

  it('getDownloadUrl uses specified dimensions', () => {
    const url = getDownloadUrl(PHOTO_ID, 5120, 4542)
    expect(url).toContain('w=5120')
    expect(url).toContain('h=4542')
    expect(url).toContain('q=90')
  })

  it('getInnerDownloadUrl returns 5120x4542', () => {
    const url = getInnerDownloadUrl(PHOTO_ID)
    expect(url).toContain('w=5120')
    expect(url).toContain('h=4542')
  })

  it('getOuterDownloadUrl returns 1080x2640', () => {
    const url = getOuterDownloadUrl(PHOTO_ID)
    expect(url).toContain('w=1080')
    expect(url).toContain('h=2640')
  })
})
