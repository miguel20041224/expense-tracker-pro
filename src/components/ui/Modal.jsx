import { useTranslation } from 'react-i18next'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IconX } from '../icons'
import { cn } from '../../utils/cn'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  panelClassName,
  size = 'md',
}) {
  const { t } = useTranslation('common')
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-xl',
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm motion-safe:animate-fade-in"
        aria-label={t('actions.close')}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex max-h-[min(92dvh,720px)] w-full flex-col overflow-hidden',
          'border border-border-subtle bg-surface-card shadow-2xl shadow-black/40',
          'motion-safe:animate-sheet-up sm:max-h-[min(88dvh,720px)] sm:rounded-2xl sm:motion-safe:animate-scale-in',
          sizeClasses[size],
          panelClassName,
        )}
      >
        <div
          className={cn(
            'flex shrink-0 items-start justify-between gap-3 border-b border-border-subtle px-5 py-4',
            className,
          )}
        >
          <div className="min-w-0">
            {title ? (
              <h2 id={titleId} className="text-base font-semibold text-slate-100">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-slate-400">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/8 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label={t('actions.close')}
          >
            <IconX className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
