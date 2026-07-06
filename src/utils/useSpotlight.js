import { useEffect, useRef } from 'react'

/**
 * Adds a spotlight border effect to a card element.
 * The border glows at the cursor position on hover.
 */
export default function useSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--spot-x', `${x}%`)
      el.style.setProperty('--spot-y', `${y}%`)
    }

    const handleLeave = () => {
      el.style.setProperty('--spot-x', '50%')
      el.style.setProperty('--spot-y', '50%')
    }

    // Init center
    handleLeave()

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return ref
}
