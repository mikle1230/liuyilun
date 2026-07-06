/**
 * Default cover images for journal tags.
 * Falls back to the first image if tag is not mapped.
 */

const TAG_IMAGES = {
  'AI': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  '工具': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
  '投资': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  '旅行': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  '随笔': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
  '个人': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
  '行业': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  '阅读': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
  '科技': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  '数据库': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
  '金融': 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800&q=80',
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'

export function getCoverImage(tags, explicitImage) {
  if (explicitImage) return explicitImage
  if (!tags || !tags.length) return FALLBACK_IMAGE
  for (const tag of tags) {
    if (TAG_IMAGES[tag]) return TAG_IMAGES[tag]
  }
  return FALLBACK_IMAGE
}
