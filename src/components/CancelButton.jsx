import { RotateCcw } from 'lucide-react'

export default function CancelButton({
  onClick,
  variant = 'footer',
  showIcon = false,
}) {
  const className = variant === 'heading' ? 'heading-cancel-button' : 'cancel-button'

  return (
    <button className={className} type="button" onClick={onClick}>
      {showIcon && <RotateCcw size={14} />}
      Cancelar
    </button>
  )
}
