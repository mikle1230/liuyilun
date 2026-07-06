import { useState } from 'react'
import categories from '../data/ai-nav.json'
import './JournalSidebar.css'

export default function JournalSidebar() {
  const [collapsed, setCollapsed] = useState(new Set())

  const allExpanded = collapsed.size === 0

  const toggleAll = () => {
    if (allExpanded) {
      setCollapsed(new Set(categories.map((c) => c.id)))
    } else {
      setCollapsed(new Set())
    }
  }

  const toggle = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  return (
    <aside className="journal-sidebar">
      <div className="journal-sidebar-header">
        <span className="journal-sidebar-title">AI 工具</span>
        <button className="js-toggle-all" onClick={toggleAll}>
          {allExpanded ? '收起全部' : '全部展开'}
        </button>
      </div>

      {categories.map((cat) => {
        const open = !collapsed.has(cat.id)
        return (
          <div key={cat.id} className={`js-cat ${open ? 'open' : ''}`}>
            <button
              className="js-cat-btn"
              onClick={() => toggle(cat.id)}
            >
              <span className="js-cat-icon">{cat.icon}</span>
              <span className="js-cat-name">{cat.name}</span>
              <span className="js-cat-arrow">{open ? '▾' : '▸'}</span>
            </button>

            {open && (
              <div className="js-items">
                {cat.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="js-item"
                  >
                    <span className="js-item-name">{item.name}</span>
                    {item.desc && <span className="js-item-desc">{item.desc}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}
