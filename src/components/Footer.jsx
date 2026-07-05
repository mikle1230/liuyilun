import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-accent-bar" />

        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              M<span className="footer-logo-dot" />
            </Link>
            <p className="footer-tagline">
              记录思考 · <em>收集知识</em> · 探索世界<br />
              一个人的知识枢纽
            </p>
          </div>

          {/* 内容 */}
          <div>
            <p className="footer-col-title">内容</p>
            <div className="footer-col-links">
              <Link to="/blog" className="footer-link">博客</Link>
              <Link to="/blog?section=ai" className="footer-link">AI 收集</Link>
            </div>
          </div>

          {/* 探索 */}
          <div>
            <p className="footer-col-title">探索</p>
            <div className="footer-col-links">
              <Link to="/explore" className="footer-link">探索世界</Link>
              <Link to="/about" className="footer-link">关于我</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="footer-col-title">联系</p>
            <div className="footer-contact-card">
              <div className="footer-contact-header">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
                <span>电子邮箱</span>
              </div>
              <a href="mailto:47847796@qq.com" className="footer-email">
                47847796@qq.com
              </a>

            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {year}</span>
          <span className="footer-badge">
            <span className="footer-badge-dot" />
            记录思考 · 收集知识 · 探索世界
          </span>
          <Link to="/hk" className="footer-hidden-entry" aria-hidden="true" tabIndex={-1}>·</Link>
        </div>
      </div>
    </footer>
  )
}
