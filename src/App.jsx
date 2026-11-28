import { useState } from 'react'
import { LogOut } from 'lucide-react'
import InventoryMovements from './Movements.jsx'
import Login from './Login.jsx'
import { signOut } from './api/auth.js'
import './App.css'
import './Login.css'

function App() {
  const [session, setSession] = useState(null)
  const [logoutPending, setLogoutPending] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function handleLogout() {
    setLogoutPending(true)
    setLogoutError('')

    try {
      await signOut(session.token)
      setSession(null)
    } catch (error) {
      setLogoutError(error.message)
    } finally {
      setLogoutPending(false)
    }
  }

  if (!session) {
    return <Login onLogin={setSession} />
  }

  return (
    <InventoryMovements
      profileName={session.nombre}
      sessionError={logoutError}
      topbarActions={
        <button className="session-logout" type="button" onClick={handleLogout} disabled={logoutPending}>
          <LogOut size={15} aria-hidden="true" />
          {logoutPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
      }
    />
  )
}

export default App
