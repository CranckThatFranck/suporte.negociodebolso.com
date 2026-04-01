import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects to /login when there is no token', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>private page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('renders children when token exists', () => {
    localStorage.setItem('jwt', 'token')

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>private page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('private page')).toBeInTheDocument()
  })
})
