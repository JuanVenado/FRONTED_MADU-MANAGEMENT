import { solicitar } from './cliente.js'

export function crearApiInventario(token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw new TypeError('Se requiere un token para consultar el inventario.')
  }

  const pedir = (ruta, opciones) => solicitar(ruta, { ...opciones, token })
  const rutaConId = (ruta, id) => `${ruta}/${encodeURIComponent(id)}`

  function recurso(ruta) {
    return {
      listar: (signal) => pedir(ruta, { signal }),
      obtener: (id, signal) => pedir(rutaConId(ruta, id), { signal }),
      crear: (datos) => pedir(ruta, { metodo: 'POST', datos }),
      actualizar: (id, datos) => pedir(rutaConId(ruta, id), { metodo: 'PUT', datos }),
      desactivar: (id) => pedir(rutaConId(ruta, id), { metodo: 'DELETE' }),
    }
  }

  return {
    productos: {
      ...recurso('/productos'),
      guardarPresentacion: (productoId, presentacionId, factor) =>
        pedir(`${rutaConId('/productos', productoId)}/presentaciones/${encodeURIComponent(presentacionId)}`, {
          metodo: 'PUT',
          datos: { factor_conversion: factor },
        }),
    },
    movimientos: {
      listar: (signal) => pedir('/movimientos', { signal }),
      obtener: (id, signal) => pedir(rutaConId('/movimientos', id), { signal }),
      registrar: (datos) => pedir('/movimientos', { metodo: 'POST', datos }),
    },
    categorias: recurso('/categorias'),
    unidades: recurso('/unidades'),
    proveedores: recurso('/proveedores'),
    presentaciones: recurso('/presentaciones'),
  }
}
