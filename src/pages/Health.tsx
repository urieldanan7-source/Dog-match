import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Alert, Phone } from '../components/Icons'
import { Coupon, Sample, SectionHead } from '../components/ui'
import { symptoms } from '../data/health'
import { IS_SAMPLE, vets } from '../data/sample'

export default function Health() {
  const [id, setId] = useState<string | null>(null)
  const [copied, setCopied] = useState('')
  const s = symptoms.find((x) => x.id === id)
  const vet = vets.find((v) => v.coupon)
  return (
    <Page title="שאלות בריאות" wide>
      <div className="pt-10"><SectionHead eyebrow="שאלות בריאות" title="מה קורה לכלב?">בחרו מה אתם רואים. נגיד מה יכול להיות, ומתי לא לחכות.</SectionHead></div>
      <p className="mt-6 flex max-w-2xl gap-3 border-s-4 bg-blush p-4 font-semibold" style={{ borderColor: 'var(--accent)' }}><Alert className="shrink-0" />אל תסמכו עלינו, פנו לווטרינר. המידע כאן כללי, ועוד לא נבדק על ידי וטרינר.</p>
      <div role="group" aria-label="מה אתם רואים" className="mt-8 flex flex-wrap gap-2">
        {symptoms.map((x) => {
          const on = x.id === id
          return <button key={x.id} type="button" aria-pressed={on} onClick={() => setId(x.id)} className="min-h-11 cursor-pointer border-[1.5px] px-4 font-semibold" style={on ? { background: 'var(--color-ink)', color: 'var(--color-bg)', borderColor: 'var(--color-ink)' } : { background: 'transparent', color: 'var(--color-ink)', borderColor: 'var(--color-line)' }}>{x.title}</button>
        })}
      </div>
      {s && (
        <section aria-live="polite" aria-labelledby="s-h" className="mt-8 grid gap-6 lg:grid-cols-3">
          <h2 id="s-h" className="sr-only">{s.title}</h2>
          <div className="bg-[#160F11] p-6 text-[#F6E4E2]" style={{ borderRadius: 6 }}>
            <h3 className="text-2xl" style={{ color: '#F2D7D2' }}>לנסוע לווטרינר עכשיו אם</h3>
            <ul className="m-0 mt-3 grid list-disc gap-1 ps-5">{s.now.map((x) => <li key={x}>{x}</li>)}</ul>
            <Link to="/emergency" className="btn btn-light mt-5"><Phone />מוקדי חירום</Link>
          </div>
          <div className="card p-6"><h3 className="text-2xl">מה יכול להיות</h3><ul className="m-0 mt-3 grid list-disc gap-1 ps-5">{s.maybe.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="panel p-6"><h3 className="text-2xl">בינתיים</h3><ul className="m-0 mt-3 grid list-disc gap-1 ps-5">{s.meanwhile.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </section>
      )}
      {vet?.coupon && (
        <section aria-labelledby="vet-h" className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div><h2 id="vet-h" className="text-2xl">{vet.coupon.text}</h2><p className="m-0 text-ink-soft">{vet.name}, {vet.city} {IS_SAMPLE && <Sample />}</p></div>
          <Coupon code={vet.coupon.code} onCopied={() => setCopied(`הקוד ${vet.coupon!.code} הועתק`)} />
          <p role="status" className="m-0 w-full min-h-6 text-sm text-ink-soft">{copied}</p>
        </section>
      )}
    </Page>
  )
}
