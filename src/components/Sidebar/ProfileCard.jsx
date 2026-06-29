import { Link } from 'react-router-dom'

export default function ProfileCard({ postCount, wallpaperCount }) {
  return (
    <aside className="sidebar-card">
      <div className="sb-profile">
        {/* Avatar placeholder — user to provide later */}
        <div className="sb-avatar">
          <span className="sb-avatar-letter">M</span>
        </div>

        <h3 className="sb-name">M</h3>
        <p className="sb-bio">
          记录思考 · 收集知识 · 探索世界
        </p>

        <div className="sb-stats">
          <div className="sb-stat">
            <span className="sb-stat-value">{postCount}</span>
            <span className="sb-stat-label">文章</span>
          </div>
          <div className="sb-stat-divider" />
          <div className="sb-stat">
            <span className="sb-stat-value">{wallpaperCount}</span>
            <span className="sb-stat-label">壁纸</span>
          </div>
        </div>

        <Link to="/about" className="sb-profile-link">
          关于我 →
        </Link>
      </div>
    </aside>
  )
}
