import { useState } from 'react'
import { Building2, Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react'
import { signIn } from './api/auth.js'

export default function Login({ onLogin }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    setPending(true)
    setError('')

    try {
      const session = await signIn(fields.get('nombre').trim(), fields.get('password'))
      onLogin(session)
    } catch (error) {
      setError(error.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-heading">
          <h1 id="login-title">Acceso a Administración MADU</h1>
          <p>Ingresa tus credenciales para administrar el inventario.</p>
        </header>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={pending}>
            <div className="login-field">
              <label htmlFor="login-name">Nombre de usuario</label>
              <div className="login-control">
                <Building2 size={19} aria-hidden="true" />
                <input id="login-name" name="nombre" autoComplete="username" maxLength={255} required />
              </div>
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Contraseña de cuenta</label>
              <div className="login-control">
                <LockKeyhole size={19} aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="login-visibility"
                  type="button"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-controls="login-password"
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
            </div>
            {error && <p className="session-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit">
              <LogIn size={19} aria-hidden="true" />
              {pending ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </fieldset>
        </form>
        <footer className="login-network">Red logística MADU</footer>
      </section>
    </main>
  )
}
