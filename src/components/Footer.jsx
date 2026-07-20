import { Link } from 'react-router-dom'
import siteConfig from '../data/site-config.json'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-main">
          <Link to="/" className="footer-logo">{siteConfig.author.initial}</Link>

          <nav className="footer-nav">
            {siteConfig.footer.nav.map((link) => (
              <Link key={link.path} to={link.path}>{link.label}</Link>
            ))}
          </nav>

          <a href={`mailto:${siteConfig.email}`} className="footer-email">
            {siteConfig.email}
          </a>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {year}</span>
        </div>
      </div>
    </footer>
  )
}
