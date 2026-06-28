import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ScrollReveal from '../../components/ScrollReveal'
import travelData from '../../data/europe-travel.json'
import MiniProgramPromo from './MiniProgramPromo'
import { imgStyle } from '../../utils/images'
import './ExplorePage.css'

/* global L, topojson */

const countries = travelData.countries
const countryById = Object.fromEntries(countries.map((c) => [c.id, c]))

const countryAttractionCount = Object.fromEntries(
  countries.map((c) => [c.id, c.cities.reduce((s, c2) => s + c2.attractions.length, 0)])
)

const allCities = countries.flatMap((c) =>
  c.cities.map((city) => ({
    id: city.id, name: city.name, lat: city.lat, lng: city.lng,
    countryId: c.id, countryName: c.name,
  }))
)

const cityAttractionCount = Object.fromEntries(
  countries.flatMap((c) =>
    c.cities.map((city) => [city.id, city.attractions.length])
  )
)

const allAttractions = countries.flatMap((c) =>
  c.cities.flatMap((city) =>
    city.attractions.map((a) => ({
      ...a,
      cityName: city.name, countryName: c.name,
      countryNameEn: c.nameEn, countryId: c.id,
    }))
  )
)

const ATTRACTION_OFFSETS = [
  { lat: 0.025, lng: 0 },
  { lat: -0.02, lng: 0.022 },
  { lat: 0.012, lng: -0.025 },
  { lat: -0.018, lng: -0.015 },
  { lat: 0.022, lng: 0.018 },
  { lat: -0.025, lng: 0.012 },
]

const attractionsWithCoords = countries.flatMap((c) =>
  c.cities.flatMap((city) =>
    city.attractions.map((a, idx) => {
      const offset = ATTRACTION_OFFSETS[idx % ATTRACTION_OFFSETS.length]
      return {
        ...a,
        cityName: city.name,
        cityId: city.id,
        countryId: c.id,
        countryName: c.name,
        countryNameEn: c.nameEn,
        lat: city.lat + offset.lat,
        lng: city.lng + offset.lng,
      }
    })
  )
)

function getAttractionsForCity(cityId) {
  return attractionsWithCoords.filter((a) => a.cityId === cityId)
}

/* ─── Icons ─── */

const goldDotIcon = L.divIcon({
  className: '',
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><circle cx="7" cy="7" r="6" fill="#c9a96e" stroke="#121214" stroke-width="1.5"/></svg>',
  iconSize: [14, 14], iconAnchor: [7, 7],
})

const blueDotIcon = L.divIcon({
  className: '',
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><circle cx="7" cy="7" r="6" fill="#38bdf8" stroke="#121214" stroke-width="1.5"/></svg>',
  iconSize: [14, 14], iconAnchor: [7, 7],
})

/* ─── Tile ─── */

const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CARTO'

const countryNames = {
  'united-kingdom': 'United Kingdom', 'france': 'France', 'germany': 'Germany',
  'italy': 'Italy', 'spain': 'Spain', 'portugal': 'Portugal',
  'netherlands': 'Netherlands', 'belgium': 'Belgium', 'switzerland': 'Switzerland',
  'austria': 'Austria', 'greece': 'Greece', 'sweden': 'Sweden', 'norway': 'Norway',
  'denmark': 'Denmark', 'ireland': 'Ireland', 'poland': 'Poland',
  'czech-republic': 'Czechia', 'hungary': 'Hungary', 'croatia': 'Croatia',
  'turkey': 'Turkey',
  'finland': 'Finland', 'estonia': 'Estonia', 'iceland': 'Iceland',
  'montenegro': 'Montenegro',
}

/* ─── Search index ─── */
const searchIndex = [
  // Countries
  ...countries.map((c) => ({
    type: 'country', id: c.id,
    label: c.name, sublabel: `${c.cities.length} 个城市`,
    lat: countryById[c.id]?.cities?.[0]?.lat ?? 50,
    lng: countryById[c.id]?.cities?.[0]?.lng ?? 10,
    keywords: `${c.name} ${c.nameEn}`,
  })),
  // Cities
  ...allCities.map((c) => ({
    type: 'city', id: c.id,
    label: c.name, sublabel: c.countryName,
    lat: c.lat, lng: c.lng, countryId: c.countryId,
    keywords: `${c.name} ${c.countryName}`,
  })),
  // Attractions
  ...allAttractions.map((a) => ({
    type: 'attraction', id: a.id,
    label: a.name, sublabel: `${a.cityName}, ${a.countryName}`,
    lat: a.lat ?? allCities.find((c) => c.id === a.cityId)?.lat ?? 50,
    lng: a.lng ?? allCities.find((c) => c.id === a.cityId)?.lng ?? 10,
    countryId: a.countryId, image: a.image,
    keywords: `${a.name} ${a.cityName} ${a.countryName}`,
  })),
]

