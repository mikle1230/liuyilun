import { Link } from 'react-router-dom'
import { loadPostsFromModules } from '../../utils/posts'
import './JournalList.css'

const blogModules = import.meta.glob('../../content/blog/*.md', { eager: true, query: '?raw', import: 'default' })
const aiModules = import.meta.glob('../../content/ai/*.md', { eager: true, query: '?raw', import: 'default' })

const allPosts = (() => {
  const blogs = loadPostsFromModules(blogModules)
  const ais = loadPostsFromModules(aiModules)
  return [...blogs, ...ais].sort((a, b) => new Date(b.date) - new Date(a.date))
})()

export default function JournalList() {
  return (
    <div className="journal-page" style={{ paddingTop: 100 }}>
      <div className="container-narrow">
        <div className="section-label">Journal</div>
        <h1 className="section-title">随笔与记录</h1>
        <p className="page-desc">时间留下的文字。</p>
      </div>

      <div className="container" style={{ marginTop: 40 }}>
        <div className="entry-list">
          {allPosts.map((post) => (
            <Link key={post.slug} to={`/journal/${post.slug}`} className="entry-item">
              <div className="entry-visual">{post.section === 'ai' ? '🤖' : '📝'}</div>
              <div className="entry-info">
                <div className="entry-meta">{post.date}</div>
                <h3 className="entry-title">{post.title}</h3>
                <p className="entry-excerpt">{post.excerpt}</p>
                <div className="entry-tags">
                  {post.tags?.slice(0, 2).map(t => <span key={t} className="entry-tag">{t}</span>)}
                  {post.section === 'ai' && <span className="entry-tag entry-tag-ai">AI</span>}
                </div>
              </div>
              <span className="entry-arrow">→</span>
            </Link>
          ))}
        </div>
        {allPosts.length === 0 && <p className="empty-state">No entries yet.</p>}
      </div>
    </div>
  )
}
