import assert from 'node:assert/strict'
import test from 'node:test'
import { filtrarMovimientos, filtrarProductos } from '../src/inventario/filtros.js'
import { ErrorMovimiento, prepararMovimiento } from '../src/inventario/movimientos.js'

const producto = {
  id: 3,
  activo: true,
  saldo_actual: '21.00',
  presentaciones: [{ id: 14, presentacion_id: 5, factor_conversion: '10.5000' }],
}
const salida = { producto, asignacionId: '14', cantidad: '1', tipo: 'salida' }

test('el movimiento usa el ID de asociación y redondea a centésimas', () => {
  const resultado = prepararMovimiento({
    ...salida,
    cantidad: '-0.25',
    tipo: 'ajuste',
    motivo: '  Merma  ',
    referencia: null,
    folio: '  INV-15 ',
  })

  assert.deepEqual(resultado, {
    datos: {
      producto: 3,
      producto_presentacion: 14,
      tipo: 'ajuste',
      cantidad: '-0.25',
      motivo: 'Merma',
      folio: 'INV-15',
    },
    cantidadBase: '-2.63',
    saldoAnterior: '21.00',
    saldoPosterior: '18.37',
  })
  assert.equal(prepararMovimiento({ ...salida, cantidad: '2' }).saldoPosterior, '0.00')
})

test('se rechazan la sobreventa, los ajustes sin motivo y el ID de catálogo', () => {
  for (const [cambios, campo] of [
    [{ cantidad: '2.01' }, 'cantidad'],
    [{ cantidad: '0' }, 'cantidad'],
    [{ tipo: 'ajuste', motivo: ' ' }, 'motivo'],
    [{ asignacionId: 5 }, 'producto_presentacion'],
    [{ producto: { ...producto, activo: false } }, 'producto'],
  ]) {
    assert.throws(
      () => prepararMovimiento({ ...salida, ...cambios }),
      (error) => error instanceof ErrorMovimiento && error.campo === campo,
    )
  }
})

test('los límites se comprueban después de convertir a unidad base', () => {
  for (const [cantidad, factor_conversion] of [['0.01', '0.0001'], ['99999999.99', '9999.9999']]) {
    assert.throws(
      () => prepararMovimiento({
        ...salida,
        tipo: 'entrada',
        cantidad,
        producto: { ...producto, presentaciones: [{ id: 14, factor_conversion }] },
      }),
      (error) => error instanceof ErrorMovimiento && error.campo === 'cantidad',
    )
  }
})

test('el filtro de stock bajo combina categoría y búsqueda e incluye el mínimo exacto', () => {
  const bajos = { nombre: 'Café', categoria_id: 1, activo: true, stock_min: 4, saldo_actual: '4.00' }
  const productos = [
    bajos,
    { ...bajos, saldo_actual: '4.01' },
    { ...bajos, saldo_actual: null },
    { ...bajos, activo: false },
    { ...bajos, categoria_id: 2 },
  ]

  assert.deepEqual(filtrarProductos(productos, { busqueda: 'CAFE', categoriaId: '1', stock: 'bajo' }), [bajos])
  assert.deepEqual(filtrarProductos(productos, { categoriaId: 1, stock: 'disponible' }), [productos[1]])
})

test('el historial filtra fechas inclusivas y combina tipo con búsqueda', () => {
  const fin = { tipo: 'ajuste', fecha: '2026-11-28 23:59:59', motivo: 'Conciliación' }
  const movimientos = [
    fin,
    { ...fin, fecha: '2026-11-29 00:00:00' },
    { ...fin, tipo: 'salida' },
    { ...fin, motivo: 'Merma' },
  ]

  assert.deepEqual(filtrarMovimientos(movimientos, {
    tipo: 'ajuste', desde: '2026-11-28', hasta: '2026-11-28', busqueda: 'conciliacion',
  }), [fin])
})
