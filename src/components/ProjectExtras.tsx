import { useState } from 'react'
import { Link } from 'react-router-dom'
import { album, useAlbum } from '../lib/album'
import { daysBetween, formatDate, today, type Project } from '../lib/projects'
import { isSenior, seniorFromYears, toICS } from '../lib/reminders'

const ageAt = (birth: string | undefined, date: string) => {
  if (!birth) return null
  const d = daysBetween(birth, date)
  if (d < 0) return null
  if (d < 70) return `בן ${Math.floor(d / 7)} שבועות`
  const m = Math.floor(d / 30.4)
  return m < 24 ? `בן ${m} חודשים` : `בן ${Math.floor(m / 12)}`
}

export function Album({ p }: { p: Project }) {
  const { photos, error } = useAlbum(p.id)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget, f = new FormData(form)
    const file = f.get('photo') as File
    if (!file?.size) return
    setBusy(true)
    try { await album.add(p.id, file, String(f.get('date')) || today(), String(f.get('note')).trim()); form.reset(); setMsg('התמונה נוספה לאלבום') }
    catch { setMsg('לא הצלחנו לשמור. ייתכן שהדפדפן חוסם שמירה במכשיר.') }
    setBusy(false)
  }
  return (
    <section id="album" aria-labelledby="album-h" className="mt-14">
      <h2 id="album-h" className="text-3xl">אלבום הגדילה</h2>
      <p className="m-0 mt-1 text-ink-soft">תמונה כל כמה שבועות, ותראו איך {p.name} גדל. התמונות נשמרות רק במכשיר הזה.</p>
      <form onSubmit={add} className="card mt-5 grid gap-4 p-5 sm:grid-cols-[1.4fr_1fr_1.4fr_auto] sm:items-end">
        <div className="grid gap-2"><label htmlFor="photo" className="font-semibold">תמונה</label><input id="photo" name="photo" type="file" accept="image/*" required className="field py-3" /></div>
        <div className="grid gap-2"><label htmlFor="pdate" className="font-semibold">מתי צולמה</label><input id="pdate" name="date" type="date" max={today()} defaultValue={today()} className="field" /></div>
        <div className="grid gap-2"><label htmlFor="pnote" className="font-semibold">כמה מילים <span className="font-normal text-ink-soft">(לא חובה)</span></label><input id="pnote" name="note" maxLength={80} className="field" autoComplete="off" /></div>
        <button className="btn btn-ink" disabled={busy}>{busy ? 'שומר…' : 'הוספה'}</button>
      </form>
      <p role="status" className="m-0 mt-2 min-h-6 text-sm text-ink-soft">{error ? 'האלבום לא זמין בדפדפן הזה.' : msg}</p>
      {photos.length > 0 && (
        <ol className="m-0 mt-3 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((ph) => (
            <li key={ph.id} className="group relative">
              <img src={ph.url} alt={`${p.name}, ${formatDate(ph.date)}${ph.note ? `, ${ph.note}` : ''}`} className="aspect-[4/5] w-full object-cover" style={{ borderRadius: 'var(--radius-card)' }} loading="lazy" />
              <p className="m-0 mt-2 font-display text-lg font-bold">{ageAt(p.birth, ph.date) ?? formatDate(ph.date)}</p>
              <p className="m-0 text-sm text-ink-soft">{ageAt(p.birth, ph.date) ? formatDate(ph.date) : ''}{ph.note && ` · ${ph.note}`}</p>
              <button type="button" onClick={() => album.remove(ph.id)} className="link min-h-11 cursor-pointer border-0 bg-transparent p-0 text-sm">הסרה</button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

const SENIOR_TIPS = [
  ['בדיקה פעמיים בשנה', 'כולל בדיקות דם. מחלות של גיל מבוגר מתגלות מוקדם יותר.'],
  ['לשים לב לשינויים', 'שותה יותר, ישן יותר, מתבלבל או נובח בלילה: לספר לווטרינר.'],
  ['הליכות קצרות ותכופות', 'במקום טיול ארוך אחד. בלי קפיצות ממקום גבוה.'],
  ['מיטה רכה ושטיח שלא מחליק', 'עוזר למפרקים, במיוחד על רצפה חלקה.'],
  ['משקל ושיניים', 'עודף משקל מכביד על המפרקים, וכאב שיניים גורם לו לאכול פחות.'],
  ['אוכל לגיל מבוגר', 'לשאול את הווטרינר אם ומתי לעבור.'],
] as const

export function Senior({ p }: { p: Project }) {
  if (!isSenior(p)) return null
  return (
    <section aria-labelledby="sen-h" className="mt-14 bg-[#160F11] p-6 text-[#F6E4E2] sm:p-8" style={{ borderRadius: 'var(--radius-card)' }}>
      <span className="eyebrow" style={{ color: '#E7A9A0' }}>גיל הזהב</span>
      <h2 id="sen-h" className="mt-2 text-3xl text-[#F6E4E2]">{p.name} כבר כלב מבוגר</h2>
      <p className="m-0 mt-2 text-[#C9A2A6]">כלבים בגודל של {p.name} נחשבים מבוגרים מגיל {seniorFromYears(p.breedId)} בערך. הוספנו לתזכורות בדיקה פעמיים בשנה.</p>
      <ul className="m-0 mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {SENIOR_TIPS.map(([t, x]) => <li key={t} className="border-t border-[#5C4A4F] pt-3"><span className="block font-semibold">{t}</span><span className="text-[#C9A2A6]">{x}</span></li>)}
      </ul>
      <Link to="/store?c=sleep" className="btn btn-light btn-sm mt-6">מיטות אורתופדיות בחנות</Link>
    </section>
  )
}

export function CalendarButton({ p }: { p: Project }) {
  const download = () => {
    const url = URL.createObjectURL(new Blob([toICS(p)], { type: 'text/calendar' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `${p.name}-תזכורות.ics` })
    a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <button type="button" className="btn btn-ink btn-sm" onClick={download}>הוספה ליומן בטלפון</button>
}
