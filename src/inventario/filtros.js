function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

function coincide(termino, valores) {
  return !termino || valores.some((valor) => normalizar(valor).includes(termino))
}

export function filtrarProductos(
  productos,
  { busqueda = '', categoriaId, soloActivos = false, stock } = {},
) {
  const termino = normalizar(busqueda)

  return productos.filter((producto) => {
    if (soloActivos && !producto.activo) return false
    if (categoriaId != null && String(producto.categoria_id) !== String(categoriaId)) return false

    if (stock) {
      if (!producto.activo || producto.saldo_actual == null || producto.stock_min == null) return false
      const saldo = Number(producto.saldo_actual)
      const minimo = Number(producto.stock_min)
      if (!Number.isFinite(saldo) || !Number.isFinite(minimo)) return false
      const nivel = saldo <= minimo ? 'bajo' : 'disponible'
      if (stock !== nivel) return false
    }

    return coincide(termino, [producto.nombre, producto.coding, producto.descripcion])
  })
}

export function filtrarMovimientos(
  movimientos,
  { busqueda = '', tipo, desde, hasta } = {},
) {
  const termino = normalizar(busqueda)

  return movimientos.filter((movimiento) => {
    if (tipo && movimiento.tipo !== tipo) return false

    const fecha = movimiento.fecha?.slice(0, 10)
    if (desde && (!fecha || fecha < desde)) return false
    if (hasta && (!fecha || fecha > hasta)) return false

    const { folio, producto, usuario, motivo, referencia } = movimiento
    return coincide(termino, [folio, producto, usuario, motivo, referencia])
  })
}
