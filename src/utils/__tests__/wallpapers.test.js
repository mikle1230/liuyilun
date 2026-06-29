import { describe, it, expect } from 'vitest'
import {
  getThumbnailUrl,
  getPreviewUrl,
  getDownloadUrl,
  getInnerDownloadUrl,
  getOuterDownloadUrl,
} from '../wallpapers'

const mockItem = {
  id: 'test-1',
  photoId: 'abc123',
  title: 'Test Wallpaper',
}

const mockItemNoUnsplash = {
  id: 'fallback-1',
  title: 'Mountain Lake',
  photoId: null,
}

describe('wallpaper URL helpers', () => {
  it('getThumbnailUrl returns 400px URL from item', () => {
    const url = getThumbnailUrl(mockItem)
    expect(url).toContain('abc123')
    expect(url).toContain('w=400')
    expect(url).toContain('q=60')
    expect(url).toContain('auto=format')
  })

  it('getPreviewUrl returns 1920px URL', () => {
    const url = getPreviewUrl(mockItem)
    expect(url).toContain('w=1920')
    expect(url).toContain('q=80')
  })

  it('getDownloadUrl uses specified dimensions', () => {
    const url = getDownloadUrl(mockItem, 5120, 4542)
    expect(url).toContain('w=5120')
    expect(url).toContain('h=4542')
    expect(url).toContain('q=90')
  })

  it('getInnerDownloadUrl returns 5120x4542', () => {
    const url = getInnerDownloadUrl(mockItem)
    expect(url).toContain('w=5120')
    expect(url).toContain('h=4542')
  })

  it('getOuterDownloadUrl returns 1080x2640', () => {
    const url = getOuterDownloadUrl(mockItem)
    expect(url).toContain('w=1080')
    expect(url).toContain('h=2640')
  })

  it('falls back to Picsum when no Unsplash photoId', () => {
    const url = getThumbnailUrl(mockItemNoUnsplash)
    expect(url).toContain('picsum.photos')
    expect(url).toContain('mountain-lake')
  })
})
