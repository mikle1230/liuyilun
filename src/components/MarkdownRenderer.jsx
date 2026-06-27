import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import './MarkdownRenderer.css'

export default function MarkdownRenderer({ content }) {
  const containerRef = useRef(null)

  // Scroll reveal for markdown content children
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
            entry.target.style.filter = 'blur(0)'
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )

    const elements = container.querySelectorAll('h1, h2, h3, p, pre, blockquote, ul, ol, table, img')
    elements.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.filter = 'blur(3px)'
      el.style.transition = `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.04}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.04}s, filter 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.04}s`
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [content])

  return (
    <div className="markdown-renderer" ref={containerRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <span className="md-image-wrapper">
              <img src={src} alt={alt} loading="lazy" />
              {alt && <span className="md-image-caption">{alt}</span>}
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
