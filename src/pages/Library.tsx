import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Back, Forward } from '../components/Icons'
import { useIris } from '../components/Iris'
import { themeFor } from '../lib/breedTheme'
import { dogImage } from '../lib/dogAssets'
import { coreQuestions, profileFromAnswers } from '../lib/quiz'
import { breeds, scoreBreed } from '../lib/scoring'
import { useStore } from '../lib/store'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Library() {
  const go = useIris()
  const { answers } = useStore()
  const [params, setParams] = useSearchParams()
  const start = Math.max(0, breeds.findIndex((b) => b.id === (params.get('dog') ?? 'border-collie')))
  const [i, setI] = useState(start)
  const [w, setW] = useState(() => window.innerWidth)
  const wheelLock = useRef(0)
  const n = breeds.length
  const breed = breeds[i]

  const move = useCallback((d: number) => setI((v) => (v + d + n) % n), [n])
  useEffect(() => { setParams({ dog: breed.id }, { replace: true }) }, [breed.id, setParams])
  useEffect(() => {
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const percent = useMemo(() => {
    if (coreQuestions.some((q) => answers[q.id] === undefined)) return null
    const p = profileFromAnswers(answers)
    return scoreBreed(breed, p.needs, p.options)?.percent ?? null
  }, [answers, breed])

  const enter = () => go(`/breed/${breed.id}`, { color: themeFor(breed.id).stage })
  const onKey = (e: React.KeyboardEvent) => {
    // RTL: the next dog is to the left.
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); move(-1) }
  }
  const onWheel = (e: React.WheelEvent) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0
    if (!d || Date.now() < wheelLock.current) return
    wheelLock.current = Date.now() + 500
    move(d < 0 ? 1 : -1)
  }

  const mobile = w < 640
  const size = mobile ? 250 : 340
  const gap = mobile ? 170 : 260
  const span = mobile ? 2 : 3

  return (
    <Page title="ספריית הכלבים">
      <h1 className="pt-2 text-3xl font-extrabold sm:text-4xl">ספריית הכלבים</h1>
      <p className="m-0 mt-1 text-ink-soft">עברו בין הכלבים והקישו על כלב כדי להיכנס.</p>

      <section
        aria-roledescription="קרוסלה" aria-label="כל הכלבים" onKeyDown={onKey} onWheel={onWheel}
        className="relative mt-4 overflow-hidden rounded-[28px]"
        style={{ marginInline: 'calc(50% - 50vw + 8px)', background: 'radial-gradient(ellipse 70% 60% at 50% 88%, #FFFFFF 0%, #F3F5F7 55%, #DDE2E7 100%)' }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-2/3" style={{ background: 'radial-gradient(ellipse 34% 100% at 50% 0%, rgb(255 255 255 / .95), transparent 70%)' }} />
        <motion.div
          className="relative touch-pan-y" style={{ height: size + 60 }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} dragSnapToOrigin
          onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 50) move(info.offset.x > 0 ? 1 : -1) }}
        >
          {breeds.map((b, idx) => {
            let off = idx - i
            if (off > n / 2) off -= n
            if (off < -n / 2) off += n
            if (Math.abs(off) > span) return null
            const center = off === 0
            const theme = themeFor(b.id)
            return (
              <motion.div
                key={b.id} aria-hidden={!center} className="absolute top-0"
                style={{ left: '50%', width: size, height: size, marginLeft: -size / 2, zIndex: 10 - Math.abs(off) }}
                initial={false}
                animate={{ x: -off * gap, y: 26 + Math.abs(off) * Math.abs(off) * -9, scale: center ? 1.15 : 0.8, rotate: center ? 0 : off * -4 + (idx % 3 - 1) * 3, opacity: center ? 1 : 0.75 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <img
                  src={dogImage(b.id)} alt="" width={size} height={size} draggable={false}
                  className={`h-full w-full object-contain ${center ? 'bob' : ''}`}
                  style={{ filter: center ? 'drop-shadow(0 22px 18px rgb(15 42 51 / .22))' : `saturate(.4) drop-shadow(0 0 5px ${theme.accent}) ${Math.abs(off) > 1 ? 'blur(1.5px)' : ''}`, transition: 'filter .6s' }}
                />
              </motion.div>
            )
          })}
          <button type="button" onClick={enter} aria-label={`כניסה לעמוד של ${breed.name}`} className="absolute cursor-pointer rounded-full border-0 bg-transparent" style={{ left: '50%', top: 20, width: size * 0.9, height: size, marginLeft: -size * 0.45, zIndex: 20 }} />
          <button type="button" onClick={() => move(-1)} aria-label="הכלב הקודם" className="absolute top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[#C6CED6] bg-white/80 text-[#0F2A33]" style={{ right: 10 }}><Back /></button>
          <button type="button" onClick={() => move(1)} aria-label="הכלב הבא" className="absolute top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[#C6CED6] bg-white/80 text-[#0F2A33]" style={{ left: 10 }}><Forward /></button>
        </motion.div>

        <div className="relative px-4 pb-6 text-center text-[#0F2A33]" aria-live="polite">
          <motion.h2 key={breed.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="display text-[2.75rem] sm:text-6xl">{breed.name}</motion.h2>
          <p className="m-0 mt-2 min-h-8">
            {percent !== null && <span className="inline-block rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: themeFor(breed.id).uiStrong }}>{percent}% התאמה אליכם</span>}
          </p>
          <button type="button" className="btn mt-3 bg-[#0F2A33] text-white" onClick={enter}>להיכנס<Forward /></button>
          <p className="m-0 mt-3 text-sm text-[#45606A]">{i + 1} מתוך {n}</p>
        </div>
      </section>

      <section aria-labelledby="all-h" className="mt-8">
        <h2 id="all-h" className="text-xl">כל הכלבים ברשימה</h2>
        <ul className="m-0 mt-3 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3">
          {breeds.map((b) => (
            <li key={b.id}><Link to={`/breed/${b.id}`} className="flex min-h-12 items-center rounded-xl border border-line bg-surface px-3 font-semibold text-ink no-underline">{b.name}</Link></li>
          ))}
        </ul>
      </section>
    </Page>
  )
}
