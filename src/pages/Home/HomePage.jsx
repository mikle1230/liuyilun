import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import { loadPostsFromModules } from '../../utils/posts'
import { getCoverImage } from '../../utils/tagImages'
import homepageConfig from '../../data/homepage-config.json'
import './HomePage.css'

/* ════════════════════════════════════════════════════════════
   Content
   ════════════════════════════════════════════════════════════ */

const journalModules = import.meta.glob('../../content/journal/*.md', {
  eager: true, query: '?raw', import: 'default',
})

const allPosts = loadPostsFromModules(journalModules)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5)

const COLLECTION_CARDS = Array.from({ length: 6 }, (_, i) => i)

const ALL_COUNTRIES = [
  { id: 'italy', name: '意大利', en: 'Italy' },
  { id: 'france', name: '法国', en: 'France' },
  { id: 'spain', name: '西班牙', en: 'Spain' },
  { id: 'greece', name: '希腊', en: 'Greece' },
  { id: 'united-kingdom', name: '英国', en: 'United Kingdom' },
  { id: 'germany', name: '德国', en: 'Germany' },
  { id: 'portugal', name: '葡萄牙', en: 'Portugal' },
  { id: 'netherlands', name: '荷兰', en: 'Netherlands' },
  { id: 'belgium', name: '比利时', en: 'Belgium' },
  { id: 'switzerland', name: '瑞士', en: 'Switzerland' },
  { id: 'austria', name: '奥地利', en: 'Austria' },
  { id: 'sweden', name: '瑞典', en: 'Sweden' },
  { id: 'norway', name: '挪威', en: 'Norway' },
  { id: 'denmark', name: '丹麦', en: 'Denmark' },
  { id: 'ireland', name: '爱尔兰', en: 'Ireland' },
  { id: 'poland', name: '波兰', en: 'Poland' },
  { id: 'czech-republic', name: '捷克', en: 'Czech Republic' },
  { id: 'hungary', name: '匈牙利', en: 'Hungary' },
  { id: 'croatia', name: '克罗地亚', en: 'Croatia' },
  { id: 'turkey', name: '土耳其', en: 'Turkey' },
  { id: 'finland', name: '芬兰', en: 'Finland' },
  { id: 'estonia', name: '爱沙尼亚', en: 'Estonia' },
  { id: 'iceland', name: '冰岛', en: 'Iceland' },
  { id: 'montenegro', name: '黑山', en: 'Montenegro' },
]

function shuffleCountries() {
  const shuffled = [...ALL_COUNTRIES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5)
}

function pickBannerImages() {
  const shuffled = [...ALL_COUNTRIES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map((c) => `/images/countries/${c.id}.jpg`)
}

function spotMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

/* ════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [exploreItems, setExploreItems] = useState(() => shuffleCountries())
  const [wallpaperSeed, setWallpaperSeed] = useState(() => Date.now())
  const [bannerImages] = useState(() => pickBannerImages())
  const [bannerIndex, setBannerIndex] = useState(0)

  const nextBanner = useCallback(() => {
    setBannerIndex((i) => (i + 1) % bannerImages.length)
  }, [bannerImages.length])

  useEffect(() => {
    const timer = setInterval(nextBanner, 86400000)
    return () => clearInterval(timer)
  }, [nextBanner])

  const featuredPost = allPosts[0]
  const gridPosts = allPosts.slice(1, 5)

  return (
    <div className="home-page">
      {/* ─── Hero ─── */}
      <section className="home-hero">
        <div className="home-hero-banner">
          {bannerImages.map((img, i) => (
            <div
              key={img}
              className={`home-hero-slide ${i === bannerIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
        <div className="home-hero-overlay" />
        <div className="home-hero-content container">
          <ScrollReveal delay={100}>
            <h1 className="home-hero-title">
              {homepageConfig.hero.title.map((line, i) => (
                <span key={i} className={`home-hero-title-line ${i === bannerIndex ? 'active' : ''}`}>
                  {line}
                </span>
              ))}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="home-hero-desc">
              {homepageConfig.hero.descriptionLine1}<br />{homepageConfig.hero.descriptionLine2}
            </p>
          </ScrollReveal>
          <div className="home-hero-dots">
            {bannerImages.map((_, i) => (
              <button
                key={i}
                className={`home-hero-dot ${i === bannerIndex ? 'active' : ''}`}
                onClick={() => setBannerIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Journal ─── */}
      <section className="home-section">
        <div className="container">
          <div className="home-section-header">
            <span className="home-section-label">{homepageConfig.sections.journal.label}</span>
            <Link to="/journal" className="home-section-more">{homepageConfig.sections.journal.moreText}</Link>
          </div>

          {featuredPost && (
            <ScrollReveal>
              <Link to={`/journal/${featuredPost.slug}`} className="home-featured spotlight-card" onMouseMove={spotMove}>
                <div
                  className="home-featured-img"
                  style={{ backgroundImage: `url(${getCoverImage(featuredPost.tags, featuredPost.image, featuredPost.slug)})` }}
                />
                <div className="home-featured-body">
                  <time className="home-featured-date">{featuredPost.date}</time>
                  <h2 className="home-featured-title">{featuredPost.title}</h2>
                  <p className="home-featured-excerpt">{featuredPost.excerpt}</p>
                </div>
              </Link>
            </ScrollReveal>
          )}

          {gridPosts.length > 0 && (
            <div className="home-strip-grid home-strip-grid--4 stagger-children">
              {gridPosts.map((post) => (
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
          )}
        </div>
      </section>

      {/* ─── Explore ─── */}
      <section className="home-section home-section--alt">
        <div className="container">
          <div className="home-section-header">
            <span className="home-section-label">{homepageConfig.sections.explore.label}</span>
            <Link to="/explore" className="home-section-more">{homepageConfig.sections.explore.moreText}</Link>
          </div>
          <div className="home-strip-grid home-strip-grid--5">
            {exploreItems.map((item) => (
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
          <div className="home-shuffle-wrap">
            <button className="home-shuffle-btn" onClick={() => setExploreItems(shuffleCountries())}>
              {homepageConfig.shuffleButtonText}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Collection ─── */}
      <section className="home-section">
        <div className="container">
          <div className="home-section-header">
            <span className="home-section-label">{homepageConfig.sections.collection.label}</span>
            <Link to="/collection" className="home-section-more">{homepageConfig.sections.collection.moreText}</Link>
          </div>
          <div className="home-strip-grid home-strip-grid--3">
            {COLLECTION_CARDS.map((_, i) => (
              <ScrollReveal key={`${wallpaperSeed}-${i}`}>
                <Link to="/collection" className="home-strip-wall spotlight-card" onMouseMove={spotMove}>
                  <div className="home-strip-wall-img" style={{ backgroundImage: `url(https://picsum.photos/seed/${wallpaperSeed}-${i}/400/600)` }} />
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="home-shuffle-wrap">
            <button className="home-shuffle-btn" onClick={() => setWallpaperSeed(Date.now())}>
              {homepageConfig.shuffleButtonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
