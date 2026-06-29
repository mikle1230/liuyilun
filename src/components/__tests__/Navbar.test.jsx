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
  it('renders all navigation links', () => {
    renderNavbar()
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('博客')).toBeInTheDocument()
    expect(screen.getByText('壁纸')).toBeInTheDocument()
    expect(screen.getByText('探索')).toBeInTheDocument()
    expect(screen.getByText('关于')).toBeInTheDocument()
  })

  it('renders logo mark', () => {
    renderNavbar()
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('has theme toggle button with accessible label', () => {
    renderNavbar()
    const toggle = screen.getByLabelText(/切换/)
    expect(toggle).toBeInTheDocument()
  })

  it('toggles theme on button click', () => {
    renderNavbar()
    const toggle = screen.getByLabelText(/切换/)
    const html = document.documentElement

    // Default theme from ThemeContext is 'light'
    expect(html.getAttribute('data-theme')).toBe('light')

    fireEvent.click(toggle)
    expect(html.getAttribute('data-theme')).toBe('dark')
  })
})
