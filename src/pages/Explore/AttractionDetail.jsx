import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import travelData from '../../data/europe-travel.json'
import { picsumUrl } from '../../utils/images'
import '../Journal/JournalPost.css'
import './AttractionDetail.css'

function carouselImages(img, name) {
  if (!img || img.startsWith('place-')) {
    const url = picsumUrl(name, 1200, 720)
    const hue = [...(name || 'A')].reduce((s, c) => s + c.charCodeAt(0), 0) % 360
    return [
      { backgroundImage: `url(${url})` },
      { background: `linear-gradient(135deg, hsl(${(hue + 30) % 360}, 28%, 28%), hsl(${(hue + 90) % 360}, 22%, 18%))` },
    ]
  }
  if (img.startsWith('http')) {
    return [{ backgroundImage: `url(${img})` }]
  }
  const u = `url(https://images.unsplash.com/${img}?auto=format&fit=crop&w=1200&q=80)`
  return [{ backgroundImage: u }, { backgroundImage: u }]
}

export default function AttractionDetail() {
  const { slug } = useParams()
  const [currentImg] = useState(0)

  function findAttraction() {
    for (const c of travelData.countries) {
      for (const city of c.cities) {
        const found = city.attractions.find((a) => a.id === slug)
        if (found) return { ...found, cityName: city.name, countryName: c.name, countryNameEn: c.nameEn }
      }
    }
    return null
  }
  const attraction = findAttraction()

  if (!attraction) {
    return (
      <div className="explore-page">
        <section className="section" style={{ paddingTop: 160 }}>
          <div className="container"><p className="blog-empty">Loading...</p></div>
        </section>
      </div>
    )
  }

  const typeLabel = attraction.type === 'landmark' ? 'Landmark' : attraction.type === 'museum' ? 'Museum' : 'Nature'
  const imgs = carouselImages(attraction.image, attraction.name)

  return (
    <div className="explore-page">
      <article className="section journal-post-section">
        <div className="container">
          <div className="journal-post-body">
            <Link to="/explore" className="back-link">← Explore</Link>

            <div className="detail-hero-img-wrap">
              <div className="detail-hero-bg" style={imgs[currentImg]} />
            </div>

            <header className="journal-post-header">
              <span className="detail-type-badge">{typeLabel}</span>
              <h1 className="journal-post-title">{attraction.name}</h1>
              <div className="journal-post-meta">
                <span>{attraction.cityName}, {attraction.countryName}</span>
              </div>
            </header>

            <p className="detail-desc">{attraction.description}</p>

            {attraction.tips && (
              <div className="detail-tip-card">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
                <p>{attraction.tips}</p>
              </div>
            )}

            {attraction.image_search_url && (
              <a href={attraction.image_search_url} target="_blank" rel="noopener noreferrer" className="detail-bing-link">
                Search more images on Bing ↗
              </a>
            )}

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Hours</span>
                <span className="detail-info-value">Check official website</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Tickets</span>
                <span className="detail-info-value">Check official website</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Location</span>
                <span className="detail-info-value">{attraction.cityName}, {attraction.countryName}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
