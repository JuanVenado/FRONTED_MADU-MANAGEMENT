import { Check } from 'lucide-react'

export default function ConfirmButton({
  operation,
  onClick,
  variant = 'footer',
}) {
  const className = variant === 'heading' ? 'heading-save-button' : 'submit-button'

  return (
    <button className={className} type="button" onClick={onClick}>
      <Check size={variant === 'heading' ? 15 : 16} />
      Confirmar y Guardar {operation}
    </button>
  )
}
