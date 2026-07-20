import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import { countries, getCountryCover } from '../../data/countries'
import exploreConfig from '../../data/explore-config.json'
import { imgStyle, picsumUrl } from '../../utils/images'
import { getMICEDestinationsByCountry } from '../../utils/supabase'
import './ExplorePage.css'

/* ════════════════════════════════════════════════════════════
   Data
   ════════════════════════════════════════════════════════════ */

// Flat list of all attractions with city & country context
const allAttractions = countries.flatMap((c) =>
  c.cities.flatMap((city) =>
    city.attractions.map((a) => ({
      ...a,
      cityName: city.name,
      cityId: city.id,
      countryName: c.name,
      countryNameEn: c.nameEn,
      countryId: c.id,
    })),
  ),
)

// Flat list of all cities with country context
const allCities = countries.flatMap((c) =>
  c.cities.map((city) => ({
    ...city,
    countryName: c.name,
    countryNameEn: c.nameEn,
    countryId: c.id,
    attractionCount: city.attractions.length,
    coverImage: getCountryCover(c),
  })),
)

/* ════════════════════════════════════════════════════════════
   Curated
   ════════════════════════════════════════════════════════════ */

const featuredAttractions = exploreConfig.featured
  .map((id) => allAttractions.find((a) => a.id === id))
  .filter(Boolean)

const popularCities = exploreConfig.popularCities
  .map((id) => allCities.find((c) => c.id === id))
  .filter(Boolean)

/* ════════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════════ */

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function spotMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  e.currentTarget.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

const typeLabelMap = {
  landmark: 'Landmark',
  museum: 'Museum',
  nature: 'Nature',
}
const ALL_TYPES = ['all', 'landmark', 'museum', 'nature']

/* ════════════════════════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════════════════════════ */

function TypeBadge({ type, className }) {
  return (
    <span className={`${className || 'explore-attraction-type'} ${type}`}>
      {typeLabelMap[type] || type}
    </span>
  )
}

function AttractionCard({ attraction }) {
  return (
    <Link
      to={`/explore/attraction/${attraction.id}`}
      className="explore-attraction-card spotlight-card"
      onMouseMove={spotMove}
    >
      <div
        className="explore-attraction-img"
        style={imgStyle(attraction.image, 600, attraction.name)}
      />
      <div className="explore-attraction-body">
        <div className="explore-attraction-meta">
          <TypeBadge type={attraction.type} />
          <span className="explore-attraction-location">
            {attraction.cityName}, {attraction.countryNameEn}
          </span>
        </div>
        <h3 className="explore-attraction-name">{attraction.name}</h3>
        <p className="explore-attraction-desc">{attraction.description}</p>
      </div>
    </Link>
  )
}

