import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import parseFrontmatter from '../../utils/frontmatter'
import './WritePage.css'

const DRAFT_KEY = 'write_draft'
const MD_SYNTAX = [
  { syntax: '# H1', desc: 'Heading1', example: '# Title' },
  { syntax: '## H2', desc: 'Heading2', example: '## Section' },
  { syntax: '### H3', desc: 'Heading3', example: '### Sub' },
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

const ARTICLES_GLOB = import.meta.glob('../../content/journal/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function listArticles() {
  return Object.entries(ARTICLES_GLOB).map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    const slug = path.split('/').pop().replace('.md', '').split('?')[0]
    const type = 'journal'
    return { slug, title: data.title || slug, type, path }
  }).sort((a, b) => a.title.localeCompare(b.title, 'zh'))
}

export default function WritePage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [articleType, setArticleType] = useState('journal')
  const [editingSlug, setEditingSlug] = useState(null)
  const [showEditList, setShowEditList] = useState(false)
  const [theme, setTheme] = useState('tech')
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [restoredDraft, setRestoredDraft] = useState(false)
  const draftTimer = useRef(null)
  const navigate = useNavigate()
  const textareaRef = useRef(null)

  const THEMES = [
    { key: 'tech', label: '科技', icon: '🌙', desc: '深色 · 金色强调' },
    { key: 'minimal', label: '极简', icon: '☀️', desc: '浅色 · 低对比度' },
    { key: 'warm', label: '温暖', icon: '🌅', desc: '暖色 · 柔和圆角' },
  ]

  const allArticles = useMemo(() => listArticles(), [])

  const editingArticle = editingSlug
    ? allArticles.find((a) => a.slug === editingSlug)
    : null

  const saveDraft = useCallback(() => {
    const draft = { title, tags, content, articleType, editingSlug, theme }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setDraftSaved(true)
  }, [title, tags, content, articleType, editingSlug, theme])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY)
    setDraftSaved(false)
    setRestoredDraft(false)
  }, [])

  // Auto-save draft with debounce
  useEffect(() => {
    if (!authed) return
    if (published) return

    if (draftTimer.current) clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      saveDraft()
    }, 1500)

    return () => { if (draftTimer.current) clearTimeout(draftTimer.current) }
  }, [title, tags, content, articleType, editingSlug, authed, published, saveDraft])

  // Clear "saved" indicator after 2s
  useEffect(() => {
    if (!draftSaved) return
    const t = setTimeout(() => setDraftSaved(false), 2000)
    return () => clearTimeout(t)
  }, [draftSaved])

  // Load draft on auth
  useEffect(() => {
    if (!authed) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw)
      if (draft.title) setTitle(draft.title)
      if (draft.tags) setTags(draft.tags)
      if (draft.content) setContent(draft.content)
      if (draft.articleType) setArticleType(draft.articleType)
      if (draft.editingSlug) setEditingSlug(draft.editingSlug)
      if (draft.theme) setTheme(draft.theme)
      if (draft.content || draft.title) setRestoredDraft(true)
    } catch { /* ignore corrupt draft */ }
  }, [authed])

  const resetForm = () => {
    setPublished(false)
    setTitle('')
    setTags('')
    setContent('')
    setPublishError(null)
    setEditingSlug(null)
    clearDraft()
  }

  const handleSelectArticle = (article) => {
    const raw = ARTICLES_GLOB[article.path]
    if (!raw) return
    const { data, content } = parseFrontmatter(raw)
    setTitle(data.title || '')
    setTags((data.tags || []).join(', '))
    setContent(content)
    setArticleType(article.type)
    setEditingSlug(article.slug)
    setShowEditList(false)
    setPublishError(null)
  }

  const handlePublish = async () => {
    setPublishing(true)
    setPublishError(null)

    try {
      if (import.meta.env.DEV) {
        await new Promise((r) => setTimeout(r, 600))
        setPublishing(false)
        setPublished(true)
        return
      }

      const body = {
        password,
        title: title.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        content,
        type: articleType,
      }

      // If editing, include the slug so API can reuse the filename
      if (editingSlug) {
        body.existingSlug = editingSlug
      }

      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || '发布失败')
      }

      setPublishing(false)
      setPublished(true)
      clearDraft()
    } catch (err) {
      setPublishing(false)
      setPublishError(err.message)
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

  if (published) {
    return (
      <div className={`write-page theme-${theme}`}>
        <div className="write-gate">
          <div className="write-gate-card">
            <h2>✅ Sent</h2>
            <p className="write-gate-desc">
              Pushed to GitHub. Vercel is deploying.<br />
              Live in about 30 seconds.
            </p>
            <div className="write-success-actions">
              <button className="write-gate-btn" onClick={() => navigate('/')}>
                Home
              </button>
              <button className="write-gate-btn write-gate-btn-secondary" onClick={resetForm}>
                New Post
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="write-page">
        <div className="write-gate">
          <div className="write-gate-card">
            <h2>✏️ Write</h2>
            <p className="write-gate-desc">Enter password to continue</p>
            <form onSubmit={async (e) => {
              e.preventDefault()
              if (!password.trim()) return

              if (import.meta.env.DEV) {
                setPublishError(null)
                setAuthed(true)
                return
              }

              try {
                const res = await fetch('/api/auth', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ password }),
                })
                if (res.ok) {
                  setPublishError(null)
                  setAuthed(true)
                } else {
                  setPublishError('Wrong password')
                }
              } catch {
                setPublishError('验证失败，请稍后重试')
              }
            }}>
              <input
                className="write-gate-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
              {publishError && <p className="write-gate-error">{publishError}</p>}
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
    <div className={`write-page theme-${theme}`}>
      <div className="write-header">
        <input
          className="write-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <div className="write-header-row">
          <div className="write-type-tabs">
            <button
              className={`write-type-tab ${articleType === 'blog' ? 'active' : ''}`}
              onClick={() => setArticleType('blog')}
            >
              📝 Journal
            </button>
            <button
              className={`write-type-tab ${articleType === 'ai' ? 'active' : ''}`}
              onClick={() => setArticleType('ai')}
            >
              🤖 AI
            </button>
          </div>
          <div className="write-theme-switcher">
            <button
              className="write-theme-btn"
              onClick={() => setShowThemePicker((v) => !v)}
              title="切换主题"
            >
              {THEMES.find((t) => t.key === theme).icon}
            </button>
            {showThemePicker && (
              <div className="write-theme-dropdown">
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    className={`write-theme-option ${t.key === theme ? 'active' : ''}`}
                    onClick={() => { setTheme(t.key); setShowThemePicker(false) }}
                  >
                    <span className="write-theme-option-icon">{t.icon}</span>
                    <div>
                      <div className="write-theme-option-label">{t.label}</div>
                      <div className="write-theme-option-desc">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {draftSaved && <span className="write-draft-indicator">💾 已保存</span>}
          </div>
          <input
            className="write-tags-input"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
          />
          <button
            className={`write-edit-btn ${showEditList ? 'active' : ''}`}
            onClick={() => setShowEditList((v) => !v)}
          >
            {editingSlug ? `Editing: ${editingArticle?.title || editingSlug}` : '📂 Edit Posts'}
          </button>
        </div>
      </div>

      {showEditList && (
        <div className="write-edit-list">
          <div className="write-edit-list-inner">
            {allArticles
              .filter((a) => a.type === articleType)
              .map((article) => (
                <button
                  key={`${article.type}-${article.slug}`}
                  className={`write-edit-item ${editingSlug === article.slug ? 'active' : ''}`}
                  onClick={() => handleSelectArticle(article)}
                >
                  <span className="write-edit-item-title">{article.title}</span>
                  <span className="write-edit-item-slug">{article.slug}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {publishError && (
        <div className="write-message error">
          ❌ {publishError}
        </div>
      )}

      {restoredDraft && (
        <div className="write-message draft">
          📝 草稿已恢复
        </div>
      )}

      <div className="write-editor">
        <textarea
          ref={textareaRef}
          className="write-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste Markdown here..."
          spellCheck={false}
        />
        <div className="write-preview">
          <MarkdownRenderer content={title ? `# ${title}\n\n${content}` : content} />
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
          {publishing ? 'Sending...' : editingSlug ? 'Update' : 'Send'}
        </button>
      </div>
    </div>
  )
}
