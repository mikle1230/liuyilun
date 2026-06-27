import ScrollReveal from '../../components/ScrollReveal'
import './Strengths.css'

const strengths = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: '全链条资源操盘',
    description: '深耕入境游、出境会奖、政企接待、差旅管理、场馆会展，具备境内外地接、渠道、供应商、政企、口岸全维度资源储备与整合能力。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M3 16v5h5" />
        <path d="M21 16v5h-5" />
        <path d="M12 7v10" />
        <path d="M7 12h10" />
      </svg>
    ),
    title: '渠道拓展与大客',
    description: '服务世界500强、金融、科技、文旅政企客户200+，擅长渠道开发、商务谈判、资源落地与长期合作，具备从0到1搭建渠道体系能力。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: '项目落地与管控',
    description: '精通旅游产品、会奖旅游、差旅系统、场馆资源、政府接待、跨境团组统筹，擅长成本、资源、流程、风险一体化管理，落地中大型项目150+。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: '多语言与口岸资源',
    description: '英语/俄语商务洽谈工作语言，熟悉海关、边防、口岸、境外接待流程，具备高端政要团、国际代表团、奥运代表团接待经验。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: '方案策划与整合',
    description: '擅长为复杂需求定制创新型解决方案，将商业目标转化为可执行策略路径，提供会议、展览、商务活动、酒店、交通、餐饮一体化解决方案。',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v12z" />
        <path d="M12 2v4" />
        <path d="M9 11h6" />
        <path d="M12 14v-3" />
      </svg>
    ),
    title: '头部企业历练',
    description: '先后任职中青旅、携程商旅、众信博睿、中关村会展、北辰会展等头部企业，横跨旅游、差旅、会奖、会展四大领域，视野开阔、经验深厚。',
  },
]

export default function Strengths() {
  return (
    <section className="strengths-section section">
      <div className="container">
        <ScrollReveal>
          <span className="section-label">个人优势</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="section-title">
            用能力<span className="text-accent">说话</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="section-subtitle">
            多年跨行业实战积累，构筑起多维度的核心竞争力
          </p>
        </ScrollReveal>

        <div className="strengths-grid">
        {strengths.map((item, index) => (
          <ScrollReveal key={item.title} delay={200 + index * 80}>
            <div className="strength-card card-glow">
              <div className="strength-icon">{item.icon}</div>
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
