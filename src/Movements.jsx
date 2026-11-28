import { useState } from 'react'
import { Activity, ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, Boxes, Check, ChevronDown, FileText, Minus, Package, Plus, Search, SlidersHorizontal } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import MainContent from './components/MainContent.jsx'
import PageHeading from './components/PageHeading.jsx'
import CancelButton from './components/CancelButton.jsx'
import ConfirmButton from './components/ConfirmButton.jsx'

export default function InventoryMovements({ profileName, sessionError, topbarActions }) {
  const [operation, setOperation] = useState('Salida')
  const [adjustmentSign, setAdjustmentSign] = useState('negative')
  const [unit, setUnit] = useState('Caja')
  const [quantity, setQuantity] = useState('15')
  const [saved, setSaved] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [stockType, setStockType] = useState('Todos')
  const [reference, setReference] = useState('')
  const pieces = (Number(quantity) || 0) * (unit === 'Caja' ? 12 : 1)

  const productCatalog = [
    { name: 'Aceite Vegetal Nutrioli 1L', sku: 'MADU-ACE-892', category: 'Aceites', stock: 'Disponible', stockLabel: '180 Cajas disponibles' },
    { name: 'Aceite Vegetal Capullo 1L', sku: 'MADU-CAP-120', category: 'Aceites', stock: 'Disponible', stockLabel: '96 Cajas disponibles' },
    { name: 'Arroz Blanco Premium 1kg', sku: 'MADU-ARR-441', category: 'Granos', stock: 'Bajo', stockLabel: '18 Cajas disponibles' },
  ]
  const [selectedProduct, setSelectedProduct] = useState(productCatalog[0])
  const filteredProducts = productCatalog.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku}`.toLowerCase().includes(productSearch.toLowerCase())
    const matchesCategory = category === 'Todas' || product.category === category
    const matchesStock = stockType === 'Todos' || product.stock === stockType
    return matchesSearch && matchesCategory && matchesStock
  })

  return (
    <main className="inventory-shell">
      <Sidebar profileName={profileName} />
      <MainContent
        breadcrumbs={{ section: 'Inventario', page: 'Movimientos' }}
        branch="Sucursal Torreón"
        topbarActions={topbarActions}
        footer={<footer className="page-footer"><span>© 2026 Distribuciones MADU</span><span>Inventario <b>·</b> v2.4.0</span></footer>}
      >
          {sessionError && <p className="session-error" role="alert">{sessionError}</p>}
          <PageHeading
            eyebrow="MOVIMIENTOS"
            title="Registro de Movimientos"
            description="Captura de entradas, despachos y conciliaciones con trazabilidad de lote y factor de conversión."
            actions={
              <>
                <CancelButton variant="heading" showIcon onClick={() => { setQuantity('15'); setSaved(false) }} />
                <span className="draft-pill heading-draft"><span />Borrador</span>
                <ConfirmButton variant="heading" operation={operation} onClick={() => setSaved(true)} />
              </>
            }
          />

          <section className="product-search-toolbar" aria-label="Buscador de productos">
            <label className="product-search-input">
              <Search size={15} />
              <input type="search" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Buscar producto por nombre o SKU..." />
            </label>
            <label className="product-filter">
              <SlidersHorizontal size={14} />
              <span>Categoría</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Todas</option>
                <option>Aceites</option>
                <option>Granos</option>
              </select>
              <ChevronDown size={14} />
            </label>
            <label className="product-filter">
              <Package size={14} />
              <span>Tipo de stock</span>
              <select value={stockType} onChange={(event) => setStockType(event.target.value)}>
                <option>Todos</option>
                <option>Disponible</option>
                <option>Bajo</option>
              </select>
              <ChevronDown size={14} />
            </label>
            <span className="product-results-count">{filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'}</span>
          </section>
          {(productSearch || category !== 'Todas' || stockType !== 'Todos') && (
            <div className="product-search-results" role="listbox" aria-label="Resultados de productos">
              {filteredProducts.map((product) => (
                <button key={product.sku} type="button" role="option" aria-selected={selectedProduct.sku === product.sku} onClick={() => { setSelectedProduct(product); setProductSearch(''); setCategory('Todas'); setStockType('Todos') }}>
                  <span className="product-thumbnail"><Boxes size={19} /></span>
                  <span className="product-info"><strong>{product.name}</strong><small>SKU: {product.sku}</small></span>
                  <span className={`search-stock-chip ${product.stock.toLowerCase()}`}><i />{product.stockLabel}</span>
                </button>
              ))}
              {filteredProducts.length === 0 && <p className="no-product-results">No se encontraron productos con los filtros seleccionados.</p>}
            </div>
          )}

          <div className="work-area">
            <section className="form-card" aria-label="Formulario de movimiento">
              <div className="card-topline"><div><span className="card-kicker">NUEVO REGISTRO</span><h2>Detalle del movimiento</h2></div><span className="draft-pill"><span />Borrador</span></div>
              <div className="form-divider" />
              <div className="operation-label">TIPO DE OPERACIÓN</div>
              <div className="operation-switch" role="group" aria-label="Tipo de operación">
                {([{ label: 'Entrada', icon: ArrowDownToLine, sub: 'RECEPCIÓN' }, { label: 'Salida', icon: ArrowUpFromLine, sub: 'DESPACHO' }, { label: 'Ajuste', icon: Activity, sub: 'AUDITORÍA' }]).map(({ label, icon: Icon, sub }) => <button key={label} onClick={() => { setOperation(label); setSaved(false) }} className={`operation-option operation-${label.toLowerCase()}${label === 'Ajuste' ? ` adjustment-${adjustmentSign}` : ''}${operation === label ? ' selected' : ''}`} type="button"><span className="operation-icon"><Icon size={18} /></span><span className="operation-text"><strong>{label}</strong><small>{sub}</small></span>{operation === label && <Check className="operation-check" size={15} />}</button>)}
              </div>
              {operation === 'Ajuste' && (
                <div className="adjustment-direction-field">
                  <span className="field-label">Sentido Contable del Ajuste <b>*</b></span>
                  <div className="adjustment-direction-switch" role="group" aria-label="Sentido contable del ajuste">
                    <button className={`adjustment-direction-option negative${adjustmentSign === 'negative' ? ' selected' : ''}`} type="button" onClick={() => { setAdjustmentSign('negative'); setSaved(false) }}><Minus size={17} /><strong>Merma</strong></button>
                    <button className={`adjustment-direction-option positive${adjustmentSign === 'positive' ? ' selected' : ''}`} type="button" onClick={() => { setAdjustmentSign('positive'); setSaved(false) }}><Plus size={17} /><strong>Sobrante</strong></button>
                  </div>
                </div>
              )}

              <div className="fields-grid product-grid">
                <label className="field full-field"><span className="field-label">Producto en Catálogo <b>*</b></span><span className="field-control product-control"><span className="product-thumbnail"><Boxes size={19} /></span><span className="product-info"><strong>{selectedProduct.name}</strong><small>SKU: {selectedProduct.sku}</small></span><span className="stock-chip"><i />{selectedProduct.stockLabel}</span><ChevronDown size={16} className="control-chevron" /></span><span className="field-hint">Selecciona el producto sobre el que deseas registrar el movimiento.</span></label>
                <div className="product-detail full-field"><div className="bottle"><span className="bottle-cap" /><span className="bottle-label">N</span></div><div className="product-description"><span className="product-description-title">Nutrioli Puro de Soya <span>•</span> Botella 1000ml</span><span className="product-meta">EAN-13: 7501008044 <span className="meta-separator">/</span> Lote actual: <strong>LOT-2024-X41</strong> <span className="meta-separator">/</span> Caducidad: <strong className="expiry">Nov 2025</strong></span></div><span className="product-availability"><span />En stock</span></div>
                <label className="field"><span className="field-label">Tipo de Operación / Subtipo <b>*</b></span><span className="field-control select-control">{operation === 'Entrada' ? 'Recepción de compra' : operation === 'Ajuste' ? 'Ajuste por conteo físico' : 'Despacho de Ruta de Mayoreo'}<ChevronDown size={16} className="control-chevron" /></span></label>
                <label className="field"><span className="field-label">Referencia Documental <span className="optional-label">OPCIONAL</span></span><span className="field-control reference-control"><FileText size={16} /><input aria-label="Referencia documental" type="text" value={reference} onChange={(event) => { setReference(event.target.value); setSaved(false) }} placeholder={operation === 'Salida' ? 'Factura / Guía de Embarque' : operation === 'Entrada' ? 'Factura de proveedor' : 'Acta de ajuste'} /></span></label>
                <div className="field full-field"><div className="field-label">Unidad de Medida &amp; Volumen</div><div className="unit-description">Configure si el movimiento se efectúa por embalaje completo o suelto.</div><div className="unit-selector" role="group" aria-label="Unidad de medida"><button className={`unit-option${unit === 'Caja' ? ' chosen' : ''}`} type="button" onClick={() => setUnit('Caja')}><span className="unit-icon"><Boxes size={16} /></span><span><strong>Caja</strong><small>Máster (x12)</small></span>{unit === 'Caja' && <span className="unit-radio" />}</button><button className={`unit-option${unit === 'Pieza' ? ' chosen' : ''}`} type="button" onClick={() => setUnit('Pieza')}><span className="unit-icon"><Package size={16} /></span><span><strong>Pieza</strong><small>Suelta</small></span>{unit === 'Pieza' && <span className="unit-radio" />}</button></div></div>
                <label className="field quantity-field"><span className="field-label">Cantidad a {operation === 'Entrada' ? 'recibir' : operation === 'Ajuste' ? 'ajustar' : 'despachar'} ({unit === 'Caja' ? 'CAJAS' : 'PIEZAS'}) <b>*</b></span><span className="quantity-control"><input aria-label="Cantidad" inputMode="numeric" min="1" type="number" value={quantity} onChange={(event) => { setQuantity(event.target.value); setSaved(false) }} /><span>{unit === 'Caja' ? 'Cajas' : 'Piezas'}</span></span><span className="field-hint">Existencia actual: 180 Cajas / 2,160 Pzas</span></label>
                <div className="equivalence-card"><div className="equivalence-top"><span className="equivalence-icon"><ArrowLeftRight size={15} /></span><span>EQUIVALENCIA LOGÍSTICA</span></div><div className="equivalence-equation"><strong>{quantity || '0'} {unit === 'Caja' ? 'Cajas' : 'Piezas'}</strong><span>× {unit === 'Caja' ? '12' : '1'}</span><ArrowLeftRight size={14} /><strong className="equivalence-total">{pieces.toLocaleString('es-MX')} piezas</strong></div><div className="equivalence-caption">{operation === 'Salida' || (operation === 'Ajuste' && adjustmentSign === 'negative') ? 'Volumen total que se descontará del inventario' : 'Volumen total que se registrará en el inventario'}</div></div>
                <label className="field full-field notes-field"><span className="field-label">Observaciones <span className="optional-label">OPCIONAL</span></span><textarea placeholder="Agrega notas o instrucciones para este movimiento..." rows={2} /></label>
              </div>
              {saved && <div className="success-message" role="status"><Check size={16} />Movimiento guardado correctamente. El registro quedó en borrador.</div>}
              <div className="form-footer"><span className="required-note"><b>*</b> Campos obligatorios</span><div className="form-actions"><CancelButton onClick={() => { setQuantity('15'); setSaved(false) }} /><ConfirmButton operation={operation} onClick={() => setSaved(true)} /></div></div>
            </section>

            <aside className="summary-column">
              <section className="summary-card balance-summary">
                <div className="summary-heading balance-heading">
                  <span className="summary-icon"><FileText size={17} /></span>
                  <span>Resumen</span>
                </div>

                <div className="balance-row current-stock">
                  <span className="balance-label"><Package size={13} />Existencia Actual</span>
                  <span className="balance-value">
                    <strong>180 Cajas</strong>
                    <small>2,160<br />Piezas</small>
                  </span>
                </div>

                <div className={`balance-row adjustment-row ${operation === 'Entrada' || (operation === 'Ajuste' && adjustmentSign === 'positive') ? 'positive' : 'negative'}`}>
                  <span className="balance-label">{operation === 'Entrada' ? <ArrowDownToLine size={13} /> : operation === 'Ajuste' ? (adjustmentSign === 'positive' ? <Plus size={13} /> : <Minus size={13} />) : <ArrowUpFromLine size={13} />}{operation === 'Entrada' ? 'Entrada' : operation === 'Ajuste' ? (adjustmentSign === 'positive' ? 'Ajuste positivo · Sobrante' : 'Ajuste negativo · Merma') : 'Salida'}</span>
                  <span className="balance-value">
                    <strong>{operation === 'Entrada' || (operation === 'Ajuste' && adjustmentSign === 'positive') ? '+' : '-'}{Math.ceil(pieces / 12).toLocaleString('es-MX')} Cajas</strong>
                    <small>{operation === 'Entrada' || (operation === 'Ajuste' && adjustmentSign === 'positive') ? '+' : '-'}{pieces.toLocaleString('es-MX')} Piezas</small>
                  </span>
                </div>

                <div className="balance-row conversion-row">
                  <span className="balance-label"><ArrowLeftRight size={13} />Factor de conversión</span>
                  <span className="balance-value">
                    <strong>{unit === 'Caja' ? '1 Caja' : '1 Pieza'} = {unit === 'Caja' ? '12' : '1'}</strong>
                    <small>Pzas</small>
                  </span>
                </div>

                <div className="balance-divider" />

                {(() => {
                  const currentPieces = 2160
                  const isPositive = operation === 'Entrada' || (operation === 'Ajuste' && adjustmentSign === 'positive')
                  const adjustment = isPositive ? pieces : -pieces
                  const posteriorPieces = Math.max(0, currentPieces + adjustment)
                  const posteriorCajas = Math.floor(posteriorPieces / 12)
                  const posteriorSueltas = posteriorPieces % 12
                  return (
                    <>
                      <div className="posterior-card">
                        <div className="posterior-top">
                          <strong>SALDO POSTERIOR<br />AJUSTADO</strong>
                          <span className="stock-health"><i />STOCK<br />SALUDABLE</span>
                        </div>
                        <div className="posterior-total">
                          <strong>{posteriorCajas}</strong>
                          <span>Cajas</span>
                        </div>
                        <p>Equivalente a <b>{posteriorPieces.toLocaleString('es-MX')} botellas</b></p>
                        <small>{posteriorSueltas} operativas sueltas en almacén.</small>
                      </div>
                      <div className="registration-details">
                        <div><span>Operador responsable:</span><strong>{profileName}</strong></div>
                        <div><span>Hora de registro:</span><strong>{new Date().toLocaleTimeString()}</strong></div>
                      </div>
                    </>
                  )
                })()}
              </section>
            </aside>
          </div>
      </MainContent>
    </main>
  )
}
