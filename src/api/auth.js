const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

async function sendRequest(path, options) {
  try {
    return await fetch(`${apiUrl}${path}`, {
      method: 'POST',
      credentials: 'omit',
      ...options,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo.')
  }
}

async function readData(response, fallbackMessage) {
  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.success !== true) {
    const errors = payload?.data?.errors
    const message = errors?.nombre?.[0] ?? errors?.password?.[0] ?? payload?.message
    throw new Error(message || fallbackMessage)
  }

  return payload.data
}

export async function signIn(nombre, password) {
  const response = await sendRequest('/login', {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, password }),
  })
  const data = await readData(response, 'No se pudo iniciar sesión. Intenta de nuevo.')

  if (typeof data?.token !== 'string' || !data.token || typeof data.usuario?.nombre !== 'string') {
    throw new Error('El servidor devolvió una sesión inválida.')
  }

  return { token: data.token, nombre: data.usuario.nombre }
}

export async function signOut(token) {
  const response = await sendRequest('/logout', {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })

  if (response.status !== 401) {
    await readData(response, 'No se pudo cerrar sesión. Intenta de nuevo.')
  }
}
