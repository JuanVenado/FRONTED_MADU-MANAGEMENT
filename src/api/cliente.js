const urlApi = (import.meta.env?.VITE_API_URL || '/api').replace(/\/+$/, '')

export class ErrorApi extends Error {
  constructor(mensaje, { status = 0, errores = {} } = {}) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.status = status
    this.errores = errores
  }
}

export async function solicitar(
  ruta,
  { metodo = 'GET', token, datos, signal, mensajeError = 'No se pudo completar la solicitud.' } = {},
) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  if (datos !== undefined) headers['Content-Type'] = 'application/json'

  const body = datos === undefined ? undefined : JSON.stringify(datos)
  let respuesta
  try {
    respuesta = await fetch(`${urlApi}${ruta}`, {
      method: metodo,
      credentials: 'omit',
      headers,
      body,
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ErrorApi('No se pudo conectar con el servidor. Intenta de nuevo.')
  }

  const json = await respuesta.json().catch((error) => {
    if (signal?.aborted) throw error
    return null
  })

  if (!respuesta.ok || json?.success !== true) {
    const errores = json?.data?.errors ?? {}
    const mensajeCampo = Object.values(errores).flat().find((valor) => typeof valor === 'string')

    throw new ErrorApi(mensajeCampo || json?.message || mensajeError, {
      status: respuesta.status,
      errores,
    })
  }

  return json.data
}
