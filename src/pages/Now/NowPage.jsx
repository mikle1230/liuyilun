import './NowPage.css'

export default function NowPage() {
  return (
    <div className="now-page" style={{ paddingTop: 100 }}>
      <div className="container-narrow">
        <div className="section-label">Now</div>
        <h1 className="section-title">最近在做什么</h1>
        <p className="page-desc">当前的状态、关注和思考。</p>

        <div className="now-list">
          <div className="now-item">
            <div className="now-label">Working on</div>
            <div className="now-text">重新设计个人网站，转型为安静、长久的个人空间。</div>
          </div>
          <div className="now-item">
            <div className="now-label">Learning</div>
            <div className="now-text">数据库、AI 编程工具、更高效的开发工作流。</div>
          </div>
          <div className="now-item">
            <div className="now-label">Thinking about</div>
            <div className="now-text">在 AI 时代什么值得学、什么值得做、什么值得留下。</div>
          </div>
        </div>

        <p className="now-updated">Last updated: July 2026</p>
      </div>
    </div>
  )
}
