import { useState } from 'react'
import { Page } from '../components/Layout'
import { Sample, SectionHead } from '../components/ui'
import { IS_SAMPLE, sitters } from '../data/sample'
import { useProjects } from '../lib/projects'
import { breedById } from '../lib/scoring'

const RULES = [
  ['פגישה לפני', 'הכלבים נפגשים פעם אחת בגינה, לפני הנסיעה.'],
  ['דף לשומר', 'אוכל, טיולים, תרופות וטלפון של הווטרינר. מכינים אותו כאן למטה.'],
  ['ציוד משלו', 'אוכל לכל הימים, רצועה, מיטה וצעצוע מוכר.'],
  ['תור הוגן', 'שמרו לכם שלושה ימים? בפעם הבאה אתם שומרים שלושה ימים.'],
] as const

function SitterSheet() {
  const dogs = useProjects()
  const [id, setId] = useState(dogs[0]?.id ?? '')
  const [f, setF] = useState({ walks: '3 פעמים ביום', meds: '', vet: '', owner: '', notes: '' })
  const d = dogs.find((x) => x.id === id)
  const b = d && breedById(d.breedId)
  if (!d || !b) return <p className="mt-4 text-ink-soft">פתחו פרויקט לכלב, ונכין ממנו דף לשומר.</p>
  const input = (k: keyof typeof f, label: string, type = 'text') => (
    <div className="grid gap-2"><label htmlFor={`ss-${k}`} className="font-semibold">{label}</label><input id={`ss-${k}`} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field" autoComplete="off" dir={type === 'tel' ? 'ltr' : undefined} /></div>
  )
  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2"><label htmlFor="ss-dog" className="font-semibold">הכלב</label><select id="ss-dog" className="field" value={id} onChange={(e) => setId(e.target.value)}>{dogs.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        {input('walks', 'טיולים')}
        {input('meds', 'תרופות')}
        {input('vet', 'טלפון הווטרינר', 'tel')}
        {input('owner', 'הטלפון שלכם', 'tel')}
        {input('notes', 'עוד משהו שחשוב לדעת')}
        <button type="button" className="btn btn-primary justify-self-start" onClick={() => window.print()}>הדפסה או שמירה כ־PDF</button>
      </form>
      <article className="poster border border-line bg-white p-6 text-[#160F11]" aria-label="תצוגה של הדף לשומר">
        <p className="m-0 text-sm font-semibold tracking-widest text-[#6B1A2C]">דף לשומר</p>
        <h3 className="m-0 mt-1 font-display text-4xl font-black text-[#160F11]">{d.name}</h3>
        <p className="m-0 text-[#5C4A4F]">{b.name}</p>
        <dl className="m-0 mt-5 grid gap-3">
          {[['אוכל', `כ־${b.care.foodGramsPerDay} גרם ביום, מחולק לשתי ארוחות`], ['מים', `תמיד מלא, כ־${b.care.waterLitersPerDay} ליטר ביום`], ['טיולים', f.walks], ['תרופות', f.meds || 'אין'], ['ווטרינר', f.vet], ['בעלים', f.owner], ['חשוב לדעת', f.notes]].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[96px_1fr] gap-3 border-t border-[#E3C9C3] pt-3"><dt className="font-semibold">{k}</dt><dd className="m-0" dir={/^[\d\s+-]+$/.test(v) ? 'ltr' : undefined} style={{ textAlign: 'start' }}>{v}</dd></div>
          ))}
        </dl>
        <p className="m-0 mt-5 text-sm text-[#5C4A4F]">בחירום: להתקשר לווטרינר ואז לבעלים. אסור לתת שוקולד, ענבים, בצל או תרופות של בני אדם.</p>
      </article>
    </div>
  )
}

export default function Sitters() {
  return (
    <Page title="החלפת שמירה" wide>
      <div className="pt-10"><SectionHead eyebrow="החלפת שמירה" title="אתם שומרים על הכלב שלהם, הם על שלכם">בלי פנסיון ובלי תשלום: בעלי כלבים מהשכונה מחליפים ביניהם ימי שמירה.</SectionHead></div>

      <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {RULES.map(([t, x], i) => <li key={t} className="card p-5"><span className="numeral text-3xl" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span><h2 className="mt-2 text-xl">{t}</h2><p className="m-0 mt-1 text-ink-soft">{x}</p></li>)}
      </ul>

      <section aria-labelledby="nb-h" className="mt-14">
        <div className="flex flex-wrap items-center gap-3"><h2 id="nb-h" className="text-3xl">שכנים שמחפשים החלפה</h2>{IS_SAMPLE && <Sample />}</div>
        <p className="m-0 mt-1 text-ink-soft">ההרשמה והחיבור בין שכנים יפעלו כשיהיה לאתר שרת וחשבונות משתמש. בינתיים זו תצוגה.</p>
        <ul className="m-0 mt-5 grid list-none gap-px overflow-hidden border border-line bg-line p-0 md:grid-cols-3">
          {sitters.map((s) => (
            <li key={s.id} className="flex flex-col bg-bg p-5">
              <span className="eyebrow">{s.area}</span>
              <h3 className="mt-1 text-xl">{s.name}</h3>
              <p className="m-0 mt-1 text-ink-soft">הכלב: {s.dog} · {s.note}</p>
              <p className="m-0 mt-2 text-sm">יכולים לארח: {s.canHost.join(', ')}</p>
              <button type="button" disabled className="btn btn-ghost btn-sm mt-4 self-start">הצעת החלפה (בקרוב)</button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sheet-h" className="mt-14">
        <h2 id="sheet-h" className="text-3xl">דף לשומר</h2>
        <p className="m-0 mt-1 text-ink-soft">כל מה שהשומר צריך לדעת, בדף אחד. נבנה מהפרויקט של הכלב.</p>
        <SitterSheet />
      </section>
    </Page>
  )
}
