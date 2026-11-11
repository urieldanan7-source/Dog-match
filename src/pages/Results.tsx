import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Alert, Forward, Share } from '../components/Icons'
import { reducedMotion, useIris } from '../components/Iris'
import { themeFor } from '../lib/breedTheme'
import { dogImage, dogRun } from '../lib/dogAssets'
import { coreQuestions, profileFromAnswers, refineQuestions, type Profile } from '../lib/quiz'
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
    <li className="card p-5" style={lead ? { outline: '3px solid var(--accent)' } : undefined}>
      <div className="flex items-center gap-4">
        <img src={dogImage(id)} alt="" width={84} height={84} loading="lazy" className="h-[84px] w-[84px] shrink-0 rounded-2xl bg-accent-tint object-contain" />
        <div className="min-w-0 flex-1">
          <p className="m-0 text-sm font-semibold text-ink-soft">{lead ? 'ההתאמה הכי גבוהה' : `מקום ${rank}`}</p>
          <h3 className="text-2xl font-bold">{m.breed.name}</h3>
        </div>
        <p className="m-0 font-display text-4xl font-extrabold" style={{ color: 'var(--accent-strong)' }}>
          {m.percent}%<span className="sr-only"> התאמה</span>
        </p>
      </div>
      {warnings.map((w) => (
        <p key={w} className="m-0 mt-3 flex gap-2 rounded-xl bg-warn-bg p-3 font-semibold text-warn-ink"><Alert className="shrink-0" />{w}</p>
      ))}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="m-0 font-display text-base font-bold">למה הוא מתאים</h4>
          <ul className="m-0 mt-1 list-disc ps-5">{m.reasons.map((t) => <li key={t}>{levelText(t, m.breed.scores[t])}</li>)}</ul>
        </div>
        <div className="rounded-xl bg-accent-tint p-3">
          <h4 className="m-0 font-display text-base font-bold">כדאי שתדע</h4>
          <ul className="m-0 mt-1 list-disc ps-5">{caveatsFor(m).map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </div>
      <button type="button" className="btn btn-primary mt-4 w-full sm:w-auto" onClick={() => go(`/breed/${id}`, { color: themeFor(id).stage })}>
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
        <section className="card mt-8 p-6 text-center">
          <h1 className="text-3xl">עוד אין תוצאות</h1>
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
      <h1 className="pt-4 text-4xl font-extrabold">{notYet ? 'עוד לא' : 'הכלבים שמתאימים לכם'}</h1>
      {notYet ? (
        <p className="mt-3 rounded-2xl bg-warn-bg p-4 text-lg text-warn-ink">
          לפי התשובות שלכם, אף כלב ברשימה לא מגיע ל־60% התאמה. זה לא אומר שלא תוכלו לגדל כלב, אלא שכדאי לשנות משהו קודם: יותר זמן ביום, תקציב אחר או ציפיות אחרות. אלה הקרובים ביותר בינתיים.
        </p>
      ) : (
        <p className="m-0 mt-2 text-lg text-ink-soft">מסודרים לפי אחוז ההתאמה. לכל אחד יש גם חסרונות, והם כתובים ליד.</p>
      )}
      {!notYet && <Lineup top={top} animate={!!state?.justFinished && !reducedMotion()} />}

      {profile.notes.map((n) => <p key={n} className="mt-4 flex gap-2 rounded-2xl bg-accent-tint p-4"><Alert className="shrink-0" />{n}</p>)}
      {profile.options.allergy && <p className="mt-4 rounded-2xl bg-accent-tint p-4">בגלל האלרגיה מוצגים רק כלבים שנושרים מעט. אין כלב שלא גורם לאלרגיה בכלל, אז כדאי לבלות זמן עם הכלב לפני שמחליטים.</p>}

      <ol className="m-0 mt-5 grid list-none gap-4 p-0">
        {top.map((m, i) => <Card key={m.breed.id} m={m} rank={i + 1} profile={profile} lead={i === 0 && !notYet} />)}
      </ol>

      {over.length > 0 && (
        <details className="card mt-5 p-5">
          <summary className="min-h-11 cursor-pointer content-center font-display text-lg font-bold">{over.length} כלבים שירדו לתחתית בגלל התקציב</summary>
          <ol className="m-0 mt-3 grid list-none gap-4 p-0">
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
