import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { APP_NAME } from '../config'
import { Header } from '../components/Layout'
import { Companion } from '../components/Companion'
import { Back, Check, Close } from '../components/Icons'
import { reducedMotion, useIris } from '../components/Iris'
import { TraitBar } from '../components/TraitBar'
import { themeFor } from '../lib/breedTheme'
import { dogImage, type StopId } from '../lib/dogAssets'
import { breedById, traits, type Breed as BreedT } from '../lib/scoring'
import { actions, useStore } from '../lib/store'
import { askText, goodAndBad, levelText, stops, tagline, type Stop } from '../lib/traitCopy'

const DogStage = lazy(() => import('../three/DogStage'))

const hasWebGL = () => {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') ?? c.getContext('webgl')) } catch { return false }
}

function headline(breed: BreedT, stop: Stop) {
  const s = breed.scores
  switch (stop.id) {
    case 'legs': return levelText('exercise', s.exercise)
    case 'coat': return `${levelText('shedding', s.shedding)}, ${levelText('grooming', s.grooming).replace('צריך ', '')}`
    case 'body': return `${levelText('size', s.size)}, כ־${breed.care.weightKg} ק״ג`
    default: return levelText(stop.traits[0], s[stop.traits[0]])
  }
}
const paragraph = (breed: BreedT, stop: Stop) =>
  stop.id === 'body' ? '' : askText(stop.id === 'legs' ? 'energy' : stop.traits[0], breed.scores[stop.id === 'legs' ? 'energy' : stop.traits[0]])

/** Hair and dust drifting in the light. */
function Particles() {
  const dots = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    left: (i * 37) % 100, size: 2 + (i % 3), delay: -(i * 1.7), dur: 16 + (i % 7) * 3, dx: ((i % 5) - 2) * 18, op: 0.3 + (i % 4) * 0.1,
  })), [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden motion-reduce:hidden">
      {dots.map((d, i) => (
        <span key={i} className="absolute -bottom-2 rounded-full bg-white" style={{ left: `${d.left}%`, width: d.size, height: d.size, opacity: d.op, ['--dx' as string]: `${d.dx}px`, animation: `float ${d.dur}s linear ${d.delay}s infinite` }} />
      ))}
    </div>
  )
}

const SHEET = 'min-h-[45dvh] gap-3 rounded-t-[28px] bg-[rgb(7_8_11/.72)] p-6 pb-8 backdrop-blur-md sm:min-h-0 sm:w-[460px] sm:gap-4 sm:rounded-[20px] sm:pb-7'

