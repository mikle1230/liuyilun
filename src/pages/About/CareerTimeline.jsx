import ScrollReveal from '../../components/ScrollReveal'
import aboutConfig from '../../data/about-config.json'
import './CareerTimeline.css'

const { timeline } = aboutConfig

export default function CareerTimeline() {
  return (
    <section className="career-section">
      <ScrollReveal>
        <span className="section-label">{timeline.label}</span>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h2 className="section-title">{timeline.title}</h2>
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <p className="section-subtitle">{timeline.subtitle}</p>
      </ScrollReveal>

      <div className="timeline">
        <div className="timeline-line" />
        {timeline.milestones.map((m, i) => (
          <ScrollReveal key={`${m.title}-${i}`} delay={200 + i * 80}>
            <div className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-dot">
                {m.type === 'career' ? (
                  <span className="timeline-year">{m.year}</span>
                ) : (
                  <span className="timeline-star">★</span>
                )}
              </div>
              <div className="timeline-card card-glow">
                {m.type === 'project' ? (
                  <>
                    <div className="timeline-project-header">
                      <span className="timeline-project-subtitle">{m.subtitle}</span>
                      <div className="timeline-project-stat">
                        <span className="tl-stat-value">{m.stat}</span>
                        <span className="tl-stat-label">{m.statLabel}</span>
                      </div>
                    </div>
                    <h3 className="timeline-title">{m.title}</h3>
                    <p className="timeline-desc">{m.description}</p>
                  </>
                ) : (
                  <>
                    <span className="timeline-period">{m.period}</span>
                    <h3 className="timeline-title">{m.title}</h3>
                    <span className="timeline-company">{m.company}</span>
                    <p className="timeline-desc">{m.description}</p>
                    <div className="timeline-highlights">
                      {m.highlights.map((h) => (
                        <span key={h} className="timeline-highlight">{h}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
