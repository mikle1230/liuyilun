import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import parseFrontmatter from '../../utils/frontmatter'
import TagPill from '../../components/TagPill'
import './BlogPost.css'

const MarkdownRenderer = lazy(() => import('../../components/MarkdownRenderer'))

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const modules = import.meta.glob('../../content/blog/*.md', {
          query: '?raw',
        })
        const key = `../../content/blog/${slug}.md`
        if (!modules[key]) {
          setError('文章不存在')
          return
        }
        const raw = await modules[key]()
        const { data, content } = parseFrontmatter(raw)
        setPost({ ...data, content })
      } catch {
        setError('加载文章失败')
      }
    }
    loadPost()
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
          <Link to="/blog" className="back-link">← 返回博客列表</Link>

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
