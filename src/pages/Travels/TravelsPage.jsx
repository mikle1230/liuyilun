import { useEffect, useRef } from 'react'
import travelData from '../../data/europe-travel.json'
import './TravelsPage.css'

export default function TravelsPage() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (mapInstance.current || !mapRef.current || !window.L) return

    const L = window.L
    const map = L.map(mapRef.current, {
      center: [50, 10],
      zoom: 4,
      scrollWheelZoom: true,
      zoomControl: true,
    })

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4a6a4f'

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Add markers for each country's cities
    travelData.countries.forEach(country => {
      country.cities?.forEach(city => {
        if (city.lat && city.lng) {
          const marker = L.circleMarker([city.lat, city.lng], {
            radius: 6,
            fillColor: accentColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map)

          marker.bindPopup(`
            <strong>${city.name}</strong><br/>
            <span style="color:#888;font-size:12px">${country.name} · ${city.attractions?.length || 0} attractions</span>
          `)
        }
      })
    })

    mapInstance.current = map

    return () => { map.remove(); mapInstance.current = null }
  }, [])

  return (
    <div className="travels-page">
      {/* Full-width map */}
      <div className="travels-map-section">
        <div ref={mapRef} className="travels-map" />
      </div>

      <div className="container" style={{ paddingTop: 48 }}>
        <div className="section-label">Travels</div>
        <h1 className="section-title">欧洲旅行笔记</h1>
        <p className="page-desc">印象、感受、观察、瞬间。不是攻略，是记忆。</p>
      </div>

      {/* Country grid */}
      <div className="container" style={{ marginTop: 40 }}>
        <div className="country-grid">
          {travelData.countries.map(country => (
            <div key={country.id} className="country-group">
              <h3 className="country-name">{country.name}</h3>
              {country.cities?.slice(0, 3).map(city => (
                <div key={city.id} className="city-item">
                  <span className="city-name">{city.name}</span>
                  <span className="city-count">{city.attractions?.length || 0} 个景点</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Attractions */}
      <div className="container" style={{ marginTop: 48 }}>
        <div className="section-label">Highlights</div>
        <h2 className="section-title" style={{ marginBottom: 32 }}>精选景点</h2>

        {travelData.countries.slice(0, 4).map(country =>
          country.cities?.slice(0, 2).map(city =>
            city.attractions?.slice(0, 1).map(attraction => (
              <div key={attraction.id} className="attraction-card">
                <div className="attraction-image">
                  <span>{attraction.name}</span>
                </div>
                <div className="attraction-info">
                  <div className="attraction-place">{city.name} · {country.name}</div>
                  <h3 className="attraction-name">{attraction.name}</h3>
                  <p className="attraction-desc">{attraction.description?.slice(0, 150)}</p>
                  {attraction.type && (
                    <div className="attraction-tags">
                      <span className="attr-tag">{attraction.type}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  )
}
