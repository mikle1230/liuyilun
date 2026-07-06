import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import './Navbar.css'

const navLinks = [
  { label: 'Journal', path: '/journal' },
  { label: 'Collections', path: '/collections' },
  { label: 'Travels', path: '/travels' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const isHome = location.pathname === '/'
  const isActive = (path) => location.pathname.startsWith(path)

  // Track scroll position on homepage to add solid bg after hero
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // On non-home pages, always show solid bg
  const showSolid = !isHome || scrolled

  return (
    <nav className={`navbar ${showSolid ? 'navbar-solid' : 'navbar-home'}`}>
      <div className="container navbar-inner">
        <Link className="site-title" to="/" onClick={() => setMenuOpen(false)}>
          This Place
        </Link>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => { navigate(link.path); setMenuOpen(false) }}
            >
              {link.label}
            </button>
          ))}
          <button className="theme-toggle-mobile" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}
