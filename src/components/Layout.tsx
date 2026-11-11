import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { APP_NAME } from '../config'
import { actions, useStore } from '../lib/store'
import { Close, Menu, Moon, Paw, Sun } from './Icons'
import { Companion } from './Companion'

const NAV: [string, string][] = [['/quiz', 'השאלון'], ['/library', 'ספריית הכלבים'], ['/my-dog', 'הכלב שלי'], ['/store', 'חנות וקופונים'], ['/insurance', 'ביטוח בריאות']]
const MORE: [string, string][] = [['/', 'בית'], ['/health', 'שאלות בריאות'], ['/toxic', 'מה אסור לכלב לאכול'], ['/compare', 'השוואה בין זנים'], ['/emergency', 'חירום'], ['/accessibility', 'הצהרת נגישות']]
const SOON = ['הבוט זנבי', 'אלבום הגדילה']

/** Applies the theme to <html>: night mode, and the accent of the dog the user chose. */
export function useTheme() {
  const { myDogs, night } = useStore()
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = night ? 'night' : 'light'
    // The brand burgundy stays on light screens. Night mode uses blush.
    root.style.setProperty('--accent', night ? '#E7A9A0' : '#6B1A2C')
    root.style.setProperty('--accent-strong', night ? '#F2D7D2' : '#4C0F1E')
  }, [myDogs, night])
}

/** Leaves a paw print where a button was pressed. */
export function usePawPrints() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest?.('.btn') as HTMLElement | null
      if (!btn || matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const r = btn.getBoundingClientRect()
      const paw = document.createElement('span')
      paw.className = 'paw'
      paw.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><ellipse cx="6" cy="10" rx="2" ry="2.6"/><ellipse cx="10" cy="6" rx="2" ry="2.7"/><ellipse cx="14.5" cy="6" rx="2" ry="2.7"/><ellipse cx="18.5" cy="10" rx="2" ry="2.6"/><path d="M12.2 11c-3 0-5.700 3.200-5.700 5.600 0 1.800 1.500 2.600 3 2.600 1 0 1.800-.5 2.700-.5s1.700.5 2.700.5c1.500 0 3-.8 3-2.600 0-2.400-2.700-5.600-5.700-5.600z"/></svg>'
      paw.style.left = `${e.clientX - r.left}px`
      paw.style.top = `${e.clientY - r.top}px`
      btn.appendChild(paw)
      setTimeout(() => paw.remove(), 650)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

function MenuSheet({ onClose }: { onClose: () => void }) {
  const { night } = useStore()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { ref.current?.showModal() }, [])
  return (
    <dialog
      ref={ref} onClose={onClose} aria-label="תפריט"
      className="m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none border-0 bg-surface p-5 text-ink backdrop:bg-black/50"
      style={{ insetInlineStart: 'auto', insetInlineEnd: 0 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl">תפריט</h2>
        <button type="button" onClick={() => ref.current?.close()} aria-label="סגירת התפריט" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-ink"><Close /></button>
      </div>
      <nav aria-label="ראשי" className="mt-4">
        <ul className="m-0 list-none p-0">
          {[...NAV, ...MORE].map(([to, label]) => (
            <li key={to}><Link to={to} onClick={() => ref.current?.close()} className="flex min-h-12 items-center border-b border-line font-display text-xl font-bold text-ink no-underline">{label}</Link></li>
          ))}
        </ul>
      </nav>
      <button type="button" onClick={() => actions.setNight(!night)} aria-pressed={night} className="btn btn-ghost mt-5 w-full">
        {night ? <Sun /> : <Moon />}{night ? 'מצב יום' : 'מצב לילה'}
      </button>
      <h3 className="mt-6 text-base text-ink-soft">בקרוב</h3>
      <ul className="m-0 mt-1 list-none p-0 text-ink-soft">
        {SOON.map((s) => <li key={s} className="flex min-h-10 items-center">{s}</li>)}
      </ul>
    </dialog>
  )
}

export function Header({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const tone = onDark ? 'text-[#F6E4E2]' : 'text-ink'
  return (
    <header className={`relative z-30 ${onDark ? '' : 'border-b border-line bg-bg'}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 ${tone}`}>
        <Link to="/" className={`flex min-h-11 items-center gap-2 font-display text-[1.375rem] font-bold no-underline ${tone}`}>
          <Paw width={20} height={20} style={{ color: onDark ? 'var(--stage-accent)' : 'var(--accent)' }} />{APP_NAME}
        </Link>
        {!onDark && (
          <nav aria-label="ראשי" className="hidden lg:block">
            <ul className="m-0 flex list-none gap-1 p-0">
              {NAV.map(([to, label]) => {
                const on = pathname === to || (to !== '/' && pathname.startsWith(to))
                return <li key={to}><Link to={to} aria-current={on ? 'page' : undefined} className="flex min-h-11 items-center px-3 text-[.9375rem] font-semibold text-ink no-underline" style={on ? { boxShadow: 'inset 0 -2px 0 var(--accent)' } : undefined}>{label}</Link></li>
              })}
            </ul>
          </nav>
        )}
        <button type="button" onClick={() => setOpen(true)} aria-label="פתיחת התפריט" aria-haspopup="dialog" className={`grid h-11 w-11 cursor-pointer place-items-center border-0 bg-transparent ${onDark ? '' : 'lg:hidden'} ${tone}`}><Menu /></button>
      </div>
      {open && <MenuSheet onClose={() => setOpen(false)} />}
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[#160F11] text-[#F6E4E2]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div>
          <p className="m-0 font-display text-2xl font-bold">{APP_NAME}</p>
          <p className="m-0 mt-2 max-w-xs text-[#C9A2A6]">התאמה כנה בין אנשים לכלבים, עם הטוב והרע של כל אחד.</p>
        </div>
        <nav aria-label="קישורים בתחתית">
          <ul className="m-0 grid list-none gap-1 p-0">{NAV.map(([to, l]) => <li key={to}><Link to={to} className="inline-flex min-h-11 items-center text-[#F6E4E2] no-underline hover:underline">{l}</Link></li>)}</ul>
        </nav>
        <ul className="m-0 grid list-none content-start gap-1 p-0">{MORE.slice(1).map(([to, l]) => <li key={to}><Link to={to} className="inline-flex min-h-11 items-center text-[#F6E4E2] no-underline hover:underline">{l}</Link></li>)}</ul>
      </div>
    </footer>
  )
}

export function Page({ children, title, companion = true, wag = false, wide = false }: { children: ReactNode; title: string; companion?: boolean; wag?: boolean; wide?: boolean }) {
  const { pathname } = useLocation()
  useEffect(() => { document.title = `${title} | ${APP_NAME}` }, [title])
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <a href="#main" className="skip-link">דילוג לתוכן</a>
      <Header />
      <main id="main" tabIndex={-1} className={`mx-auto w-full flex-1 px-4 pb-24 outline-none sm:px-6 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>{children}</main>
      <Footer />
      {companion && <Companion wag={wag} />}
    </div>
  )
}
