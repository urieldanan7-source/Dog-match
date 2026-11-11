import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Forward } from '../components/Icons'
import { dogImage } from '../lib/dogAssets'
import { useProjects } from '../lib/projects'
import { DEFAULT_DOG, useStore } from '../lib/store'
import { answer, greet, type Reply } from '../lib/zanbi'

type Msg = { from: 'me' | 'zanbi'; id: number } & Reply
const KEY = 'dogmatch.zanbi.v1'

export function ZanbiAvatar({ size = 44 }: { size?: number }) {
  const { myDogs } = useStore()
  return (
    <span className="grid shrink-0 place-items-center overflow-hidden rounded-full border-2 bg-blush" style={{ width: size, height: size, borderColor: 'var(--color-ink)' }} aria-hidden="true">
      <img src={dogImage(myDogs[0] ?? DEFAULT_DOG)} alt="" className="h-[90%] w-[90%] object-contain" />
    </span>
  )
}

export default function Zanbi() {
  const dogs = useProjects()
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try { const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); if (Array.isArray(s) && s.length) return s } catch { /* fresh start */ }
    return [{ from: 'zanbi', id: 0, ...greet(dogs) }]
  })
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-40))) } catch { /* ok */ } end.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }) }, [msgs, typing])

  const send = (q: string) => {
    const v = q.trim()
    if (!v || typing) return
    setText('')
    setMsgs((m) => [...m, { from: 'me', id: Date.now(), text: v }])
    setTyping(true)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => { setMsgs((m) => [...m, { from: 'zanbi', id: Date.now() + 1, ...answer(v, dogs) }]); setTyping(false) }, reduce ? 0 : 450)
  }
  const last = msgs[msgs.length - 1]

  return (
    <Page title="זנבי" companion={false}>
      <div className="flex items-center gap-4 pt-8">
        <ZanbiAvatar size={64} />
        <div>
          <h1 className="text-4xl font-black">זנבי</h1>
          <p className="m-0 text-ink-soft">הכלב שעונה. לא וטרינר, אבל יודע לאן לשלוח אתכם.</p>
        </div>
      </div>

      <div role="log" aria-live="polite" aria-label="השיחה עם זנבי" className="mt-8 grid gap-4">
        {msgs.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.from === 'me' ? 'justify-end' : ''}`}>
            {m.from === 'zanbi' && <ZanbiAvatar size={36} />}
            <div className={`max-w-[85%] px-4 py-3 ${m.from === 'me' ? 'bg-blush text-ink' : 'bg-[#160F11] text-[#F6E4E2]'}`}
              style={{ borderRadius: m.from === 'me' ? '14px 14px 2px 14px' : '14px 14px 14px 2px' }}>
              <p className="m-0 text-[1.0625rem] leading-relaxed">{m.text}</p>
              {m.links && (
                <span className="mt-3 flex flex-wrap gap-2">
                  {m.links.map(([to, label]) => <Link key={to} to={to} className="btn btn-sm btn-light">{label}<Forward width={16} height={16} /></Link>)}
                </span>
              )}
            </div>
          </div>
        ))}
        {typing && <div className="flex items-end gap-2"><ZanbiAvatar size={36} /><span className="bg-[#160F11] px-4 py-3 text-[#F6E4E2]" style={{ borderRadius: '14px 14px 14px 2px' }}>זנבי חושב…</span></div>}
        <div ref={end} className="scroll-mb-32" />
      </div>

      {last.from === 'zanbi' && last.chips && !typing && (
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="שאלות מוכנות">
          {last.chips.map((c) => <button key={c} type="button" className="btn btn-ghost btn-sm" onClick={() => send(c)}>{c}</button>)}
        </div>
      )}

      <form className="sticky bottom-0 mt-6 flex gap-2 border-t border-line bg-bg py-4" onSubmit={(e) => { e.preventDefault(); send(text) }}>
        <label htmlFor="ask" className="sr-only">שאלה לזנבי</label>
        <input id="ask" value={text} onChange={(e) => setText(e.target.value)} placeholder="למשל: מותר לו לאכול אבוקדו?" className="field" autoComplete="off" maxLength={200} />
        <button className="btn btn-primary" disabled={!text.trim() || typing}>שליחה</button>
      </form>
    </Page>
  )
}
