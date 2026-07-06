import './AboutPage.css'

export default function AboutPage() {
  return (
    <div className="about-page" style={{ paddingTop: 100 }}>
      <div className="container-narrow">
        <div className="section-label">About</div>
        <h1 className="section-title">关于这个地方</h1>

        <div className="about-letter">
          <p>这个空间是我在网络上的一个安静的角落。</p>
          <p>不为了展示什么，只是想把时间留下的痕迹整理一下。走过的路、读过的书、用过的工具、沉淀下来的思考。</p>
          <p>这里不是一个产品，也不会成为一个平台。它就是一个地方，一个属于我的地方。</p>
        </div>

        <div className="about-contact">
          <p>联系: <a href="mailto:47847796@qq.com">47847796@qq.com</a></p>
        </div>
      </div>
    </div>
  )
}
