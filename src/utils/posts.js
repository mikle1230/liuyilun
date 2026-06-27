/**
 * Shared post-loading utility for markdown-driven content.
 * Handles frontmatter parsing, slug extraction, and sorting.
 */
import parseFrontmatter from './frontmatter'

/**
 * Load posts from Vite glob modules with frontmatter parsing.
 *
 * @param {Record<string, string>} modules - Result of import.meta.glob('...', { eager: true, query: '?raw', import: 'default' })
 * @param {(post: importPost) => importPost} [transform] - Optional per-post transform to add/override fields
 * @returns {Array} Sorted posts (pinned first, then by date descending)
 */
export function loadPostsFromModules(modules, transform) {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      const slug = path.split('/').pop().replace('.md', '')
      const post = {
        slug,
        title: data.title || slug,
        date: data.date || '',
        tags: data.tags || [],
        excerpt:
          data.excerpt ||
          content
            .replace(/[#*[\]\n]/g, '')
            .trim()
            .slice(0, 120),
        pinned: data.pinned || false,
      }
      return transform ? transform(post, data) : post
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date) - new Date(a.date)
    })
}

/**
 * Extract unique tags from a list of posts.
 */
export function extractTags(posts) {
  const set = new Set()
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
  return [...set]
}
