import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Test component that uses the hook
function TestConsumer() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button data-testid="toggle-btn" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  )
}

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to light theme', () => {
    renderWithTheme()
    expect(screen.getByTestId('theme-value').textContent).toBe('light')
  })

  it('toggles between light and dark', () => {
    renderWithTheme()
    const btn = screen.getByTestId('toggle-btn')

    expect(screen.getByTestId('theme-value').textContent).toBe('light')
    fireEvent.click(btn)
    expect(screen.getByTestId('theme-value').textContent).toBe('dark')
    fireEvent.click(btn)
    expect(screen.getByTestId('theme-value').textContent).toBe('light')
  })

  it('sets data-theme attribute on document element', () => {
    renderWithTheme()
    const html = document.documentElement

    expect(html.getAttribute('data-theme')).toBe('light')
    fireEvent.click(screen.getByTestId('toggle-btn'))
    expect(html.getAttribute('data-theme')).toBe('dark')
  })

  it('persists theme choice in localStorage', () => {
    renderWithTheme()
    fireEvent.click(screen.getByTestId('toggle-btn'))
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
