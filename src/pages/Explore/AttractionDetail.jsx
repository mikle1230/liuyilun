import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import travelData from '../../data/europe-travel.json'
import { picsumUrl } from '../../utils/images'
import './ExplorePage.css'

/* ─── Generate carousel images ─── */
function carouselImages(img, name) {
  if (!img || img.startsWith('place-')) {
    // Picsum for the main hero image (real photo, no API key needed)
    const url = picsumUrl(name, 1200, 720)
    const hue = [...(name || 'A')].reduce((s, c) => s + c.charCodeAt(0), 0) % 360
    return [
      { backgroundImage: `url(${url})` },
      { background: `linear-gradient(135deg, hsl(${(hue + 30) % 360}, 28%, 28%), hsl(${(hue + 90) % 360}, 22%, 18%))` },
      { background: `linear-gradient(135deg, hsl(${(hue + 60) % 360}, 25%, 32%), hsl(${(hue + 120) % 360}, 20%, 22%))` },
    ]
  }
  if (img.startsWith('http')) {
    return Array(3).fill({ backgroundImage: `url(${img})` })
  }
  return [
    { backgroundImage: `url(https://images.unsplash.com/${img}?auto=format&fit=crop&crop=entropy&w=1200&q=80)` },
    { backgroundImage: `url(https://images.unsplash.com/${img}?auto=format&fit=crop&crop=faces&w=1200&q=80)` },
    { backgroundImage: `url(https://images.unsplash.com/${img}?auto=format&fit=crop&crop=edges&w=1200&q=80)` },
  ]
}

export default function AttractionDetail() {
  const { slug } = useParams()
  const [currentImg] = useState(0)

  function findAttraction() {
    for (const c of travelData.countries) {
      for (const city of c.cities) {
        const found = city.attractions.find((a) => a.id === slug)
        if (found) {
          return {
            ...found,
            cityName: city.name,
            cityNameEn: city.nameEn,
            countryName: c.name,
            countryNameEn: c.nameEn,
            cityLat: city.lat,
            cityLng: city.lng,
          }
        }
      }
    }
    return null
  }
  const attraction = findAttraction()

  if (!attraction) {
    return (
      <div className="explore-page">
        <section className="section" style={{ paddingTop: 160 }}>
          <div className="container"><p className="blog-empty">加载中...</p></div>
        </section>
      </div>
    )
  }

  const typeLabel = attraction.type === 'landmark' ? '地标' : attraction.type === 'museum' ? '博物馆' : '自然'
  const imgs = carouselImages(attraction.image, attraction.name)

  return (
    <div className="explore-page">
      {/* ─── Hero image carousel ─── */}
      <section className="detail-hero">
        <div className="detail-hero-img-wrap">
          <div className="detail-hero-bg" style={imgs[currentImg]} />
          <div className="detail-hero-overlay" />
        </div>

        <div className="container detail-hero-content">
          <Link to="/explore" className="detail-back-link">← 返回探索</Link>
          <ScrollReveal>
            <span className="explore-hero-label">{typeLabel}</span>
            <h1 className="explore-hero-title">{attraction.name}</h1>
            <p className="explore-hero-desc" style={{ maxWidth: 600 }}>
              {attraction.cityName} · {attraction.countryName}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="section" style={{ paddingTop: 60, paddingBottom: 120 }}>
        <div className="container">
          <div className="detail-layout">
            {/* Main info */}
            <div className="detail-main">
              <ScrollReveal>
                <h2 className="detail-section-title">简介</h2>
                <p className="detail-desc">{attraction.description}</p>
              </ScrollReveal>

              {attraction.tips && (
                <ScrollReveal>
                  <div className="detail-tip-card">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <div>
                      <strong>小贴士</strong>
                      <p>{attraction.tips}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {attraction.image_search_url && (
                <ScrollReveal>
                  <a href={attraction.image_search_url} target="_blank" rel="noopener noreferrer" className="detail-bing-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                    在 Bing 上搜索更多图片
                  </a>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="detail-sidebar">
              <ScrollReveal>
                <div className="detail-info-card">
                  <div className="detail-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  </div>
                  <div className="detail-info-body">
                    <span className="detail-info-label">开放时间</span>
                    <span className="detail-info-value">暂无信息，以官网最新公告为准</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={60}>
                <div className="detail-info-card">
                  <div className="detail-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                  </div>
                  <div className="detail-info-body">
                    <span className="detail-info-label">门票信息</span>
                    <span className="detail-info-value">暂无信息，以官网最新公告为准</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="detail-info-card">
                  <div className="detail-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div className="detail-info-body">
                    <span className="detail-info-label">地址</span>
                    <span className="detail-info-value">{attraction.cityName}，{attraction.countryName}</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <div className="detail-info-card">
                  <div className="detail-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                  </div>
                  <div className="detail-info-body">
                    <span className="detail-info-label">注意事项</span>
                    <span className="detail-info-value">请遵守当地参观规定，部分景点需提前预约</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <Link to="/explore" state={{ focusCity: attraction.cityId, focusCountry: attraction.countryId }} className="detail-map-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                  在地图上查看位置
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
