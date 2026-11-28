import assert from 'node:assert/strict'
import test from 'node:test'
import { signIn, signOut } from '../src/api/auth.js'
import { ErrorApi } from '../src/api/cliente.js'
import { crearApiInventario } from '../src/api/inventario.js'

test('el acceso conserva el contrato y el cierre tolera un token ya revocado', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async (url, opciones) => {
    if (url === '/api/login') {
      assert.deepEqual(JSON.parse(opciones.body), { nombre: 'Operador', password: 'prueba' })
      return Response.json({ success: true, data: { token: 'token-de-prueba', usuario: { nombre: 'Operador' } } })
    }

    assert.equal(url, '/api/logout')
    assert.equal(opciones.headers.Authorization, 'Bearer token-de-prueba')
    return Response.json({ success: false, message: 'Autenticación requerida.' }, { status: 401 })
  })

  const sesion = await signIn('Operador', 'prueba')
  assert.deepEqual(sesion, { token: 'token-de-prueba', nombre: 'Operador' })
  await signOut(sesion.token)
  assert.equal(fetch.mock.callCount(), 2)
})

test('la asignación usa la ruta y el formato de Laravel con el token de la sesión', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, opciones) => {
    assert.equal(url, '/api/productos/3/presentaciones/5')
    assert.equal(opciones.method, 'PUT')
    assert.equal(opciones.headers.Authorization, 'Bearer token-de-prueba')
    assert.deepEqual(JSON.parse(opciones.body), { factor_conversion: '10.5000' })
    return Response.json({ success: true, data: { id: 14, presentacion_id: 5 } })
  })

  const api = crearApiInventario('token-de-prueba')
  assert.deepEqual(await api.productos.guardarPresentacion(3, 5, '10.5000'), { id: 14, presentacion_id: 5 })
})

test('los errores de validación conservan el código HTTP y los mensajes por campo', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({
    success: false,
    data: { errors: { cantidad: ['Saldo insuficiente.'] } },
    message: 'Los datos de la solicitud no son válidos.',
  }, { status: 400 }))

  await assert.rejects(
    crearApiInventario('token-de-prueba').movimientos.registrar({ cantidad: 4 }),
    (error) => error instanceof ErrorApi && error.status === 400
      && error.message === 'Saldo insuficiente.' && error.errores.cantidad[0] === error.message,
  )
})
