export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password, title, tags, content, type = 'blog', existingSlug } = req.body

  if (password !== process.env.WRITE_PASSWORD) {
    return res.status(401).json({ error: '密码错误' })
  }

  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' })
  }

  const date = new Date().toISOString().slice(0, 10)
  const tagStr = JSON.stringify(Array.isArray(tags) ? tags : [])
  const excerpt = content.replace(/[#*[\]\n]/g, '').trim().slice(0, 120)

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `date: "${date}"`,
    `tags: ${tagStr}`,
    `excerpt: "${excerpt}"`,
    '---',
    '',
    content,
  ].join('\n')

  // If editing existing article, reuse its filename
  const slug = generateSlug(title)
  const filename = existingSlug
    ? `${existingSlug}.md`
    : `${date}-${slug}.md`
  const directory = type === 'ai' ? 'ai' : 'blog'
  const path = `src/content/${directory}/${filename}`
  const token = process.env.GITHUB_TOKEN
  const owner = 'mikle1230'
  const repo = 'liuyilun'

  const body = {
    message: existingSlug ? `更新文章: ${title}` : `发布新文章: ${title}`,
    content: Buffer.from(frontmatter, 'utf-8').toString('base64'),
  }

  // For existing files, we need the SHA to update
  // First fetch the current file to get its SHA
  if (existingSlug) {
    const getRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (getRes.ok) {
      const existing = await getRes.json()
      body.sha = existing.sha
    }
  }

  const githubRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!githubRes.ok) {
    const err = await githubRes.json().catch(() => ({}))
    return res.status(500).json({
      error: `GitHub API 错误 (${githubRes.status})`,
      detail: err.message,
    })
  }

  const route = directory === 'ai' ? 'ai' : 'blog'
  return res.status(200).json({
    success: true,
    slug,
    url: `/${route}/${slug}`,
    filename,
  })
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s一-鿿-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'post'
}
