import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Alert, Check, Forward, Share } from '../components/Icons'
import { Arch } from '../components/ui'
import { reducedMotion, useIris } from '../components/Iris'
import { themeFor } from '../lib/breedTheme'
import { dogImage, dogRun } from '../lib/dogAssets'
import { coreQuestions, profileFromAnswers, refineQuestions, sizeNote, type Profile } from '../lib/quiz'
import { rankBreeds, traitById, type Match, type TraitId } from '../lib/scoring'
import { useStore } from '../lib/store'
import { goodAndBad, levelText } from '../lib/traitCopy'

const FLAT_FACED = ['french-bulldog', 'english-bulldog', 'pug']

/** Two or three things worth knowing, for every match: weakest fits first, then the hard ends of the breed's scales. */
export function caveatsFor(m: Match): string[] {
  const text = (t: TraitId) => levelText(t, m.breed.scores[t])
  const out = m.parts.filter((p) => m.caveats.includes(p.trait) && p.score < 1).sort((a, b) => a.score - b.score).map((p) => text(p.trait))
  for (const t of goodAndBad(m.breed).bad) if (out.length < 2 && !out.includes(text(t))) out.push(text(t))
  for (const t of ['cost', 'grooming', 'exercise'] as TraitId[]) if (out.length < 2 && !out.includes(text(t))) out.push(`${traitById[t].name}: ${text(t)}`)
  return out.slice(0, 3)
}

