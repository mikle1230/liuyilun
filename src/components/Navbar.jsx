import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import './Navbar.css'

const navLinks = [
  { label: 'Journal', path: '/journal' },
  { label: 'Explore', path: '/explore' },
  { label: 'Collection', path: '/collection' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const themeRef = useRef(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleClick = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setThemeOpen(false)
      }
    }
    if (themeOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [themeOpen])

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
          <div className="theme-dropdown" ref={themeRef}>
            <button
              className="theme-toggle"
              onClick={() => setThemeOpen(!themeOpen)}
              aria-label="切换主题"
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
            {themeOpen && (
              <div className="theme-dropdown-menu">
                <button
                  className={`theme-dropdown-item ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => { toggleTheme(); setThemeOpen(false) }}
                >
                  ☀️ 浅色
                </button>
                <button
                  className={`theme-dropdown-item ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => { toggleTheme(); setThemeOpen(false) }}
                >
                  🌙 深色
                </button>
              </div>
            )}
          </div>

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
