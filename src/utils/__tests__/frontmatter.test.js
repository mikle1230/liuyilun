import { describe, it, expect } from 'vitest'
import parseFrontmatter from '../frontmatter'

describe('parseFrontmatter', () => {
  it('parses title, date, tags, excerpt from valid frontmatter', () => {
    const md = `---
title: "测试文章"
date: "2026-06-27"
tags: ["随笔", "个人"]
excerpt: "这是一段摘要"
pinned: true
---

## 正文内容

这里是文章正文。`

    const result = parseFrontmatter(md)
    expect(result.data.title).toBe('测试文章')
    expect(result.data.date).toBe('2026-06-27')
    expect(result.data.tags).toEqual(['随笔', '个人'])
    expect(result.data.excerpt).toBe('这是一段摘要')
    expect(result.data.pinned).toBe(true)
    expect(result.content).toContain('正文内容')
  })

  it('returns empty data and full content when no frontmatter', () => {
    const md = '# 只有标题\n\n没有 frontmatter 的文章。'
    const result = parseFrontmatter(md)
    expect(result.data).toEqual({})
    expect(result.content).toBe(md)
  })

  it('handles empty frontmatter (--- ---)', () => {
    const md = `---
---

正文内容`
    const result = parseFrontmatter(md)
    expect(result.data).toEqual({})
    expect(result.content).toContain('正文内容')
  })

  it('supports boolean values', () => {
    const md = `---
pinned: true
draft: false
---

content`
    const result = parseFrontmatter(md)
    expect(result.data.pinned).toBe(true)
    expect(result.data.draft).toBe(false)
  })

  it('supports numeric values', () => {
    const md = `---
count: 42
---

content`
    const result = parseFrontmatter(md)
    expect(result.data.count).toBe(42)
  })

  it('handles Chinese characters in title', () => {
    const md = `---
title: "给小白的 Claude Code 安装指南"
date: "2026-06-28"
---

安装步骤...`
    const result = parseFrontmatter(md)
    expect(result.data.title).toBe('给小白的 Claude Code 安装指南')
    expect(result.data.date).toBe('2026-06-28')
  })

  it('preserves markdown content after frontmatter', () => {
    const md = `---
title: "Test"
---

# Heading

**bold** text

- list item 1
- list item 2`
    const result = parseFrontmatter(md)
    expect(result.content).toContain('# Heading')
    expect(result.content).toContain('**bold**')
    expect(result.content).toContain('- list item 2')
  })
})
