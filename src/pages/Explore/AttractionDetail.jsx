import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import { countries } from '../../data/countries'
import attractionInfo from '../../data/attraction-info.json'
import { imgStyle, picsumUrl } from '../../utils/images'
import '../Journal/JournalPost.css'
import './AttractionDetail.css'


function carouselImages(img, name) {
  const images = []

  // Primary image
  if (img && img.startsWith('http')) {
    images.push({ backgroundImage: `url(${img})` })
  } else if (img && !img.startsWith('place-')) {
    const u = `url(https://images.unsplash.com/${img}?auto=format&fit=crop&w=1200&q=80)`
    images.push({ backgroundImage: u })
  } else {
    // Picsum seed for primary
    const url = picsumUrl(name, 1200, 720)
    images.push({ backgroundImage: `url(${url})` })
  }

  // Secondary image — different pic or gradient for visual variety
  const seed2 = name ? `${name}-2` : 'secondary'
  images.push({ backgroundImage: `url(${picsumUrl(seed2, 1200, 720)})` })

  // Tertiary — gradient from name hash for fallback/variety
  const hue = [...(name || 'A')].reduce((s, c) => s + c.charCodeAt(0), 0) % 360
  images.push({
    background: `linear-gradient(135deg, hsl(${hue}, 30%, 35%), hsl(${(hue + 60) % 360}, 25%, 22%))`,
  })

  return images
}

/* ════════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════════ */

export default function AttractionDetail() {
  const { slug } = useParams()
  const [currentImg, setCurrentImg] = useState(0)

  function findAttraction() {
    for (const c of countries) {
      for (const city of c.cities) {
        const found = city.attractions.find((a) => a.id === slug)
        if (found) {
          return {
            ...found,
            cityName: city.name,
            cityId: city.id,
            countryName: c.name,
            countryNameEn: c.nameEn,
            countryId: c.id,
            allCityAttractions: city.attractions,
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
          <div className="container">
            <p className="blog-empty">Loading...</p>
          </div>
        </section>
      </div>
    )
  }

  const typeLabelMap = { landmark: 'Landmark', museum: 'Museum', nature: 'Nature' }
  const typeLabel = typeLabelMap[attraction.type] || attraction.type
  const imgs = carouselImages(attraction.image, attraction.name)
  const info = attractionInfo[attraction.id] || null

  // Nearby: other attractions in same city, excluding current
  const nearby = (attraction.allCityAttractions || [])
    .filter((a) => a.id !== attraction.id)
    .slice(0, 3)

  return (
    <div className="explore-page">
      <article className="section journal-post-section">
        <div className="container">
          <div className="journal-post-body">
            {/* Breadcrumb */}
            <div className="detail-breadcrumb">
              <Link to="/explore" className="detail-breadcrumb-link">Explore</Link>
              <span className="detail-breadcrumb-sep">/</span>
              <span className="detail-breadcrumb-current">{attraction.cityName}</span>
            </div>

            {/* Image Carousel */}
            <div className="detail-carousel">
              <div className="detail-carousel-track" style={imgs[currentImg]} />
              {imgs.length > 1 && (
                <div className="detail-carousel-dots">
                  {imgs.map((_, i) => (
                    <button
                      key={i}
                      className={`detail-carousel-dot${i === currentImg ? ' active' : ''}`}
                      onClick={() => setCurrentImg(i)}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Header */}
            <header className="journal-post-header">
              <span className={`detail-type-badge ${attraction.type}`}>{typeLabel}</span>
              <h1 className="journal-post-title">{attraction.name}</h1>
              <div className="journal-post-meta">
                <span>{attraction.cityName}, {attraction.countryName}</span>
              </div>
            </header>

            {/* Description */}
            <ScrollReveal>
              <p className="detail-desc">{attraction.description}</p>
            </ScrollReveal>

            {/* Tips */}
            {attraction.tips && (
              <ScrollReveal>
                <div className="detail-tip-card">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <p>{attraction.tips}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Info Grid */}
            <ScrollReveal>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <span className="detail-info-label">Hours</span>
                  <span className="detail-info-value">
                    {info?.hours || 'Check official website'}
                  </span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">Tickets</span>
                  <span className="detail-info-value">
                    {info?.ticketPrice || 'Check official website'}
                  </span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">Best Time</span>
                  <span className="detail-info-value">
                    {info?.bestTime || 'Year-round'}
                  </span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">Transport</span>
                  <span className="detail-info-value">
                    {info?.transport || 'Varies by location'}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Official site + image search links */}
            <ScrollReveal>
              <div className="detail-links">
                {info?.officialUrl && (
                  <a
                    href={info.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-official-link"
                  >
                    Official Website ↗
                  </a>
                )}
                {attraction.image_search_url && (
                  <a
                    href={attraction.image_search_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-bing-link"
                  >
                    Search more images on Bing ↗
                  </a>
                )}
              </div>
            </ScrollReveal>

            {/* Nearby Attractions */}
            {nearby.length > 0 && (
              <ScrollReveal>
                <section className="detail-nearby">
                  <h2 className="detail-nearby-title">Nearby in {attraction.cityName}</h2>
                  <div className="detail-nearby-grid">
                    {nearby.map((a) => (
                      <Link
                        key={a.id}
                        to={`/explore/attraction/${a.id}`}
                        className="detail-nearby-card"
                      >
                        <div
                          className="detail-nearby-img"
                          style={imgStyle(a.image, 400, a.name)}
                        />
                        <div className="detail-nearby-body">
                          <span className={`detail-nearby-type ${a.type}`}>
                            {typeLabelMap[a.type]}
                          </span>
                          <h3 className="detail-nearby-name">{a.name}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
