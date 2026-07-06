import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import travelData from '../../data/europe-travel.json'
import { imgStyle } from '../../utils/images'
import './ExplorePage.css'

const countries = travelData.countries

function getCountryCover(country) {
  const names = country.nameEn.toLowerCase().replace(/\s+/g, '-')
  return `https://images.unsplash.com/photo-${country.id === 'france' ? '1502602898657-3e91760cbb34'
    : country.id === 'italy' ? '1523906837458-0668d9c9d75b'
    : country.id === 'spain' ? '1543783206-7a5969ac5c71'
    : country.id === 'germany' ? '1467269205-a7a3c3e9c5e8'
    : country.id === 'united-kingdom' ? '1513635269975-59663e0ac1ad'
    : country.id === 'switzerland' ? '1530122037265-a5f1f91d3b99'
    : country.id === 'greece' ? '1533105079780-92b9be4833fa'
    : country.id === 'portugal' ? '1555885614-5c8e3ab3e140'
    : country.id === 'netherlands' ? '1512474932049-78ac69ede4a0'
    : country.id === 'austria' ? '1516552830192-1f78299c5d96'
    : country.id === 'sweden' ? '1508182315256-7b1e8c04c5c9'
    : country.id === 'norway' ? '1520769669658-fc49e4441ca1'
    : country.id === 'denmark' ? '1513622470522-16f11784df5d'
    : country.id === 'ireland' ? '1549918864-5db3a6d4e5a3'
    : country.id === 'hungary' ? '1565967152-a98e25028a0a'
    : country.id === 'croatia' ? '1555998017-765d9de3f6a0'
    : country.id === 'turkey' ? '1524231757912-21f4f3e72c2f'
    : country.id === 'poland' ? '1590080874088-eb9e21d5b7c3'
    : country.id === 'belgium' ? '1558618666-1c4e2e0a73f7'
    : country.id === 'czech-republic' ? '1519677100203-a0e668c92439'
    : country.id === 'finland' ? '1518531933037-1b45c2b7c0d7'
    : country.id === 'estonia' ? '1558532923-2a6c6ca6c6b8'
    : country.id === 'iceland' ? '1504893524553-56a33edc5b3e'
    : country.id === 'montenegro' ? '1558618666-1c4e2e0a73f7'
    : '1488646953014-85cb44e25828'
  }?w=800&q=80`
}

export default function ExplorePage() {
  const [activeCountry, setActiveCountry] = useState(null)

  const selectedCountry = activeCountry ? countries.find((c) => c.id === activeCountry) : null
  const countryCities = selectedCountry?.cities || []

  const handleBack = () => setActiveCountry(null)

  return (
    <div className="explore-page">
      {/* ── Hero ── */}
      <section className="explore-hero">
        <div className="container">
          <ScrollReveal>
            <span className="explore-hero-label">探索</span>
            <h1 className="explore-hero-title">你向往的世界</h1>
            <p className="explore-hero-desc">
              一座城市一座城市地认识这个世界。精选欧洲旅行目的地，每个城市都有值得探索的风景。
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
                      className="explore-country-card"
                      onClick={() => setActiveCountry(country.id)}
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
                          {cityCount} 个城市 · {attractionCount} 个景点
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
                ← 返回所有国家
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
                      <span className="explore-city-count">{city.attractions.length} 个景点</span>
                    </h3>

                    <div className="explore-attraction-grid stagger-children">
                      {city.attractions.map((a, i) => (
                        <ScrollReveal key={a.id} delay={i * 60}>
                          <Link to={`/explore/attraction/${a.id}`} className="attraction-card-link">
                            <div className="attraction-card">
                              <div className="attraction-card-img" style={imgStyle(a.image, 800, a.name)} />
                              <div className="attraction-card-body">
                                <div className="attraction-card-meta">
                                  <span className="attraction-type-badge">
                                    {a.type === 'landmark' ? '地标' : a.type === 'museum' ? '博物馆' : '自然'}
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
