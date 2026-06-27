import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import parseFrontmatter from '../../utils/frontmatter'
import TagPill from '../../components/TagPill'
import '../Blog/BlogPost.css'

const MarkdownRenderer = lazy(() => import('../../components/MarkdownRenderer'))
import './AIPost.css'

const postModules = import.meta.glob('../../content/ai/*.md', {
  query: '?raw',
})

function findPostBySlug(slug) {
  const path = Object.keys(postModules).find((k) => {
    const parts = k.split('/')
    const file = parts[parts.length - 1]
    return file === `${slug}.md`
  })
  if (!path) return null
  return postModules[path]
}

export default function AIPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loader = findPostBySlug(slug)

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
      <div className="ai-page">
        <section className="section blog-post-section">
          <div className="container blog-post-error">
            <h1>404</h1>
            <p>{error}</p>
            <Link to="/ai" className="back-link">← 返回 AI 收集</Link>
          </div>
        </section>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="ai-page">
        <section className="section blog-post-section">
          <div className="container blog-post-loading">
            <div className="loading-spinner" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="ai-page">
      <article className="section blog-post-section">
        <div className="container">
          <Link to="/ai" className="back-link">← 返回 AI 收集</Link>

          <header className="blog-post-header">
            <h1 className="blog-post-title">{post.title}</h1>
            <div className="blog-post-meta">
              <time>{post.date}</time>
              <span className="meta-divider" />
              <div className="blog-post-tags">
                {post.tags?.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>
              {post.sourceUrl && (
                <>
                  <span className="meta-divider" />
                  <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                    原文链接 ↗
                  </a>
                </>
              )}
            </div>
          </header>

          <Suspense fallback={<div className="loading-spinner" />}>
            <MarkdownRenderer content={post.content} />
          </Suspense>
        </div>
      </article>
    </div>
  )
}
