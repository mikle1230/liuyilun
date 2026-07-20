import { Helmet } from 'react-helmet-async'
import siteConfig from '../data/site-config.json'

const SITE_NAME = siteConfig.name
const DEFAULT_DESC = siteConfig.description

export default function Seo({ title, description, path }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || DEFAULT_DESC} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || DEFAULT_DESC} />
      {path && <meta property="og:url" content={`https://${siteConfig.domain}${path}`} />}
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
