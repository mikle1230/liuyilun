import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import wallpapersData from '../../data/wallpapers.json'
import { getThumbnailUrl } from '../../utils/wallpapers'
import WallpaperLightbox from './WallpaperLightbox'
import './WallpapersPage.css'

function extractTags(data) {
  const set = new Set()
  data.forEach((w) => w.tags.forEach((t) => set.add(t)))
  return [...set].sort()
}

function LazyImage({ item, onSelect }) {
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true)
          observer.unobserve(el)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={imgRef}
      className="wallpaper-item"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
    >
      {loaded ? (
        error ? (
          <div className="wallpaper-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        ) : (
          <img
            src={getThumbnailUrl(item)}
            alt={item.title}
            loading="lazy"
            className="wallpaper-img"
            onError={() => setError(true)}
          />
        )
      ) : (
        <div className="wallpaper-skeleton" />
      )}
      <div className="wallpaper-overlay">
        <span className="wallpaper-overlay-title">{item.title}</span>
        <span className="wallpaper-overlay-photographer">
          {item.photographer}
        </span>
      </div>
    </div>
  )
}

export default function WallpapersPage() {
  const [activeTag, setActiveTag] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const allTags = useMemo(() => extractTags(wallpapersData), [])

  const filtered = useMemo(() => {
    if (!activeTag) return wallpapersData
    return wallpapersData.filter((w) => w.tags.includes(activeTag))
  }, [activeTag])

  const openLightbox = useCallback((item) => {
    const idx = filtered.findIndex((w) => w.id === item.id)
    setLightboxIndex(idx)
  }, [filtered])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filtered.length)
  }, [filtered.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
  }, [filtered.length])

  return (
    <div className="wallpapers-page">
      <ModuleHero
        title="壁纸"
        subtitle="精选壁纸 · 适配 Vivo X Fold 5 内外双屏"
      />

      <section className="section wallpapers-section">
        <div className="container">
          {/* Tag filter */}
          <ScrollReveal>
            <div className="wallpaper-tag-filter">
              <button
                className={`filter-tag ${activeTag === null ? 'active' : ''}`}
                onClick={() => setActiveTag(null)}
              >
                全部
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-tag ${activeTag === tag ? 'active' : ''}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Masonry grid */}
          <div className="wallpaper-masonry">
            {filtered.map((item) => (
              <LazyImage key={item.id} item={item} onSelect={openLightbox} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="blog-empty">暂无壁纸</p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <WallpaperLightbox
          item={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
          hasNext={filtered.length > 1}
        />
      )}
    </div>
  )
}
