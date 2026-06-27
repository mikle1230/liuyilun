import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules, extractTags } from '../../utils/posts'
import './BlogList.css'

const postModules = import.meta.glob('../../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export default function BlogList() {
  const posts = useMemo(() => loadPostsFromModules(postModules), [])

  const allTags = useMemo(() => extractTags(posts), [posts])

  const [activeTag, setActiveTag] = useState(null)
  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts

  return (
    <div className="blog-page">
      <ModuleHero
        title="博客"
        subtitle="日常感悟、旅行见闻、行业观察与工具分享"
      />

      <section className="section blog-list-section">
        <div className="container">
          {allTags.length > 0 && (
            <ScrollReveal>
              <div className="blog-tag-filter">
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
          )}

          <div className="blog-grid stagger-children">
            {filteredPosts.map((post) => (
              <ScrollReveal key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="drama-card">
                  <div className="drama-card-glow" />
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
