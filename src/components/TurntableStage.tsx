import { useEffect, useRef, useState } from 'react'
import { dogTurntable, type StopId } from '../lib/dogAssets'

const MOVE = 850
const RATIO = 880 / 764
// A photo has straight black edges. Fading them out lets it sit on the stage glow without a visible box.
const fade = 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 70%, transparent 100%)'
const STILL_MASK = { WebkitMaskImage: fade, maskImage: fade }
const ease =(t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * A turntable video used as the dog: scrubbed to the angle of each stop and zoomed to the body part.
 * A breed that only has a photo gets the zoom without the turn.
 */
export function TurntableStage({ breedId, stop }: { breedId: string; stop: StopId }) {
  const table = dogTurntable(breedId)!
  const video = useRef<HTMLVideoElement>(null)
  const shot = table.shots[stop]

  useEffect(() => {
    const v = video.current
    if (!v) return
    let raf = 0
    const run = () => {
      const from = v.currentTime
      const start = performance.now()
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / MOVE)
        const t = from + (shot.t - from) * ease(k)
        // Seek only when the frame would actually change (30fps video), so the decoder is not flooded.
        if (Math.abs(v.currentTime - t) > 1 / 30 || k === 1) v.currentTime = t
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    if (v.readyState >= 1) run()
    else v.addEventListener('loadedmetadata', run, { once: true })
    return () => { cancelAnimationFrame(raf); v.removeEventListener('loadedmetadata', run) }
  }, [shot.t])

  // Fit the frame inside the stage ourselves, so the focal point is in percent of the picture and not of the box.
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => {
      const w = Math.min(el.clientWidth, el.clientHeight * RATIO)
      setSize({ w, h: w / RATIO })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const focused = shot.zoom > 1
  const style = {
    width: size.w, height: size.h,
    transformOrigin: `${shot.x}% ${shot.y}%`,
    transform: `translate(${50 - shot.x}%, ${50 - shot.y}%) scale(${shot.zoom})`,
    transition: `transform ${MOVE}ms cubic-bezier(.65,0,.35,1), transform-origin ${MOVE}ms cubic-bezier(.65,0,.35,1)`,
  }
  return (
    <div ref={box} className="turntable relative grid h-full w-full place-items-center overflow-hidden">
      {table.src
        ? <video ref={video} src={table.src} poster={table.poster} muted playsInline preload="auto" tabIndex={-1} className="max-w-none" style={style} />
        : <img src={table.poster} alt="" className="max-w-none" style={{ ...style, ...STILL_MASK }} />}
      {focused && <span className="hotspot absolute left-1/2 top-1/2 -ml-[22px] -mt-[22px]" />}
    </div>
  )
}
