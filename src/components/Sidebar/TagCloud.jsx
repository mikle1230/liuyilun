export default function TagCloud({ tags = [], activeTag, onTagClick }) {
  if (!tags.length) return null

  return (
    <aside className="sidebar-card">
      <h4 className="sb-card-title">灵感标签</h4>
      <div className="sb-tag-cloud">
        <button
          className={`sb-tag ${activeTag === null ? 'sb-tag-active' : ''}`}
          onClick={() => onTagClick(null)}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            className={`sb-tag ${activeTag === tag ? 'sb-tag-active' : ''}`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </aside>
  )
}
