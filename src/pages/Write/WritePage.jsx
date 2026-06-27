import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import './WritePage.css'

const MD_SYNTAX = [
  { syntax: '# H1', desc: '标题1', example: '# 文章标题' },
  { syntax: '## H2', desc: '标题2', example: '## 章节' },
  { syntax: '### H3', desc: '标题3', example: '### 小节' },
  { syntax: '**粗**', desc: '加粗', example: '**重要内容**' },
  { syntax: '*斜*', desc: '斜体', example: '*斜体文字*' },
  { syntax: '[文](url)', desc: '链接', example: '[点击](https://...)' },
  { syntax: '![alt]()', desc: '图片', example: '![风景](/img.jpg)' },
  { syntax: '- 项', desc: '无序列表', example: '- 第一项\n- 第二项' },
  { syntax: '1. 项', desc: '有序列表', example: '1. 第一步\n2. 第二步' },
  { syntax: '> 引', desc: '引用', example: '> 一段引用' },
  { syntax: '`代码`', desc: '行内代码', example: '使用 `code()`' },
  { syntax: '```', desc: '代码块', example: '```js\nconst x = 1\n```' },
  { syntax: '---', desc: '分隔线', example: '---' },
  { syntax: '\\|列\\|', desc: '表格', example: '|姓名|年龄|\n|--- |--- |\n|张三|25|' },
]

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
    setPublishing(true)
    setMessage(null)

    try {
      if (import.meta.env.DEV) {
        await new Promise((r) => setTimeout(r, 600))
        setPublishing(false)
        setMessage({ type: 'success', text: '✅ 本地模式：发布成功（模拟）' })
        setTimeout(() => setMessage(null), 2500)
        return
      }

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

      setPublishing(false)
      setMessage({ type: 'success', text: '✅ 发布成功！即将跳转…' })
      setTimeout(() => navigate(`/blog/${data.slug}`), 1500)
    } catch (err) {
      setPublishing(false)
      setMessage({ type: 'error', text: `❌ ${err.message}` })
    }
  }

  const insertMd = (example) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newContent = content.slice(0, start) + example + content.slice(end)
    setContent(newContent)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + example.length, start + example.length)
    })
  }

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
        <input
          className="write-tags-input"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="标签（逗号分隔）"
        />
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
        <div className="write-md-bar">
          <span className="write-md-bar-label">Markdown</span>
          <div className="write-md-bar-items">
            {MD_SYNTAX.map((item) => (
              <span
                key={item.syntax}
                className="write-md-chip"
                onClick={() => insertMd(item.example)}
                title={item.desc}
              >
                {item.syntax}
              </span>
            ))}
          </div>
        </div>
        <button
          className="write-publish-btn"
          onClick={handlePublish}
          disabled={publishing || !title.trim() || !content.trim()}
        >
          {publishing ? '发送中…' : '发送'}
        </button>
      </div>
    </div>
  )
}
