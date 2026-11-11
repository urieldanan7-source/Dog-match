import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Alert, Check, Forward } from '../components/Icons'
import { Arch, SectionHead } from '../components/ui'
import { duties, reminders } from '../data/care'
import { addDays, daysBetween, formatDate, projects, today, useProjects, type Project } from '../lib/projects'
import { breedById, breeds } from '../lib/scoring'
import { useStore } from '../lib/store'
import { levelText } from '../lib/traitCopy'

function NewProject({ onDone }: { onDone?: () => void }) {
  const { myDogs } = useStore()
  const navigate = useNavigate()
  const [breedId, setBreed] = useState(myDogs[0] ?? 'mixed-medium')
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const id = projects.create({ name: String(f.get('name')).trim(), breedId, birth: String(f.get('birth')) || undefined })
    onDone?.()
    navigate(`/my-dog/${id}`)
  }
  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-3 sm:items-end">
      <div className="grid gap-2"><label htmlFor="name" className="font-semibold">איך קוראים לו?</label><input id="name" name="name" required maxLength={30} className="field" autoComplete="off" /></div>
      <div className="grid gap-2">
        <label htmlFor="breed" className="font-semibold">זן</label>
        <select id="breed" className="field" value={breedId} onChange={(e) => setBreed(e.target.value)}>{breeds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
      </div>
      <div className="grid gap-2"><label htmlFor="birth" className="font-semibold">תאריך לידה <span className="font-normal text-ink-soft">(אם ידוע)</span></label><input id="birth" name="birth" type="date" max={today()} className="field" /></div>
      <button className="btn btn-primary sm:col-span-3 sm:justify-self-start">פתיחת פרויקט</button>
    </form>
  )
}

