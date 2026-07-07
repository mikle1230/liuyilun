import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import travelData from '../../data/europe-travel.json'
import { imgStyle } from '../../utils/images'
import './ExplorePage.css'

const countries = travelData.countries

function getCountryCover(country) {
  return `/images/countries/${country.id}.jpg`
}

function spotMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

export default function ExplorePage() {
  const location = useLocation()
  const [activeCountry, setActiveCountry] = useState(location.state?.focusCountry || null)

  useEffect(() => {
    if (location.state?.focusCountry) {
      window.history.replaceState({}, '', '/explore')
    }
  }, [location.state?.focusCountry])

  const selectedCountry = activeCountry ? countries.find((c) => c.id === activeCountry) : null
  const countryCities = selectedCountry?.cities || []

  const handleBack = () => setActiveCountry(null)

  return (
    <div className="explore-page">
      {/* ── Hero ── */}
      <section className="explore-hero">
        <div className="container">
          <ScrollReveal>
            <span className="explore-hero-label">Explore</span>
            <h1 className="explore-hero-title">你向往的世界</h1>
            <p className="explore-hero-desc">
               理解一个地方为什么成为今天的样子。不是为了打卡，而是为了看见。
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Country Grid ── */}
      {!activeCountry && (
        <section className="section explore-grid-section">
          <div className="container">
            <div className="explore-country-grid stagger-children">
              {countries.map((country) => {
                const cityCount = country.cities.length
                const attractionCount = country.cities.reduce((s, c) => s + c.attractions.length, 0)
                return (
                  <ScrollReveal key={country.id}>
                    <button
                      className="explore-country-card spotlight-card"
                      onClick={() => setActiveCountry(country.id)}
                      onMouseMove={spotMove}
                    >
                      <div
                        className="explore-country-card-img"
                        style={{
                          backgroundImage: `url(${getCountryCover(country)})`,
                        }}
                      />
                      <div className="explore-country-card-overlay" />
                      <div className="explore-country-card-body">
                        <h3 className="explore-country-name">{country.name}</h3>
                        <p className="explore-country-en">{country.nameEn}</p>
                        <p className="explore-country-stats">
                          {cityCount} cities · {attractionCount} spots
                        </p>
                      </div>
                    </button>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Country Detail ── */}
      {activeCountry && selectedCountry && (
        <section className="section explore-detail-section">
          <div className="container">
            <ScrollReveal>
              <button className="explore-back-btn" onClick={handleBack}>
                ← All Countries
              </button>
              <div className="explore-country-header">
                <h2 className="explore-country-heading">{selectedCountry.name}</h2>
                <span className="explore-country-heading-en">{selectedCountry.nameEn}</span>
                <p className="explore-country-desc">{selectedCountry.description}</p>
              </div>
            </ScrollReveal>

            <div className="explore-cities">
              {countryCities.map((city) => (
                <ScrollReveal key={city.id}>
                  <div className="explore-city-block">
                    <h3 className="explore-city-name">
                      {city.name}
                      <span className="explore-city-count">{city.attractions.length} spots</span>
                    </h3>

                    <div className="explore-attraction-grid stagger-children">
                      {city.attractions.map((a, i) => (
                        <ScrollReveal key={a.id} delay={i * 60}>
                          <Link to={`/explore/attraction/${a.id}`} className="attraction-card-link">
                            <div className="attraction-card spotlight-card" onMouseMove={(e) => {
                              const el = e.currentTarget
                              const rect = el.getBoundingClientRect()
                              el.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
                              el.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
                            }}>
                              <div className="attraction-card-img" style={imgStyle(a.image, 800, a.name)} />
                              <div className="attraction-card-body">
                                <div className="attraction-card-meta">
                                  <span className="attraction-type-badge">
                                    {a.type === 'landmark' ? 'Landmark' : a.type === 'museum' ? 'Museum' : 'Nature'}
                                  </span>
                                  <span className="attraction-location">{city.name}, {selectedCountry.nameEn}</span>
                                </div>
                                <h3 className="attraction-name">{a.name}</h3>
                                <p className="attraction-desc">{a.description}</p>
                                {a.tips && (
                                  <div className="attraction-tip">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="M12 16v-4M12 8h.01" />
                                    </svg>
                                    <span>{a.tips}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
