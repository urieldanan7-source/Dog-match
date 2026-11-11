import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { Page } from '../components/Layout'
import { Chips, Sample, SectionHead } from '../components/ui'
import { distanceKm, kindLabel, kinds, places, type Place, type PlaceKind } from '../data/places'
import { IS_SAMPLE } from '../data/sample'

const ISRAEL: [number, number] = [31.75, 34.95]

const pin = (on: boolean) => L.divIcon({
  className: '',
  html: `<span class="map-pin${on ? ' is-on' : ''}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><ellipse cx="6" cy="10" rx="2" ry="2.6"/><ellipse cx="10" cy="6" rx="2" ry="2.7"/><ellipse cx="14.5" cy="6" rx="2" ry="2.7"/><ellipse cx="18.5" cy="10" rx="2" ry="2.6"/><path d="M12.2 11c-3 0-5.7 3.2-5.7 5.6 0 1.8 1.5 2.6 3 2.6 1 0 1.8-.5 2.7-.5s1.7.5 2.7.5c1.5 0 3-.8 3-2.6 0-2.4-2.7-5.6-5.7-5.6z"/></svg></span>`,
  iconSize: [34, 42], iconAnchor: [17, 42],
})
const meIcon = L.divIcon({ className: '', html: '<span class="map-me"></span>', iconSize: [18, 18], iconAnchor: [9, 9] })

function Fly({ to }: { to: [number, number] | null }) {
  const map = useMap()
  useEffect(() => { if (to) map.flyTo(to, Math.max(map.getZoom(), 13), { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.8 }) }, [to, map])
  return null
}

const waze = (p: Place) => `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`
const gmaps = (p: Place) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`

export default function Places() {
  const [params, setParams] = useSearchParams()
  const kind = (params.get('k') as PlaceKind | null) ?? null
  const [sel, setSel] = useState<string | null>(null)
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null)
  const [locMsg, setLocMsg] = useState('')
  const listRef = useRef<HTMLUListElement>(null)

  const shown = useMemo(() => {
    const l = kind ? places.filter((p) => p.kind === kind) : places
    return me ? [...l].sort((a, b) => distanceKm(me, a) - distanceKm(me, b)) : l
  }, [kind, me])
  const selected = places.find((p) => p.id === sel) ?? null

  const locate = () => {
    if (!navigator.geolocation) { setLocMsg('הדפדפן לא תומך במיקום'); return }
    setLocMsg('מחפשים את המיקום שלכם…')
    navigator.geolocation.getCurrentPosition(
      (pos) => { setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocMsg('הרשימה מסודרת לפי מרחק מכם') },
      () => setLocMsg('לא קיבלנו גישה למיקום. אפשר לבחור מקום מהרשימה.'),
      { timeout: 10000 },
    )
  }
  const choose = (id: string) => {
    setSel(id)
    listRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  return (
    <Page title="מקומות שמקבלים כלבים" wide>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10">
        <SectionHead eyebrow="מפה" title="לאן אפשר ללכת עם הכלב">גינות כלבים, חופים, בתי קפה, מסלולים ומקומות לינה שמקבלים כלבים.</SectionHead>
        {IS_SAMPLE && <Sample />}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1"><Chips label="סוג מקום" items={[[null, 'הכל'] as const, ...kinds]} value={kind} onChange={(k) => { setSel(null); setParams(k ? { k } : {}, { replace: true }) }} /></div>
        <button type="button" className="btn btn-ink btn-sm" onClick={locate}>קרוב אליי</button>
      </div>
      <p role="status" className="m-0 mt-2 min-h-6 text-sm text-ink-soft">{locMsg}</p>

      <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="map-frame h-[52vh] min-h-[320px] lg:sticky lg:top-4 lg:h-[72vh]" dir="ltr">
          <MapContainer center={ISRAEL} zoom={8} scrollWheelZoom={false} className="h-full w-full" attributionControl>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {shown.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]} icon={pin(p.id === sel)} title={p.name} alt={p.name} eventHandlers={{ click: () => choose(p.id) }} zIndexOffset={p.id === sel ? 1000 : 0} />
            ))}
            {me && <Marker position={[me.lat, me.lng]} icon={meIcon} title="המיקום שלכם" />}
            <Fly to={selected ? [selected.lat, selected.lng] : me ? [me.lat, me.lng] : null} />
          </MapContainer>
        </div>

        <ul ref={listRef} aria-label={`${shown.length} מקומות`} className="m-0 grid list-none content-start gap-px overflow-hidden border border-line bg-line p-0 lg:max-h-[72vh] lg:overflow-y-auto">
          {shown.map((p) => {
            const on = p.id === sel
            return (
              <li key={p.id} data-id={p.id} className="bg-bg" style={on ? { background: 'var(--color-blush)' } : undefined}>
                <button type="button" onClick={() => setSel(p.id)} aria-pressed={on} className="block w-full cursor-pointer border-0 bg-transparent p-5 text-start text-ink">
                  <span className="eyebrow">{kindLabel(p.kind)} · {p.city}{me && ` · ${distanceKm(me, p).toFixed(distanceKm(me, p) < 10 ? 1 : 0)} ק״מ`}</span>
                  <span className="mt-1 block font-display text-xl font-bold">{p.name}</span>
                  <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-soft">{p.features.map((f) => <span key={f}>{f}</span>)}</span>
                  {p.note && <span className="mt-2 block text-sm">{p.note}</span>}
                </button>
                {on && (
                  <div className="flex flex-wrap gap-2 px-5 pb-5">
                    <a href={waze(p)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">ניווט בוויז</a>
                    <a href={gmaps(p)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">גוגל מפות</a>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <p className="m-0 mt-4 text-sm text-ink-soft">כדאי להתקשר לפני שמגיעים: מקומות משנים את המדיניות שלהם לגבי כלבים.</p>
    </Page>
  )
}
