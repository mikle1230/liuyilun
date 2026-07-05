import { useState, useRef, useEffect } from 'react'
import './HKGate.css'

export default function HKGate() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'hk2026') {
      setUnlocked(true)
    } else {
      setShake(true)
      setPassword('')
      inputRef.current?.focus()
      setTimeout(() => setShake(false), 500)
    }
  }

  if (unlocked) {
    return (
      <div className="hk-gate">
        <div className="hk-unlocked">
          <div className="hk-icon">🔑</div>
          <h2 className="hk-title">香港之旅</h2>
          <p className="hk-subtitle">Hong Kong Trip</p>
          <div className="hk-links">
            <a
              href="/hk/香港行程.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hk-link-card hk-link-itinerary"
            >
              <span className="hk-link-icon">🗺️</span>
              <span className="hk-link-label">香港行程</span>
              <span className="hk-link-arrow">→</span>
            </a>
            <a
              href="/hk/香港美食指南.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hk-link-card hk-link-food"
            >
              <span className="hk-link-icon">🍜</span>
              <span className="hk-link-label">香港美食指南</span>
              <span className="hk-link-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hk-gate">
      <div className={`hk-lock ${shake ? 'shake' : ''}`}>
        <div className="hk-lock-icon">🔒</div>
        <form onSubmit={handleSubmit} className="hk-form">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入密码"
            className="hk-input"
            autoComplete="off"
          />
          <button type="submit" className="hk-submit">
            进入
          </button>
        </form>
      </div>
    </div>
  )
}
