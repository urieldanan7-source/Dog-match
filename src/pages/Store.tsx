import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Coupon, Sample, SectionHead } from '../components/ui'
import { categories, IS_SAMPLE, products, stores, vets, type Category } from '../data/sample'

export default function Store() {
  const [params, setParams] = useSearchParams()
  const cat = (params.get('c') as Category | null) ?? null
  const [copied, setCopied] = useState('')
  const shown = cat ? products.filter((p) => p.category === cat) : products
  const storeName = (id: string) => stores.find((s) => s.id === id)?.name
  const done = (code: string) => () => setCopied(`הקוד ${code} הועתק`)

  return (
    <Page title="חנות וקופונים" wide>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10">
        <SectionHead eyebrow="חנות וקופונים" title="מה הכלב צריך, ואיפה זה זול יותר">מוצרים שבחרנו, וקודי הנחה לחנויות ולמרפאות.</SectionHead>
        {IS_SAMPLE && <Sample />}
      </div>

      <section aria-labelledby="cp-h" className="mt-10">
        <h2 id="cp-h" className="text-3xl">קודי קופון</h2>
        <ul className="m-0 mt-5 grid list-none gap-px overflow-hidden border border-line bg-line p-0 md:grid-cols-2">
          {[...stores.filter((s) => s.coupon).map((s) => ({ id: s.id, name: s.name, sub: `${s.kind} · ${s.area}`, c: s.coupon! })),
            ...vets.filter((v) => v.coupon).map((v) => ({ id: v.id, name: v.name, sub: `וטרינר · ${v.city}`, c: v.coupon! }))].map((x) => (
            <li key={x.id} className="flex flex-wrap items-center justify-between gap-4 bg-bg p-5">
              <span><span className="block font-display text-xl font-bold">{x.c.text}</span><span className="text-ink-soft">{x.name} · {x.sub}</span></span>
              <Coupon code={x.c.code} onCopied={done(x.c.code)} />
            </li>
          ))}
        </ul>
        <p role="status" className="m-0 mt-2 min-h-6 text-sm text-ink-soft">{copied}</p>
      </section>

      <section aria-labelledby="pr-h" className="mt-10">
        <h2 id="pr-h" className="text-3xl">מוצרים</h2>
        <div role="group" aria-label="סינון לפי קטגוריה" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
          {[[null, 'הכל'] as const, ...categories].map(([id, label]) => {
            const on = cat === id
            return (
              <button key={label} type="button" aria-pressed={on} onClick={() => setParams(id ? { c: id } : {}, { replace: true })}
                className="min-h-11 shrink-0 cursor-pointer border-[1.5px] px-4 font-semibold" style={on ? { background: 'var(--color-ink)', color: 'var(--color-bg)', borderColor: 'var(--color-ink)' } : { background: 'transparent', color: 'var(--color-ink)', borderColor: 'var(--color-line)' }}>{label}</button>
            )
          })}
        </div>
        <ul className="m-0 mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id} className="card flex flex-col p-5">
              <span className="eyebrow">{categories.find(([c]) => c === p.category)?.[1]}</span>
              <h3 className="mt-2 font-display text-xl font-bold">{p.name}</h3>
              <p className="m-0 mt-1 text-ink-soft">{p.note}</p>
              <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                <span><span className="numeral text-3xl">{p.price} ₪</span><span className="block text-sm text-ink-soft">ב{storeName(p.store)}</span></span>
                <a href="#" aria-disabled="true" onClick={(e) => e.preventDefault()} className="btn btn-ink btn-sm">לחנות</a>
              </div>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-4 text-sm text-ink-soft">חלק מהקישורים יהיו קישורי שותפים: אם תקנו דרכם, נקבל עמלה קטנה. המחיר שלכם לא משתנה.</p>
      </section>
    </Page>
  )
}
