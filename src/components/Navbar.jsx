import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import './Navbar.css'

const navLinks = [
  { label: '首页', path: '/' },
  { label: '博客', path: '/blog' },
  { label: '探索', path: '/explore' },
  { label: 'AI 导航', path: '/ai-nav' },
  { label: '壁纸', path: '/wallpapers' },
  { label: '关于', path: '/about' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleNavClick = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link className="navbar-logo" to="/" onClick={() => setMenuOpen(false)}>
          <span className="logo-mark">M</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(link.path)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '切换暗色模式' : '切换亮色模式'}
            title={theme === 'light' ? '暗色模式' : '亮色模式'}
          >
            {/* Sun icon (light mode) / Moon icon (dark mode) */}
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  )
}
