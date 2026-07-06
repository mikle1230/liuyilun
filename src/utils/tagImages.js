/**
 * Cover images for journal tags — multiple options per tag.
 * Uses the post slug as a seed so each article gets a consistent image.
 */

const IMAGE_POOLS = {
  'AI': [
    'photo-1677442136019-21780ecad995',
    'photo-1620712943543-bcc4688e7485',
    'photo-1485827404703-89b55fcc595e',
    'photo-1531746790096-5e28f1b4e2c2',
  ],
  '工具': [
    'photo-1629654297299-c8506221ca97',
    'photo-1460925895917-afdab827c52f',
    'photo-1551288049-bebda4e38f71',
  ],
  '投资': [
    'photo-1611974789855-9c2a0a7236a3',
    'photo-1590283603385-17ffb3a7bd44',
    'photo-1633158829585-23ba8f7c8caf',
    'photo-1559526324-4b87b484c6ef',
  ],
  '旅行': [
    'photo-1488646953014-85cb44e25828',
    'photo-1469854523086-cc02fe5d8800',
    'photo-1500835556837-5b1b430d5b2f',
    'photo-1476514525535-80a9f34e9f7a',
    'photo-1503220317783-7e9c2b6a6d6f',
  ],
  '随笔': [
    'photo-1499750310107-5fef28a66643',
    'photo-1517841905240-472988babdf9',
    'photo-1455390582262-044a1d5e9c5a',
  ],
  '个人': [
    'photo-1517841905240-472988babdf9',
    'photo-1434030216411-1ce1a1f5b4c6',
    'photo-1488190211106-89c3e5dd1ff3',
  ],
  '行业': [
    'photo-1486406146926-c627a92ad1ab',
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1454165804606-c3d57bc86b40',
    'photo-1560472355-536de3962603',
  ],
  '阅读': [
    'photo-1512820790803-83ca734da794',
    'photo-1524995997946-a1c2e315a42f',
    'photo-1506880018603-84ac6e51ce71',
  ],
  '科技': [
    'photo-1518770660439-4636190af475',
    'photo-1550751827-4bd374c3f58b',
    'photo-1535223289822-1c86d2e3e5a9',
    'photo-1451187580459-43490279c0fa',
  ],
  '数据库': [
    'photo-1544383835-bda2bc66a55d',
    'photo-1558494949-ef010cbdcc31',
    'photo-1544197150-b99a580bb7a8',
  ],
  '金融': [
    'photo-1633158829585-23ba8f7c8caf',
    'photo-1579532537598-459ecdaf39cc',
    'photo-1559526324-4b87b484c6ef',
  ],
  '法律': [
    'photo-1589829545856-d10d557cf95f',
    'photo-1450101499163-c8848c66ca85',
  ],
  '管理': [
    'photo-1552664730-d307ca884978',
    'photo-1542744173-8e7e53415bb0',
    'photo-1600880292203-757bb62b4baf',
  ],
  '半导体': [
    'photo-1517077304055-6e89dcf36a0b',
    'photo-1611944212102-3c9534a70747',
    'photo-1555664424-778a1e5e1b48',
  ],
}

const FALLBACKS = [
  'photo-1499750310107-5fef28a66643',
  'photo-1507525428034-b723cf961d3e',
  'photo-1472289065668-ce650ac443d2',
  'photo-1519681393784-d120267933ba',
  'photo-1506905925348-21ebda60e2cd',
  'photo-1518837695005-2083093ee35b',
  'photo-1441974231531-c6227db76b6e',
]

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function pickFromPool(pool, seed) {
  return `https://images.unsplash.com/${pool[seed % pool.length]}?w=800&q=80`
}

export function getCoverImage(tags, explicitImage, seedSlug) {
  if (explicitImage) return explicitImage

  const seed = seedSlug ? hashCode(seedSlug) : Date.now()

  if (tags && tags.length) {
    for (const tag of tags) {
      const pool = IMAGE_POOLS[tag]
      if (pool) return pickFromPool(pool, seed + hashCode(tag))
    }
  }

  return pickFromPool(FALLBACKS, seed)
}
