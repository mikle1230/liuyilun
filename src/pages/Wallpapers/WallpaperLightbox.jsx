import { useEffect, useRef, useCallback } from 'react'
import { getPreviewUrl, getDownloadUrl } from '../../utils/wallpapers'
import './WallpaperLightbox.css'

export default function WallpaperLightbox({
  item,
  onClose,
  onNext,
  onPrev,
  hasNext,
}) {
  const touchRef = useRef({ startX: 0, startY: 0 })
  const imgRef = useRef(null)

  /* ─── Keyboard navigation ─── */
  useEffect(() => {
    const handler = (e) => {
      switch (e.key) {
        case 'Escape': onClose(); break
        case 'ArrowRight': onNext(); break
        case 'ArrowLeft': onPrev(); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onNext, onPrev])

  /* ─── Touch swipe ─── */
  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0]
    touchRef.current = { startX: t.clientX, startY: t.clientY }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const t = e.changedTouches[0]
    const dx = t.clientX - touchRef.current.startX
    const dy = t.clientY - touchRef.current.startY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 80) {
      if (dx > 0) onPrev()
      else onNext()
    }
  }, [onNext, onPrev])

  /* ─── Lock scroll ─── */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="lightbox-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button className="lightbox-close" onClick={onClose} aria-label="关闭">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {hasNext && (
        <>
          <button className="lightbox-nav lightbox-nav-left" onClick={onPrev} aria-label="上一张">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="lightbox-nav lightbox-nav-right" onClick={onNext} aria-label="下一张">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Image */}
      <div className="lightbox-content">
        <img
          ref={imgRef}
          src={getPreviewUrl(item)}
          alt={item.title}
          className="lightbox-image"
        />
      </div>

      {/* Bottom bar */}
      <div className="lightbox-bar">
        <div className="lightbox-info">
          <span className="lightbox-title">{item.title}</span>
        </div>

        <div className="lightbox-actions">
          <a
            href={getDownloadUrl(item, 2160, 4800)}
            download
            className="lightbox-dl-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            下载 2160×4800
          </a>
        </div>
      </div>
    </div>
  )
}
