import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import travelData from '../../data/europe-travel.json'
import { imgStyle } from '../../utils/images'
import { getMICEDestinationsByCountry } from '../../utils/supabase'
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

const EUMICE_URL = import.meta.env.VITE_EUMICE_URL || 'http://localhost:3000'

export default function ExplorePage() {
  const location = useLocation()
  const [activeCountry, setActiveCountry] = useState(location.state?.focusCountry || null)
  const [miceDests, setMiceDests] = useState([])
  const [miceLoading, setMiceLoading] = useState(false)

  useEffect(() => {
    if (location.state?.focusCountry) {
      window.history.replaceState({}, '', '/explore')
    }
  }, [location.state?.focusCountry])

  const selectedCountry = activeCountry ? countries.find((c) => c.id === activeCountry) : null
  const countryCities = selectedCountry?.cities || []

  useEffect(() => {
    if (!selectedCountry) return
    setMiceLoading(true)
    getMICEDestinationsByCountry(selectedCountry.name)
      .then(setMiceDests)
      .finally(() => setMiceLoading(false))
  }, [selectedCountry])

  const handleBack = () => { setActiveCountry(null); setMiceDests([]) }

  const tierLabel = { economy: '性价比', mid: '中高端', luxury: '顶奢' }

  return (
    <div className="explore-page">
      {/* ── Hero — only on country grid, not on detail ── */}
      {!activeCountry && (
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
      )}

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
                    <button className="explore-country-card spotlight-card" onClick={() => setActiveCountry(country.id)} onMouseMove={spotMove}>
                      <div className="explore-country-card-img" style={{ backgroundImage: `url(${getCountryCover(country)})` }} />
                      <div className="explore-country-card-overlay" />
                      <div className="explore-country-card-body">
                        <h3 className="explore-country-name">{country.name}</h3>
                        <p className="explore-country-en">{country.nameEn}</p>
                        {country.description && (
                          <p className="explore-country-card-desc">{country.description}</p>
                        )}
                        <p className="explore-country-stats">{cityCount} cities · {attractionCount} spots</p>
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
            <div className="explore-detail-topbar">
              <button className="explore-back-btn" onClick={handleBack}>← Explore</button>
            </div>
            <ScrollReveal>
              <div className="explore-country-header">
                <h2 className="explore-country-heading">{selectedCountry.name}</h2>
                <span className="explore-country-heading-en">{selectedCountry.nameEn}</span>
              </div>
            </ScrollReveal>

            {/* ── MICE: Business Travel — ABOVE cities, site-native aesthetic ── */}
            {miceDests.length > 0 && (
              <div className="mice-section">
                <ScrollReveal>
                  <div className="mice-section-header">
                    <div className="mice-section-accent" />
                    <div>
                      <h2 className="mice-section-title">商务出行</h2>
                      <p className="mice-section-sub">
                        会议、奖励旅游与活动策划 · {miceDests.length} 个目的地
                        <a href={EUMICE_URL} target="_blank" rel="noopener noreferrer" className="mice-section-eumice-link">EuMICE ↗</a>
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="mice-cards">
                  {miceDests.map((dest, i) => (
                    <ScrollReveal key={dest.id} delay={i * 60}>
                      <article className="mice-card">
                        {/* Header row */}
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

                        {/* Pitch */}
                        {dest.pitch && (
                          <p className="mice-card-pitch">{dest.pitch}</p>
                        )}

                        {/* Tags row */}
                        <div className="mice-card-tags">
                          {(dest.event_type || []).map((t) => (
                            <span key={t} className="mice-tag mice-tag--active">{t}</span>
                          ))}
                          {(dest.themes || []).slice(0, 4).map((t) => (
                            <span key={t} className="mice-tag">{t}</span>
                          ))}
                        </div>

                        {/* Spec sheet — compact 2-line grid */}
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

                        {/* Content blocks */}
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
                  <div><h2 className="mice-section-title">商务出行</h2><p className="mice-section-sub">加载目的地数据…</p></div>
                </div>
              </div>
            )}

            <div className="explore-cities">
              {countryCities.map((city) => (
                <ScrollReveal key={city.id}>
                  <div className="explore-city-block">
                    <h3 className="explore-city-name">{city.name}<span className="explore-city-count">{city.attractions.length} spots</span></h3>
                    <div className="explore-attraction-grid stagger-children">
                      {city.attractions.map((a, i) => (
                        <ScrollReveal key={a.id} delay={i * 60}>
                          <Link to={`/explore/attraction/${a.id}`} className="attraction-card-link">
                            <div className="attraction-card spotlight-card" onMouseMove={(e) => {
                              const el = e.currentTarget; const rect = el.getBoundingClientRect()
                              el.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
                              el.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
                            }}>
                              <div className="attraction-card-img" style={imgStyle(a.image, 800, a.name)} />
                              <div className="attraction-card-body">
                                <div className="attraction-card-meta">
                                  <span className="attraction-type-badge">{a.type === 'landmark' ? 'Landmark' : a.type === 'museum' ? 'Museum' : 'Nature'}</span>
                                  <span className="attraction-location">{city.name}, {selectedCountry.nameEn}</span>
                                </div>
                                <h3 className="attraction-name">{a.name}</h3>
                                <p className="attraction-desc">{a.description}</p>
                                {a.tips && (
                                  <div className="attraction-tip">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
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
