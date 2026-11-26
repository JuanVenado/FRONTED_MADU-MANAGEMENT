export default function PageHeading({
  eyebrow,
  title,
  description,
  action,
  actions,
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && (
          <div className="eyebrow">
            <span className="eyebrow-line" />
            {eyebrow}
          </div>
        )}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {(actions || action) && (
        <div className="page-heading-actions">
          {actions || action}
        </div>
      )}
    </div>
  )
}