function Lineup({ top, animate }: { top: Match[]; animate: boolean }) {
  // Best match in the middle and a step forward, the rest around it.
  const order = [3, 1, 0, 2, 4].filter((i) => top[i])
  const [arrived, setArrived] = useState(!animate)
  return (
    <div aria-hidden="true" className="relative mt-1 flex h-36 items-end justify-center overflow-hidden sm:h-44">
      {order.map((idx, slot) => {
        const m = top[idx]
        const size = idx === 0 ? 132 : 92
        return (
          <motion.div
            key={m.breed.id} className="relative shrink-0" style={{ width: size * 0.72, zIndex: idx === 0 ? 2 : 1 }}
            initial={animate ? { x: 500 + slot * 60, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1, y: idx === 0 ? 0 : -14, scale: 1 }}
            transition={{ duration: 0.9, delay: idx * 0.14, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => idx === Math.min(4, top.length - 1) && setArrived(true)}
          >
            <img src={arrived ? dogImage(m.breed.id) : dogRun(m.breed.id)} alt="" width={size} height={size} className="max-w-none" style={{ width: size, height: size, marginInlineStart: -size * 0.14, transform: 'scaleX(-1)', filter: idx === 0 ? 'drop-shadow(0 10px 8px rgb(15 42 51 / .2))' : undefined }} />
          </motion.div>
        )
      })}
    </div>
  )
}

function Card({ m, rank, profile, lead }: { m: Match; rank: number; profile: Profile; lead: boolean }) {
  const go = useIris()
  const id = m.breed.id
  const warnings: string[] = []
  if (m.overBudget) warnings.push('העלות החודשית גבוהה מהתקציב שסימנתם, ולכן הוא בתחתית הרשימה.')
  if (m.heatWarning) warnings.push('סובל מאוד בחום. בלי מזגן, הקיץ הישראלי מסוכן לו.')
  if (profile.flags.hardVetBill && FLAT_FACED.includes(id)) warnings.push('כלבים עם פנים שטוחות יקרים בווטרינר יותר מהממוצע. כדאי לבדוק ביטוח.')
  if (profile.flags.stairs && id === 'dachshund') warnings.push('מדרגות רבות מסוכנות לגב של דאקסהונד.')
  return (
    <li className={lead ? 'bg-[#160F11] p-5 text-[#F6E4E2] sm:p-8' : 'border-t border-line py-6'} style={lead ? { borderRadius: 6 } : undefined}>
      <div className="flex items-center gap-4 sm:gap-6">
        <Arch id={id} className={`shrink-0 ${lead ? 'h-36 w-28 sm:h-48 sm:w-40' : 'h-24 w-20'}`} />
        <div className="min-w-0 flex-1">
          <span className="eyebrow" style={lead ? { color: '#E7A9A0' } : undefined}>{lead ? 'הכי מתאים לכם' : `מקום ${rank}`}</span>
          <h3 className={`mt-1 font-bold ${lead ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{m.breed.name}</h3>
        </div>
        <p className={`numeral m-0 ${lead ? 'text-6xl sm:text-8xl' : 'text-5xl'}`} style={{ color: lead ? '#F2D7D2' : 'var(--accent)' }}>
          {m.percent}<span className="text-[.5em]">%</span><span className="sr-only"> התאמה</span>
        </p>
      </div>
      {warnings.map((w) => (
        <p key={w} className="m-0 mt-4 flex gap-2 border-s-4 bg-warn-bg p-3 font-semibold text-warn-ink" style={{ borderColor: 'var(--color-warn-ink)' }}><Alert className="shrink-0" />{w}</p>
      ))}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <h4 className="m-0 text-sm font-semibold tracking-wider" style={{ color: lead ? '#E7A9A0' : 'var(--accent)' }}>למה הוא מתאים</h4>
          <ul className="m-0 mt-2 grid list-none gap-1 p-0">{m.reasons.map((t) => <li key={t} className="flex gap-2"><Check width={18} height={18} className="mt-1 shrink-0" />{levelText(t, m.breed.scores[t])}</li>)}</ul>
        </div>
        <div className={lead ? 'border-s border-[#3A2328] ps-5' : 'border-s border-line ps-5'}>
          <h4 className="m-0 text-sm font-semibold tracking-wider" style={{ color: lead ? '#E7A9A0' : 'var(--accent)' }}>כדאי שתדע</h4>
          <ul className="m-0 mt-2 grid list-none gap-1 p-0">{caveatsFor(m).map((c) => <li key={c} className="flex gap-2"><Alert width={18} height={18} className="mt-1 shrink-0" />{c}</li>)}</ul>
        </div>
      </div>
      <button type="button" className={`btn mt-6 w-full sm:w-auto ${lead ? 'btn-light' : 'btn-ghost'}`} onClick={() => go(`/breed/${id}`, { color: themeFor(id).stage })}>
        עוד על {m.breed.name}<Forward />
      </button>
    </li>
  )
}

export default function Results() {
  const { answers } = useStore()
  const { state } = useLocation() as { state: { justFinished?: boolean } | null }
  const answered = coreQuestions.filter((q) => answers[q.id] !== undefined).length
  const profile = useMemo(() => profileFromAnswers(answers), [answers])
  const { matches, notYet } = useMemo(() => rankBreeds(profile.needs, profile.options), [profile])
  const [copied, setCopied] = useState(false)

  if (answered < coreQuestions.length) {
    return (
      <Page title="התוצאות">
        <section className="mt-12 bg-blush p-8 text-center" style={{ borderRadius: 6 }}>
          <h1 className="text-4xl">עוד אין תוצאות</h1>
          <p className="text-ink-soft">עניתם על {answered} מתוך {coreQuestions.length} שאלות. צריך את כולן כדי לחשב התאמה.</p>
          <Link to="/quiz" className="btn btn-primary">{answered ? 'להמשיך מאיפה שעצרתם' : 'להתחיל את השאלון'}</Link>
        </section>
      </Page>
    )
  }

  let inBudget = matches.filter((m) => !m.overBudget)
  const over = matches.filter((m) => m.overBudget)
  // Adopting from a shelter: a mixed dog close to the top moves to the top.
  if (profile.source === 'shelter' && inBudget.length) {
    const best = inBudget[0].percent
    const near = (m: Match) => m.breed.id.startsWith('mixed') && best - m.percent <= 5
    inBudget = [...inBudget.filter(near), ...inBudget.filter((m) => !near(m))]
  }
  const top = inBudget.slice(0, notYet ? 3 : 5)
  const refined = refineQuestions.some((q) => answers[q.id] !== undefined)

  const share = async () => {
    const text = `ההתאמות שלי: ${top.map((m) => `${m.breed.name} ${m.percent}%`).join(', ')}`
    const url = location.origin + import.meta.env.BASE_URL
    try {
      if (navigator.share) await navigator.share({ title: 'איזה כלב מתאים לי', text, url })
      else { await navigator.clipboard.writeText(`${text}\n${url}`); setCopied(true) }
    } catch { /* the user closed the share sheet */ }
  }

  return (
    <Page title="התוצאות" wag={!!state?.justFinished}>
      <span className="eyebrow mt-10">התוצאות שלכם</span>
      <h1 className="mt-2 text-[2.75rem] font-black leading-none sm:text-6xl">{notYet ? 'עוד לא' : 'הכלבים שמתאימים לכם'}</h1>
      {notYet ? (
        <p className="mt-4 border-s-4 bg-warn-bg p-4 text-lg text-warn-ink" style={{ borderColor: 'var(--color-warn-ink)' }}>
          לפי התשובות שלכם, אף כלב ברשימה לא מגיע ל־60% התאמה. זה לא אומר שלא תוכלו לגדל כלב, אלא שכדאי לשנות משהו קודם: יותר זמן ביום, תקציב אחר או ציפיות אחרות. אלה הקרובים ביותר בינתיים.
        </p>
      ) : (
        <p className="m-0 mt-2 text-lg text-ink-soft">מסודרים לפי אחוז ההתאמה. לכל אחד יש גם חסרונות, והם כתובים ליד.</p>
      )}
      {!notYet && <Lineup top={top} animate={!!state?.justFinished && !reducedMotion()} />}

      {[...profile.notes, sizeNote(answers, matches)].filter((n): n is string => !!n).map((n) => <p key={n} className="mt-4 flex gap-2 border-s-4 border-ink bg-blush p-4"><Alert className="shrink-0" />{n}</p>)}
      {profile.options.allergy && <p className="mt-4 border-s-4 border-ink bg-blush p-4">בגלל האלרגיה מוצגים רק כלבים שנושרים מעט. אין כלב שלא גורם לאלרגיה בכלל, אז כדאי לבלות זמן עם הכלב לפני שמחליטים.</p>}

      <ol className="m-0 mt-8 grid list-none gap-0 p-0">
        {top.map((m, i) => <Card key={m.breed.id} m={m} rank={i + 1} profile={profile} lead={i === 0 && !notYet} />)}
      </ol>

      {over.length > 0 && (
        <details className="mt-8 border-t-2 border-ink pt-4">
          <summary className="min-h-11 cursor-pointer content-center font-display text-lg font-bold">{over.length} כלבים שירדו לתחתית בגלל התקציב</summary>
          <ol className="m-0 mt-3 grid list-none p-0">
            {over.map((m, i) => <Card key={m.breed.id} m={m} rank={inBudget.length + i + 1} profile={profile} lead={false} />)}
          </ol>
        </details>
      )}

      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link to="/quiz/refine" className="btn btn-primary">{refined ? 'לעדכן את שאלות הדיוק' : '8 שאלות נוספות לדיוק התוצאה'}</Link>
        <button type="button" className="btn btn-ghost" onClick={share}><Share />שיתוף התוצאות</button>
        <Link to="/quiz" className="btn btn-ghost">לשנות תשובות</Link>
      </section>
      <p role="status" className="mt-2 min-h-6 text-sm text-ink-soft">{copied ? 'התוצאות הועתקו.' : ''}</p>
      <p className="text-sm text-ink-soft">חלק מהציונים הם הערכה שעוד לא נבדקה על ידי וטרינר או מאלף. התוצאה היא נקודת התחלה, לא החלטה.</p>
    </Page>
  )
}
