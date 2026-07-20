import { useState, useEffect, useRef, useCallback } from 'react'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import parseFrontmatter from '../../utils/frontmatter'
import { countries } from '../../data/countries'
import exploreConfig from '../../data/explore-config.json'
import attractionInfo from '../../data/attraction-info.json'
import homepageConfig from '../../data/homepage-config.json'
import aboutConfig from '../../data/about-config.json'
import siteConfig from '../../data/site-config.json'
import './AdminPage.css'

/* ════════════════════════════════════════════════════════════
   Registry
   ════════════════════════════════════════════════════════════ */

const REGISTRY = [
  { id: 'journal', category: 'Content', label: 'Journal', icon: '📝' },
  { id: 'countries', category: 'Explore', label: 'Countries', icon: '🌍' },
  { id: 'explore-config', category: 'Explore', label: 'Featured & Cities', icon: '⭐' },
  { id: 'attraction-info', category: 'Explore', label: 'Attraction Info', icon: 'ℹ️' },
  { id: 'homepage', category: 'Site', label: 'Homepage', icon: '🏠' },
  { id: 'about', category: 'Site', label: 'About', icon: '👤' },
  { id: 'site', category: 'Site', label: 'Site Settings', icon: '⚙️' },
]

/* ════════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════════ */

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

function jsonDiff(a, b) {
  return JSON.stringify(a) !== JSON.stringify(b)
}

/* ════════════════════════════════════════════════════════════
   Journal Editor (absorbed from /write)
   ════════════════════════════════════════════════════════════ */

const DRAFT_KEY = 'admin_journal_draft'
const ARTICLES_GLOB = import.meta.glob('../../../content/journal/*.md', {
  eager: true, query: '?raw', import: 'default',
})

function listArticles() {
  return Object.entries(ARTICLES_GLOB).map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    const slug = path.split('/').pop().replace('.md', '').split('?')[0]
    return { slug, title: data.title || slug, date: data.date, tags: data.tags || [] }
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
}

