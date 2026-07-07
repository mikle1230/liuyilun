/**
 * Journal cover images — uses picsum.photos for reliable random photos.
 * Seed = tag name + post slug for consistent but varied results.
 */

const TAG_POOLS = {
  'AI': ['ai-technology', 'machine-learning', 'neural-network', 'robot-future'],
  '工具': ['productivity-tools', 'workspace-desk', 'minimal-workspace'],
  '投资': ['stock-market', 'financial-charts', 'investment-portfolio', 'trading-desk'],
  '旅行': ['travel-europe', 'mountain-landscape', 'coastal-view', 'city-skyline', 'road-trip'],
  '随笔': ['writing-journal', 'coffee-shop', 'quiet-morning'],
  '个人': ['portrait-thought', 'reading-nook', 'personal-space'],
  '行业': ['corporate-office', 'business-meeting', 'conference-room', 'team-work'],
  '阅读': ['library-books', 'reading-corner', 'book-stack'],
  '科技': ['circuit-board', 'server-room', 'digital-code', 'tech-abstract'],
  '数据库': ['data-center', 'server-racks', 'database-storage'],
  '金融': ['finance-chart', 'banking-hall', 'trading-floor'],
  '法律': ['law-books', 'courtroom', 'legal-documents'],
  '管理': ['management-team', 'strategy-board', 'leadership'],
  '半导体': ['microchip', 'semiconductor-wafer', 'circuit-design'],
}

const FALLBACKS = [
  'contemplative-writing', 'quiet-workspace', 'nature-reflection',
  'urban-thought', 'mountain-serenity', 'ocean-calm', 'forest-path',
]

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function getCoverImage(tags, explicitImage, seedSlug) {
  if (explicitImage) return explicitImage

  const seed = seedSlug ? hashCode(seedSlug) : Date.now()

  if (tags && tags.length) {
    for (const tag of tags) {
      const pool = TAG_POOLS[tag]
      if (pool) {
        const idx = (seed + hashCode(tag)) % pool.length
        return `https://picsum.photos/seed/${pool[idx]}-${idx}/800/500`
      }
    }
  }

  const fi = seed % FALLBACKS.length
  return `https://picsum.photos/seed/${FALLBACKS[fi]}-${fi}/800/500`
}
