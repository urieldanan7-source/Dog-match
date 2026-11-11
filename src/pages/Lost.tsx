import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Chips, SectionHead } from '../components/ui'
import { useAlbum } from '../lib/album'
import { today, useProjects } from '../lib/projects'
import { breedById, breeds } from '../lib/scoring'

const LOST = [
  ['לחפש מיד בסביבה', 'רוב הכלבים נמצאים קרוב לבית. קוראים בשמו בקול רגוע, ולוקחים את החטיף שהוא אוהב.'],
  ['להתקשר למוקד העירוני ולווטרינר העירוני', 'כלבים שנמצאים מגיעים לשם. מתקשרים כל יום, ולא רק פעם אחת.'],
  ['לבדוק שהפרטים בשבב מעודכנים', 'אם החלפתם טלפון או כתובת, מבקשים מהווטרינר לעדכן. בלי זה, מי שסורק את השבב לא ימצא אתכם.'],
  ['להתקשר למרפאות ולעמותות באזור', 'אנשים מביאים אליהן כלבים שמצאו כדי לסרוק שבב.'],
  ['להפיץ מודעה', 'בקבוצות השכונה ובלוחות מודעות. למטה אפשר להכין מודעה ולהדפיס.'],
  ['להשאיר משהו עם הריח שלכם', 'בגד ישן או שמיכה שלו ליד הדלת או במקום שבו ברח.'],
] as const
const FOUND = [
  ['לבדוק אם יש תג עם טלפון', 'על הקולר או על הרתמה. אם הכלב לחוץ, מתקרבים לאט ובצד, בלי להסתכל לו בעיניים.'],
  ['לסרוק שבב', 'לוקחים אותו למרפאה וטרינרית או לווטרינר העירוני. סריקה לוקחת שניות ומגלה מי הבעלים.'],
  ['להתקשר למוקד העירוני', 'כדי שמי שמחפש אותו ימצא אותו שם.'],
  ['מים וצל', 'לתת מים. אוכל רק מעט, כי לא ידוע מה מותר לו.'],
  ['לפרסם תמונה', 'בקבוצות השכונה, בלי לכתוב את כל הסימנים: ככה תוכלו לוודא שמי שפונה הוא באמת הבעלים.'],
] as const

function Poster({ dogId }: { dogId: string | null }) {
  const dogs = useProjects()
  const d = dogs.find((x) => x.id === dogId) ?? null
  const { photos } = useAlbum(d?.id ?? '-')
  const [f, setF] = useState({ name: d?.name ?? '', breed: d ? breedById(d.breedId)?.name ?? '' : '', signs: '', area: '', date: today(), phone: '' })
  const [photo, setPhoto] = useState<string | null>(null)
  useEffect(() => { if (!photo && photos[0]) setPhoto(photos[0].url) }, [photos, photo])
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const field = (k: keyof typeof f, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="grid gap-2"><label htmlFor={`pf-${k}`} className="font-semibold">{label}</label><input id={`pf-${k}`} value={f[k]} onChange={set(k)} className="field" autoComplete="off" {...extra} /></div>
  )
  return (
    <section aria-labelledby="poster-h" className="mt-14">
      <h2 id="poster-h" className="text-3xl">מודעה להדפסה</h2>
      <p className="m-0 mt-1 text-ink-soft">ממלאים, ומדפיסים או שומרים כ־PDF. שום פרט לא נשלח לשום מקום.</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form className="no-print grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          {field('name', 'שם הכלב', { maxLength: 30 })}
          <div className="grid gap-2">
            <label htmlFor="pf-breed" className="font-semibold">זן</label>
            <input id="pf-breed" list="breed-list" value={f.breed} onChange={set('breed')} className="field" autoComplete="off" />
            <datalist id="breed-list">{breeds.map((b) => <option key={b.id} value={b.name} />)}</datalist>
          </div>
          {field('signs', 'סימנים', { placeholder: 'צבע, קולר, כתם, אופי', maxLength: 120 })}
          {field('area', 'איפה נעלם', { placeholder: 'שכונה או רחוב', maxLength: 60 })}
          {field('date', 'מתי', { type: 'date', max: today() })}
          {field('phone', 'טלפון', { type: 'tel', inputMode: 'tel', dir: 'ltr', maxLength: 20, autoComplete: 'tel' })}
          <div className="grid gap-2"><label htmlFor="pf-photo" className="font-semibold">תמונה</label><input id="pf-photo" type="file" accept="image/*" className="field py-3" onChange={(e) => { const file = e.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)) }} /></div>
          <button type="button" className="btn btn-primary justify-self-start" onClick={() => window.print()}>הדפסה או שמירה כ־PDF</button>
        </form>
        <article className="poster border-[3px] border-[#160F11] bg-white p-6 text-[#160F11]" aria-label="תצוגה של המודעה">
          <p className="m-0 bg-[#6B1A2C] py-3 text-center font-display text-5xl font-black tracking-wide text-white">נעלם כלב</p>
          <div className="mt-4 grid aspect-[4/3] place-items-center overflow-hidden bg-[#F2D7D2]">
            {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : <span className="text-[#5C4A4F]">כאן תופיע התמונה</span>}
          </div>
          <p className="m-0 mt-4 text-center font-display text-5xl font-black">{f.name || 'שם הכלב'}</p>
          <p className="m-0 mt-1 text-center text-xl">{[f.breed, f.signs].filter(Boolean).join(' · ') || 'זן וסימנים'}</p>
          <p className="m-0 mt-3 text-center text-lg">נעלם {f.area ? `ב${f.area}` : ''} {f.date && `ב־${new Date(f.date + 'T12:00').toLocaleDateString('he-IL')}`}</p>
          <p className="m-0 mt-5 border-t-2 border-[#160F11] pt-4 text-center text-lg font-semibold">ראיתם אותו? התקשרו</p>
          <p className="m-0 text-center font-display text-5xl font-black" dir="ltr">{f.phone || '050-0000000'}</p>
        </article>
      </div>
    </section>
  )
}

export default function Lost() {
  const [params, setParams] = useSearchParams()
  const mode = params.get('m') === 'found' ? 'found' : 'lost'
  const steps = mode === 'lost' ? LOST : FOUND
  return (
    <Page title="כלב אבד או נמצא" wide>
      <div className="no-print pt-10">
        <SectionHead eyebrow="כלב אבד או נמצא" title={mode === 'lost' ? 'הכלב שלכם נעלם? מתחילים עכשיו' : 'מצאתם כלב? ככה מחזירים אותו הביתה'} />
        <div className="mt-6"><Chips label="מה קרה" items={[['lost', 'הכלב שלי נעלם'], ['found', 'מצאתי כלב']] as const} value={mode} onChange={(m) => setParams(m === 'found' ? { m } : params.get('dog') ? { dog: params.get('dog')! } : {}, { replace: true })} /></div>
        <ol className="m-0 mt-8 grid list-none gap-px overflow-hidden border border-line bg-line p-0 md:grid-cols-2">
          {steps.map(([t, x], i) => (
            <li key={t} className="flex gap-4 bg-bg p-5">
              <span className="numeral text-3xl" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span><span className="block font-display text-xl font-bold">{t}</span><span className="text-ink-soft">{x}</span></span>
            </li>
          ))}
        </ol>
        {mode === 'found' && <p className="m-0 mt-6">הכלב פצוע או במצוקה? <Link to="/emergency" className="link">לדף החירום</Link></p>}
      </div>
      {mode === 'lost' && <Poster dogId={params.get('dog')} />}
    </Page>
  )
}
