import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { dogImage } from '../lib/dogAssets'
import { breedById } from '../lib/scoring'
import { DEFAULT_DOG, isSleepTime, useStore } from '../lib/store'
import { Moon } from './Icons'

const TIPS: [RegExp, string][] = [
  [/^\/quiz/, 'אין תשובות נכונות. תענו לפי החיים שלכם היום, לא לפי מה שהייתם רוצים.'],
  [/^\/results/, 'גם להתאמה הכי גבוהה יש חסרונות. שווה לקרוא את "כדאי שתדע".'],
  [/^\/library/, 'אפשר לעבור בין הכלבים בחיצים או בהחלקה, ולהקיש על כלב כדי להיכנס.'],
  [/^\/breed/, 'גללו למטה כדי לעבור על הגוף שלי, חלק אחרי חלק.'],
  [/./, 'אני כאן איתכם. הקישו עליי בכל שלב אם צריך עזרה.'],
]

/** The dog in the corner. It follows the user through the site, wags when the quiz ends and sleeps at night. */
export function Companion({ wag = false }: { wag?: boolean }) {
  const { myDogs, night } = useStore()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [asleep, setAsleep] = useState(isSleepTime())
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const id = setInterval(() => setAsleep(isSleepTime()), 60_000)
    return () => clearInterval(id)
  }, [])

  const dogs = myDogs.length ? myDogs : [DEFAULT_DOG]
  const sleeping = asleep || night
  const names = dogs.map((d) => breedById(d)?.name).join(' ו')
  const tip = sleeping ? 'ששש, אני ישן. אפשר להמשיך בלעדיי, אני כאן בבוקר.' : TIPS.find(([re]) => re.test(pathname))![1]

  return (
    <div className="fixed bottom-4 z-40 flex items-end gap-2" style={{ insetInlineEnd: 16 }}>
      <AnimatePresence>
        {open && (
          <motion.p
            id="companion-tip" role="status"
            initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
            className="card m-0 mb-3 max-w-[15rem] px-4 py-3 text-[.9375rem] text-ink"
            style={{ borderEndEndRadius: 6 }}
          >{tip}</motion.p>
        )}
      </AnimatePresence>
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="companion-tip"
        aria-label={`הכלב המלווה, ${names}${sleeping ? ', ישן' : ''}. הקישו לטיפ`}
        className="relative grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-full border-2 bg-surface p-0 shadow-lg"
        style={{ borderColor: 'var(--accent)' }}
      >
        {dogs.slice(0, 2).map((d, i) => (
          <img
            key={d} src={dogImage(d)} alt="" width={64} height={64}
            className={`absolute h-[58px] w-[58px] object-contain ${wag && !sleeping ? 'wag' : ''}`}
            style={{
              transform: `${dogs.length > 1 ? `translateX(${i ? -10 : 10}px) scale(.8)` : ''} ${sleeping ? 'rotate(80deg) scale(.8)' : ''}`,
              filter: sleeping ? 'brightness(.7) saturate(.6)' : undefined,
            }}
          />
        ))}
        {sleeping && <span aria-hidden="true" className="absolute -top-2 grid h-7 w-7 place-items-center rounded-full bg-surface text-ink shadow" style={{ insetInlineStart: -4 }}><Moon width={16} height={16} /></span>}
      </button>
    </div>
  )
}
