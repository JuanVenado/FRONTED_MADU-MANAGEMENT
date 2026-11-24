import { Bell, Command, Search } from 'lucide-react'

export default function Topbar({
  breadcrumbs = { section: 'Inventario', page: 'Movimientos' },
  branch = 'Sucursal Torreón',
}) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <span>{breadcrumbs.section}</span>
        <span className="crumb-slash">/</span>
        <strong>{breadcrumbs.page}</strong>
      </div>
      <div className="top-actions">
        <div className="top-divider" />
        <span className="branch"><span className="status-dot" />{branch}</span>
      </div>
    </header>
  )
}
