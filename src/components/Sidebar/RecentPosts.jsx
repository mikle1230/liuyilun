import { Link } from 'react-router-dom'

export default function RecentPosts({ posts = [] }) {
  if (!posts.length) return null

  const recent = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <aside className="sidebar-card">
      <h4 className="sb-card-title">最新文章</h4>
      <div className="sb-recent-list">
        {recent.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="sb-recent-item"
          >
            <span className="sb-recent-dot" />
            <div className="sb-recent-body">
              <span className="sb-recent-title">{post.title}</span>
              <time className="sb-recent-date">{post.date}</time>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}