/* ════════════════════════════════════════════════════════
   Component
   ════════════════════════════════════════════════════════ */

export default function ExplorePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeCountry, setActiveCountry] = useState(location.state?.focusCountry || null)
  const [activeCity, setActiveCity] = useState(location.state?.focusCity || null)

  // Clear incoming focus state after first render so refresh doesn't re-trigger
  useEffect(() => {
    if (location.state?.focusCity) {
      window.history.replaceState({}, '', '/explore')
    }
  }, [location.state?.focusCity])
  const [hoveredChip, setHoveredChip] = useState(null)
  const [geoReady, setGeoReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)

  // Floating popup
  const [popupData, setPopupData] = useState(null) // { attraction, x, y } | null
  const popupTimerRef = useRef(null)
  const popupRef = useRef(null)
  const mapWrapRef = useRef(null)

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const cityMarkersRef = useRef([])
  const attractionMarkersRef = useRef([])
  const geoLayerRef = useRef(null)

  const handleCountryClick = (id) => { setActiveCountry(id); setActiveCity(null) }
  const handleBackgroundClick = () => { setActiveCountry(null); setActiveCity(null) }

  // ── Show popup overlay ──
  const showPopup = useCallback((attraction, latlng) => {
    if (!mapRef.current || !mapWrapRef.current) return
    const point = mapRef.current.latLngToContainerPoint(latlng)
    const rect = mapWrapRef.current.getBoundingClientRect()
    setPopupData({
      attraction,
      x: rect.left + point.x,
      y: rect.top + point.y - 180, // popup above the dot
    })
  }, [])

  const hidePopup = useCallback(() => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current)
    popupTimerRef.current = setTimeout(() => {
      setPopupData(null)
      popupTimerRef.current = null
    }, 2000)
  }, [])

  const cancelHidePopup = useCallback(() => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current)
      popupTimerRef.current = null
    }
  }, [])

  // ── Init map ──

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [50, 10], zoom: 4, zoomControl: true,
      scrollWheelZoom: true, dragging: true,
      updateWhenIdle: false, keepBuffer: 3,
    })
    L.tileLayer(darkTileUrl, { attribution: tileAttribution }).addTo(map)
    mapRef.current = map

    // City markers
    const cityMakers = allCities.map((city) => {
      const count = cityAttractionCount[city.id] || 0
      const marker = L.marker([city.lat, city.lng], { icon: goldDotIcon }).addTo(map)
      marker.setOpacity(0)
      marker.bindTooltip(`${city.name} · ${count} 个景点`, {
        direction: 'top', offset: [0, -12], permanent: false,
        className: 'city-label-tooltip',
      })
      marker.on('click', (e) => { L.DomEvent.stopPropagation(e); setActiveCity(city.id) })
      return { marker, city }
    })
    cityMarkersRef.current = cityMakers

    // GeoJSON boundaries
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((world) => {
        const geojson = topojson.feature(world, world.objects.countries)
        const gl = L.geoJSON(geojson, {
          style: () => ({ color: 'rgba(244,244,245,0.08)', weight: 1, fillColor: 'transparent', fillOpacity: 0 }),
          onEachFeature: (f, layer) => {
            const mid = Object.entries(countryNames).find(([, n]) => n === f.properties?.name)?.[0]
            if (!mid) return
            layer.countryId = mid
            layer.on('mouseover', () => {
              if (map.getZoom() >= 9 || (activeCountry !== null && activeCountry !== mid)) return
              layer.setStyle({ color: '#c9a96e', weight: 2.5, fillColor: 'rgba(201,169,110,0.12)', fillOpacity: 1 })
              layer.bringToFront()
            })
            layer.on('mouseout', () => { if (activeCountry !== mid) gl.resetStyle(layer) })
            layer.on('click', (e) => { L.DomEvent.stopPropagation(e); handleCountryClick(mid) })
          },
        }).addTo(map)
        geoLayerRef.current = gl
        map.on('click', handleBackgroundClick)
        setGeoReady(true)
      })
      .catch(() => { map.on('click', handleBackgroundClick); setGeoReady(true) })

    return () => { map.remove(); mapRef.current = null }
  // Map init must only run once — deps like activeCountry are
  // intentionally excluded to avoid recreating the entire map.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── React to country/city changes ──

  useEffect(() => {
    if (!geoReady || !mapRef.current || !geoLayerRef.current) return
    const map = mapRef.current
    const geoLayer = geoLayerRef.current

    // Clear attraction markers
    attractionMarkersRef.current.forEach((m) => map.removeLayer(m))
    attractionMarkersRef.current = []
    setPopupData(null)

    geoLayer.eachLayer((l) => geoLayer.resetStyle(l))

    if (activeCountry) {
      cityMarkersRef.current.forEach(({ marker, city }) => {
        marker.setOpacity(city.countryId === activeCountry ? 1 : 0)
      })

      if (activeCity) {
        // Attraction markers
        const markers = getAttractionsForCity(activeCity).map((a) => {
          const m = L.marker([a.lat, a.lng], { icon: blueDotIcon }).addTo(map)

          m.on('mouseover', () => {
            cancelHidePopup()
            showPopup(a, L.latLng(a.lat, a.lng))
          })
          m.on('mouseout', hidePopup)

          m.on('click', (e) => {
            L.DomEvent.stopPropagation(e)
            navigate(`/explore/attraction/${a.id}`)
          })

          return m
        })
        attractionMarkersRef.current = markers

        const city = allCities.find((c) => c.id === activeCity)
        if (city) map.setView([city.lat, city.lng], 12, { animate: true })
      } else {
        let bounds = null
        geoLayer.eachLayer((l) => { if (l.countryId === activeCountry) bounds = l.getBounds() })
        if (bounds) {
          if (activeCountry === 'france') bounds = L.latLngBounds([41.3, -4.8], [51.1, 9.6])
          else if (activeCountry === 'sweden') bounds = L.latLngBounds([55.3, 11.1], [69.1, 24.2])
          else if (activeCountry === 'norway') bounds = L.latLngBounds([57.9, 4.5], [71.2, 31.2])
          else if (activeCountry === 'finland') bounds = L.latLngBounds([59.8, 20.6], [70.1, 31.6])
          else if (activeCountry === 'iceland') bounds = L.latLngBounds([63.3, -24.5], [66.6, -13.5])
          else if (activeCountry === 'estonia') bounds = L.latLngBounds([57.5, 23.5], [59.7, 28.2])
          else if (activeCountry === 'montenegro') bounds = L.latLngBounds([41.9, 18.4], [43.6, 20.4])
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
        }
      }

      geoLayer.eachLayer((l) => {
        if (l.countryId === activeCountry) {
          l.setStyle({ color: '#c9a96e', weight: 2.5, fillColor: 'rgba(201,169,110,0.1)', fillOpacity: 1 })
          l.bringToFront()
        }
      })
    } else {
      cityMarkersRef.current.forEach(({ marker }) => marker.setOpacity(0))
      map.setView([50, 10], 4)
    }
  }, [activeCountry, activeCity, geoReady, cancelHidePopup, hidePopup, navigate, showPopup])

  // ── Search logic ──
  const filteredSearch = searchQuery.trim()
    ? searchIndex.filter((item) =>
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : []

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSearchSelect = (item) => {
    setSearchQuery("")
    setSearchOpen(false)
    if (!mapRef.current) return
    if (item.type === "country") {
      setActiveCountry(item.id)
      setActiveCity(null)
    } else if (item.type === "city") {
      setActiveCountry(item.countryId)
      setActiveCity(item.id)
    } else if (item.type === "attraction") {
      setActiveCountry(item.countryId)
      const city = allAttractions.find((a) => a.id === item.id)
      const cityId = city ? (city.cityId || allCities.find((c) => c.name === city.cityName)?.id) : null
      if (cityId) setActiveCity(cityId)
    }
  }




  // ── Derived data ──

  const selectedCountry = activeCountry ? countryById[activeCountry] : null
  const selectedCity = activeCity ? allCities.find((c) => c.id === activeCity) : null

  const selectedAttractions = (() => {
    if (activeCity) {
      return allAttractions.filter((a) => {
        const city = allCities.find((c) => c.id === activeCity)
        return city && a.cityName === city.name && a.countryId === city.countryId
      })
    }
    if (activeCountry) {
      return allAttractions.filter((a) => a.countryId === activeCountry)
    }
    return []
  })()

  const countryCities = activeCountry
    ? countries.find((c) => c.id === activeCountry)?.cities || []
    : []

  return (
    <div className="explore-page">
      <section className="explore-map-section">
        <div className="container">
          <ScrollReveal>
            <span className="explore-hero-label">探索</span>
            <h1 className="explore-hero-title">你向往的世界</h1>
            <p className="explore-hero-desc">
              在地图上悬停查看国家边界，点击国家聚焦，再点城市查看景点详情。
            </p>
          </ScrollReveal>
        </div>

        <div className="explore-map-wrap" ref={mapWrapRef}>
          <div className="map-placeholder" />
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

n          {/* Search */}
          <div className="map-search" ref={searchRef}>
            <input
              className="map-search-input"
              type="text"
              placeholder="搜索国家、城市、景点..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
              onFocus={() => searchQuery.trim() && setSearchOpen(true)}
            />
            {searchOpen && filteredSearch.length > 0 && (
              <div className="map-search-results">
                {filteredSearch.map((item) => (
                  <div
                    key={item.type + "-" + item.id}
                    className="map-search-item"
                    onClick={() => handleSearchSelect(item)}
                  >
                    <span className="map-search-item-type">{item.type === "country" ? "🏳" : item.type === "city" ? "📍" : "⭐"}</span>
                    <div className="map-search-item-text">
                      <span className="map-search-item-label">{item.label}</span>
                      <span className="map-search-item-sublabel">{item.sublabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floating popup overlay — fixed position, above map */}
          {popupData && (
            <div
              className="map-popup-overlay"
              ref={popupRef}
              style={{ left: popupData.x, top: popupData.y }}
              onMouseEnter={cancelHidePopup}
              onMouseLeave={hidePopup}
              onClick={() => {
                cancelHidePopup()
                navigate(`/explore/attraction/${popupData.attraction.id}`)
              }}
            >
              <div className="map-popup-img" style={imgStyle(popupData.attraction.image, 300, popupData.attraction.name)} />
              <div className="map-popup-body">
                <span className="map-popup-type">
                  {popupData.attraction.type === 'landmark' ? '地标' : popupData.attraction.type === 'museum' ? '博物馆' : '自然'}
                </span>
                <div className="map-popup-name">{popupData.attraction.name}</div>
                <div className="map-popup-desc">{popupData.attraction.description}</div>
                <span className="map-popup-cta">查看详情 →</span>
              </div>
            </div>
          )}
        </div>

        <div className="explore-country-chips">
          <button className={`map-country-chip ${activeCountry === null ? 'active' : ''}`} onClick={handleBackgroundClick}>全部</button>
          {countries.map((c) => (
            <button key={c.id}
              className={`map-country-chip ${activeCountry === c.id ? 'active' : ''}`}
              onClick={() => handleCountryClick(c.id)}
              onMouseEnter={() => setHoveredChip(c.id)}
              onMouseLeave={() => setHoveredChip(null)}
            >
              {c.name}
              {hoveredChip === c.id && !activeCountry && (
                <span className="chip-tooltip">{countryAttractionCount[c.id]} 个景点</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="explore-attractions-section">
        <div className="container">
          {selectedCountry && !activeCity && (
            <ScrollReveal>
              <div className="explore-country-header">
                <h2 className="explore-country-name">{selectedCountry.name}<span className="explore-country-en"> / {selectedCountry.nameEn}</span></h2>
                <p className="explore-country-desc">{selectedCountry.description}</p>
              </div>
            </ScrollReveal>
          )}

          {activeCountry && !activeCity && (
            <ScrollReveal>
              <div className="city-subnav">
                <span className="city-subnav-label">选择城市：</span>
                <div className="city-subnav-chips">
                  {countryCities.map((city) => (
                    <button key={city.id} className={`city-chip ${activeCity === city.id ? 'active' : ''}`} onClick={() => setActiveCity(city.id)}>{city.name}</button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {selectedCity && (
            <ScrollReveal>
              <div className="city-header">
                <button className="city-back-btn" onClick={() => setActiveCity(null)}>← 返回 {selectedCountry?.name}</button>
                <h3 className="city-header-name">{selectedCity.name}<span className="city-header-count">{selectedAttractions.length} 个景点</span></h3>
              </div>
            </ScrollReveal>
          )}

          <div className="explore-attraction-grid stagger-children">
            {selectedAttractions.map((a, i) => (
              <ScrollReveal key={a.id} delay={i * 60}>
                <Link to={`/explore/attraction/${a.id}`} className="attraction-card-link">
                  <div className="attraction-card">
                    <div className="attraction-card-img" style={imgStyle(a.image, 800, a.name)} />
                    <div className="attraction-card-body">
                      <div className="attraction-card-meta">
                        <span className="attraction-type-badge">{a.type === 'landmark' ? '地标' : a.type === 'museum' ? '博物馆' : '自然'}</span>
                        <span className="attraction-location">{a.cityName}, {a.countryNameEn}</span>
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
          {selectedAttractions.length === 0 && <p className="blog-empty">暂无景点数据</p>}
        </div>
      </section>

      <MiniProgramPromo />
    </div>
  )
}
