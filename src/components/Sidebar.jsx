import { Activity, ArrowLeftRight, ClipboardList, LayoutDashboard, Package, Settings2, ShieldCheck, Warehouse } from 'lucide-react'

const navItems = [
  { label: 'Panel principal', icon: LayoutDashboard },
  { label: 'Catálogo de productos', icon: Package },
  { label: 'Registro de movimientos', icon: ArrowLeftRight },
  { label: 'Órdenes de compra', icon: ClipboardList },
  { label: 'Reportes', icon: Activity },
]

export default function Sidebar({ activeItem = 'Registro de movimientos', profileName }) {
  const initials = profileName.trim().split(/\s+/).slice(0, 2).map((name) => name[0]).join('').toUpperCase()

  return (
    <aside className="sidebar">
      <a className="brand" href="#inicio" aria-label="MADU Inventario, inicio">
        <span className="brand-mark"><Warehouse size={21} strokeWidth={2.2} /></span>
        <span className="brand-copy"><strong>MADU</strong><small>INVENTARIO</small></span>
      </a>

      <div className="workspace-label">OPERACIÓN</div>
      <nav className="side-nav" aria-label="Navegación principal">
        {navItems.map(({ label, icon: Icon }) => {
          const active = label === activeItem
          return (
            <button className={`nav-item${active ? ' active' : ''}`} key={label} type="button">
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {active && <span className="nav-indicator" />}
            </button>
          )
        })}
      </nav>

      <div className="workspace-label management-label">ADMINISTRACIÓN</div>
      <nav className="side-nav" aria-label="Administración">
        <button className="nav-item" type="button"><ShieldCheck size={17} strokeWidth={1.8} /><span>Usuarios y permisos</span></button>
        <button className="nav-item" type="button"><Settings2 size={17} strokeWidth={1.8} /><span>Configuración</span></button>
      </nav>

      <div className="sidebar-bottom">
        <div className="profile" title={profileName}>
          <span className="avatar" aria-hidden="true">{initials}</span>
          <span className="profile-copy"><strong>{profileName}</strong></span>
        </div>
      </div>
    </aside>
  )
}
