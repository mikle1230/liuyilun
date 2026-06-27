import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
  { label: '首页', path: '/' },
  { label: '博客', path: '/blog' },
  { label: 'AI', path: '/ai' },
  { label: '探索', path: '/explore' },
  { label: '关于', path: '/about' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

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
    </nav>
  )
}
