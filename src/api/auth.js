import { ErrorApi, solicitar } from './cliente.js'

export async function signIn(nombre, password) {
  const data = await solicitar('/login', {
    metodo: 'POST',
    datos: { nombre, password },
    mensajeError: 'No se pudo iniciar sesión. Intenta de nuevo.',
  })

  if (typeof data?.token !== 'string' || !data.token || typeof data.usuario?.nombre !== 'string') {
    throw new Error('El servidor devolvió una sesión inválida.')
  }

  return { token: data.token, nombre: data.usuario.nombre }
}

export async function signOut(token) {
  try {
    await solicitar('/logout', {
      metodo: 'POST',
      token,
      mensajeError: 'No se pudo cerrar sesión. Intenta de nuevo.',
    })
  } catch (error) {
    if (!(error instanceof ErrorApi) || error.status !== 401) throw error
  }
}
