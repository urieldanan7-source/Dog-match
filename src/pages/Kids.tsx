import { useState } from 'react'
import { Page } from '../components/Layout'
import { Check } from '../components/Icons'
import { SectionHead } from '../components/ui'
import { addDays, today, useProjects } from '../lib/projects'

const RULES = [
  ['שואלים לפני שמלטפים', 'כלב של מישהו אחר? קודם שואלים את הבעלים, ונותנים לכלב לרחרח את היד.'],
  ['לא מפריעים כשהוא אוכל או ישן', 'גם כלב נחמד יכול לנשוך אם מבהילים אותו.'],
  ['לא מחבקים בצוואר', 'כלבים לא אוהבים חיבוק חזק או נשיקה בפנים. מלטפים בצד ובגב.'],
  ['לשים לב מתי הוא רוצה שקט', 'מתרחק, מלקק שפתיים, מפהק או מראה את הלבן בעיניים? נותנים לו מנוחה.'],
  ['לא רצים ולא צועקים ליד כלב זר', 'כלב זר מתקרב? עומדים בשקט כמו עץ, ידיים צמודות לגוף.'],
  ['לא מושכים בזנב ובאוזניים', 'זה כואב לו, גם אם הוא לא צועק.'],
] as const
const CHORES = [['water', 'למלא מים'], ['feed', 'להאכיל, עם מבוגר'], ['walk', 'טיול, עם מבוגר'], ['brush', 'לסרק'], ['play', 'לשחק 10 דקות'], ['toys', 'לאסוף צעצועים']] as const
const DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
const KEY = 'dogmatch.kids.v1'

const weekStart = () => { const d = new Date(today() + 'T12:00'); return addDays(today(), -d.getDay()) }
const load = (): { week: string; on: string[] } => {
  try { const s = JSON.parse(localStorage.getItem(KEY) ?? 'null'); if (s?.week === weekStart()) return s } catch { /* new week */ }
  return { week: weekStart(), on: [] }
}

export default function Kids() {
  const dogs = useProjects()
  const name = dogs[0]?.name ?? 'הכלב'
  const [s, setS] = useState(load)
  const toggle = (k: string) => {
    const next = { ...s, on: s.on.includes(k) ? s.on.filter((x) => x !== k) : [...s.on, k] }
    setS(next); try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ok */ }
  }
  const todayIdx = new Date().getDay()
  return (
    <Page title="מצב ילדים" wide>
      <div className="pt-10"><SectionHead eyebrow="מצב ילדים" title={`איך מתנהגים עם ${name}`}>כללים פשוטים לילדים, ולוח משימות שבועי שמסמנים ביחד.</SectionHead></div>
      <ol className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {RULES.map(([t, x], i) => (
          <li key={t} className="card p-6">
            <span className="numeral text-5xl" style={{ color: 'var(--accent)' }}>{i + 1}</span>
            <h2 className="mt-2 text-2xl">{t}</h2>
            <p className="m-0 mt-2 text-lg text-ink-soft">{x}</p>
          </li>
        ))}
      </ol>

      <section aria-labelledby="ch-h" className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="ch-h" className="text-3xl">המשימות של השבוע</h2>
          <p className="numeral m-0 text-4xl" style={{ color: 'var(--accent)' }}>{s.on.length}<span className="ms-2 font-body text-base font-semibold text-ink-soft">כוכבים</span></p>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-center">
            <thead><tr><th scope="col" className="p-2 text-start">משימה</th>{DAYS.map((d, i) => <th key={d} scope="col" className="p-2" style={i === todayIdx ? { color: 'var(--accent)' } : undefined}>{d}</th>)}</tr></thead>
            <tbody>
              {CHORES.map(([id, label]) => (
                <tr key={id} className="border-t border-line">
                  <th scope="row" className="p-2 text-start font-semibold">{label}</th>
                  {DAYS.map((d, i) => {
                    const k = `${id}-${i}`, on = s.on.includes(k)
                    return (
                      <td key={d} className="p-1">
                        <button type="button" aria-pressed={on} aria-label={`${label}, יום ${d}`} onClick={() => toggle(k)}
                          className="grid h-11 w-11 cursor-pointer place-items-center border-[1.5px] p-0"
                          style={on ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' } : { background: 'transparent', borderColor: 'var(--color-line)', color: 'var(--color-ink)' }}>
                          {on && <Check width={20} height={20} />}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 mt-3 text-sm text-ink-soft">הלוח מתאפס בכל יום ראשון.</p>
      </section>
    </Page>
  )
}
