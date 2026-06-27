import './ModuleHero.css'

export default function ModuleHero({ title, subtitle }) {
  return (
    <section className="module-hero-section">
      <div className="module-hero-bg">
        <div className="aurora-bg">
          <div className="aurora-gradient" />
          <div className="aurora-gradient" />
          <div className="aurora-gradient" />
        </div>
      </div>
      <div className="container module-hero-inner">
        <h1 className="module-hero-title">{title}</h1>
        {subtitle && <p className="module-hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  )
}
