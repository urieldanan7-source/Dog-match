import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
import { SectionHead } from '../components/ui'
import { foods, type Level } from '../data/toxic'

const LABEL: Record<Level, string> = { danger: 'אסור', caution: 'בזהירות', ok: 'מותר' }
const STYLE: Record<Level, React.CSSProperties> = {
  danger: { background: 'var(--color-accent)', color: '#fff' },
  caution: { background: 'var(--color-blush)', color: 'var(--color-ink)' },
  ok: { background: 'var(--color-good-bg)', color: 'var(--color-good-ink)' },
}

export default function Toxic() {
  const [q, setQ] = useState('')
  const term = q.trim()
  const shown = term ? foods.filter((f) => (f.name + (f.also ?? '')).includes(term)) : foods
  return (
    <Page title="מה אסור לכלב לאכול" wide>
      <div className="pt-10"><SectionHead eyebrow="לפני שנותנים מהצלחת" title="מה אסור לכלב לאכול">אם הכלב כבר אכל משהו מסוכן, אל תחכו לסימנים. <Link to="/emergency" className="link">למסך החירום</Link></SectionHead></div>
      <div className="mt-8 max-w-md">
        <label htmlFor="q" className="font-semibold">חיפוש מאכל</label>
        <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="field mt-2" placeholder="למשל: ענבים" />
      </div>
      <p role="status" className="m-0 mt-3 text-sm text-ink-soft">{term ? (shown.length ? `נמצאו ${shown.length}` : 'לא מצאנו. אם אתם לא בטוחים, שאלו וטרינר.') : ''}</p>
      <ul className="m-0 mt-2 grid list-none p-0">
        {shown.map((f) => (
          <li key={f.name} className="grid grid-cols-[84px_1fr] gap-4 border-t border-line py-4 last:border-b sm:grid-cols-[96px_1fr_2fr]">
            <span className="h-fit self-start px-2 py-1 text-center text-sm font-semibold" style={STYLE[f.level]}>{LABEL[f.level]}</span>
            <span><span className="block font-display text-xl font-bold">{f.name}</span>{f.also && <span className="text-sm text-ink-soft">{f.also}</span>}</span>
            <span className="col-start-2 text-ink-soft sm:col-start-3">{f.why}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-ink-soft">הרשימה מבוססת על רשימות וטרינריות מפורסמות, כמו של מוקד ההרעלות של ASPCA. היא לא מלאה.</p>
    </Page>
  )
}