function Block({ active, children, className = '' }: { active: boolean; children: React.ReactNode; className?: string }) {
  const still = reducedMotion()
  return (
    <motion.div
      className={`flex flex-col gap-4 ${className}`} initial={false}
      animate={active ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: still ? 1 : 0.15, y: still ? 0 : 12, filter: still ? 'blur(0px)' : 'blur(8px)' }}
      transition={{ duration: active ? 0.4 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function MyDog({ breed }: { breed: BreedT }) {
  const { myDogs } = useStore()
  const [state, setState] = useState<'idle' | 'ask' | 'fly' | 'done'>('idle')
  const mine = myDogs.includes(breed.id)
  const choose = (add: boolean) => {
    actions.setMyDog(breed.id, add)
    if (reducedMotion()) return setState('done')
    setState('fly')
    setTimeout(() => setState('done'), 1100)
  }
  const w = window.innerWidth, h = window.innerHeight
  return (
    <>
      {state === 'ask' ? (
        <div role="group" aria-label="כבר בחרתם כלב" className="flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-light" onClick={() => choose(false)}>להחליף את {breedById(myDogs[0])?.name}</button>
          <button type="button" className="btn btn-outline-light" onClick={() => choose(true)}>להוסיף ככלב שני</button>
        </div>
      ) : (
        <button
          type="button" className="btn" disabled={mine} style={{ background: 'var(--stage-accent)', color: '#07080B' }}
          onClick={() => (myDogs.length && !mine ? setState('ask') : choose(false))}
        >{mine ? <><Check />זה הכלב שלכם</> : 'זה הכלב שלי'}</button>
      )}
      <p role="status" className="sr-only">{state === 'done' ? `${breed.name} הוא עכשיו הכלב המלווה שלכם` : ''}</p>
      {state === 'fly' && (
        <motion.img
          aria-hidden="true" alt="" src={dogImage(breed.id)} width={220} height={220} className="pointer-events-none fixed left-1/2 top-1/2 z-50 -ml-[110px] -mt-[110px]"
          initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: -(w / 2 - 48), y: h / 2 - 48, scale: 0.29 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </>
  )
}

function Info({ breed }: { breed: BreedT }) {
  const { good, bad } = goodAndBad(breed)
  const c = breed.care
  const still = reducedMotion()
  return (
    <motion.div
      initial={still ? false : { rotateY: 80, opacity: 0 }} whileInView={{ rotateY: 0, opacity: 1 }} viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl rounded-[28px] bg-[#F3F1EC] p-6 text-[#0F2A33] sm:p-9" style={{ transformPerspective: 1400 }}
    >
      <h2 id="info-h" tabIndex={-1} className="display text-4xl outline-none sm:text-5xl">הטוב והרע</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#E1F1EA] p-4 text-[#1F5A40]">
          <h3 className="text-lg">הטוב</h3>
          <ul className="m-0 mt-2 list-disc ps-5 font-semibold">{good.length ? good.map((t) => <li key={t}>{levelText(t, breed.scores[t])}</li>) : <li>אין תכונה שבולטת לטובה בציונים.</li>}</ul>
        </div>
        <div className="rounded-2xl bg-[#FDE9E3] p-4 text-[#7A2E1B]">
          <h3 className="text-lg">הרע</h3>
          <ul className="m-0 mt-2 list-disc ps-5 font-semibold">{bad.length ? bad.map((t) => <li key={t}>{levelText(t, breed.scores[t])}</li>) : <li>אין תכונה קיצונית לרעה בציונים. עדיין, כל כלב דורש זמן, כסף וסבלנות.</li>}</ul>
        </div>
      </div>

      <h3 className="mt-8 text-2xl">כל התכונות</h3>
      <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {traits.map((t) => <TraitBar key={t.id} breed={breed} trait={t.id} color="#0F2A33" track="#D9D5CB" />)}
      </div>

      <h3 className="mt-8 text-2xl">אוכל, מים ועלות</h3>
      <dl className="m-0 mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['משקל ממוצע', `${c.weightKg} ק״ג`], ['אוכל יבש ביום', `${c.foodGramsPerDay} גרם`], ['מים ביום', `${c.waterLitersPerDay} ליטר`], ['אוכל בחודש', `${c.monthlyFoodILS.budget} עד ${c.monthlyFoodILS.premium} ₪`]].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-white p-3">
            <dt className="text-sm font-semibold text-[#45606A]">{k}</dt>
            <dd className="m-0 font-display text-xl font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[.9375rem] text-[#45606A]">
        המספרים הם הערכה לכלב בוגר במשקל ממוצע. הכמות המדויקת היא לפי ההוראות על שק המזון והווטרינר. העלות הכוללת בחודש, עם וטרינר, ציוד וטיפוח: {levelText('cost', breed.scores.cost)}.
      </p>
    </motion.div>
  )
}

export default function Breed() {
  const { id } = useParams()
  const breed = breedById(id ?? '')
  const go = useIris()
  const theme = themeFor(breed?.id)
  const scroller = useRef<HTMLDivElement>(null)
  const [stop, setStop] = useState<StopId | 'info'>('intro')
  const [progress, setProgress] = useState(0)
  const [use3d] = useState(() => !reducedMotion() && hasWebGL())
  const lowPower = useMemo(() => (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 640, [])

  const back = () => go(`/library?dog=${breed?.id ?? ''}`, { dark: false, color: theme.stage })
  useEffect(() => { if (breed) document.title = `${breed.name} | ${APP_NAME}` }, [breed])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('dialog[open]')) back() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  useEffect(() => {
    const root = scroller.current
    if (!root) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setStop((e.target as HTMLElement).dataset.stop as StopId)
    }, { root, rootMargin: '-45% 0px -45% 0px' })
    root.querySelectorAll('[data-stop]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [breed?.id])

  if (!breed) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg p-6 text-center text-ink">
        <main><h1 className="text-3xl">לא מצאנו את הכלב הזה</h1><Link to="/library" className="btn btn-primary mt-4">לספריית הכלבים</Link></main>
      </div>
    )
  }

  const shot: StopId = stop === 'info' ? 'finale' : stop
  const jump = (s: string) => scroller.current?.querySelector<HTMLElement>(`[data-stop="${s}"]`)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
  const section = 'relative flex min-h-dvh snap-start flex-col justify-end sm:justify-center sm:ps-[6vw]'
  const vars = { '--stage': theme.stage, '--glow': theme.glow, '--stage-accent': theme.accent } as CSSProperties
  const dimmed = stop === 'info'
  const centered = stop === 'finale' || stop === 'info'

  return (
    <div className="stage on-dark" style={vars}>
      <a href="#main" className="skip-link">דילוג לתוכן</a>
      <div className="stage-bg" aria-hidden="true" />
      <Particles />
      <div aria-hidden="true" className={`stage-canvas pointer-events-none fixed inset-x-0 top-0 h-[58dvh] transition-opacity duration-500 sm:inset-y-0 sm:right-auto sm:h-auto sm:w-[58%] sm:transition-all sm:duration-700 ${centered ? 'sm:left-[21%]' : 'sm:left-0'}`} style={{ opacity: dimmed ? 0.12 : 1 }}>
        {use3d ? (
          <Suspense fallback={<img src={dogImage(breed.id)} alt="" className="h-full w-full object-contain p-8 opacity-60" />}>
            <DogStage breedId={breed.id} stop={shot} accent={theme.accent} glow={theme.glow} lowPower={lowPower} />
          </Suspense>
        ) : (
          <img src={dogImage(breed.id)} alt="" className="h-full w-full object-contain p-6" style={{ filter: 'drop-shadow(0 30px 40px rgb(0 0 0 / .5))' }} />
        )}
      </div>
      <div className="stage-vignette" aria-hidden="true" />
      <div className="stage-grain" aria-hidden="true" />
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-0.5 bg-white/15"><div className="h-0.5" style={{ width: `${progress * 100}%`, background: 'var(--stage-accent)' }} /></div>

      <div className="fixed inset-x-0 top-0 z-30">
        <Header onDark />
        <button type="button" onClick={back} className="ms-4 flex min-h-11 cursor-pointer items-center gap-1 rounded-full border border-white/40 bg-black/30 px-4 font-semibold text-[#F3F1EC]"><Back width={20} height={20} />לספרייה</button>
      </div>

      <nav aria-label="חלקי הגוף" className="fixed bottom-auto left-1/2 top-[calc(55dvh-68px)] z-30 flex -translate-x-1/2 gap-2 sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:flex-col sm:gap-3" style={{ opacity: dimmed ? 0 : 1, pointerEvents: dimmed ? 'none' : undefined, transition: 'opacity .3s' }}>
        {stops.map((s, n) => {
          const on = stop === s.id
          return (
            <button key={s.id} type="button" onClick={() => jump(s.id)} aria-label={`${n + 1}. ${s.part}: ${s.label}`} aria-current={on ? 'step' : undefined}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-sm font-bold"
              style={on ? { background: 'var(--stage-accent)', color: '#07080B', border: 0 } : { background: 'rgb(7 8 11 / .55)', color: '#F3F1EC', border: '1.5px solid rgb(243 241 236 / .5)' }}
            >{n + 1}</button>
          )
        })}
      </nav>

      <div
        ref={scroller} id="main" tabIndex={-1}
        className="no-scrollbar relative z-10 h-dvh snap-y snap-proximity overflow-y-auto outline-none"
        onScroll={(e) => { const el = e.currentTarget; setProgress(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) }}
      >
        <main>
          <section data-stop="intro" aria-labelledby="breed-h" className={section}>
            <Block active={stop === 'intro'} className="p-6 pb-12 sm:w-[520px] sm:p-0">
              <h1 id="breed-h" className="display text-[4rem] sm:text-[6rem]">{breed.name}</h1>
              <p className="m-0 text-lg text-[#E4E7EC]">{tagline(breed)}</p>
              <p className="m-0 text-[.9375rem] font-semibold text-[#E4E7EC]">גללו למטה לסיור בגוף</p>
            </Block>
          </section>

          {stops.map((s, n) => (
            <section key={s.id} data-stop={s.id} aria-labelledby={`stop-${s.id}`} className={section}>
              <Block active={stop === s.id} className={SHEET}>
                <span className="tag">{n + 1} · {s.part} · {s.label}</span>
                <h2 id={`stop-${s.id}`} className="display text-[2.125rem] sm:text-[3.25rem]">{headline(breed, s)}</h2>
                {paragraph(breed, s) && <p className="m-0 text-lg leading-relaxed text-[#E4E7EC]">{paragraph(breed, s)}</p>}
                {s.traits.map((t) => <TraitBar key={t} breed={breed} trait={t} color="var(--stage-accent)" track="rgb(243 241 236 / .2)" withText={s.traits.length > 1 && s.id !== 'body' || (s.id === 'body' && t !== 'size')} />)}
              </Block>
            </section>
          ))}

          <section data-stop="finale" aria-label="סיום הסיור" className="relative flex min-h-dvh snap-start flex-col items-center justify-end overflow-hidden pb-24 sm:pb-12">
            <div aria-hidden="true" className="display pointer-events-none absolute inset-x-0 top-[26%] whitespace-nowrap text-center text-[24vw] sm:top-[18%]" style={{ color: 'var(--glow)', filter: 'blur(6px) brightness(1.7)', opacity: 0.5 }}>{breed.name}</div>
            <Block active={stop === 'finale'} className="relative items-center px-6">
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" className="btn btn-light" onClick={() => { jump('info'); setTimeout(() => document.getElementById('info-h')?.focus({ preventScroll: true }), 600) }}>הטוב והרע</button>
                <Link to={`/compare?a=${breed.id}`} className="btn btn-outline-light">השוואה לזן אחר</Link>
              </div>
              <MyDog breed={breed} />
            </Block>
          </section>

          <section data-stop="info" aria-labelledby="info-h" className="relative snap-start px-3 py-24 sm:px-6">
            <Info breed={breed} />
            <p className="mx-auto mt-6 flex max-w-3xl justify-center">
              <button type="button" onClick={back} className="btn btn-outline-light"><Close />חזרה לספרייה</button>
            </p>
          </section>
        </main>
      </div>
      {(stop === 'finale' || stop === 'info') && <Companion />}
    </div>
  )
}
