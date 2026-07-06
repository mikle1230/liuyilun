import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { loadPostsFromModules } from '../../utils/posts'
import { getThumbnailUrl, getFullDownloadUrl } from '../../utils/wallpapers'
import wallpapersData from '../../data/wallpapers.json'
import './HomePage.css'

const blogModules = import.meta.glob('../../content/blog/*.md', { eager: true, query: '?raw', import: 'default' })
const aiModules = import.meta.glob('../../content/ai/*.md', { eager: true, query: '?raw', import: 'default' })

const allPosts = (() => {
  const blogs = loadPostsFromModules(blogModules)
  const ais = loadPostsFromModules(aiModules)
  return [...blogs, ...ais].sort((a, b) => new Date(b.date) - new Date(a.date))
})()

const latest = allPosts[0]
const recentPosts = allPosts.slice(0, 4)
const wallpaperItems = wallpapersData.items.filter(w => w.enabled !== false).slice(0, 4)

export default function HomePage() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.playsInline = true
    const play = () => video.play().catch(() => {})
    if (video.readyState >= 3) { play() }
    else {
      video.addEventListener('canplay', play, { once: true })
      setTimeout(play, 3000)
    }
  }, [])

  return (
    <div className="home-page">
      {/* === Hero Video === */}
      <section className="home-hero">
        <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="auto">
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="container">
            <div className="hero-kicker">This Place</div>
            <h1 className="hero-title">一处随时间<br />生长的个人空间。</h1>
            <p className="hero-desc">记录走过的路、读过的书、用过的好工具、沉淀下来的思考。</p>
          </div>
        </div>
      </section>

      {/* === Featured Story === */}
      {latest && (
        <section className="section container">
          <div className="featured">
            <div className="featured-image">
              <span>📰 Latest</span>
            </div>
            <div className="featured-content">
              <div className="featured-cat">Featured</div>
              <h2 className="featured-title">{latest.title}</h2>
              <p className="featured-excerpt">{latest.excerpt}</p>
              <Link to={`/journal/${latest.slug}`} className="featured-cta">Read →</Link>
            </div>
          </div>
        </section>
      )}

      {/* === Journal Entries === */}
      <section className="section container">
        <div className="section-label">Journal</div>
        <h2 className="section-title" style={{ marginBottom: 32 }}>随笔与记录</h2>
        <div className="entry-list">
          {recentPosts.map((post) => (
            <Link key={post.slug} to={`/journal/${post.slug}`} className="entry-item">
              <div className="entry-visual">{post.section === 'ai' ? '🤖' : '📝'}</div>
              <div className="entry-info">
                <div className="entry-meta">{post.date}</div>
                <h3 className="entry-title">{post.title}</h3>
                <p className="entry-excerpt">{post.excerpt}</p>
              </div>
              <span className="entry-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* === Wallpaper Gallery Section === */}
      <section className="section container">
        <div className="section-label">Gallery</div>
        <h2 className="section-title" style={{ marginBottom: 32 }}>收集的风景</h2>
        <div className="home-gallery">
          {wallpaperItems.map(w => (
            <a key={w.id} href={getFullDownloadUrl(w)} target="_blank" rel="noopener noreferrer" className="home-gallery-card" title="点击下载">
              <img src={getThumbnailUrl(w)} alt={w.title} loading="lazy" />
              <div className="home-gallery-info">
                <span>{w.title}</span>
              </div>
            </a>
          ))}
        </div>
        <Link to="/collections" className="section-cta">View all →</Link>
      </section>

      {/* === Travels Preview === */}
      <section className="section container">
        <div className="section-label">Travels</div>
        <h2 className="section-title" style={{ marginBottom: 32 }}>旅行笔记</h2>
        <div className="travel-preview">
          <div className="travel-preview-card">
            <div className="travel-preview-img">🇬🇧</div>
            <h3>伦敦的雾</h3>
            <p>十一月的伦敦，下午四点天就暗了。</p>
          </div>
          <div className="travel-preview-card">
            <div className="travel-preview-img">🇨🇭</div>
            <h3>瑞士的慢火车</h3>
            <p>从 Interlaken 到 Zermatt 的山谷穿行。</p>
          </div>
          <div className="travel-preview-card">
            <div className="travel-preview-img">🇯🇵</div>
            <h3>京都的雨</h3>
            <p>六月雨季的岚山，竹林的雨声。</p>
          </div>
        </div>
        <Link to="/travels" className="section-cta">Explore map →</Link>
      </section>
    </div>
  )
}
