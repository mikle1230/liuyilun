import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

/**
 * Redirect /ai/:slug → /blog/:slug (301-style replacement).
 * Reads the slug from params and navigates to the equivalent blog route.
 */
export default function RedirectToBlog() {
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(`/blog/${slug}`, { replace: true })
  }, [slug, navigate])

  return null
}