function JournalEditor() {
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState(null)
  const [editingSlug, setEditingSlug] = useState(null)
  const [showEditList, setShowEditList] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const draftTimer = useRef(null)
  const textareaRef = useRef(null)

  const articles = listArticles()

  // Draft auto-save
  useEffect(() => {
    if (!title && !content) return
    if (draftTimer.current) clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, tags, content, editingSlug }))
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 2000)
    }, 1500)
    return () => clearTimeout(draftTimer.current)
  }, [title, tags, content, editingSlug])

  const loadDraft = () => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (!saved) return
    try {
      const draft = JSON.parse(saved)
      if (draft.title || draft.content) {
        setTitle(draft.title || '')
        setTags(draft.tags || '')
        setContent(draft.content || '')
        if (draft.editingSlug) setEditingSlug(draft.editingSlug)
      }
    } catch { /* ignore */ }
  }

  const loadArticle = (slug) => {
    const path = Object.keys(ARTICLES_GLOB).find((p) => p.includes(`/${slug}.md`))
    if (!path) return
    const raw = ARTICLES_GLOB[path]
    const { data, content: body } = parseFrontmatter(raw)
    setTitle(data.title || '')
    setTags((data.tags || []).join(', '))
    setContent(body || '')
    setEditingSlug(slug)
    setShowEditList(false)
  }

  const reset = () => {
    setTitle(''); setTags(''); setContent(''); setEditingSlug(null)
    localStorage.removeItem(DRAFT_KEY)
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return
    setPublishing(true)
    setMessage(null)

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: sessionStorage.getItem('admin_pass'),
          title: title.trim(),
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          content,
          type: 'journal',
          existingSlug: editingSlug || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Error ${res.status}`)
      }

      setMessage({ type: 'success', text: editingSlug ? 'Updated! Vercel deploying...' : 'Published! Vercel deploying...' })
      reset()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="admin-editor journal-editor">
      <div className="admin-editor-header">
        <h2>Journal</h2>
        <div className="admin-editor-actions">
          <button className="admin-btn admin-btn-ghost" onClick={() => setShowEditList(!showEditList)}>
            {showEditList ? 'Cancel' : `Edit Posts (${articles.length})`}
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={loadDraft}>Restore Draft</button>
          <button className="admin-btn admin-btn-ghost" onClick={reset}>New</button>
        </div>
      </div>

      {draftSaved && <div className="admin-toast">Draft saved</div>}
      {message && <div className={`admin-toast admin-toast--${message.type}`}>{message.text}</div>}

      {showEditList && (
        <div className="admin-article-list">
          {articles.map((a) => (
            <button key={a.slug} className="admin-article-item" onClick={() => loadArticle(a.slug)}>
              <span className="admin-article-title">{a.title}</span>
              <span className="admin-article-date">{a.date}</span>
            </button>
          ))}
        </div>
      )}

      {editingSlug && <div className="admin-editing-badge">Editing: {editingSlug}</div>}

      <input
        className="admin-input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="admin-input"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="journal-editor-grid">
        <textarea
          ref={textareaRef}
          className="admin-textarea"
          placeholder="Write Markdown here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="journal-editor-preview">
          <span className="admin-label">Preview</span>
          <div className="admin-preview-box">
            {content ? <MarkdownRenderer content={content} /> : <p className="admin-hint">Preview appears here</p>}
          </div>
        </div>
      </div>
      <button
        className="admin-btn admin-btn-primary"
        onClick={handlePublish}
        disabled={publishing || !title.trim() || !content.trim()}
      >
        {publishing ? 'Publishing...' : editingSlug ? 'Update' : 'Publish'}
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Country Editor
   ════════════════════════════════════════════════════════════ */

function CountryEditor({ data, onChange }) {
  const [selectedId, setSelectedId] = useState(data[0]?.id || '')
  const [expandedCities, setExpandedCities] = useState({})
  const countryData = data.find((c) => c.id === selectedId)

  const update = (c) => {
    onChange('countries', data.map((x) => (x.id === c.id ? c : x)))
  }

  const updateAttraction = (cityId, attrId, field, value) => {
    if (!countryData) return
    const updated = {
      ...countryData,
      cities: countryData.cities.map((city) =>
        city.id === cityId
          ? { ...city, attractions: city.attractions.map((a) => (a.id === attrId ? { ...a, [field]: value } : a)) }
          : city,
      ),
    }
    update(updated)
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>Countries</h2>
        <select className="admin-select" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {data.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.nameEn})</option>)}
        </select>
      </div>

      {countryData && (
        <div className="admin-form">
          <div className="admin-field">
            <label className="admin-label">Name (ZH)</label>
            <input className="admin-input" value={countryData.name} onChange={(e) => update({ ...countryData, name: e.target.value })} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Name (EN)</label>
            <input className="admin-input" value={countryData.nameEn} onChange={(e) => update({ ...countryData, nameEn: e.target.value })} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" rows="2" value={countryData.description || ''} onChange={(e) => update({ ...countryData, description: e.target.value })} />
          </div>

          <h3 className="admin-section-title">Cities</h3>
          {countryData.cities.map((city) => {
            const expanded = expandedCities[city.id]
            return (
              <div key={city.id} className="admin-city-block">
                <button
                  className="admin-city-toggle"
                  onClick={() => setExpandedCities({ ...expandedCities, [city.id]: !expanded })}
                >
                  <span className="admin-city-arrow">{expanded ? '▼' : '▶'}</span>
                  <span className="admin-city-name">{city.name} ({city.nameEn})</span>
                  <span className="admin-city-meta">{city.attractions.length} spots</span>
                </button>

                {expanded && city.attractions.map((a) => (
                  <div key={a.id} className="admin-attraction-card">
                    <div className="admin-field-row">
                      <div className="admin-field admin-field-sm">
                        <label className="admin-label">Name</label>
                        <input className="admin-input" value={a.name} onChange={(e) => updateAttraction(city.id, a.id, 'name', e.target.value)} />
                      </div>
                      <div className="admin-field admin-field-xs">
                        <label className="admin-label">Type</label>
                        <select className="admin-select" value={a.type} onChange={(e) => updateAttraction(city.id, a.id, 'type', e.target.value)}>
                          <option value="landmark">Landmark</option>
                          <option value="museum">Museum</option>
                          <option value="nature">Nature</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Description</label>
                      <textarea className="admin-textarea" rows="2" value={a.description || ''} onChange={(e) => updateAttraction(city.id, a.id, 'description', e.target.value)} />
                    </div>
                    <div className="admin-field-row">
                      <div className="admin-field admin-field-sm">
                        <label className="admin-label">Tips</label>
                        <input className="admin-input" value={a.tips || ''} onChange={(e) => updateAttraction(city.id, a.id, 'tips', e.target.value)} />
                      </div>
                      <div className="admin-field admin-field-sm">
                        <label className="admin-label">Image (Unsplash ID or URL)</label>
                        <input className="admin-input" value={a.image || ''} onChange={(e) => updateAttraction(city.id, a.id, 'image', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Explore Config Editor
   ════════════════════════════════════════════════════════════ */

function ConfigEditor({ data, onChange }) {
  const allIds = countries.flatMap((c) =>
    c.cities.flatMap((city) => city.attractions.map((a) => a.id)),
  )

  const allCityIds = countries.flatMap((c) =>
    c.cities.map((city) => city.id),
  )

  const toggleFeatured = (id) => {
    const featured = data.featured.includes(id)
      ? data.featured.filter((f) => f !== id)
      : [...data.featured, id]
    onChange('explore-config', { ...data, featured })
  }

  const toggleCity = (id) => {
    const cities = data.popularCities.includes(id)
      ? data.popularCities.filter((c) => c !== id)
      : [...data.popularCities, id]
    onChange('explore-config', { ...data, popularCities: cities })
  }

  return (
    <div className="admin-editor">
      <h2>Featured & Popular Cities</h2>

      <h3 className="admin-section-title">Featured Attractions ({data.featured.length})</h3>
      <div className="admin-check-grid">
        {allIds.map((id) => (
          <label key={id} className="admin-check-item">
            <input type="checkbox" checked={data.featured.includes(id)} onChange={() => toggleFeatured(id)} />
            <span>{id}</span>
          </label>
        ))}
      </div>

      <h3 className="admin-section-title">Popular Cities ({data.popularCities.length})</h3>
      <div className="admin-check-grid">
        {allCityIds.map((id) => {
          const city = countries.flatMap((c) => c.cities).find((c2) => c2.id === id)
          return (
            <label key={id} className="admin-check-item">
              <input type="checkbox" checked={data.popularCities.includes(id)} onChange={() => toggleCity(id)} />
              <span>{city ? `${city.name} (${id})` : id}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Attraction Info Editor
   ════════════════════════════════════════════════════════════ */

function AttractionInfoEditor({ data, onChange }) {
  const [selectedId, setSelectedId] = useState(Object.keys(data)[0] || '')
  const [newId, setNewId] = useState('')

  const update = (id, field, value) => {
    onChange('attraction-info', { ...data, [id]: { ...data[id], [field]: value } })
  }

  const addNew = () => {
    if (!newId.trim()) return
    onChange('attraction-info', { ...data, [newId.trim()]: { hours: '', ticketPrice: '', bestTime: '', transport: '', officialUrl: '' } })
    setSelectedId(newId.trim())
    setNewId('')
  }

  const info = data[selectedId]

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>Attraction Info</h2>
        <div className="admin-editor-actions">
          <select className="admin-select" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {Object.keys(data).map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-field-row">
        <input className="admin-input" placeholder="New attraction ID..." value={newId} onChange={(e) => setNewId(e.target.value)} />
        <button className="admin-btn admin-btn-ghost" onClick={addNew}>Add</button>
      </div>

      {info && (
        <div className="admin-form">
          {['hours', 'ticketPrice', 'bestTime', 'transport', 'officialUrl'].map((field) => (
            <div key={field} className="admin-field">
              <label className="admin-label">{field === 'ticketPrice' ? 'Ticket Price' : field === 'bestTime' ? 'Best Time' : field === 'officialUrl' ? 'Official URL' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input className="admin-input" value={info[field] || ''} onChange={(e) => update(selectedId, field, e.target.value)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Homepage Editor
   ════════════════════════════════════════════════════════════ */

function HomepageEditor({ data, onChange }) {
  const update = (path, value) => {
    const keys = path.split('.')
    const clone = deepClone(data)
    let obj = clone
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
    obj[keys[keys.length - 1]] = value
    onChange('homepage', clone)
  }

  const updateArrayItem = (path, index, value) => {
    const clone = deepClone(data)
    const keys = path.split('.')
    let obj = clone
    for (let i = 0; i < keys.length; i++) obj = obj[keys[i]]
    obj[index] = value
    onChange('homepage', clone)
  }

  return (
    <div className="admin-editor">
      <h2>Homepage Hero</h2>

      <div className="admin-form">
        <div className="admin-field">
          <label className="admin-label">Description Line 1</label>
          <input className="admin-input" value={data.hero.descriptionLine1} onChange={(e) => update('hero.descriptionLine1', e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Description Line 2</label>
          <input className="admin-input" value={data.hero.descriptionLine2} onChange={(e) => update('hero.descriptionLine2', e.target.value)} />
        </div>

        <h3 className="admin-section-title">Typewriter Words</h3>
        {data.hero.typewriterWords.map((word, i) => (
          <div key={i} className="admin-field">
            <label className="admin-label">Word {i + 1}</label>
            <input className="admin-input" value={word} onChange={(e) => updateArrayItem('hero.typewriterWords', i, e.target.value)} />
          </div>
        ))}

        <h3 className="admin-section-title">Section Labels</h3>
        {Object.entries(data.sections).map(([key, section]) => (
          <div key={key} className="admin-field-row">
            <div className="admin-field admin-field-sm">
              <label className="admin-label">{key} Label</label>
              <input className="admin-input" value={section.label} onChange={(e) => update(`sections.${key}.label`, e.target.value)} />
            </div>
            <div className="admin-field admin-field-sm">
              <label className="admin-label">{key} More Text</label>
              <input className="admin-input" value={section.moreText} onChange={(e) => update(`sections.${key}.moreText`, e.target.value)} />
            </div>
          </div>
        ))}

        <div className="admin-field">
          <label className="admin-label">Shuffle Button Text</label>
          <input className="admin-input" value={data.shuffleButtonText} onChange={(e) => update('shuffleButtonText', e.target.value)} />
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   About Editor
   ════════════════════════════════════════════════════════════ */

function AboutEditor({ data, onChange }) {
  const update = (path, value) => {
    const keys = path.split('.')
    const clone = deepClone(data)
    let obj = clone
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
    obj[keys[keys.length - 1]] = value
    onChange('about', clone)
  }

  return (
    <div className="admin-editor">
      <h2>About Page</h2>

      <h3 className="admin-section-title">Hero</h3>
      <div className="admin-field-row">
        <div className="admin-field admin-field-sm">
          <label className="admin-label">Label</label>
          <input className="admin-input" value={data.hero.label} onChange={(e) => update('hero.label', e.target.value)} />
        </div>
        <div className="admin-field admin-field-sm">
          <label className="admin-label">Title</label>
          <input className="admin-input" value={data.hero.title} onChange={(e) => update('hero.title', e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Subtitle</label>
          <input className="admin-input" value={data.hero.subtitle} onChange={(e) => update('hero.subtitle', e.target.value)} />
        </div>
      </div>

      <h3 className="admin-section-title">Bio</h3>
      <div className="admin-field-row">
        <div className="admin-field admin-field-sm">
          <label className="admin-label">Section Title (before accent)</label>
          <input className="admin-input" value={data.bio.sectionTitle1} onChange={(e) => update('bio.sectionTitle1', e.target.value)} />
        </div>
        <div className="admin-field admin-field-sm">
          <label className="admin-label">Accent Word</label>
          <input className="admin-input" value={data.bio.sectionTitleAccent} onChange={(e) => update('bio.sectionTitleAccent', e.target.value)} />
        </div>
      </div>
      <div className="admin-field">
        <label className="admin-label">Industries Label</label>
        <input className="admin-input" value={data.bio.industriesLabel} onChange={(e) => update('bio.industriesLabel', e.target.value)} />
      </div>

      <h3 className="admin-section-title">Paragraphs</h3>
      {data.bio.paragraphs.map((p, i) => (
        <div key={i} className="admin-field">
          <label className="admin-label">Paragraph {i + 1}</label>
          <textarea className="admin-textarea" rows="3" value={p} onChange={(e) => { const clone = deepClone(data); clone.bio.paragraphs[i] = e.target.value; onChange('about', clone) }} />
        </div>
      ))}

      <h3 className="admin-section-title">Stats</h3>
      {data.bio.stats.map((stat, i) => (
        <div key={i} className="admin-field-row">
          <div className="admin-field admin-field-xs">
            <label className="admin-label">Value</label>
            <input className="admin-input" value={stat.value} onChange={(e) => { const clone = deepClone(data); clone.bio.stats[i].value = e.target.value; onChange('about', clone) }} />
          </div>
          <div className="admin-field admin-field-xs">
            <label className="admin-label">Label</label>
            <input className="admin-input" value={stat.label} onChange={(e) => { const clone = deepClone(data); clone.bio.stats[i].label = e.target.value; onChange('about', clone) }} />
          </div>
        </div>
      ))}

      <h3 className="admin-section-title">Contact Section</h3>
      {['label', 'title1', 'title2', 'titleAccent', 'description', 'ctaText'].map((field) => (
        <div key={field} className="admin-field">
          <label className="admin-label">{field}</label>
          <input className="admin-input" value={data.contact[field]} onChange={(e) => update(`contact.${field}`, e.target.value)} />
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Site Settings Editor
   ════════════════════════════════════════════════════════════ */

function SiteEditor({ data, onChange }) {
  const update = (key, value) => onChange('site', { ...data, [key]: value })
  const updateNav = (index, field, value) => {
    const nav = [...data.nav]
    nav[index] = { ...nav[index], [field]: value }
    onChange('site', { ...data, nav })
  }

  return (
    <div className="admin-editor">
      <h2>Site Settings</h2>

      <div className="admin-form">
        {['name', 'description', 'domain', 'email'].map((field) => (
          <div key={field} className="admin-field">
            <label className="admin-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input className="admin-input" value={data[field]} onChange={(e) => update(field, e.target.value)} />
          </div>
        ))}

        <h3 className="admin-section-title">Navigation</h3>
        {data.nav.map((link, i) => (
          <div key={i} className="admin-field-row">
            <div className="admin-field admin-field-sm">
              <label className="admin-label">Label</label>
              <input className="admin-input" value={link.label} onChange={(e) => updateNav(i, 'label', e.target.value)} />
            </div>
            <div className="admin-field admin-field-sm">
              <label className="admin-label">Path</label>
              <input className="admin-input" value={link.path} onChange={(e) => updateNav(i, 'path', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Main Admin Component
   ════════════════════════════════════════════════════════════ */

const EDITORS = {
  journal: JournalEditor,
  countries: CountryEditor,
  'explore-config': ConfigEditor,
  'attraction-info': AttractionInfoEditor,
  homepage: HomepageEditor,
  about: AboutEditor,
  site: SiteEditor,
}

const INITIAL_DATA = {
  countries,
  'explore-config': exploreConfig,
  'attraction-info': attractionInfo,
  homepage: homepageConfig,
  about: aboutConfig,
  site: siteConfig,
}

const FILE_PATHS = {
  'countries': 'src/data/countries',
  'explore-config': 'src/data/explore-config.json',
  'attraction-info': 'src/data/attraction-info.json',
  'homepage': 'src/data/homepage-config.json',
  'about': 'src/data/about-config.json',
  'site': 'src/data/site-config.json',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(null)
  const [activeTab, setActiveTab] = useState('journal')
  const [data, setData] = useState(INITIAL_DATA)
  const [originalData] = useState(() => deepClone(INITIAL_DATA))
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)
  const [showReview, setShowReview] = useState(false)

  // Password gate
  const handleAuth = async (e) => {
    e.preventDefault()
    if (!password.trim()) return
    setAuthError(null)

    if (import.meta.env.DEV) {
      setAuthed(true)
      sessionStorage.setItem('admin_pass', password)
      return
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthed(true)
        sessionStorage.setItem('admin_pass', password)
      } else {
        setAuthError('Wrong password')
      }
    } catch {
      setAuthError('Network error')
    }
  }

  // Data change handler
  const handleChange = useCallback((key, newData) => {
    setData((prev) => ({ ...prev, [key]: newData }))
  }, [])

  // Get dirty files
  const getDirtyFiles = () => {
    const dirty = {}
    for (const [key, current] of Object.entries(data)) {
      if (key === 'countries') {
        // Compare each country individually
        current.forEach((country) => {
          const orig = originalData.countries.find((c) => c.id === country.id)
          if (orig && jsonDiff(orig, country)) {
            dirty[`src/data/countries/${country.id}.json`] = JSON.stringify(country, null, 2) + '\n'
          }
        })
      } else if (jsonDiff(originalData[key], current)) {
        const path = FILE_PATHS[key]
        if (path) {
          dirty[path] = JSON.stringify(current, null, 2) + '\n'
        }
      }
    }
    return dirty
  }

  // Save
  const handleSave = async () => {
    const dirty = getDirtyFiles()
    if (Object.keys(dirty).length === 0) {
      setSaveMessage({ type: 'info', text: 'No changes to save.' })
      return
    }

    setSaving(true)
    setSaveMessage(null)
    setShowReview(false)

    if (import.meta.env.DEV) {
      // Dev mode: log to console
      console.log('Would save:', Object.keys(dirty))
      console.log('Files:', dirty)
      await new Promise((r) => setTimeout(r, 600))
      setSaveMessage({ type: 'success', text: `[DEV] ${Object.keys(dirty).length} files would be saved. Check console.` })
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: sessionStorage.getItem('admin_pass'),
          files: dirty,
        }),
      })

      const result = await res.json().catch(() => ({}))
      if (result.success) {
        setSaveMessage({ type: 'success', text: result.message || 'Saved! Vercel is deploying...' })
      } else {
        setSaveMessage({ type: 'error', text: result.message || 'Some files failed to save.' })
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const dirtyFiles = getDirtyFiles()
  const dirtyCount = Object.keys(dirtyFiles).length

  // Password gate
  if (!authed) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-card">
          <h2>Admin</h2>
          <p className="admin-gate-desc">Enter password to manage site content</p>
          <form onSubmit={handleAuth}>
            <input
              className="admin-gate-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {authError && <p className="admin-gate-error">{authError}</p>}
            <button type="submit" className="admin-gate-btn" disabled={!password.trim()}>
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Group registry by category
  const categories = {}
  REGISTRY.forEach((item) => {
    if (!categories[item.category]) categories[item.category] = []
    categories[item.category].push(item)
  })

  const Editor = EDITORS[activeTab]
  const editorData = data[activeTab]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1 className="admin-sidebar-logo">Admin</h1>
        </div>
        <nav className="admin-sidebar-nav">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="admin-sidebar-group">
              <span className="admin-sidebar-cat">{category}</span>
              {items.map((item) => (
                <button
                  key={item.id}
                  className={`admin-sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="admin-sidebar-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          {saveMessage && (
            <div className={`admin-save-msg admin-save-msg--${saveMessage.type}`}>
              {saveMessage.text}
            </div>
          )}
          <button
            className="admin-btn admin-btn-outline"
            onClick={() => setShowReview(true)}
            disabled={dirtyCount === 0}
          >
            Review Changes ({dirtyCount})
          </button>
          <a href="/" className="admin-sidebar-link">← Back to site</a>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {Editor && <Editor data={editorData} onChange={handleChange} />}
      </main>

      {/* Review Modal */}
      {showReview && (
        <div className="admin-modal-overlay" onClick={() => setShowReview(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Review Changes</h2>
            <p className="admin-modal-desc">{dirtyCount} file{dirtyCount !== 1 ? 's' : ''} modified:</p>
            <ul className="admin-modal-list">
              {Object.keys(dirtyFiles).map((path) => (
                <li key={path}>{path}</li>
              ))}
            </ul>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowReview(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
