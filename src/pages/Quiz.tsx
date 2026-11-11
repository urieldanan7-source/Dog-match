import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Back, Check, Forward } from '../components/Icons'
import { dogImage, dogRun } from '../lib/dogAssets'
import { coreQuestions, refineQuestions } from '../lib/quiz'
import { actions, DEFAULT_DOG, useStore } from '../lib/store'

/** The leash: a line the dog walks along. It replaces the progress bar. */
function Leash({ step, total, dog, walking }: { step: number; total: number; dog: string; walking: boolean }) {
  const p = total > 1 ? step / (total - 1) : 0
  return (
    <div className="relative mt-2 h-24" role="progressbar" aria-label="התקדמות בשאלון" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-valuetext={`שאלה ${step + 1} מתוך ${total}`}>
      {['var(--color-line)', 'var(--accent)'].map((stroke, n) => (
        <svg key={stroke} aria-hidden="true" className="absolute inset-x-0 bottom-3 h-5 w-full" preserveAspectRatio="none" viewBox="0 0 100 10"
          style={n ? { clipPath: `inset(-4px 0 -4px ${(1 - p) * 100}%)`, transition: 'clip-path .6s cubic-bezier(.22,1,.36,1)' } : undefined}>
          <path d="M100 5 Q 87.5 0 75 5 T 50 5 T 25 5 T 0 5" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
      {/* The track is the leash minus one dog. The wrapper spans it and slides by its own width, so only transform animates. */}
      <div className="absolute bottom-3 start-0 h-[76px] w-[calc(100%-76px)]" aria-hidden="true">
      <div className="h-full w-full will-change-transform" style={{ transform: `translateX(${-p * 100}%)`, transition: 'transform .6s cubic-bezier(.22,1,.36,1)' }}>
      <div className="h-[76px] w-[76px]">
        <img aria-hidden="true" alt="" src={walking ? dogRun(dog) : dogImage(dog)} width={76} height={76} className="h-full w-full object-contain" style={{ transform: 'scaleX(-1)' }} />
      </div>
      </div>
      </div>
    </div>
  )
}

export default function Quiz({ refine = false }: { refine?: boolean }) {
  const list = refine ? refineQuestions : coreQuestions
  const { answers, myDogs } = useStore()
  const navigate = useNavigate()
  const firstOpen = useMemo(() => {
    const i = list.findIndex((q) => answers[q.id] === undefined)
    return i === -1 ? 0 : i
    // Only on entry: where the user left off.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [i, setI] = useState(firstOpen)
  const [walking, setWalking] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const prev = useRef(firstOpen)
  const q = list[i]
  const value = answers[q.id]
  const multi = Array.isArray(value) ? value : []

  useEffect(() => {
    if (prev.current === i) return
    prev.current = i
    heading.current?.focus()
    setWalking(true)
    const t = setTimeout(() => setWalking(false), 650)
    return () => clearTimeout(t)
  }, [i])

  const next = () => (i < list.length - 1 ? setI(i + 1) : navigate('/results', { state: { justFinished: true } }))
  const choose = (id: string) => {
    if (q.multi) {
      actions.answer(q.id, multi.includes(id) ? multi.filter((m) => m !== id) : [...multi, id])
    } else {
      actions.answer(q.id, id)
      setTimeout(next, 220)
    }
  }
  const canContinue = q.multi ? true : value !== undefined

  return (
    <Page title={refine ? 'שאלות לדיוק התוצאה' : 'השאלון'}>
      <p className="m-0 flex items-baseline justify-between pt-8">
        <span className="eyebrow">{refine ? 'שאלות לדיוק התוצאה' : 'יוצאים לטיול'}</span>
        <span className="font-semibold text-ink-soft"><span className="numeral text-3xl text-ink">{String(i + 1).padStart(2, '0')}</span> / {list.length}</span>
      </p>
      <Leash step={i} total={list.length} dog={myDogs[0] ?? DEFAULT_DOG} walking={walking} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={q.id} aria-labelledby="q-h"
          initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4"
        >
          <h1 id="q-h" ref={heading} tabIndex={-1} className="text-[2.25rem] font-bold leading-[1.05] outline-none sm:text-5xl">{q.text}</h1>
          {q.help && <p className="m-0 mt-2 text-ink-soft">{q.help}</p>}
          <div role="group" aria-labelledby="q-h" className="mt-7 grid border-t border-line">
            {q.options.map((opt) => {
              const on = q.multi ? multi.includes(opt.id) : value === opt.id
              return (
                <button
                  key={opt.id} type="button" aria-pressed={on} onClick={() => choose(opt.id)}
                  className="flex min-h-16 cursor-pointer items-center justify-between gap-3 border-0 border-b border-solid border-line bg-transparent px-1 text-start text-xl text-ink transition-colors hover:bg-blush"
                  style={{ background: on ? 'var(--color-blush)' : undefined, boxShadow: on ? 'inset -4px 0 0 var(--accent)' : undefined, fontWeight: on ? 600 : 400, paddingInlineStart: on ? 16 : 4, transition: 'padding .2s, background-color .2s' }}
                >
                  <span>{opt.label}</span>
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center border-[1.5px]" style={{ borderRadius: q.multi ? 2 : 999, borderColor: on ? 'var(--accent)' : 'var(--color-ink-soft)', background: on ? 'var(--accent)' : 'transparent', color: '#fff' }}>
                    {on && <Check width={16} height={16} strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.section>
      </AnimatePresence>

      <div className="mt-7 flex items-center justify-between gap-3">
        {i > 0
          ? <button type="button" className="btn btn-ghost" onClick={() => setI(i - 1)}><Back />חזרה</button>
          : <Link to={refine ? '/results' : '/'} className="btn btn-ghost"><Back />{refine ? 'לתוצאות' : 'לדף הבית'}</Link>}
        <button type="button" className="btn btn-primary" onClick={next} disabled={!canContinue} style={{ opacity: canContinue ? 1 : 0.45 }}>
          {i === list.length - 1 ? 'לתוצאות' : q.multi || value !== undefined ? 'המשך' : 'בחרו תשובה'}<Forward />
        </button>
      </div>
      <p className="mt-4 text-sm text-ink-soft">התשובות נשמרות רק במכשיר שלכם.</p>
    </Page>
  )
}
