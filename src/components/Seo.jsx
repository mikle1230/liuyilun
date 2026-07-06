import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'This Place — M'
const DEFAULT_DESC = '记录走过的路、读过的书、用过的好工具、沉淀下来的思考。'

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
