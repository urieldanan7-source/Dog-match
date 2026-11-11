import { Link, useSearchParams } from 'react-router-dom'
import { Page } from '../components/Layout'
import { dogImage } from '../lib/dogAssets'
import { breedById, breeds, traits } from '../lib/scoring'
import { levelText, pct } from '../lib/traitCopy'

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const a = breedById(params.get('a') ?? '') ?? breeds[5]
  const b = breedById(params.get('b') ?? '') ?? breeds.find((x) => x.id !== a.id)!
  const pick = (key: 'a' | 'b', id: string) => setParams({ a: a.id, b: b.id, [key]: id }, { replace: true })
  const colors = ['var(--accent)', 'var(--color-coral)']
  return (
    <Page title="השוואה בין זנים">
      <h1 className="pt-4 text-3xl font-extrabold sm:text-4xl">השוואה בין זנים</h1>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {([['a', a], ['b', b]] as const).map(([key, br], n) => (
          <div key={key} className="card p-3 text-center">
            <img src={dogImage(br.id)} alt="" width={140} height={140} className="mx-auto h-auto w-full max-w-[150px]" />
            <label htmlFor={`sel-${key}`} className="sr-only">{n ? 'הזן השני' : 'הזן הראשון'}</label>
            <select id={`sel-${key}`} className="field mt-2 font-semibold" style={{ borderColor: colors[n], borderWidth: 3 }} value={br.id} onChange={(e) => pick(key, e.target.value)}>
              {breeds.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <Link to={`/breed/${br.id}`} className="mt-2 inline-flex min-h-11 items-center font-semibold">לעמוד של {br.name}</Link>
          </div>
        ))}
      </div>
      <table className="mt-6 w-full border-collapse text-start">
        <caption className="sr-only">השוואת 12 התכונות בין {a.name} ל{b.name}</caption>
        <thead><tr className="text-sm text-ink-soft"><th scope="col" className="p-2 text-start">תכונה</th><th scope="col" className="p-2 text-start">{a.name}</th><th scope="col" className="p-2 text-start">{b.name}</th></tr></thead>
        <tbody>
          {traits.map((t) => (
            <tr key={t.id} className="border-t border-line align-top">
              <th scope="row" className="p-2 text-start font-display font-bold">{t.name}</th>
              {[a, b].map((br, n) => (
                <td key={n} className="w-[38%] p-2">
                  <div className="font-semibold">{pct(br.scores[t.id])}%</div>
                  <div aria-hidden="true" className="my-1 h-2 rounded-full bg-line"><div className="h-2 rounded-full" style={{ width: `${pct(br.scores[t.id])}%`, background: colors[n] }} /></div>
                  <div className="text-sm text-ink-soft">{levelText(t.id, br.scores[t.id])}{br.source[t.id] === 'estimate' ? ' (הערכה)' : ''}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}
