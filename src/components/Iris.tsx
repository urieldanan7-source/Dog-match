import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { animate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Go = (path: string, opts?: { dark?: boolean; color?: string }) => void
const Ctx = createContext<Go>(() => {})
export const useIris = () => useContext(Ctx)

export const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Light to dark and back. Going dark, a hole in a dark sheet closes from the edges inward
 * (700ms), then the route changes. Going light, the same hole opens over the new page.
 */
export function IrisProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const hole = useRef<HTMLSpanElement>(null)
  const [color, setColor] = useState<string | null>(null)
  const busy = useRef(false)

  const go = useCallback<Go>((path, opts = {}) => {
    if (busy.current) return
    if (reducedMotion()) { navigate(path); return }
    busy.current = true
    const dark = opts.dark ?? true
    setColor(opts.color ?? '#07080B')
    requestAnimationFrame(async () => {
      const el = hole.current
      if (!el) { busy.current = false; navigate(path); return }
      const radius = (from: number, to: number, delay = 0) =>
        animate(from, to, { duration: 0.7, ease: EASE, delay, onUpdate: (v) => el.style.setProperty('--r', `${v * 110}vmax`) })
      if (dark) {
        await radius(1, 0)
        navigate(path)
        await animate(el, { opacity: [1, 0] }, { duration: 0.35, delay: 0.1 })
      } else {
        el.style.setProperty('--r', '0vmax')
        await animate(el, { opacity: [0, 1] }, { duration: 0.2 })
        navigate(path)
        await radius(0, 1, 0.05)
      }
      busy.current = false
      setColor(null)
    })
  }, [navigate])

  return (
    <Ctx.Provider value={go}>
      {children}
      {color && <div className="iris" aria-hidden="true" style={{ ['--iris' as string]: color }}><span ref={hole} /></div>}
    </Ctx.Provider>
  )
}
