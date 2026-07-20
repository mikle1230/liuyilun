import ScrollReveal from '../../components/ScrollReveal'
import aboutConfig from '../../data/about-config.json'
import './Strengths.css'

const { strengths } = aboutConfig

const ICONS = {
  layers: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  expand: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M3 16v5h5" />
      <path d="M21 16v5h-5" />
      <path d="M12 7v10" />
      <path d="M7 12h10" />
    </svg>
  ),
  image: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  edit: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  archive: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v12z" />
      <path d="M12 2v4" />
      <path d="M9 11h6" />
      <path d="M12 14v-3" />
    </svg>
  ),
}

export default function Strengths() {
  return (
    <section className="strengths-section section">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">{strengths.label}</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">
            {strengths.title1}<span className="text-accent">{strengths.titleAccent}</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle">{strengths.subtitle}</p>
        </ScrollReveal>

        <div className="strengths-grid">
          {strengths.items.map((item, index) => (
            <ScrollReveal key={item.title} delay={200 + index * 80}>
              <div className="strength-card card-glow">
                <div className="strength-icon">{ICONS[item.icon]}</div>
                <h3 className="strength-title">{item.title}</h3>
                <p className="strength-description">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
