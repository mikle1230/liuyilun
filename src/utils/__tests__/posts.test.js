import { describe, it, expect } from 'vitest'
import { loadPostsFromModules, extractTags } from '../posts'

function makeModule(content, path = '/blog/test.md') {
  return { [path]: content }
}

describe('loadPostsFromModules', () => {
  it('loads posts with correct slug, title, date', () => {
    const modules = makeModule(`---
title: "Test Post"
date: "2026-06-27"
tags: ["tag1"]
---

Content here`, '/blog/test-post.md')

    const posts = loadPostsFromModules(modules)
    expect(posts).toHaveLength(1)
    expect(posts[0].slug).toBe('test-post')
    expect(posts[0].title).toBe('Test Post')
    expect(posts[0].date).toBe('2026-06-27')
    expect(posts[0].tags).toEqual(['tag1'])
  })

  it('detects section from path: /blog/ → tech', () => {
    const modules = makeModule('---\ntitle: "B"\n---\nContent', '/blog/hello.md')
    const posts = loadPostsFromModules(modules)
    expect(posts[0].section).toBe('tech')
  })

  it('detects section from path: /ai/ → ai', () => {
    const modules = makeModule('---\ntitle: "A"\n---\nContent', '/content/ai/test.md')
    const posts = loadPostsFromModules(modules)
    expect(posts[0].section).toBe('ai')
  })

  it('sorts pinned posts first, then by date descending', () => {
    const modules = {
      '/blog/a.md': '---\ntitle: "A"\ndate: "2026-06-27"\npinned: true\n---\nA',
      '/blog/b.md': '---\ntitle: "B"\ndate: "2026-06-28"\n---\nB',
      '/blog/c.md': '---\ntitle: "C"\ndate: "2026-06-26"\n---\nC',
    }

    const posts = loadPostsFromModules(modules)
    expect(posts[0].title).toBe('A')  // pinned
    expect(posts[1].title).toBe('B')  // newest unpinned
    expect(posts[2].title).toBe('C')  // oldest
  })

  it('returns excerpt from frontmatter or fallback from content', () => {
    const withExcerpt = makeModule(`---
title: "With"
excerpt: "Custom excerpt"
---

Body text`, '/blog/with.md')

    const without = makeModule(`---
title: "Without"
---

This is some longer body text that should be used as fallback excerpt.`, '/blog/without.md')

    const posts = [...loadPostsFromModules(withExcerpt), ...loadPostsFromModules(without)]
    expect(posts.find(p => p.title === 'With').excerpt).toBe('Custom excerpt')
    expect(posts.find(p => p.title === 'Without').excerpt).toContain('longer body text')
  })

  it('applies custom transform when provided', () => {
    const modules = makeModule('---\ntitle: "X"\n---\n', '/blog/x.md')
    const posts = loadPostsFromModules(modules, (post, data) => ({
      ...post,
      customField: data.title + '!',
    }))
    expect(posts[0].customField).toBe('X!')
  })
})

describe('extractTags', () => {
  it('returns unique sorted tags', () => {
    const posts = [
      { tags: ['c', 'a'] },
      { tags: ['b', 'a'] },
      { tags: ['c'] },
    ]
    expect(extractTags(posts)).toEqual(['a', 'b', 'c'])
  })

  it('returns empty array for posts with no tags', () => {
    expect(extractTags([{ tags: [] }, { tags: [] }])).toEqual([])
  })
})
