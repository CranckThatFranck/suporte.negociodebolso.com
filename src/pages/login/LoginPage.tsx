import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getToken, setToken } from '../../lib/storage/session'

export default function LoginPage() {
  const token = getToken()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const expiredSession = new URLSearchParams(location.search).get('reason') === 'session-expired'

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (!email || !password) {
      setError('Informe e-mail e senha para continuar.')
      setLoading(false)
      return
    }

    setToken('demo-jwt-token')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm"
      >
        <h1 className="text-h2">Login da equipe</h1>
        <p className="mt-1 text-body text-text-secondary">Acesse sua central de atendimento.</p>

        {expiredSession && (
          <p className="mt-4 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-caption text-warning">
            Sua sessão expirou. Faça login novamente.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-caption text-error">
            {error}
          </p>
        )}

        <label className="mt-4 block text-caption text-text-secondary" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body text-text-primary outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          placeholder="atendente@negociodebolso.com"
        />

        <label className="mt-4 block text-caption text-text-secondary" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body text-text-primary outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          placeholder="********"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-body font-medium text-surface transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
