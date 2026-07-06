import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-links">
          <Link to="/journal">Journal</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/travels">Travels</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()}</span>
          <span>This is a place, not a product.</span>
        </div>
      </div>
    </footer>
  )
}
