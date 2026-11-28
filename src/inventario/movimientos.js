const tipos = new Set(['entrada', 'salida', 'ajuste'])
const maximoCantidad = 9_999_999_999n
const escalaFactor = 10_000n
const maximoFactor = 99_999_999n

export class ErrorMovimiento extends Error {
  constructor(campo, mensaje) {
    super(mensaje)
    this.name = 'ErrorMovimiento'
    this.campo = campo
  }
}

function aEscala(valor, decimales) {
  const coincidencia = /^([+-]?)(\d{0,10})(?:\.(\d*))?$/.exec(String(valor ?? '').trim())
  if (!coincidencia) return null
  const [, signo, entero, fraccion = ''] = coincidencia
  if ((!entero && !fraccion) || fraccion.length > decimales) return null

  const magnitud = BigInt((entero || '0') + fraccion.padEnd(decimales, '0'))
  return signo === '-' ? -magnitud : magnitud
}

function comoDecimal(centesimas) {
  const cantidad = centesimas < 0n ? -centesimas : centesimas
  const signo = centesimas < 0n ? '-' : ''
  return `${signo}${cantidad / 100n}.${String(cantidad % 100n).padStart(2, '0')}`
}

export function prepararMovimiento({
  producto,
  asignacionId,
  tipo,
  cantidad,
  motivo = '',
  referencia = '',
  folio = '',
}) {
  if (!producto?.activo) {
    throw new ErrorMovimiento('producto', 'Selecciona un producto activo.')
  }
  if (!tipos.has(tipo)) {
    throw new ErrorMovimiento('tipo', 'Selecciona el tipo de movimiento.')
  }

  const asignacion = producto.presentaciones?.find(({ id }) => String(id) === String(asignacionId))
  if (!asignacion) {
    throw new ErrorMovimiento('producto_presentacion', 'Selecciona una presentación asignada al producto.')
  }
  const factor = aEscala(asignacion.factor_conversion, 4)
  if (factor === null || factor < 1n || factor > maximoFactor) {
    throw new ErrorMovimiento('producto_presentacion', 'La presentación no tiene un factor de conversión válido.')
  }

  const cantidadCapturada = aEscala(cantidad, 2)
  if (cantidadCapturada === null || cantidadCapturada > maximoCantidad || cantidadCapturada < -maximoCantidad) {
    throw new ErrorMovimiento('cantidad', 'Ingresa una cantidad válida con hasta dos decimales.')
  }
  if (cantidadCapturada === 0n || (tipo !== 'ajuste' && cantidadCapturada < 0n)) {
    throw new ErrorMovimiento('cantidad', 'La cantidad debe ser positiva en entradas y salidas, y distinta de cero en ajustes.')
  }

  const motivoLimpio = motivo?.trim() ?? ''
  const referenciaLimpia = referencia?.trim() ?? ''
  const folioLimpio = folio?.trim() ?? ''
  if (tipo === 'ajuste' && !motivoLimpio) {
    throw new ErrorMovimiento('motivo', 'Escribe el motivo del ajuste.')
  }

  const saldo = aEscala(producto.saldo_actual, 2)
  if (saldo === null || saldo < 0n || saldo > maximoCantidad) {
    throw new ErrorMovimiento('producto', 'Consulta el saldo actual del producto antes de registrar el movimiento.')
  }

  // Redondea al centésimo y aleja del cero cuando la conversión queda a la mitad.
  const mitad = escalaFactor / 2n
  const fraccion = cantidadCapturada < 0n ? -mitad : mitad
  const cantidadBase = (cantidadCapturada * factor + fraccion) / escalaFactor

  if (cantidadBase === 0n) {
    throw new ErrorMovimiento('cantidad', 'La cantidad convertida debe ser de al menos 0.01 unidades base.')
  }

  const saldoPosterior = saldo + (tipo === 'salida' ? -cantidadBase : cantidadBase)
  if (saldoPosterior < 0n || saldoPosterior > maximoCantidad) {
    throw new ErrorMovimiento('cantidad', 'El saldo resultante está fuera del rango permitido.')
  }

  const datos = {
    producto: producto.id,
    producto_presentacion: asignacion.id,
    tipo,
    cantidad: comoDecimal(cantidadCapturada),
  }
  if (motivoLimpio) datos.motivo = motivoLimpio
  if (referenciaLimpia) datos.referencia = referenciaLimpia
  if (folioLimpio) datos.folio = folioLimpio

  return {
    datos,
    cantidadBase: comoDecimal(cantidadBase),
    saldoAnterior: comoDecimal(saldo),
    saldoPosterior: comoDecimal(saldoPosterior),
  }
}
