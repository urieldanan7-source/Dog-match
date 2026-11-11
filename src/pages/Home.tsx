import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
import { reducedMotion } from '../components/Iris'
import { dogImage, dogRun } from '../lib/dogAssets'
import { DEFAULT_DOG, useStore } from '../lib/store'
import { Forward } from '../components/Icons'

const SEEN = 'dogmatch.splash'
const seen = () => { try { return sessionStorage.getItem(SEEN) === '1' } catch { return true } }

/** The opening: the dog runs in, hops, shrinks and settles into the circle in the corner. */
function Splash({ dogs, onDone }: { dogs: string[]; onDone: () => void }) {
  const two = dogs.length > 1
  const w = window.innerWidth, h = window.innerHeight
  // The corner circle is 64px, 16px from the bottom and from the inline end (left in RTL).
  const corner = { x: -(w / 2 - 48), y: h / 2 - 48 }
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t) }, [onDone])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 grid place-items-center overflow-hidden">
      {dogs.slice(0, 2).map((d, i) => {
        const fromRight = i === 0
        const meet = two ? (fromRight ? 70 : -70) : 0
        return (
          <motion.div
            key={d} className="absolute"
            initial={{ x: fromRight ? w * 0.75 : -w * 0.75, y: 0, scale: 1 }}
            animate={{ x: [null, meet, meet, meet, corner.x], y: [0, 0, -46, 0, corner.y], scale: [1, 1, 1, 1, 0.29] }}
            transition={{ duration: 3.4, times: [0, 0.56, 0.64, 0.72, 1], ease: ['easeOut', 'easeOut', 'easeIn', [0.22, 1, 0.36, 1]] }}
          >
            <img src={dogRun(d)} alt="" width={220} height={220} style={{ transform: fromRight ? 'scaleX(-1)' : undefined }} />
          </motion.div>
        )
      })}
    </div>
  )
}

export default function Home() {
  const { myDogs } = useStore()
  const dogs = myDogs.length ? myDogs : [DEFAULT_DOG]
  const [splash, setSplash] = useState(() => !seen() && !reducedMotion())
  const done = () => { try { sessionStorage.setItem(SEEN, '1') } catch { /* fine */ } setSplash(false) }
  const reveal = (delay: number) => splash
    ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
    : {}

  return (
    <Page title="בית" companion={!splash}>
      {splash && <Splash dogs={dogs} onDone={done} />}
      <section className="pt-6 sm:pt-12">
        <motion.p {...reveal(2.4)} className="m-0 font-semibold" style={{ color: 'var(--accent-strong)' }}>לפני שמביאים כלב הביתה</motion.p>
        <motion.h1 {...reveal(2.4)} className="mt-2 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          איזה כלב מתאים לחיים שלכם?
        </motion.h1>
        <motion.p {...reveal(2.6)} className="mt-4 max-w-xl text-lg text-ink-soft">
          כמה שאלות על הבית, הזמן והתקציב שלכם, ונראה לכם אילו כלבים מתאימים, וגם מה פחות נוח בכל אחד מהם.
        </motion.p>
        <motion.div {...reveal(2.8)} className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link to="/quiz" className="btn btn-primary">אני מתלבט איזה כלב<Forward /></Link>
          <Link to="/soon" className="btn btn-ghost">כבר יש לי כלב</Link>
        </motion.div>
      </section>

      <motion.section {...reveal(3)} aria-labelledby="lib-h" className="card mt-10 overflow-hidden p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="lib-h" className="text-2xl">ספריית הכלבים</h2>
            <p className="m-0 mt-1 text-ink-soft">21 כלבים, כל אחד עם הטוב והרע שלו.</p>
          </div>
          <Link to="/library" className="btn btn-ghost shrink-0" style={{ minHeight: 44, padding: '0 18px' }}>לספרייה</Link>
        </div>
        <div aria-hidden="true" className="mt-2 flex justify-between">
          {['labrador', 'shih-tzu', 'gsd', 'beagle'].map((d, i) => (
            <img key={d} src={dogImage(d)} alt="" width={140} height={140} loading="lazy" className={`h-auto w-1/4 max-w-[150px] ${i === 3 ? 'hidden sm:block' : ''}`} />
          ))}
        </div>
      </motion.section>
    </Page>
  )
}
