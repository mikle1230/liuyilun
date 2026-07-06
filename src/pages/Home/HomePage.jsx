import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules } from '../../utils/posts'
import { getCoverImage } from '../../utils/tagImages'
import travelData from '../../data/europe-travel.json'
import wallpapersData from '../../data/wallpapers.json'
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

const pickedCountries = travelData.countries.slice(0, 5)
const pickedWallpapers = wallpapersData.slice(0, 5)

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

const COUNTRY_COVERS = {
  'united-kingdom': '1513635269975-59663e0ac1ad',
  'france': '1502602898657-3e91760cbb34',
  'germany': '1467269205-a7a3c3e9c5e8',
  'italy': '1523906837458-0668d9c75b75',
  'spain': '1543783206-7a5969ac5c71',
  'portugal': '1555885614-5c8e3ab3e140',
  'netherlands': '1512474932049-78ac69ede4a0',
  'belgium': '1558618666-1c4e2e0a73f7',
  'switzerland': '1530122037265-a5f1f91d3b99',
  'austria': '1516552830192-1f78299c5d96',
  'greece': '1533105079780-92b9be4833fa',
  'sweden': '1508182315256-7b1e8c04c5c9',
  'norway': '1520769669658-fc49e4441ca1',
  'denmark': '1513622470522-16f11784df5d',
  'ireland': '1549918864-5db3a6d4e5a3',
  'poland': '1590080874088-eb9e21d5b7c3',
  'czech-republic': '1519677100203-a0e668c92439',
  'hungary': '1565967152-a98e25028a0a',
  'croatia': '1555998017-765d9de3f6a0',
  'turkey': '1524231757912-21f4f3e72c2f',
  'finland': '1518531933037-1b45c2b7c0d7',
  'estonia': '1558532923-2a6c6ca6c6b8',
  'iceland': '1504893524553-56a33edc5b3e',
  'montenegro': '1558618666-1c4e2e0a73f7',
}

function countryCover(c) {
  const photo = COUNTRY_COVERS[c.id] || '1469854523086-cc02fe5d8800'
  return `https://images.unsplash.com/photo-${photo}?w=600&q=80`
}

const WALLPAPER_COVERS = {
  'aurora-borealis': '1483344560535-82e1f7182eae',
  'mountain-lake': '1506905925348-21ebda60e2cd',
  'cherry-blossom': '1523712999610-d11827ea0b1f',
  'starry-night': '1419242902214-4d19d0b72df3',
  'ocean-sunset': '1507525428034-b723cf961d3e',
}

function wallpaperCover(w) {
  const photo = WALLPAPER_COVERS[w.id] || '1470071459604-3b5ec3a7fe05'
  return `https://images.unsplash.com/photo-${photo}?w=400&q=80`
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
          <div className="home-strip-scroll">
            {pickedCountries.map((c) => (
              <ScrollReveal key={c.id}>
                <Link to="/explore" className="home-strip-country spotlight-card" onMouseMove={spotMove}>
                  <div className="home-strip-country-img" style={{ backgroundImage: `url(${countryCover(c)})` }} />
                  <div className="home-strip-country-overlay">
                    <span className="home-strip-country-name">{c.name}</span>
                    <span className="home-strip-country-en">{c.nameEn}</span>
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
            {pickedWallpapers.map((w) => (
              <ScrollReveal key={w.id}>
                <Link to="/collection" className="home-strip-wall spotlight-card" onMouseMove={spotMove}>
                  <div className="home-strip-wall-img" style={{ backgroundImage: `url(${wallpaperCover(w)})` }} />
                  <span className="home-strip-wall-title">{w.title}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
