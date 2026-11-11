import { useState } from 'react'
import { Page } from '../components/Layout'
import { Check, Close } from '../components/Icons'
import { Coupon, Sample, SectionHead } from '../components/ui'
import { IS_SAMPLE, plans } from '../data/sample'

const ALL = [...new Set(plans.flatMap((p) => [...p.covers, ...p.excludes]))].filter((c) => plans.some((p) => p.covers.includes(c)))

export default function Insurance() {
  const [copied, setCopied] = useState('')
  return (
    <Page title="ביטוח בריאות לכלב" wide>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10">
        <SectionHead eyebrow="ביטוח בריאות" title="ניתוח אחד יכול לעלות אלפי שקלים">
          השוואה בין פוליסות לפי מחיר, השתתפות עצמית ומה מכוסה. כדאי להצטרף כשהכלב צעיר, לפני שמופיעות בעיות.
        </SectionHead>
        {IS_SAMPLE && <Sample />}
      </div>

      <ul className="m-0 mt-10 grid list-none gap-4 p-0 lg:grid-cols-3">
        {plans.map((p, i) => (
          <li key={p.id} className={`flex flex-col p-6 ${i === 1 ? 'bg-[#160F11] text-[#F6E4E2]' : 'card'}`} style={i === 1 ? { borderRadius: 6 } : undefined}>
            <span className="eyebrow" style={i === 1 ? { color: '#E7A9A0' } : undefined}>{p.company}</span>
            <h2 className="mt-2 text-3xl">{p.name}</h2>
            <p className="numeral m-0 mt-5 text-6xl">{p.monthly}<span className="ms-2 font-body text-lg font-semibold">₪ בחודש</span></p>
            <dl className="m-0 mt-5 grid grid-cols-2 gap-3 border-t pt-4" style={{ borderColor: i === 1 ? '#3A2328' : 'var(--color-line)' }}>
              <div><dt className="text-sm opacity-80">השתתפות עצמית</dt><dd className="m-0 font-semibold">{p.deductible} ₪</dd></div>
              <div><dt className="text-sm opacity-80">תקרה לשנה</dt><dd className="m-0 font-semibold">{p.yearlyCap.toLocaleString('he-IL')} ₪</dd></div>
              <div className="col-span-2"><dt className="text-sm opacity-80">גיל הצטרפות</dt><dd className="m-0 font-semibold">{p.joinAge}</dd></div>
            </dl>
            <ul className="m-0 mt-5 grid list-none gap-2 p-0">
              {ALL.map((c) => {
                const yes = p.covers.includes(c)
                return <li key={c} className="flex items-center gap-2" style={{ opacity: yes ? 1 : 0.6 }}>{yes ? <Check width={18} height={18} /> : <Close width={18} height={18} />}<span>{c}{!yes && <span className="sr-only"> (לא מכוסה)</span>}</span></li>
              })}
            </ul>
            <p className="m-0 mt-4 text-sm opacity-80">לא מכוסה: {p.excludes.join(', ')}</p>
            {p.coupon && <div className="mt-5"><p className="m-0 mb-2 font-semibold">{p.coupon.text}</p><Coupon code={p.coupon.code} onCopied={() => setCopied(`הקוד ${p.coupon!.code} הועתק`)} /></div>}
          </li>
        ))}
      </ul>
      <p role="status" className="m-0 mt-2 min-h-6 text-sm text-ink-soft">{copied}</p>
      <p className="max-w-2xl text-sm text-ink-soft">ההשוואה היא מידע כללי ולא ייעוץ ביטוחי. התנאים המחייבים הם אלה שבפוליסה עצמה.</p>
    </Page>
  )
}
