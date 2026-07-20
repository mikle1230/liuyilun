export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password, files } = req.body

  if (password !== process.env.WRITE_PASSWORD) {
    return res.status(401).json({ error: '密码错误' })
  }

  if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
    return res.status(400).json({ error: '没有要保存的文件' })
  }

  const token = process.env.GITHUB_TOKEN
  const owner = 'mikle1230'
  const repo = 'liuyilun'
  const results = []
  const errors = []

  for (const [filePath, content] of Object.entries(files)) {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }

      // Get current SHA if file exists
      let sha = null
      const getRes = await fetch(apiUrl, { headers })
      if (getRes.ok) {
        const existing = await getRes.json()
        sha = existing.sha
      }

      // Put file
      const body = {
        message: `admin: update ${filePath}`,
        content: Buffer.from(
          typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n',
          'utf-8',
        ).toString('base64'),
      }
      if (sha) body.sha = sha

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      })

      if (!putRes.ok) {
        const errData = await putRes.json().catch(() => ({}))
        throw new Error(`GitHub API ${putRes.status}: ${errData.message || 'unknown'}`)
      }

      results.push({ path: filePath, status: 'saved' })
    } catch (err) {
      errors.push({ path: filePath, error: err.message })
    }
  }

  return res.status(errors.length ? 207 : 200).json({
    success: errors.length === 0,
    saved: results,
    errors,
    message: errors.length
      ? `${results.length} saved, ${errors.length} failed`
      : `${results.length} files saved`,
  })
}
