import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules } from '../../utils/posts'
import './HomePage.css'

/* ════════════════════════════════════════════════════════
   Content — markdown → featured posts
   ════════════════════════════════════════════════════════ */

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

const featuredBlog = loadPostsFromModules(blogModules).filter((p) => p.pinned)
const featuredAi = loadPostsFromModules(aiModules).filter((p) => p.pinned)

/* ════════════════════════════════════════════════════════
   Typewriter
   ════════════════════════════════════════════════════════ */

const typewriterWords = [
  '在时间里留下痕迹',
  '把经历变成知识',
  '让思考持续生长',
  '做一个有意思的人',
]

function useTypewriter(words, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2500) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Typewriter animation loop — setState inside effect is intentional
    const currentWord = words[wordIndex]

    if (!isDeleting && text === currentWord) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && text === '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
      return
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed
    const timeout = setTimeout(() => {
      setText(isDeleting
        ? currentWord.slice(0, text.length - 1)
        : currentWord.slice(0, text.length + 1)
      )
    }, speed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

  return text
}

/* ════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════ */

const minifeatures = [
  '实时全球互动地图',
  '深度目的地人文百科',
  '专属旅行笔记云同步',
]

export default function HomePage() {
  const videoRef = useRef(null)
  const typewriterText = useTypewriter(typewriterWords)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.playsInline = true

    const attemptPlay = () => {
      video.play().catch(() => {
        const playOnInteraction = () => {
          video.play().catch(() => {})
          document.removeEventListener('pointerdown', playOnInteraction)
          document.removeEventListener('keydown', playOnInteraction)
        }
        document.addEventListener('pointerdown', playOnInteraction, { once: true })
        document.addEventListener('keydown', playOnInteraction, { once: true })
      })
    }

    // Try immediately if already buffered
    if (video.readyState >= 3) {
      attemptPlay()
    } else {
      // Wait until enough data is loaded
      video.addEventListener('canplay', attemptPlay, { once: true })
      // Fallback: try on window load anyway
      window.addEventListener('load', attemptPlay, { once: true })
      // Last resort retry
      setTimeout(attemptPlay, 3000)
    }
  }, [])

  return (
    <div className="home-page">
      {/* ─── Hero ─── */}
      <section className="home-hero">
        <div className="home-hero-video-wrapper">
          <video
            ref={videoRef}
            className="home-hero-video"
            autoPlay muted loop playsInline preload="auto" poster="/video/hero-poster.webp"
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="home-hero-overlay" />

        <div className="home-hero-content container">
          <ScrollReveal delay={100}>
            <h1 className="home-hero-title">
              <span className="typewriter-text">{typewriterText}</span>
              <span className="typewriter-cursor">|</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="home-hero-desc">
              走过的路、读过的书、用过的工具、沉淀的思考——
              <br />
              在信息洪流中，留下属于自己的脉络。
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Featured Content ─── */}
      <section className="section home-featured-section">
        <div className="container">

          {/* Section header */}
          <ScrollReveal>
            <div className="featured-header">
              <span className="featured-label">精选内容</span>
              <div className="featured-header-line" />
            </div>
          </ScrollReveal>

          <div className="featured-grid">
            {/* Blog column */}
            <div className="featured-col">
              <ScrollReveal>
                <div className="featured-col-header">
                  <svg className="featured-col-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M8 7h8M8 11h6" />
                  </svg>
                  <span>博客</span>
                  <Link to="/blog" className="featured-col-more">查看全部 →</Link>
                </div>
              </ScrollReveal>
              <div className="featured-post-list">
                {featuredBlog.map((post) => (
                  <ScrollReveal key={post.slug}>
                    <Link to={`/blog/${post.slug}`} className="featured-post-card">
                      <div className="featured-post-meta">
                        <time className="featured-post-date">{post.date}</time>
                        <div className="featured-post-tags">
                          {post.tags?.slice(0, 2).map((t) => (
                            <span key={t} className="featured-post-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                      <h3 className="featured-post-title">{post.title}</h3>
                      <p className="featured-post-excerpt">{post.excerpt}</p>
                      <span className="featured-post-arrow">阅读文章 →</span>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* AI column */}
            <div className="featured-col">
              <ScrollReveal>
                <div className="featured-col-header">
                  <svg className="featured-col-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span>AI 收集</span>
                  <Link to="/ai" className="featured-col-more">查看全部 →</Link>
                </div>
              </ScrollReveal>
              <div className="featured-post-list">
                {featuredAi.map((post) => (
                  <ScrollReveal key={post.slug}>
                    <Link to={`/ai/${post.slug}`} className="featured-post-card">
                      <div className="featured-post-meta">
                        <time className="featured-post-date">{post.date}</time>
                        <div className="featured-post-tags">
                          {post.tags?.slice(0, 2).map((t) => (
                            <span key={t} className="featured-post-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                      <h3 className="featured-post-title">{post.title}</h3>
                      <p className="featured-post-excerpt">{post.excerpt}</p>
                      <span className="featured-post-arrow">阅读文章 →</span>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mini Program ─── */}
      <section className="section home-mini-section">
        <div className="container">
          <ScrollReveal>
            <div className="featured-header">
              <span className="featured-label">探索世界</span>
              <div className="featured-header-line" />
            </div>
          </ScrollReveal>

          <div className="home-mini-card">
            <div className="home-mini-left">
              <div className="home-mini-qr-ring" />
              <div className="home-mini-qr">
                <div className="home-mini-qr-inner">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="15" y="15" width="3" height="3" />
                    <rect x="18" y="18" width="3" height="3" />
                  </svg>
                  <span>扫码体验</span>
                </div>
              </div>
              <p className="home-mini-qr-hint">微信扫描 · 开启探索之旅</p>
            </div>

            <div className="home-mini-right">
              <span className="home-mini-label">Connect Digitally</span>
              <h2 className="home-mini-title">探索世界微信小程序</h2>
              <p className="home-mini-desc">
                将整个世界的灵感装进兜里。精选旅行指南、沉浸式航拍地图以及独家知识专栏。随时随地，开启您的全球视野。
              </p>
              <div className="home-mini-features">
                {minifeatures.map((feat) => (
                  <div key={feat} className="home-mini-feature">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="10" r="8" />
                      <path d="M6 10l3 3 5-5" />
                    </svg>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
