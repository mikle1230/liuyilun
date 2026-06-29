import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import parseFrontmatter from '../../utils/frontmatter'
import TagPill from '../../components/TagPill'
import './BlogPost.css'

const MarkdownRenderer = lazy(() => import('../../components/MarkdownRenderer'))

// Load from both content directories
const blogModules = import.meta.glob('../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
})

const aiModules = import.meta.glob('../../content/ai/*.md', {
  query: '?raw',
  import: 'default',
})

function findPostBySlug(slug) {
  const allModules = { ...blogModules, ...aiModules }
  const path = Object.keys(allModules).find((k) => {
    const file = k.split('/').pop().split('?')[0]
    return file === `${slug}.md`
  })
  if (!path) return null
  return { loader: allModules[path], path }
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const found = findPostBySlug(slug)

    if (!found) {
      setError('文章不存在')
      return
    }

    const section = found.path.includes('/blog/') ? 'tech' : 'ai'

    ;(async () => {
      try {
        const raw = await found.loader()
        const { data, content } = parseFrontmatter(raw)
        setPost({ slug, section, ...data, content })
      } catch {
        setError('加载文章失败')
      }
    })()
  }, [slug])

  if (error) {
    return (
      <div className="blog-page">
        <section className="section blog-post-section">
          <div className="container blog-post-error">
            <h1>404</h1>
            <p>{error}</p>
            <Link to="/blog" className="back-link">← 返回博客列表</Link>
          </div>
        </section>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-page">
        <section className="section blog-post-section">
          <div className="container blog-post-loading">
            <div className="loading-spinner" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="blog-page">
      <article className="section blog-post-section">
        <div className="container">
          <div className="blog-post-body">
            <Link to="/blog" className="back-link">← 返回博客列表</Link>

            <header className="blog-post-header">
              <h1 className="blog-post-title">{post.title}</h1>
              <div className="blog-post-meta">
                <time>{post.date}</time>
                <span className="meta-divider" />
                {post.section && (
                  <>
                    <span className="post-section-badge">
                      {post.section === 'ai' ? 'AI' : '技术'}
                    </span>
                    <span className="meta-divider" />
                  </>
                )}
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
        </div>
      </article>
    </div>
  )
}
