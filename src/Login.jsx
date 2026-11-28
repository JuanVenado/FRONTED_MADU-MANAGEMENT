import { useState } from 'react'
import { Warehouse } from 'lucide-react'
import { signIn } from './api/auth.js'

export default function Login({ onLogin }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

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
        <div className="login-brand">
          <span className="brand-mark"><Warehouse size={21} aria-hidden="true" /></span>
          <span>MADU Inventario</span>
        </div>
        <h1 id="login-title">Inicia sesión</h1>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={pending}>
            <label htmlFor="login-name">Nombre de usuario</label>
            <input id="login-name" name="nombre" autoComplete="username" maxLength={255} required />
            <label htmlFor="login-password">Contraseña</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" required />
            {error && <p className="session-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit">{pending ? 'Iniciando sesión…' : 'Iniciar sesión'}</button>
          </fieldset>
        </form>
      </section>
    </main>
  )
}
