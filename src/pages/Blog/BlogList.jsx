import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules, extractTags } from '../../utils/posts'
import './BlogList.css'

const blogModules = import.meta.glob('../../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const aiModules = import.meta.glob('../../content/ai/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function loadAllPosts() {
  const blogs = loadPostsFromModules(blogModules)
  const ais = loadPostsFromModules(aiModules)
  // Merge and re-sort
  return [...blogs, ...ais].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date) - new Date(a.date)
  })
}

const sectionOptions = [
  { key: 'all', label: '全部' },
  { key: 'tech', label: '技术' },
  { key: 'ai', label: 'AI' },
]

export default function BlogList() {
  const posts = useMemo(() => loadAllPosts(), [])
  const allTags = useMemo(() => extractTags(posts), [posts])
  const [searchParams] = useSearchParams()

  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'all')
  const [activeTag, setActiveTag] = useState(null)

  const filteredPosts = posts.filter((p) => {
    const matchSection = activeSection === 'all' || p.section === activeSection
    const matchTag = !activeTag || p.tags.includes(activeTag)
    return matchSection && matchTag
  })

  return (
    <div className="blog-page">
      <ModuleHero
        title="博客"
        subtitle="日常感悟、AI 学习、行业观察与工具分享"
      />

      <section className="section blog-list-section">
        <div className="container">
          {/* Section filter */}
          <ScrollReveal>
            <div className="blog-filters">
              <div className="blog-section-filter">
                {sectionOptions.map((opt) => (
                  <button
                    key={opt.key}
                    className={`filter-tag ${activeSection === opt.key ? 'active' : ''}`}
                    onClick={() => setActiveSection(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {allTags.length > 0 && (
                <div className="blog-tag-filter">
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

          <div className="blog-grid stagger-children">
            {filteredPosts.map((post) => (
              <ScrollReveal key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="drama-card">
                  <div className="drama-card-glow" />
                  {post.section === 'ai' && (
                    <span className="drama-card-badge">AI</span>
                  )}
                  <div className="drama-card-body">
                    <time className="drama-card-date">{post.date}</time>
                    <h3 className="drama-card-title">{post.title}</h3>
                    <p className="drama-card-excerpt">{post.excerpt}</p>
                    <div className="drama-card-tags">
                      {post.tags?.map((tag) => (
                        <span key={tag} className="drama-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className="blog-empty">暂无文章</p>
          )}
        </div>
      </section>
    </div>
  )
}
