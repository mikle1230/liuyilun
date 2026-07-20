import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import JournalSidebar from '../../components/JournalSidebar'
import { loadPostsFromModules, extractTags } from '../../utils/posts'
import { getCoverImage } from '../../utils/tagImages'
import './JournalList.css'

const ALL_POSTS = import.meta.glob('../../content/journal/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function spotMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

export default function JournalList() {
  const posts = useMemo(() => loadPostsFromModules(ALL_POSTS), [])

  const allTags = useMemo(() => extractTags(posts), [posts])

  const [activeTag, setActiveTag] = useState(null)
  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts

  return (
    <div className="journal-page">
      <ModuleHero
        label="记录"
        title="Journal"
        subtitle="观察，然后记录。诚实，比精彩更重要。"
      />

      <section className="section journal-list-section">
        <div className="journal-layout container">
          <div className="journal-main">
            {allTags.length > 0 && (
            <ScrollReveal>
              <div className="journal-tag-filter">
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

          <div className="journal-grid stagger-children">
            {filteredPosts.map((post) => (
              <ScrollReveal key={post.slug}>
                <Link to={`/journal/${post.slug}`} className="journal-card spotlight-card" onMouseMove={spotMove}>
                  <div
                    className="journal-card-img"
                    style={{
                      backgroundImage: `url(${getCoverImage(post.tags, post.image, post.slug)})`,
                    }}
                  />
                  <div className="journal-card-body">
                    <time className="journal-card-date">{post.date}</time>
                    <h3 className="journal-card-title">{post.title}</h3>
                    <p className="journal-card-excerpt">{post.excerpt}</p>
                    <div className="journal-card-tags">
                      {post.tags?.map((tag) => (
                        <span key={tag} className="journal-tag">{tag}</span>
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

          <JournalSidebar />
        </div>
      </section>
    </div>
  )
}
