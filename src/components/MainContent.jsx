import Topbar from './Topbar.jsx'

export default function MainContent({
  children,
  breadcrumbs,
  branch,
  topbarActions,
  footer,
}) {
  return (
    <section className="main-panel">
      <Topbar breadcrumbs={breadcrumbs} branch={branch} actions={topbarActions} />
      <div className="page-content">
        {children}
        {footer}
      </div>
    </section>
  )
}
