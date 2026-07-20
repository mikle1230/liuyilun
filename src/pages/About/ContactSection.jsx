import aboutConfig from '../../data/about-config.json'

const { contact } = aboutConfig

export default function ContactSection() {
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
          <span className="section-label" style={{ opacity: 1, transform: 'none', filter: 'none' }}>{contact.label}</span>
          <h2 className="contact-title">
            {contact.title1}<br />
            {contact.title2}<span className="text-accent">{contact.titleAccent}</span>
          </h2>
          <p className="contact-description">{contact.description}</p>

          <div className="contact-channels">
            {contact.links.map((link) => (
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

          <a href={`mailto:${contact.links[0].value}`} className="contact-cta">
            {contact.ctaText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
