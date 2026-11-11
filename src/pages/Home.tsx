import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
import { reducedMotion } from '../components/Iris'
import { Forward } from '../components/Icons'
import { Arch, SectionHead } from '../components/ui'
import { dogRun } from '../lib/dogAssets'
import { DEFAULT_DOG, useStore } from '../lib/store'
import { OwnerGrid } from './Owner'

const SEEN = 'dogmatch.splash'
const seen = () => { try { return sessionStorage.getItem(SEEN) === '1' } catch { return true } }
const EASE = [0.22, 1, 0.36, 1] as const

/** The opening: the dog runs in, hops, shrinks and settles into the circle in the corner. */
function Splash({ dogs, onDone }: { dogs: string[]; onDone: () => void }) {
  const two = dogs.length > 1
  const w = window.innerWidth, h = window.innerHeight
  const corner = { x: -(w / 2 - 48), y: h / 2 - 48 }
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t) }, [onDone])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 grid place-items-center overflow-hidden">
      <motion.div className="absolute inset-0 bg-bg" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 2.3, duration: 0.6 }} />
      {dogs.slice(0, 2).map((d, i) => {
        const fromRight = i === 0
        const meet = two ? (fromRight ? 70 : -70) : 0
        return (
          <motion.div key={d} className="absolute will-change-transform"
            initial={{ x: fromRight ? w * 0.75 : -w * 0.75, y: 0, scale: 1 }}
            animate={{ x: [null, meet, meet, meet, corner.x], y: [0, 0, -46, 0, corner.y], scale: [1, 1, 1, 1, 0.29] }}
            transition={{ duration: 3.4, times: [0, 0.56, 0.64, 0.72, 1], ease: ['easeOut', 'easeOut', 'easeIn', EASE] }}>
            <img src={dogRun(d)} alt="" width={220} height={220} style={{ transform: fromRight ? 'scaleX(-1)' : undefined }} />
          </motion.div>
        )
      })}
    </div>
  )
}

const STEPS: [string, string, string][] = [
  ['01', '18 שאלות על החיים שלכם', 'הבית, הזמן, התקציב והמשפחה. בלי תשובות נכונות.'],
  ['02', 'התאמה באחוזים', 'לכל כלב: למה הוא מתאים, ומה כדאי שתדעו לפני.'],
  ['03', 'מכירים את הכלב מקרוב', 'סיור בגוף שלו: אילוף, נביחות, פעילות, פרווה ומשפחה.'],
]

export default function Home() {
  const { myDogs } = useStore()
  const dogs = myDogs.length ? myDogs : [DEFAULT_DOG]
  const [splash, setSplash] = useState(() => !seen() && !reducedMotion())
  const done = () => { try { sessionStorage.setItem(SEEN, '1') } catch { /* fine */ } setSplash(false) }
  const reveal = (delay: number) => splash
    ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.7, ease: EASE } }
    : {}

  return (
    <Page title="בית" companion={!splash} wide>
      {splash && <Splash dogs={dogs} onDone={done} />}
      <section className="grid gap-10 pt-10 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <motion.span {...reveal(2.4)} className="eyebrow">לפני שמביאים כלב הביתה</motion.span>
          <motion.h1 {...reveal(2.45)} className="mt-4 text-[3.25rem] font-black leading-[.95] tracking-tight sm:text-[5.5rem]">
            איזה כלב<br />מתאים<br /><span style={{ color: 'var(--accent)' }}>לחיים שלכם?</span>
          </motion.h1>
          <motion.p {...reveal(2.6)} className="mt-6 max-w-lg text-lg text-ink-soft sm:text-xl">
            כמה שאלות על הבית, הזמן והתקציב, ונראה לכם אילו כלבים מתאימים. גם את מה שפחות נוח בכל אחד.
          </motion.p>
          <motion.div {...reveal(2.75)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/quiz" className="btn btn-primary">אני מתלבט איזה כלב<Forward /></Link>
            <Link to="/owner" className="btn btn-ghost">כבר יש לי כלב</Link>
          </motion.div>
        </div>
        <motion.div {...reveal(2.5)} className="relative mx-auto w-full max-w-[420px]">
          <Arch id="border-collie" eager className="aspect-[4/5] w-full" />
          <span className="absolute -bottom-3 start-4 bg-bg px-3 py-1 font-display text-lg font-bold">בורדר קולי</span>
        </motion.div>
      </section>

      <section aria-labelledby="how-h" className="mt-24">
        <SectionHead eyebrow="איך זה עובד" title="שלושה צעדים, חמש דקות" id="how-h" />
        <ol className="m-0 mt-8 grid list-none gap-0 p-0 sm:grid-cols-3">
          {STEPS.map(([n, t, d]) => (
            <li key={n} className="border-t-2 border-ink pt-5 sm:pe-8">
              <span className="numeral text-5xl" style={{ color: 'var(--accent)' }}>{n}</span>
              <h3 className="mt-3 text-2xl">{t}</h3>
              <p className="m-0 mt-2 text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="lib-h" className="-mx-4 mt-24 bg-[#160F11] px-4 py-16 text-[#F6E4E2] sm:-mx-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow" style={{ color: '#E7A9A0' }}>ספריית הכלבים</span>
              <h2 id="lib-h" className="mt-2 text-[2.25rem] leading-[1.05] text-[#F6E4E2] sm:text-[3.25rem]">21 כלבים, כל אחד<br />עם הטוב והרע שלו</h2>
            </div>
            <Link to="/library" className="btn btn-outline-light">לספרייה<Forward /></Link>
          </div>
          <ul className="m-0 mt-10 grid list-none grid-cols-3 gap-3 p-0 sm:gap-5">
            {[['golden', 'גולדן רטריבר'], ['border-collie', 'בורדר קולי'], ['canaan', 'כלב כנעני']].map(([id, name]) => (
              <li key={id}><Link to={`/breed/${id}`} className="block text-[#F6E4E2] no-underline">
                <Arch id={id} eager className="aspect-[3/4] w-full border border-[#3A2328]" />
                <span className="mt-3 block font-display text-lg font-bold sm:text-2xl">{name}</span>
              </Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="own-h" className="mt-24">
        <SectionHead eyebrow="כבר יש לכם כלב?" title="כל מה שצריך לחיים איתו" id="own-h">תזכורות, הנחות, ביטוח, ומה עושים כשמשהו לא בסדר.</SectionHead>
        <OwnerGrid />
      </section>
    </Page>
  )
}
