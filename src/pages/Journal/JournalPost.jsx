import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import parseFrontmatter from '../../utils/frontmatter'
import './JournalPost.css'

const MarkdownRenderer = lazy(() => import('../../components/MarkdownRenderer'))

const blogModules = import.meta.glob('../../content/blog/*.md', { query: '?raw', import: 'default' })
const aiModules = import.meta.glob('../../content/ai/*.md', { query: '?raw', import: 'default' })

function findPostBySlug(slug) {
  const all = { ...blogModules, ...aiModules }
  const path = Object.keys(all).find((k) => k.split('/').pop().split('?')[0] === `${slug}.md`)
  if (!path) return null
  return { loader: all[path], section: path.includes('/blog/') ? 'tech' : 'ai' }
}

export default function JournalPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const found = findPostBySlug(slug)
    if (!found) { setError('Not found'); return; }
    ;(async () => {
      try {
        const raw = await found.loader()
        const { data, content } = parseFrontmatter(raw)
        setPost({ slug, section: found.section, ...data, content })
      } catch { setError('Failed to load') }
    })()
  }, [slug])

  if (error) return (
    <div className="journal-post-page">
      <div className="journal-post-container">
        <Link to="/journal" className="back-link">← Back</Link>
        <div className="error-state">
          <h1>404</h1>
          <p>{error}</p>
        </div>
      </div>
    </div>
  )

  if (!post) return (
    <div className="journal-post-page">
      <div className="journal-post-container">
        <div className="loading-spinner" />
      </div>
    </div>
  )

  return (
    <div className="journal-post-page">
      <article className="journal-post-container">
        <Link to="/journal" className="back-link">← Back to Journal</Link>

        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <time>{post.date}</time>
            <span className="post-meta-dot" />
            {post.section === 'ai' && <span className="post-section-badge">AI</span>}
            {post.tags?.map((tag) => (
              <span key={tag} className="post-tag">{tag}</span>
            ))}
            {post.sourceUrl && (
              <>
                <span className="post-meta-dot" />
                <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="post-source">
                  Source ↗
                </a>
              </>
            )}
          </div>
        </header>

        <Suspense fallback={<div className="loading-spinner" />}>
          <MarkdownRenderer content={post.content} />
        </Suspense>
      </article>
    </div>
  )
}
