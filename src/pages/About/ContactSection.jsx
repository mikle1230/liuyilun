export default function ContactSection() {
  const socialLinks = [
    { name: '邮箱', icon: '✉️', value: '47847796@qq.com', href: 'mailto:47847796@qq.com' },
  ]

  return (
    <section id="contact" className="contact-section section">
      <div className="aurora-bg">
        <div className="aurora-gradient" />
        <div className="aurora-gradient" />
        <div className="aurora-gradient" />
      </div>
      <div className="contact-bg" />

      <div className="contact-content container">
        <div className="contact-main">
          <span className="section-label" style={{ opacity: 1, transform: 'none', filter: 'none' }}>联系我</span>
          <h2 className="contact-title">
            一起聊聊<br />
            下一个<span className="text-accent">可能性</span>
          </h2>
          <p className="contact-description">
            无论你是寻求合作的伙伴，还是想要探讨行业趋势的同仁，
            都欢迎随时联系。最好的机会，往往始于一次对话。
          </p>

          <div className="contact-channels">
            {socialLinks.map((link) => (
              <div key={link.name} className="contact-channel-card">
                <span className="channel-icon">{link.icon}</span>
                <div className="channel-info">
                  <span className="channel-name">{link.name}</span>
                  {link.href ? (
                    <a href={link.href} className="channel-value">{link.value}</a>
                  ) : (
                    <span className="channel-value">{link.value || link.note}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <a href="mailto:47847796@qq.com" className="contact-cta">
            发送邮件
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
