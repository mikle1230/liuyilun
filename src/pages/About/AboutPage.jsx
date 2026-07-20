import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import CareerTimeline from './CareerTimeline'
import Strengths from './Strengths'
import ContactSection from './ContactSection'
import aboutConfig from '../../data/about-config.json'
import './AboutPage.css'
import './ContactSection.css'

const { hero, bio, contact } = aboutConfig

const contactItems = [
  { label: '邮箱', value: contact.links[0].value, href: contact.links[0].href },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <ModuleHero
        label={hero.label}
        title={hero.title}
        subtitle={hero.subtitle}
      />

      {/* Bio */}
      <section className="section about-bio-section">
        <div className="container">
          <div className="about-grid">
            <ScrollReveal className="about-left">
              <div className="about-avatar-wrapper">
                <div className="about-avatar">
                  <span className="avatar-initials">M</span>
                </div>
                <div className="avatar-ring" />
              </div>
              <div className="about-contact-list">
                {contactItems.map((item) => (
                  <div key={item.label} className="contact-item">
                    <span className="contact-label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="contact-value">{item.value}</a>
                    ) : (
                      <span className="contact-value">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <div className="about-right">
              <ScrollReveal>
                <h2 className="section-title">
                  {bio.sectionTitle1}<span className="text-accent">{bio.sectionTitleAccent}</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="about-bio">
                  {bio.paragraphs.map((p, i) => (
                    <p key={i} className="bio-paragraph">{p}</p>
                  ))}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="about-industries">
                  <span className="industries-label">{bio.industriesLabel}</span>
                  <div className="industries-tags">
                    {bio.industries.map((ind) => (
                      <span key={ind} className="industry-tag">{ind}</span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="about-stats">
                  {bio.stats.map((stat) => (
                    <div key={stat.label} className="stat-item">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
        <div className="divider" />
      </section>

      <CareerTimeline />
      <div className="divider" />

      <Strengths />
      <div className="divider" />

      <ContactSection />
    </div>
  )
}
