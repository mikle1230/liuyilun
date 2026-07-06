import ModuleHero from '../../components/ModuleHero'
import ScrollReveal from '../../components/ScrollReveal'
import CareerTimeline from './CareerTimeline'
import Strengths from './Strengths'
import ContactSection from './ContactSection'
import './AboutPage.css'
import './ContactSection.css'

const aboutStats = [
  { value: '19+', label: '年行业经验' },
  { value: '200+', label: '服务客户' },
  { value: '150+', label: '中大型项目' },
  { value: '50+', label: '跨境会奖项目' },
]

const contactItems = [
  { label: '邮箱', value: '47847796@qq.com', href: 'mailto:47847796@qq.com' },
]

const industries = [
  '入境旅游', '会奖旅游', '差旅管理', '场馆会展', '渠道拓展', '政企接待', '大型活动'
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <ModuleHero
        label="我是"
        title="About"
        subtitle="19年旅游·会展·差旅行业深耕，全链条资源操盘手"
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
                  全链条资源的<span className="text-accent">操盘手</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="about-bio">
                  <p className="bio-paragraph">
                    深耕旅游、会展、差旅行业19年，从入境旅游到出境会奖，从差旅管理到场馆会展资源运营，
                    具备境内外地接、渠道、供应商、政企、口岸全维度资源储备与整合能力。
                  </p>
                  <p className="bio-paragraph">
                    曾任职中青旅、携程商旅、众信博睿、中关村会展、北辰会展等头部企业，
                    服务世界500强、金融、科技、文旅政企客户200+，落地中大型项目150+。
                    英语/俄语双语工作语言，具备高端政要团、国际代表团接待经验。
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="about-industries">
                  <span className="industries-label">涉猎领域</span>
                  <div className="industries-tags">
                    {industries.map((ind) => (
                      <span key={ind} className="industry-tag">{ind}</span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="about-stats">
                  {aboutStats.map((stat) => (
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

      {/* Career + Projects merged timeline */}
      <CareerTimeline />
      <div className="divider" />

      {/* Strengths */}
      <Strengths />
      <div className="divider" />

      {/* Contact */}
      <ContactSection />
    </div>
  )
}
