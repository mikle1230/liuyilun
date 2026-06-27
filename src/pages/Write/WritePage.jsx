import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import './WritePage.css'

const MD_SYNTAX = [
  { syntax: '# H1', desc: '一级标题', example: '# 文章标题' },
  { syntax: '## H2', desc: '二级标题', example: '## 章节标题' },
  { syntax: '### H3', desc: '三级标题', example: '### 小节标题' },
  { syntax: '**文字**', desc: '加粗', example: '这是**重要**内容' },
  { syntax: '*文字*', desc: '斜体', example: '这是*斜体*文字' },
  { syntax: '[文字](url)', desc: '超链接', example: '[点击访问](https://example.com)' },
  { syntax: '![alt](url)', desc: '图片', example: '![风景](/image.jpg)' },
  { syntax: '- 项目', desc: '无序列表', example: '- 第一项\n- 第二项' },
  { syntax: '1. 项目', desc: '有序列表', example: '1. 第一步\n2. 第二步' },
  { syntax: '> 引用', desc: '引用块', example: '> 这是一段引用' },
  { syntax: '`代码`', desc: '行内代码', example: '使用 `console.log()`' },
  { syntax: '```\n代码\n```', desc: '代码块', example: '```python\nprint("hello")\n```' },
  { syntax: '---', desc: '分隔线', example: '---' },
  { syntax: '| 列1 | 列2 |', desc: '表格', example: '| 姓名 | 年龄 |\n| --- | --- |\n| 张三 | 25 |' },
]

export default function WritePage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState(null)
  const [showMdRef, setShowMdRef] = useState(false)
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
            {publishing ? '发送中…' : '发送'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`write-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className={`write-md-ref ${showMdRef ? 'open' : ''}`}>
        <div className="write-md-ref-grid">
          {MD_SYNTAX.map((item) => (
            <div
              key={item.syntax}
              className="write-md-ref-item"
              onClick={() => setContent((prev) => prev + item.example + '\n')}
              title="点击插入到编辑器"
            >
              <code className="write-md-ref-syntax">{item.syntax}</code>
              <span className="write-md-ref-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

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
        <button
          className={`write-md-toggle ${showMdRef ? 'active' : ''}`}
          onClick={() => setShowMdRef((v) => !v)}
        >
          {showMdRef ? '收起语法' : 'Markdown 语法'}
        </button>
      </div>
    </div>
  )
}
