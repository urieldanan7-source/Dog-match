import type { ReactNode } from 'react'
import { dogImage, dogTurntable } from '../lib/dogAssets'

/** A dog framed in a black arch. Breeds with a better model show its still, the rest the prototype. */
export function Arch({ id, className = '', eager = false }: { id: string; className?: string; eager?: boolean }) {
  const real = dogTurntable(id)
  return (
    <div className={`arch ${real ? 'is-real' : ''} ${className}`} aria-hidden="true">
      <img src={real ? real.poster : dogImage(id)} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" style={real ? undefined : { padding: '18% 8% 6%' }} />
    </div>
  )
}

/** Marks content that is a stand-in until the real data arrives. */
export const Sample = ({ children = 'נתוני דוגמה' }: { children?: ReactNode }) => <span className="sample">{children}</span>

export function SectionHead({ eyebrow, title, children, id }: { eyebrow?: string; title: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 id={id} className="mt-2 text-[2rem] leading-[1.05] sm:text-[2.75rem]">{title}</h2>
      {children && <p className="m-0 mt-3 text-lg text-ink-soft">{children}</p>}
    </div>
  )
}

/** A copyable coupon code. */
export function Coupon({ code, onCopied }: { code: string; onCopied?: () => void }) {
  const copy = async () => { try { await navigator.clipboard.writeText(code); onCopied?.() } catch { /* clipboard blocked */ } }
  return (
    <button type="button" onClick={copy}
      className="inline-flex min-h-11 cursor-pointer items-center gap-3 border-[1.5px] border-dashed border-accent bg-accent-tint px-3 font-semibold tracking-wider text-ink" style={{ borderColor: 'var(--accent)' }}>
      <span dir="ltr">{code}</span><span className="text-sm font-normal" style={{ color: 'var(--accent)' }}>העתקה</span>
    </button>
  )
}

/** A row of toggle chips. Black when on, hairline when off. */
export function Chips<T extends string | null>({ items, value, onChange, label }: { items: readonly (readonly [T, string])[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {items.map(([id, text]) => {
        const on = value === id
        return (
          <button key={text} type="button" aria-pressed={on} onClick={() => onChange(id)}
            className="min-h-11 shrink-0 cursor-pointer border-[1.5px] px-4 font-semibold"
            style={on ? { background: 'var(--color-ink)', color: 'var(--color-bg)', borderColor: 'var(--color-ink)' } : { background: 'transparent', color: 'var(--color-ink)', borderColor: 'var(--color-line)' }}>{text}</button>
        )
      })}
    </div>
  )
}
