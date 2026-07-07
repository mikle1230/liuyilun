import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules } from '../../utils/posts'
import { getCoverImage } from '../../utils/tagImages'
import './HomePage.css'

/* ════════════════════════════════════════════════════════
   Content
   ════════════════════════════════════════════════════════ */

const journalModules = import.meta.glob('../../content/{blog,ai}/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const allPosts = loadPostsFromModules(journalModules)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 6)

const COLLECTION_CARDS = Array.from({ length: 10 }, (_, i) => i)

const EXPLORE_ITEMS = [
  { id: 'italy', name: '意大利', en: 'Italy' },
  { id: 'france', name: '法国', en: 'France' },
  { id: 'spain', name: '西班牙', en: 'Spain' },
  { id: 'greece', name: '希腊', en: 'Greece' },
  { id: 'united-kingdom', name: '英国', en: 'United Kingdom' },
]

/* ════════════════════════════════════════════════════════
   Typewriter
   ════════════════════════════════════════════════════════ */

const typewriterWords = [
  '不是一个网站，而是一个地方',
  '人生值得被认真记录',
  '一座不断成长的数字花园',
  '时间是这里真正的主角',
]

function useTypewriter(words, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2500) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    if (!isDeleting && text === currentWord) {
      const t = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(t)
    }
    if (isDeleting && text === '') {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
      return
    }
    const speed = isDeleting ? deletingSpeed : typingSpeed
    const t = setTimeout(() => {
      setText(isDeleting
        ? currentWord.slice(0, text.length - 1)
        : currentWord.slice(0, text.length + 1)
      )
    }, speed)
    return () => clearTimeout(t)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration])
  return text
}

function spotMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
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
    video.play().catch(() => {
      const cb = () => { video.play().catch(() => {}) }
      document.addEventListener('pointerdown', cb, { once: true })
      document.addEventListener('keydown', cb, { once: true })
    })
  }, [])

  return (
    <div className="home-page">
      {/* ─── Hero ─── */}
      <section className="home-hero">
        <div className="home-hero-video-wrapper">
          <video ref={videoRef} className="home-hero-video" autoPlay muted loop playsInline preload="auto">
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
              观察 · 记录 · 反思 · 策展<br />安静的时光博物馆，为认真生活的人而建
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Journal ─── */}
      <section className="section home-strip">
        <div className="container">
          <div className="home-strip-header">
            <span className="home-strip-label">Journal</span>
            <Link to="/journal" className="home-strip-more">All Posts →</Link>
          </div>
          <div className="home-strip-grid home-strip-grid--3">
            {allPosts.slice(0, 3).map((post) => (
              <ScrollReveal key={post.slug}>
                <Link to={`/journal/${post.slug}`} className="home-strip-card spotlight-card" onMouseMove={spotMove}>
                  <div className="home-strip-img" style={{ backgroundImage: `url(${getCoverImage(post.tags, post.image, post.slug)})` }} />
                  <div className="home-strip-body">
                    <time className="home-strip-date">{post.date}</time>
                    <h3 className="home-strip-title">{post.title}</h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="home-strip-grid home-strip-grid--3">
            {allPosts.slice(3, 6).map((post) => (
              <ScrollReveal key={post.slug}>
                <Link to={`/journal/${post.slug}`} className="home-strip-card spotlight-card" onMouseMove={spotMove}>
                  <div className="home-strip-img" style={{ backgroundImage: `url(${getCoverImage(post.tags, post.image, post.slug)})` }} />
                  <div className="home-strip-body">
                    <time className="home-strip-date">{post.date}</time>
                    <h3 className="home-strip-title">{post.title}</h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Explore ─── */}
      <section className="section home-strip">
        <div className="container">
          <div className="home-strip-header">
            <span className="home-strip-label">Explore</span>
            <Link to="/explore" className="home-strip-more">All Countries →</Link>
          </div>
          <div className="home-strip-grid home-strip-grid--5">
            {EXPLORE_ITEMS.map((item) => (
              <ScrollReveal key={item.id}>
                <Link to="/explore" state={{ focusCountry: item.id }} className="home-strip-card spotlight-card" onMouseMove={spotMove}>
                  <div className="home-strip-img" style={{ backgroundImage: `url(/images/countries/${item.id}.jpg)`, height: 200 }} />
                  <div className="home-strip-body">
                    <h3 className="home-strip-title">{item.name}</h3>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.en}</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Collection ─── */}
      <section className="section home-strip">
        <div className="container">
          <div className="home-strip-header">
            <span className="home-strip-label">Collection</span>
            <Link to="/collection" className="home-strip-more">All →</Link>
          </div>
          <div className="home-strip-grid home-strip-grid--5">
            {COLLECTION_CARDS.map((item, i) => (
              <ScrollReveal key={i}>
                <Link to="/collection" className="home-strip-wall spotlight-card" onMouseMove={spotMove}>
                  <div className="home-strip-wall-img" style={{ backgroundImage: `url(https://picsum.photos/seed/wall-${i}/400/600)` }} />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
