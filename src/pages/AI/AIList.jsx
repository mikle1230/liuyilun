import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules, extractTags } from '../../utils/posts'
import './AIList.css'

const postModules = import.meta.glob('../../content/ai/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const categories = ['全部', '教程', '工具', '资讯', '思考']

const categoryIcons = {
  '教程': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  '工具': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  '资讯': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  '思考': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

export default function AIList() {
  const posts = useMemo(() => (
    loadPostsFromModules(postModules, (post, data) => ({
      ...post,
      category: data.category || '工具',
    }))
  ), [])

  const allTags = useMemo(() => extractTags(posts), [posts])

  const [activeTag, setActiveTag] = useState(null)
  const [activeCat, setActiveCat] = useState('全部')

  const filteredPosts = posts.filter((p) => {
    const matchTag = !activeTag || p.tags.includes(activeTag)
    const matchCat = activeCat === '全部' || p.category === activeCat
    return matchTag && matchCat
  })

  return (
    <div className="ai-page">
      <ModuleHero
        title="AI 收集"
        subtitle="Claude Code 学习笔记、AI 工具与资讯收集"
      />

      <section className="section ai-list-section">
        <div className="container">
          <ScrollReveal>
            <div className="ai-filters">
              <div className="ai-cat-filter">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-tag ${activeCat === cat ? 'active' : ''}`}
                    onClick={() => setActiveCat(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {allTags.length > 0 && (
                <div className="ai-tag-filter">
                  <button
                    className={`filter-tag ${activeTag === null ? 'active' : ''}`}
                    onClick={() => setActiveTag(null)}
                  >
                    全部标签
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
              )}
            </div>
          </ScrollReveal>

          <div className="ai-grid stagger-children">
            {filteredPosts.map((post) => (
              <ScrollReveal key={post.slug}>
                <Link to={`/ai/${post.slug}`} className="ai-card">
                  <div className="ai-card-icon">
                    {categoryIcons[post.category] || categoryIcons['工具']}
                  </div>
                  <div className="ai-card-body">
                    <span className="ai-card-cat">{post.category}</span>
                    <h3 className="ai-card-title">{post.title}</h3>
                    <p className="ai-card-excerpt">{post.excerpt}</p>
                    <div className="ai-card-meta">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="ai-tag">{tag}</span>
                      ))}
                      <time>{post.date}</time>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className="blog-empty">暂无内容</p>
          )}
        </div>
      </section>
    </div>
  )
}
