import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'theme'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage unavailable (private browsing, SSR, etc.)
  }
  // Default to light — wabi-sabi bright is the primary experience
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Sync data-theme attribute + localStorage whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