function SearchResults({ results, query }) {
  if (!results.length) {
    return (
      <div className="explore-empty">
        <div className="explore-empty-icon">🔍</div>
        <p className="explore-empty-text">No results for &ldquo;{query}&rdquo;</p>
        <p className="explore-empty-hint">Try a different search term or clear filters</p>
      </div>
    )
  }
  return (
    <section className="section explore-strip">
      <div className="container">
        <div className="explore-results-header">
          <span className="explore-results-count">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="explore-attraction-grid stagger-children">
          {results.map((a, i) => (
            <ScrollReveal key={a.id} delay={i * 40}>
              <AttractionCard attraction={a} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════ */

const EUMICE_URL = import.meta.env.VITE_EUMICE_URL || 'http://localhost:3000'

export default function ExplorePage() {
  const location = useLocation()

  // View state
  const [activeCountryId, setActiveCountryId] = useState(null)
  const [activeCityId, setActiveCityId] = useState(null)

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  // Inspiration shuffle
  const [inspirationItems, setInspirationItems] = useState(() =>
    shuffleArray(allAttractions).slice(0, 5),
  )

  // MICE (loaded per country detail)
  const [miceDests, setMiceDests] = useState([])
  const [miceLoading, setMiceLoading] = useState(false)

  // Handle deep-link focusCountry from homepage
  useEffect(() => {
    if (location.state?.focusCountry) {
      setActiveCountryId(location.state.focusCountry)
      window.history.replaceState({}, '', '/explore')
    }
  }, [location.state?.focusCountry])

  // Load MICE data when country detail opens
  const activeCountry = activeCountryId ? countries.find((c) => c.id === activeCountryId) : null
  const activeCity = activeCityId ? allCities.find((c) => c.id === activeCityId) : null

  useEffect(() => {
    if (!activeCountry) { setMiceDests([]); return }
    setMiceLoading(true)
    getMICEDestinationsByCountry(activeCountry.name)
      .then(setMiceDests)
      .finally(() => setMiceLoading(false))
  }, [activeCountry])

  // Search filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q && typeFilter === 'all') return null // not searching

    let results = allAttractions

    if (typeFilter !== 'all') {
      results = results.filter((a) => a.type === typeFilter)
    }

    if (q) {
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.nameEn?.toLowerCase().includes(q) ||
          a.cityName.toLowerCase().includes(q) ||
          a.countryName.toLowerCase().includes(q) ||
          a.countryNameEn?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q),
      )
    }

    return results
  }, [searchQuery, typeFilter])

  const isSearching = searchQuery.trim() !== '' || typeFilter !== 'all'

  // Handlers
  const handleBack = () => {
    setActiveCountryId(null)
    setActiveCityId(null)
    setMiceDests([])
  }

  const handleCityClick = (cityId) => {
    setActiveCountryId(null)
    setActiveCityId(cityId)
  }

  const handleCountryClick = (countryId) => {
    setActiveCityId(null)
    setActiveCountryId(countryId)
  }

  const shuffleInspiration = () => {
    setInspirationItems(shuffleArray(allAttractions).slice(0, 5))
  }

  // ─── City Detail View ───
  if (activeCity) {
    const country = countries.find((c) => c.id === activeCity.countryId)
    return (
      <div className="explore-page">
        <section className="section explore-detail">
          <div className="container">
            <div className="explore-back-bar">
              <button className="explore-back-btn" onClick={handleBack}>
                ← Explore
              </button>
            </div>
            <ScrollReveal>
              <div className="explore-detail-header">
                <h2 className="explore-detail-heading">{activeCity.name}</h2>
                <span className="explore-detail-sub">{activeCity.countryName} · {activeCity.attractionCount} spots</span>
              </div>
            </ScrollReveal>

            <div className="explore-attraction-grid stagger-children">
              {activeCity.attractions.map((a, i) => (
                <ScrollReveal key={a.id} delay={i * 40}>
                  <AttractionCard
                    attraction={{
                      ...a,
                      cityName: activeCity.name,
                      countryName: activeCity.countryName,
                      countryNameEn: activeCity.countryNameEn,
                      countryId: activeCity.countryId,
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ─── Country Detail View ───
  if (activeCountry) {
    const countryCities = activeCountry.cities || []
    const tierLabel = { economy: '性价比', mid: '中高端', luxury: '顶奢' }

    return (
      <div className="explore-page">
        <section className="section explore-detail">
          <div className="container">
            <div className="explore-back-bar">
              <button className="explore-back-btn" onClick={handleBack}>
                ← Explore
              </button>
            </div>
            <ScrollReveal>
              <div className="explore-detail-header">
                <h2 className="explore-detail-heading">{activeCountry.name}</h2>
                <span className="explore-detail-sub">{activeCountry.nameEn}</span>
              </div>
            </ScrollReveal>

            {/* MICE Section */}
            {miceDests.length > 0 && (
              <div className="mice-section">
                <ScrollReveal>
                  <div className="mice-section-header">
                    <div className="mice-section-accent" />
                    <div>
                      <h2 className="mice-section-title">商务出行</h2>
                      <p className="mice-section-sub">
                        会议、奖励旅游与活动策划 · {miceDests.length} 个目的地
                        <a href={EUMICE_URL} target="_blank" rel="noopener noreferrer" className="mice-section-eumice-link">
                          EuMICE ↗
                        </a>
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="mice-cards">
                  {miceDests.map((dest, i) => (
                    <ScrollReveal key={dest.id} delay={i * 60}>
                      <article className="mice-card">
                        <div className="mice-card-head">
                          <div className="mice-card-head-left">
                            <span className={`mice-card-tier tier-${dest.tier || 'mid'}`}>
                              {tierLabel[dest.tier] || '中高端'}
                            </span>
                            <h3 className="mice-card-name">{dest.name}</h3>
                          </div>
                          <div className="mice-card-stars" title={`完善度 ${dest.completeness || 1}/5`}>
                            {Array.from({ length: 5 }, (_, k) => (
                              <span key={k} className={k < (dest.completeness || 1) ? 'mice-star filled' : 'mice-star'}>
                                {k < (dest.completeness || 1) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>

                        {dest.pitch && <p className="mice-card-pitch">{dest.pitch}</p>}

                        <div className="mice-card-tags">
                          {(dest.event_type || []).map((t) => (
                            <span key={t} className="mice-tag mice-tag--active">{t}</span>
                          ))}
                          {(dest.themes || []).slice(0, 4).map((t) => (
                            <span key={t} className="mice-tag">{t}</span>
                          ))}
                        </div>

                        <div className="mice-card-specs">
                          {dest.group_size && (
                            <div className="mice-spec">
                              <span className="mice-spec-label">人数规模</span>
                              <span className="mice-spec-value">{dest.group_size}</span>
                            </div>
                          )}
                          {dest.season && (
                            <div className="mice-spec">
                              <span className="mice-spec-label">最佳季节</span>
                              <span className="mice-spec-value">{dest.season}</span>
                            </div>
                          )}
                          {dest.timezone && (
                            <div className="mice-spec">
                              <span className="mice-spec-label">时区</span>
                              <span className="mice-spec-value">{dest.timezone}</span>
                            </div>
                          )}
                          {dest.direct_flight && (
                            <div className="mice-spec">
                              <span className="mice-spec-label">直飞</span>
                              <span className="mice-spec-value">{dest.direct_flight}</span>
                            </div>
                          )}
                          {dest.visa_info && (
                            <div className="mice-spec">
                              <span className="mice-spec-label">签证</span>
                              <span className="mice-spec-value">{dest.visa_info}</span>
                            </div>
                          )}
                          {dest.chinese_guide && (
                            <div className="mice-spec">
                              <span className="mice-spec-label">中文导游</span>
                              <span className="mice-spec-value">{dest.chinese_guide}</span>
                            </div>
                          )}
                        </div>

                        <div className="mice-card-sections">
                          {dest.venues && (
                            <details className="mice-card-detail" open>
                              <summary className="mice-detail-summary">酒店 / 会场资源</summary>
                              <p className="mice-detail-text">{dest.venues}</p>
                            </details>
                          )}
                          {dest.activities && (
                            <details className="mice-card-detail">
                              <summary className="mice-detail-summary">特色活动 / 团建创意</summary>
                              <p className="mice-detail-text">{dest.activities}</p>
                            </details>
                          )}
                          {dest.dining && (
                            <details className="mice-card-detail">
                              <summary className="mice-detail-summary">特色餐饮推荐</summary>
                              <p className="mice-detail-text">{dest.dining}</p>
                            </details>
                          )}
                          {dest.china_notes && (
                            <details className="mice-card-detail">
                              <summary className="mice-detail-summary">中国客户注意事项</summary>
                              <p className="mice-detail-text">{dest.china_notes}</p>
                            </details>
                          )}
                          {dest.transport && (
                            <details className="mice-card-detail">
                              <summary className="mice-detail-summary">城市间交通</summary>
                              <p className="mice-detail-text">{dest.transport}</p>
                            </details>
                          )}
                        </div>

                        <a
                          href={`${EUMICE_URL}/destination/${dest.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mice-card-cta"
                        >
                          在 EuMICE 查看完整档案
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17L17 7M7 7h10v10" /></svg>
                        </a>
                      </article>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {miceLoading && (
              <div className="mice-section">
                <div className="mice-section-header">
                  <div className="mice-section-accent" />
                  <div>
                    <h2 className="mice-section-title">商务出行</h2>
                    <p className="mice-section-sub">加载目的地数据…</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cities */}
            <div className="explore-detail-cities">
              {countryCities.map((city) => (
                <ScrollReveal key={city.id}>
                  <div className="explore-detail-city-block">
                    <h3 className="explore-detail-city-name">
                      {city.name}
                      <span className="explore-detail-city-count">{city.attractions.length} spots</span>
                    </h3>
                    <div className="explore-attraction-grid stagger-children">
                      {city.attractions.map((a, i) => (
                        <ScrollReveal key={a.id} delay={i * 40}>
                          <AttractionCard
                            attraction={{
                              ...a,
                              cityName: city.name,
                              countryName: activeCountry.name,
                              countryNameEn: activeCountry.nameEn,
                              countryId: activeCountry.id,
                            }}
                          />
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ─── Home View ───
  return (
    <div className="explore-page">
      {/* ── Hero — Search + Filters ── */}
      <section className="explore-hero">
        <div className="container">
          <ScrollReveal>
            <span className="explore-hero-label">Explore</span>
            <h1 className="explore-hero-title">发现你的下一站</h1>
            <p className="explore-hero-desc">
              24个国家，100+精选目的地——找到属于你的欧洲故事
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="explore-search-wrap">
              <svg className="explore-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                className="explore-search-input"
                placeholder="Search attractions, cities, countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="explore-filter-row">
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  className={`explore-filter-chip${typeFilter === t ? ' active' : ''}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t === 'all' ? 'All' : typeLabelMap[t]}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Search Results (replaces home content when searching) ── */}
      {isSearching ? (
        <SearchResults results={searchResults} query={searchQuery} />
      ) : (
        <>
          {/* ── Featured Highlights ── */}
          {featuredAttractions.length > 0 && (
            <section className="section explore-strip">
              <div className="container">
                <div className="explore-section-header">
                  <h2 className="explore-section-label">Featured</h2>
                </div>
                <div className="explore-featured-scroll">
                  {featuredAttractions.map((a) => (
                    <ScrollReveal key={a.id}>
                      <Link
                        to={`/explore/attraction/${a.id}`}
                        className="explore-featured-card"
                      >
                        <div
                          className="explore-featured-img"
                          style={imgStyle(a.image, 680, a.name)}
                        />
                        <div className="explore-featured-overlay" />
                        <div className="explore-featured-body">
                          <span className={`explore-featured-badge ${a.type}`}>
                            {typeLabelMap[a.type]}
                          </span>
                          <h3 className="explore-featured-name">{a.name}</h3>
                          <p className="explore-featured-location">
                            {a.cityName}, {a.countryNameEn}
                          </p>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Travel Inspiration ── */}
          <section className="section explore-strip">
            <div className="container">
              <div className="explore-section-header">
                <h2 className="explore-section-label">Inspiration</h2>
                <span className="explore-section-more">Random picks to spark your wanderlust</span>
              </div>
              <div className="explore-attraction-grid stagger-children">
                {inspirationItems.map((a, i) => (
                  <ScrollReveal key={`${a.id}-${i}`} delay={i * 60}>
                    <AttractionCard attraction={a} />
                  </ScrollReveal>
                ))}
              </div>
              <div className="explore-shuffle-wrap">
                <button className="explore-shuffle-btn" onClick={shuffleInspiration}>
                  🔀 Shuffle
                </button>
              </div>
            </div>
          </section>

          {/* ── Browse by City ── */}
          <section className="section explore-strip">
            <div className="container">
              <div className="explore-section-header">
                <h2 className="explore-section-label">Cities</h2>
              </div>
              <div className="explore-city-grid stagger-children">
                {popularCities.map((city) => (
                  <ScrollReveal key={city.id}>
                    <button
                      className="explore-city-card spotlight-card"
                      onClick={() => handleCityClick(city.id)}
                      onMouseMove={spotMove}
                    >
                      <div
                        className="explore-city-img"
                        style={{ backgroundImage: `url(${picsumUrl(city.name, 400, 320)})` }}
                      />
                      <div className="explore-city-overlay" />
                      <div className="explore-city-body">
                        <h3 className="explore-city-name">{city.name}</h3>
                        <p className="explore-city-country">
                          {city.countryName} · {city.attractionCount} spots
                        </p>
                      </div>
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Browse by Country ── */}
          <section className="section explore-strip">
            <div className="container">
              <div className="explore-section-header">
                <h2 className="explore-section-label">Countries</h2>
              </div>
              <div className="explore-country-grid stagger-children">
                {countries.map((country) => {
                  const cityCount = country.cities.length
                  const attractionCount = country.cities.reduce((s, c) => s + c.attractions.length, 0)
                  return (
                    <ScrollReveal key={country.id}>
                      <button
                        className="explore-country-card spotlight-card"
                        onClick={() => handleCountryClick(country.id)}
                        onMouseMove={spotMove}
                      >
                        <div
                          className="explore-country-img"
                          style={{ backgroundImage: `url(${getCountryCover(country)})` }}
                        />
                        <div className="explore-country-overlay" />
                        <div className="explore-country-body">
                          <h3 className="explore-country-name">{country.name}</h3>
                          <span className="explore-country-en">{country.nameEn}</span>
                          <span className="explore-country-stats">{cityCount} cities · {attractionCount} spots</span>
                        </div>
                      </button>
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
