import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Back, Forward } from '../components/Icons'
import { useIris } from '../components/Iris'
import { themeFor } from '../lib/breedTheme'
import { Arch } from '../components/ui'
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
  const size = mobile ? 230 : 300
  const gap = mobile ? 190 : 270
  const span = mobile ? 2 : 3

  return (
    <Page title="ספריית הכלבים" wide>
      <span className="eyebrow mt-10">ספריית הכלבים</span>
      <h1 className="mt-2 text-[2.75rem] font-black leading-none sm:text-6xl">21 כלבים, מקרוב</h1>
      <p className="m-0 mt-3 text-lg text-ink-soft">עברו בין הכלבים בחיצים או בהחלקה, והקישו על כלב כדי להיכנס.</p>

      <section
        aria-roledescription="קרוסלה" aria-label="כל הכלבים" onKeyDown={onKey} onWheel={onWheel}
        className="relative mt-8 overflow-hidden rounded-[6px]"
        style={{ background: 'var(--color-blush)' }}
      >
        <motion.div
          className="relative touch-pan-y" style={{ height: size * 1.25 + 40 }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} dragSnapToOrigin
          onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 50) move(info.offset.x > 0 ? 1 : -1) }}
        >
          {breeds.map((b, idx) => {
            let off = idx - i
            if (off > n / 2) off -= n
            if (off < -n / 2) off += n
            if (Math.abs(off) > span) return null
            const center = off === 0
            return (
              <motion.div
                key={b.id} aria-hidden={!center} className="absolute top-0"
                style={{ left: '50%', width: size, height: size * 1.25, marginLeft: -size / 2, zIndex: 10 - Math.abs(off) }}
                initial={false}
                animate={{ x: -off * gap, y: center ? 24 : 60, scale: center ? 1 : 0.74, opacity: center ? 1 : Math.abs(off) > 1 ? 0.35 : 0.6 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Arch id={b.id} eager={Math.abs(off) <= 1} className="h-full w-full" />
              </motion.div>
            )
          })}
          <button type="button" onClick={enter} aria-label={`כניסה לעמוד של ${breed.name}`} className="absolute cursor-pointer rounded-full border-0 bg-transparent" style={{ left: '50%', top: 24, width: size, height: size * 1.25, marginLeft: -size / 2, zIndex: 20 }} />
          <button type="button" onClick={() => move(-1)} aria-label="הכלב הקודם" className="absolute top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-ink text-bg" style={{ right: 12 }}><Back /></button>
          <button type="button" onClick={() => move(1)} aria-label="הכלב הבא" className="absolute top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-ink text-bg" style={{ left: 12 }}><Forward /></button>
        </motion.div>

        <div className="relative px-4 pb-8 pt-2 text-center text-ink" aria-live="polite">
          <motion.h2 key={breed.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="display text-[3rem] sm:text-7xl">{breed.name}</motion.h2>
          <p className="m-0 mt-2 min-h-8">
            {percent !== null && <span className="inline-block bg-ink px-3 py-1 text-sm font-semibold text-bg">{percent}% התאמה אליכם</span>}
          </p>
          <button type="button" className="btn btn-primary mt-3" onClick={enter}>להיכנס<Forward /></button>
          <p className="m-0 mt-3 text-sm text-ink-soft">{i + 1} מתוך {n}</p>
        </div>
      </section>

      <section aria-labelledby="all-h" className="mt-14">
        <h2 id="all-h" className="text-3xl">כל הכלבים ברשימה</h2>
        <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-x-6 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {breeds.map((b) => (
            <li key={b.id}><Link to={`/breed/${b.id}`} className="flex min-h-12 items-center border-b border-line font-display text-lg font-bold text-ink no-underline hover:text-[var(--accent)]">{b.name}</Link></li>
          ))}
        </ul>
      </section>
    </Page>
  )
}
