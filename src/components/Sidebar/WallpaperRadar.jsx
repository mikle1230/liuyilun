import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getThumbnailUrl } from '../../utils/wallpapers'

export default function WallpaperRadar({ wallpapers = [] }) {
  const picks = useMemo(() => {
    if (!wallpapers.length) return []
    const copy = [...wallpapers]
    // Fisher-Yates shuffle, take 2
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy.slice(0, 2)
  }, [wallpapers])

  if (!picks.length) return null

  return (
    <aside className="sidebar-card">
      <h4 className="sb-card-title">
        壁纸小雷达
        <Link to="/wallpapers" className="sb-card-more">发现更多 →</Link>
      </h4>
      <div className="sb-radar-grid">
        {picks.map((w) => (
          <Link
            key={w.id}
            to="/wallpapers"
            className="sb-radar-item"
          >
            <img
              src={getThumbnailUrl(w)}
              alt={w.title}
              className="sb-radar-img"
              loading="lazy"
            />
            <span className="sb-radar-label">{w.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
