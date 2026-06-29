import { useState, useMemo } from 'react'
import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import categories from '../../data/ai-nav.json'
import './AINavPage.css'

export default function AINavPage() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let list = categories
    if (activeCategory) {
      list = list.filter((c) => c.id === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list
        .map((c) => ({
          ...c,
          items: c.items.filter(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              item.desc.toLowerCase().includes(q)
          ),
        }))
        .filter((c) => c.items.length > 0)
    }
    return list
  }, [activeCategory, searchQuery])

  return (
    <div className="ainav-page">
      <ModuleHero
        title="AI 导航"
        subtitle="精选 AI 工具合集 · 对话 · 绘画 · 编程 · 写作 · 视频 · 搜索 · 音频 · 开源"
      />

      <section className="section ainav-section">
        <div className="container">
          {/* Search bar */}
          <ScrollReveal>
            <div className="ainav-search">
              <svg className="ainav-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="ainav-search-input"
                placeholder="搜索 AI 工具…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </ScrollReveal>

          {/* Category tabs */}
          <ScrollReveal>
            <div className="ainav-categories">
              <button
                className={`ainav-cat-btn ${activeCategory === null ? 'active' : ''}`}
                onClick={() => setActiveCategory(null)}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`ainav-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.id ? null : cat.id)
                  }
                >
                  <span className="ainav-cat-icon">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Category groups */}
          {filtered.map((cat) => (
            <div key={cat.id} className="ainav-group">
              <ScrollReveal>
                <div className="ainav-group-header">
                  <span className="ainav-group-icon">{cat.icon}</span>
                  <div>
                    <h2 className="ainav-group-title">{cat.name}</h2>
                    <p className="ainav-group-desc">{cat.description}</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className="ainav-grid">
                {cat.items.map((item) => (
                  <ScrollReveal key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ainav-card"
                    >
                      <span className="ainav-card-name">{item.name}</span>
                      <span className="ainav-card-desc">{item.desc}</span>
                      <span className="ainav-card-arrow">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </span>
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="ainav-empty">未找到匹配的工具</p>
          )}

          {/* Footer note */}
          <p className="ainav-footer-note">
            数据参考自{' '}
            <a href="https://python4office.cn/ai-nav/" target="_blank" rel="noopener noreferrer">
              白开水 AI 导航站
            </a>
            {' · '}持续更新中
          </p>
        </div>
      </section>
    </div>
  )
}
