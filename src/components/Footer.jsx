import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-main">
          <Link to="/" className="footer-logo">M</Link>

          <nav className="footer-nav">
            <Link to="/journal">Journal</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/collection">Collection</Link>
            <Link to="/about">About</Link>
          </nav>

          <a href="mailto:47847796@qq.com" className="footer-email">
            47847796@qq.com
          </a>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {year}</span>
          <Link to="/hk" className="footer-hidden-dot">·</Link>
        </div>
      </div>
    </footer>
  )
}
