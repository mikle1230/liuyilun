const features = [
  '实时全球互动地图',
  '深度目的地人文百科',
  '专属旅行笔记云同步',
]

export default function MiniProgramPromo() {
  return (
    <section className="miniprogram-section">
      <div className="container">
        <div className="miniprogram-card">
          <div className="miniprogram-qr">
            <div className="miniprogram-qr-ring" />
            <div className="miniprogram-qr-code">
              <div className="miniprogram-qr-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="15" y="15" width="3" height="3" />
                  <rect x="18" y="18" width="3" height="3" />
                </svg>
                <span>扫码体验</span>
              </div>
            </div>
            <p className="miniprogram-qr-hint">扫描二维码 · 微信中开启探索之旅</p>
          </div>

          <div className="miniprogram-info">
            <span className="miniprogram-label">Connect Digitally</span>
            <h2 className="miniprogram-title">探索世界微信小程序</h2>
            <p className="miniprogram-desc">
              将整个世界的灵感装进兜里。精选旅行指南、沉浸式航拍地图以及独家知识专栏。随时随地，开启您的全球视野。
            </p>
            <div className="miniprogram-features">
              {features.map((feat) => (
                <div key={feat} className="miniprogram-feature">
                  <svg className="miniprogram-feature-icon"
                    width="20" height="20" viewBox="0 0 20 20"
                    fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M6 10l3 3 5-5" />
                  </svg>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
