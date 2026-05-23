import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../../i18n/languages'
import { IconChevronDown } from '../icons'
import { cn } from '../../utils/cn'

export function LanguageSelector({ className }) {
  const { i18n, t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const listboxId = useId()
  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0]

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  function handleSelect(code) {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-border-subtle bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:w-auto sm:min-w-[10.5rem]"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={t('language.select')}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-base leading-none" aria-hidden>
            {current.flag}
          </span>
          <span className="truncate font-semibold text-white">{current.nativeLabel}</span>
        </span>
        <IconChevronDown
          className={cn('size-4 shrink-0 text-slate-400 transition', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t('language.select')}
          className="absolute right-0 z-50 mt-2 max-h-72 w-full min-w-[14rem] overflow-auto rounded-xl border border-border-subtle bg-slate-900/95 p-1.5 shadow-xl shadow-black/40 backdrop-blur-md sm:w-56"
        >
          {SUPPORTED_LANGUAGES.map((item) => {
            const selected = item.code === i18n.language
            return (
              <li key={item.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition',
                    selected
                      ? 'bg-accent/15 text-white'
                      : 'text-slate-300 hover:bg-white/6 hover:text-white',
                  )}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {item.flag}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">{item.nativeLabel}</span>
                      {selected ? (
                        <span className="rounded-md bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                          {t('language.active')}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{item.label}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
