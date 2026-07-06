import { describe, it, expect } from 'vitest'
import {
  getThumbnailUrl,
  getPreviewUrl,
  getDownloadUrl,
  getFullDownloadUrl,
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
    const url = getDownloadUrl(mockItem, 2160, 4800)
    expect(url).toContain('w=2160')
    expect(url).toContain('h=4800')
    expect(url).toContain('q=90')
  })

  it('getFullDownloadUrl returns 2160x4800', () => {
    const url = getFullDownloadUrl(mockItem)
    expect(url).toContain('w=2160')
    expect(url).toContain('h=4800')
  })

  it('falls back to Picsum when no Unsplash photoId', () => {
    const url = getThumbnailUrl(mockItemNoUnsplash)
    expect(url).toContain('picsum.photos')
    expect(url).toContain('mountain-lake')
  })
})