export function MyDogList() {
  const list = useProjects()
  return (
    <Page title="הכלב שלי" wide>
      <div className="pt-10"><SectionHead eyebrow="הכלב שלי" title="פרויקט לכל כלב">חיסונים ותזכורות, אוכל ומים, וחובות של בעלי כלבים. אפשר לפתוח כמה פרויקטים שרוצים.</SectionHead></div>
      {list.length > 0 && (
        <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.id}>
              <Link to={`/my-dog/${p.id}`} className="card flex items-center gap-4 p-4 text-ink no-underline hover:border-ink">
                <Arch id={p.breedId} className="h-28 w-24 shrink-0" />
                <span className="grid gap-1"><span className="font-display text-2xl font-bold">{p.name}</span><span className="text-ink-soft">{breedById(p.breedId)?.name}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-12 text-2xl">{list.length ? 'כלב נוסף' : 'הכלב הראשון'}</h2>
      <div className="mt-4"><NewProject /></div>
    </Page>
  )
}

function dueDate(p: Project, r: (typeof reminders)[number]): string | null {
  const last = p.done[r.id]
  if (r.atAgeWeeks !== undefined) {
    if (!p.birth || last) return null
    const due = addDays(p.birth, r.atAgeWeeks * 7)
    return daysBetween(p.birth, today()) > 365 ? null : due
  }
  return addDays(last ?? p.created, r.everyDays!)
}

export function MyDogProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const list = useProjects()
  const p = list.find((x) => x.id === id)
  const [confirm, setConfirm] = useState(false)
  const items = useMemo(() => (p ? reminders.map((r) => ({ r, due: dueDate(p, r) })).filter((x) => x.due).sort((a, b) => a.due!.localeCompare(b.due!)) : []), [p])
  if (!p) return <Page title="הכלב שלי"><p className="pt-10 text-lg">לא מצאנו את הפרויקט הזה. <Link to="/my-dog" className="link">לכל הכלבים</Link></p></Page>
  const breed = breedById(p.breedId)!
  const c = breed.care
  const bagDays = p.bag ? Math.floor((p.bag.kg * 1000) / c.foodGramsPerDay) : 0
  const bagLeft = p.bag ? bagDays - daysBetween(p.bag.opened, today()) : 0
  const ageMonths = p.birth ? Math.floor(daysBetween(p.birth, today()) / 30.4) : null

  return (
    <Page title={p.name} wide>
      <div className="grid gap-8 pt-10 sm:grid-cols-[1fr_220px] sm:items-end">
        <div>
          <span className="eyebrow">הפרויקט של</span>
          <h1 className="mt-2 text-[3.5rem] font-black leading-none sm:text-7xl">{p.name}</h1>
          <p className="m-0 mt-3 text-lg text-ink-soft">{breed.name}{ageMonths !== null && ` · ${ageMonths < 24 ? `בן ${ageMonths} חודשים` : `בן ${Math.floor(ageMonths / 12)}`}`}</p>
          <Link to={`/breed/${breed.id}`} className="link mt-3 inline-flex min-h-11 items-center">הכל על {breed.name}</Link>
        </div>
        <Arch id={breed.id} eager className="hidden h-64 sm:block" />
      </div>

      <section aria-labelledby="rem-h" className="mt-12">
        <h2 id="rem-h" className="text-3xl">תזכורות</h2>
        <p className="m-0 mt-1 text-ink-soft">לוח כללי. הווטרינר קובע את הלוח המדויק.{!p.birth && ' בלי תאריך לידה לא מוצגים חיסוני גורים.'}</p>
        <ul className="m-0 mt-5 grid list-none p-0">
          {items.map(({ r, due }) => {
            const left = daysBetween(today(), due!)
            const late = left < 0
            return (
              <li key={r.id} className="grid grid-cols-[72px_1fr] items-center gap-x-4 gap-y-3 border-t border-line py-4 last:border-b sm:grid-cols-[96px_1fr_auto]">
                <span className="numeral text-3xl" style={{ color: late ? 'var(--color-warn-ink)' : 'var(--accent)' }}>{late ? '!' : left}<span className="ms-1 font-body text-sm font-semibold">{late ? '' : 'ימים'}</span></span>
                <span className="min-w-0"><span className="block font-semibold">{r.title}</span><span className="text-sm text-ink-soft">{late ? `עבר המועד, ${formatDate(due!)}` : formatDate(due!)} · {r.note}</span></span>
                <button type="button" className="btn btn-ghost btn-sm col-start-2 justify-self-start sm:col-start-3" onClick={() => projects.update(p.id, { done: { ...p.done, [r.id]: today() } })}><Check width={18} height={18} />בוצע היום</button>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="food-h" className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 id="food-h" className="text-3xl">אוכל ומים</h2>
          <dl className="m-0 mt-5 grid grid-cols-2 gap-5">
            {[['אוכל יבש ביום', `${c.foodGramsPerDay} גרם`], ['מים ביום', `${c.waterLitersPerDay} ליטר`], ['משקל ממוצע', `${c.weightKg} ק״ג`], ['אוכל בחודש', `${c.monthlyFoodILS.budget} עד ${c.monthlyFoodILS.premium} ₪`]].map(([k, v]) => (
              <div key={k}><dt className="text-sm text-ink-soft">{k}</dt><dd className="m-0 font-display text-3xl font-bold">{v}</dd></div>
            ))}
          </dl>
          <p className="m-0 mt-4 text-sm text-ink-soft">הערכה לכלב בוגר במשקל ממוצע. הכמות המדויקת לפי השק והווטרינר.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-2xl">מתי נגמר השק?</h3>
          {p.bag ? (
            <>
              <p className="numeral m-0 mt-4 text-6xl" style={{ color: bagLeft <= 5 ? 'var(--color-warn-ink)' : 'var(--accent)' }}>{Math.max(0, bagLeft)}<span className="ms-2 font-body text-lg font-semibold">ימים</span></p>
              <p className="m-0 mt-2 text-ink-soft">שק של {p.bag.kg} ק״ג שנפתח ב־{formatDate(p.bag.opened)} מספיק לכ־{bagDays} ימים.</p>
              {bagLeft <= 7 && <Link to="/store?c=food" className="btn btn-primary mt-4">להזמין שק חדש<Forward /></Link>}
              <button type="button" className="link mt-3 block min-h-11 cursor-pointer border-0 bg-transparent p-0" onClick={() => projects.update(p.id, { bag: undefined })}>פתחתי שק חדש</button>
            </>
          ) : (
            <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); const kg = Number(new FormData(e.currentTarget).get('kg')); if (kg > 0) projects.update(p.id, { bag: { kg, opened: today() } }) }}>
              <div className="grid gap-2"><label htmlFor="kg" className="font-semibold">גודל השק שפתחתם היום (ק״ג)</label><input id="kg" name="kg" type="number" min="1" max="40" step="0.5" required className="field w-40" inputMode="decimal" /></div>
              <button className="btn btn-ink">לחשב</button>
            </form>
          )}
        </div>
      </section>

      <section aria-labelledby="duty-h" className="mt-14">
        <h2 id="duty-h" className="text-3xl">חובות של בעלי כלבים</h2>
        <p className="m-0 mt-1 text-ink-soft">לפי התקנות בישראל. כדאי לוודא מול הרשות המקומית.</p>
        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-2">
          {duties.map((d) => {
            const on = p.duties.includes(d.id)
            return (
              <li key={d.id}>
                <label className="card flex min-h-11 cursor-pointer gap-3 p-4" style={on ? { borderColor: 'var(--accent)' } : undefined}>
                  <input type="checkbox" checked={on} onChange={() => projects.update(p.id, { duties: on ? p.duties.filter((x) => x !== d.id) : [...p.duties, d.id] })} className="mt-1 h-5 w-5 shrink-0" style={{ accentColor: 'var(--accent)' }} />
                  <span><span className="block font-semibold">{d.title}</span><span className="text-ink-soft">{d.text}</span></span>
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="know-h" className="mt-14">
        <h2 id="know-h" className="text-3xl">מה כדאי לזכור על {breed.name}</h2>
        <ul className="m-0 mt-4 grid list-none gap-2 p-0 sm:grid-cols-2">
          {(['exercise', 'alone', 'grooming', 'heat'] as const).map((t) => <li key={t} className="border-t border-line pt-3"><span className="font-semibold">{levelText(t, breed.scores[t])}</span></li>)}
        </ul>
      </section>

      <div className="mt-16 border-t border-line pt-6">
        {confirm ? (
          <p className="m-0 flex flex-wrap items-center gap-3"><Alert />למחוק את הפרויקט של {p.name}? אי אפשר לשחזר.
            <button type="button" className="btn btn-sm btn-primary" onClick={() => { projects.remove(p.id); navigate('/my-dog') }}>מחיקה</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirm(false)}>ביטול</button>
          </p>
        ) : <button type="button" className="link min-h-11 cursor-pointer border-0 bg-transparent p-0" onClick={() => setConfirm(true)}>מחיקת הפרויקט</button>}
      </div>
    </Page>
  )
}
