import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'The Place'
const DEFAULT_DESC = '安静的时光博物馆，为认真生活的人而建'

export default function Seo({ title, description, path }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || DEFAULT_DESC} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || DEFAULT_DESC} />
      {path && <meta property="og:url" content={`https://www.831225.xyz${path}`} />}
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
