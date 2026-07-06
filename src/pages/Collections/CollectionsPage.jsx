import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import wallpapersData from '../../data/wallpapers.json'
import aiNavData from '../../data/ai-nav.json'
import { getThumbnailUrl, getFullDownloadUrl, getDownloadUrl } from '../../utils/wallpapers'
import './CollectionsPage.css'

export default function CollectionsPage() {
  const wallpaperItems = useMemo(() => wallpapersData.items.filter(w => w.enabled !== false), [])
  const config = wallpapersData.config

  // Display count state
  const [showCount, setShowCount] = useState(config.displayCount || 6)
  const visibleWallpapers = useMemo(() => {
    const shuffled = [...wallpaperItems].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, showCount)
  }, [wallpaperItems, showCount])

  // Custom size tool state
  const [customMode, setCustomMode] = useState(false)
  const [customW, setCustomW] = useState(config.fullWidth || 2160)
  const [customH, setCustomH] = useState(config.fullHeight || 4800)
  const [selectedWallpaper, setSelectedWallpaper] = useState(null)
  const perPage = config.displayPerPage || 12

  const getDownloadLink = (w) => {
    if (customMode && selectedWallpaper?.id === w.id) {
      return getDownloadUrl(w, customW, customH)
    }
    return getFullDownloadUrl(w)
  }

  const handleWallpaperClick = (w, e) => {
    if (!customMode) return // normal click = open default download
    e.preventDefault()
    setSelectedWallpaper(w)
  }

  return (
    <div className="collections-page" style={{ paddingTop: 100 }}>
      <div className="container-narrow">
        <div className="section-label">Collections</div>
        <h1 className="section-title">收藏与索引</h1>
        <p className="page-desc">有用之物与无用之美，汇集于此。</p>
      </div>

      <div className="container" style={{ marginTop: 48 }}>
        {/* AI Tools */}
        <section className="section">
          <h2 className="coll-section-title">AI Tools</h2>
          <p className="coll-section-desc">日常使用的 AI 工具与参考。</p>
          <div className="coll-grid coll-grid-wide">
            {aiNavData.map(cat => (
              <div key={cat.id} className="coll-card">
                <h3 className="coll-card-title"><span className="coll-icon">{cat.icon}</span> {cat.name}</h3>
                <div className="coll-card-items">
                  {cat.items.map(item => (
                    <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="coll-item">
                      <span className="coll-name">{item.name}</span>
                      <span className="coll-desc">{item.desc}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery with Custom Size Tool */}
        <section className="section">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <h2 className="coll-section-title">Gallery</h2>
              <p className="coll-section-desc">收集的风景与光影瞬间。点击可下载。</p>
            </div>
            <button
              className={`wp-custom-toggle ${customMode ? 'active' : ''}`}
              onClick={() => { setCustomMode(!customMode); setSelectedWallpaper(null) }}
            >
              {customMode ? '✓ 自定义尺寸' : '✎ 自定义尺寸'}
            </button>
          </div>

          {/* Custom size controls */}
          {customMode && (
            <div className="wp-custom-bar">
              <div className="wp-custom-inputs">
                <label>宽</label>
                <input
                  type="number" value={customW} min={100} max={10000}
                  onChange={e => setCustomW(Number(e.target.value))}
                />
                <span className="wp-custom-x">×</span>
                <label>高</label>
                <input
                  type="number" value={customH} min={100} max={10000}
                  onChange={e => setCustomH(Number(e.target.value))}
                />
                <span className="wp-custom-hint">px</span>
              </div>
              {selectedWallpaper && (
                <a
                  href={getDownloadUrl(selectedWallpaper, customW, customH)}
                  target="_blank" rel="noopener noreferrer"
                  className="wp-custom-dl-btn"
                >
                  下载 {selectedWallpaper.title} ({customW}×{customH})
                </a>
              )}
              {!selectedWallpaper && (
                <span className="wp-custom-hint">点击上方一张壁纸选择</span>
              )}
            </div>
          )}

          <div className="gallery-grid">
            {visibleWallpapers.map(w => (
              <a
                key={w.id}
                href={getDownloadLink(w)}
                target="_blank" rel="noopener noreferrer"
                className={`gallery-card ${selectedWallpaper?.id === w.id ? 'gallery-card-selected' : ''}`}
                title={customMode ? '点击选择这张壁纸' : '点击下载原图'}
                onClick={(e) => handleWallpaperClick(w, e)}
              >
                <img src={getThumbnailUrl(w)} alt={w.title} loading="lazy" />
                <div className="gallery-info">
                  <span>{w.title}</span>
                  {customMode && selectedWallpaper?.id === w.id ? (
                    <span className="gallery-dl">已选 {customW}×{customH}</span>
                  ) : (
                    <span className="gallery-dl">下载 {config.fullWidth}×{config.fullHeight}</span>
                  )}
                </div>
              </a>
            ))}
          </div>

          {visibleWallpapers.length < wallpaperItems.length && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button className="wp-load-more" onClick={() => setShowCount(prev => prev + perPage)}>
                显示更多（{visibleWallpapers.length}/{wallpaperItems.length}）
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
