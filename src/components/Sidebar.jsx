import { Activity, ArrowLeftRight, ChevronDown, CircleHelp, ClipboardList, LayoutDashboard, Package, Settings2, ShieldCheck, Warehouse } from 'lucide-react'

const user = {
  name: 'Valenzuela Guerra',
  role: 'Administrador',
  initials: 'VG',
}

const navItems = [
  { label: 'Panel principal', icon: LayoutDashboard },
  { label: 'Catálogo de productos', icon: Package },
  { label: 'Registro de movimientos', icon: ArrowLeftRight, active: true },
  { label: 'Órdenes de compra', icon: ClipboardList },
  { label: 'Reportes', icon: Activity },
]

export default function Sidebar({ activeItem = 'Registro de movimientos', profileName = 'Valenzuela Guerra' }) {
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
        <button className="profile" type="button">
          <span className="avatar">{user.initials}</span>
          <span className="profile-copy"><strong>{user.name}</strong><small>{user.role}</small></span>
          <ChevronDown size={15} />
        </button>
      </div>
    </aside>
  )
}
