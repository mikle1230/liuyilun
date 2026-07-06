import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules } from '../../utils/posts'
import { getCoverImage } from '../../utils/tagImages'
import './HomePage.css'

/* ════════════════════════════════════════════════════════
   Content — merged journal (blog + ai)
   ════════════════════════════════════════════════════════ */

const journalModules = import.meta.glob('../../content/{blog,ai}/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const featuredPosts = (() => {
  return loadPostsFromModules(journalModules)
    .filter((p) => p.pinned)
    .slice(0, 4)
})()

const recentPosts = (() => {
  return loadPostsFromModules(journalModules)
    .filter((p) => !p.pinned)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)
})()

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

    if (video.readyState >= 3) {
      attemptPlay()
    } else {
      video.addEventListener('canplay', attemptPlay, { once: true })
      window.addEventListener('load', attemptPlay, { once: true })
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

      {/* ─── Featured Posts ─── */}
      {featuredPosts.length > 0 && (
        <section className="section home-featured-section">
          <div className="container">
            <ScrollReveal>
              <div className="featured-header">
                <span className="featured-label">精选</span>
                <div className="featured-header-line" />
                <Link to="/journal" className="featured-col-more">查看全部 →</Link>
              </div>
            </ScrollReveal>

            <div className="home-card-grid stagger-children">
              {featuredPosts.map((post) => (
                <ScrollReveal key={post.slug}>
                  <Link to={`/journal/${post.slug}`} className="journal-card">
                    <div
                      className="journal-card-img"
                      style={{
                        backgroundImage: `url(${getCoverImage(post.tags, post.image)})`,
                      }}
                    />
                    <div className="journal-card-body">
                      <time className="journal-card-date">{post.date}</time>
                      <h3 className="journal-card-title">{post.title}</h3>
                      <p className="journal-card-excerpt">{post.excerpt}</p>
                      <div className="journal-card-tags">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="journal-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Recent Posts ─── */}
      {recentPosts.length > 0 && (
        <section className="section home-recent-section">
          <div className="container">
            <ScrollReveal>
              <div className="featured-header">
                <span className="featured-label">最新</span>
                <div className="featured-header-line" />
              </div>
            </ScrollReveal>

            <div className="home-card-grid stagger-children">
              {recentPosts.map((post) => (
                <ScrollReveal key={post.slug}>
                  <Link to={`/journal/${post.slug}`} className="journal-card">
                    <div
                      className="journal-card-img"
                      style={{
                        backgroundImage: `url(${getCoverImage(post.tags, post.image)})`,
                      }}
                    />
                    <div className="journal-card-body">
                      <time className="journal-card-date">{post.date}</time>
                      <h3 className="journal-card-title">{post.title}</h3>
                      <p className="journal-card-excerpt">{post.excerpt}</p>
                      <div className="journal-card-tags">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="journal-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Explore Teaser ─── */}
      <section className="section home-explore-teaser">
        <div className="container">
          <ScrollReveal>
            <div className="home-explore-banner">
              <div className="home-explore-text">
                <span className="featured-label">探索</span>
                <h2 className="home-explore-heading">你向往的世界</h2>
                <p className="home-explore-desc">
                  从布拉格的查理大桥到冰岛的极光，一座一座城市地认识这个世界。
                </p>
                <Link to="/explore" className="home-explore-link">
                  开始探索 →
                </Link>
              </div>
              <div className="home-explore-visual" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
