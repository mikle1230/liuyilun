import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'M — 个人知识枢纽'
const DEFAULT_DESC = '记录思考 · 收集知识 · 探索世界 — 一个人的知识枢纽'

export default function Seo({ title, description, path }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const url = path ? `https://liuyilun.site${path}` : 'https://liuyilun.site'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || DEFAULT_DESC} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || DEFAULT_DESC} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
