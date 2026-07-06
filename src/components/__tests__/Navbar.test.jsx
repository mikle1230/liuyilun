import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../../contexts/ThemeContext'
import Navbar from '../Navbar'

function renderNavbar() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('Navbar', () => {
  it('renders navigation links', () => {
    renderNavbar()
    expect(screen.getByText('Journal')).toBeInTheDocument()
    expect(screen.getByText('Collections')).toBeInTheDocument()
    expect(screen.getByText('Travels')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders site title', () => {
    renderNavbar()
    expect(screen.getByText('This Place')).toBeInTheDocument()
  })

  it('has theme toggle buttons', () => {
    renderNavbar()
    const toggles = screen.getAllByRole('button')
    const themeToggle = toggles.find(b => b.textContent === '🌙' || b.textContent === '☀️')
    expect(themeToggle).toBeTruthy()
  })

  it('toggles theme on click', () => {
    renderNavbar()
    const toggles = screen.getAllByRole('button')
    const themeToggle = toggles.find(b => b.textContent === '🌙' || b.textContent === '☀️')
    const html = document.documentElement

    expect(html.getAttribute('data-theme')).toBe('light')
    fireEvent.click(themeToggle)
    expect(html.getAttribute('data-theme')).toBe('dark')
  })
})
