import Topbar from './Topbar.jsx'

export default function MainContent({
  children,
  breadcrumbs,
  branch,
  footer,
}) {
  return (
    <section className="main-panel">
      <Topbar breadcrumbs={breadcrumbs} branch={branch} />
      <div className="page-content">
        {children}
        {footer}
      </div>
    </section>
  )
}
