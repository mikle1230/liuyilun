import ScrollReveal from '../../components/ScrollReveal'
import './CareerTimeline.css'

const milestones = [
  {
    year: '2005',
    period: '起步期',
    title: '入境旅游 · 全流程接待',
    company: '中青旅 (CYTS)',
    description: '从入境旅游一线起步，掌握地接、签证、酒店、交通等全流程操作，建立对旅游产业链的完整认知。',
    highlights: ['入境全流程操作', '地接资源积累', '多口岸协调'],
    type: 'career',
  },
  {
    year: '2010',
    period: '成长期',
    title: '会奖旅游 · 差旅管理纵深',
    company: '携程商旅 / 众信博睿',
    description: '转向出境会奖旅游和企业差旅管理，横跨商旅、MICE、跨境执行三大领域，积累高端客户服务经验。',
    highlights: ['出境会奖旅游', '企业差旅管理', '跨境团组执行'],
    type: 'career',
  },
  {
    year: '2015',
    period: '突破期',
    title: '场馆会展 · 渠道体系搭建',
    company: '中关村会展 / 北辰会展',
    description: '负责国际论坛运营和场馆资源招商，从0到1搭建渠道合作体系，对接政企、媒体、文旅多方资源。',
    highlights: ['国际论坛运营', '场馆资源招商', '渠道体系搭建'],
    type: 'career',
  },
  {
    year: '至今',
    period: '整合期',
    title: '全链条资源操盘',
    company: '独立操盘手',
    description: '整合19年行业积累，为企业和机构提供差旅·会展·活动·渠道一体化解决方案，服务世界500强及政企客户200+。',
    highlights: ['全链条资源', '一站式方案', '全球化落地'],
    type: 'career',
  },
  {
    year: '标杆',
    title: '国家会议中心二期',
    subtitle: '场馆资源 · 渠道拓展',
    stat: '200+',
    statLabel: '签约客户',
    description: '负责国家会议中心二期场馆资源招商与渠道拓展，搭建企业、文旅、政府、会展公司合作渠道。',
    type: 'project',
  },
  {
    year: '标杆',
    title: '中关村论坛',
    subtitle: '国际论坛 · 全案运营',
    stat: '10,000+',
    statLabel: '参会规模',
    description: '负责中关村论坛市场化合作与文旅/科技/企业渠道拓展，从0到1搭建会员渠道与合作体系。',
    type: 'project',
  },
  {
    year: '标杆',
    title: '跨境会奖旅游项目',
    subtitle: '出境会奖 · 全球落地',
    stat: '50+',
    statLabel: '跨境项目',
    description: '统筹金融、医药、快消大客户会奖旅游，落地日本、巴厘岛、芬兰、南非等跨境会奖项目。',
    type: 'project',
  },
  {
    year: '标杆',
    title: '企业差旅管理',
    subtitle: '差旅管理 · 渠道拓展',
    stat: '25+',
    statLabel: '新增企业客户',
    description: '负责企业差旅资源渠道运营，对接航司、酒店、差旅平台、企业客户四方资源。',
    type: 'project',
  },
]

export default function CareerTimeline() {
  return (
    <section className="career-section">
      <ScrollReveal>
        <span className="section-label">职业历程与精选项目</span>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h2 className="section-title">19年行业深耕</h2>
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <p className="section-subtitle">
          从入境旅游一线到全链条资源操盘，每一步都是资源与经验的累积
        </p>
      </ScrollReveal>

      <div className="timeline">
        <div className="timeline-line" />
        {milestones.map((m, i) => (
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
