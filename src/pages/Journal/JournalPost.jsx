import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import parseFrontmatter from '../../utils/frontmatter'
import TagPill from '../../components/TagPill'
import './JournalPost.css'

const MarkdownRenderer = lazy(() => import('../../components/MarkdownRenderer'))

const ALL_POSTS = import.meta.glob('../../content/{blog,ai}/*.md', {
  query: '?raw',
  import: 'default',
})

function findBySlug(slug) {
  const path = Object.keys(ALL_POSTS).find((k) => {
    const file = k.split('/').pop().split('?')[0]
    return file === `${slug}.md`
  })
  if (!path) return null
  return ALL_POSTS[path]
}

export default function JournalPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loader = findBySlug(slug)

    if (!loader) {
      setError('文章不存在')
      return
    }

    ;(async () => {
      try {
        const raw = await loader()
        const { data, content } = parseFrontmatter(raw)
        setPost({ slug, ...data, content })
      } catch {
        setError('加载文章失败')
      }
    })()
  }, [slug])

  if (error) {
    return (
      <div className="journal-page">
        <section className="section journal-post-error-section">
          <div className="container">
            <h1>404</h1>
            <p>{error}</p>
            <Link to="/journal" className="back-link">← 返回 Journal</Link>
          </div>
        </section>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="journal-page">
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
            <div className="loading-spinner" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="journal-page">
      <article className="section journal-post-section">
        <div className="container">
          <div className="journal-post-body">
            <Link to="/journal" className="back-link">← 返回 Journal</Link>

            <header className="journal-post-header">
              <h1 className="journal-post-title">{post.title}</h1>
              <div className="journal-post-meta">
                <time>{post.date}</time>
                <span className="meta-divider" />
                <div className="journal-post-tags">
                  {post.tags?.map((tag) => (
                    <TagPill key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </header>

            <Suspense fallback={<div className="loading-spinner" />}>
              <MarkdownRenderer content={post.content} />
            </Suspense>
          </div>
        </div>
      </article>
    </div>
  )
}
