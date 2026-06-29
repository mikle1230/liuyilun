import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../../contexts/ThemeContext'
import TagPill from '../TagPill'

function renderWithProviders(ui) {
  return render(
    <ThemeProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  )
}

describe('TagPill', () => {
  it('renders label text', () => {
    renderWithProviders(<TagPill label="随笔" />)
    expect(screen.getByText('随笔')).toBeInTheDocument()
  })

  it('renders with correct class', () => {
    const { container } = renderWithProviders(<TagPill label="React" />)
    const pill = container.querySelector('.tag-pill')
    expect(pill).toBeTruthy()
  })
})
