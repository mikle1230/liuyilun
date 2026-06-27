import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import './WritePage.css'

export default function WritePage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const textareaRef = useRef(null)

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return

    setPublishing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          title: title.trim(),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          content,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || '发布失败')
      }

      setMessage({ type: 'success', text: '✅ 发布成功！即将跳转…' })
      setTimeout(() => {
        navigate(`/blog/${data.slug}`)
      }, 1500)
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${err.message}` })
    } finally {
      setPublishing(false)
    }
  }

  // Cmd/Ctrl + Enter to publish
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!publishing && title.trim() && content.trim()) {
          handlePublish()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [publishing, title, content, password, tags])

  // Auto-focus textarea when authenticated
  useEffect(() => {
    if (authed && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [authed])

  if (!authed) {
    return (
      <div className="write-page">
        <div className="write-gate">
          <div className="write-gate-card">
            <h2>✏️ 发布文章</h2>
            <p className="write-gate-desc">输入发布密码继续</p>
            <form onSubmit={(e) => { e.preventDefault(); setAuthed(true) }}>
              <input
                className="write-gate-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="发布密码"
                autoFocus
              />
              <button className="write-gate-btn" type="submit">
                进入
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="write-page">
      <div className="write-header">
        <input
          className="write-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
        />
        <div className="write-header-right">
          <input
            className="write-tags-input"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="标签（逗号分隔）"
          />
          <button
            className="write-publish-btn"
            onClick={handlePublish}
            disabled={publishing || !title.trim() || !content.trim()}
          >
            {publishing ? '发布中…' : '发布'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`write-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="write-editor">
        <textarea
          ref={textareaRef}
          className="write-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在此粘贴或撰写 Markdown 内容…"
          spellCheck={false}
        />
        <div className="write-preview">
          <MarkdownRenderer content={content} />
        </div>
      </div>

      <div className="write-footer">
        <span className="write-hint">
          提示：支持 Markdown 语法 · Ctrl+Enter 快速发布
        </span>
      </div>
    </div>
  )
}
