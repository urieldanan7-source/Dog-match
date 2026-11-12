import packed from 'virtual:packed-dogs'
/**
 * The one place that maps a breed to its visuals. Replacing the prototype dogs with
 * better models means swapping files in public/dogs and, if the rig differs, the anchors here.
 */
export type Vec3 = [number, number, number]
export type StopId = 'intro' | 'head' | 'mouth' | 'legs' | 'coat' | 'body' | 'finale'

const file = (id: string) => (id.startsWith('mixed') ? 'mixed' : id.replaceAll('-', '_'))
const base = import.meta.env.BASE_URL + 'dogs/'

/**
 * In the one-file build (npm run build:single) every dog file is packed inside the HTML as data.
 * Big files are turned into blob URLs on first use, so video seeking and model loading stay fast.
 */
const blobs = new Map<string, string>()
const url = (name: string) => {
  if (import.meta.env.MODE !== 'single') return base + name
  const data = packed[name]
  if (!data || !/\.(glb|mp4)$/.test(name)) return data ?? ''
  if (!blobs.has(name)) {
    const [head, b64] = data.split(',')
    const bin = atob(b64), bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    blobs.set(name, URL.createObjectURL(new Blob([bytes], { type: head.slice(5, head.indexOf(';')) })))
  }
  return blobs.get(name)!
}

export const dogImage = (id: string) => url(`${file(id)}.webp`)
export const dogRun = (id: string) => url(`${file(id)}_run.webp`)
export const dogModel = (id: string) => url(`${file(id)}.glb`)

/** Camera shots in model space (x forward, y up). `anchor` is where the hotspot dot sits. */
export const shots: Record<StopId, { position: Vec3; target: Vec3; anchor?: Vec3 }> = {
  intro: { position: [1.7, 0.95, 2.3], target: [0.1, 0.62, 0] },
  head: { position: [1.8, 1.3, 1.3], target: [0.66, 1.02, 0], anchor: [0.8, 1.17, 0.08] },
  mouth: { position: [1.95, 0.98, 0.95], target: [0.85, 0.92, 0], anchor: [1.0, 0.83, 0.08] },
  legs: { position: [1.4, 0.5, 1.6], target: [0.3, 0.36, 0.1], anchor: [0.34, 0.3, 0.21] },
  coat: { position: [-0.9, 1.6, 1.8], target: [0, 0.72, 0], anchor: [-0.1, 0.9, 0.12] },
  body: { position: [0.6, 0.85, 2.6], target: [0.1, 0.62, 0], anchor: [0.5, 0.62, 0.24] },
  finale: { position: [3.4, 0.85, 1.0], target: [0.1, 0.66, 0] },
}

/**
 * Turntable videos of better models (one full turn in 4s). Until the models themselves are
 * exported as GLB, the breed stage scrubs the video to an angle and zooms to the body part.
 * `t` is the time in seconds, `x`/`y` the focal point in percent of the frame, `zoom` the scale.
 */
export interface Framing { t: number; x: number; y: number; zoom: number }
/** Without `src` the dog is a single photo: the stage only zooms to the body part, it cannot turn. */
type Turntable = { src?: string; poster: string; shots: Record<StopId, Framing> }
const f = (t: number, x = 50, y = 50, zoom = 1): Framing => ({ t, x, y, zoom })
const turn = (id: string, shotsFor: Record<StopId, Framing>): Turntable =>
  ({ get src() { return url(`real/${id}.mp4`) }, poster: url(`real/${id}.jpg`), shots: shotsFor })
const still = (id: string, shotsFor: Record<StopId, Framing>): Turntable =>
  ({ poster: url(`real/${id}.jpg`), shots: shotsFor })

const turntables: Record<string, Turntable> = {
  // A studio photo (public/dogs/real/border_collie.jpg, 880x764), so `t` is always 0.
  'border-collie': still('border_collie', {
    intro: f(0), head: f(0, 65, 27, 2), mouth: f(0, 71, 33, 2.2), legs: f(0, 57, 74, 1.9),
    coat: f(0, 39, 47, 1.8), body: f(0, 50, 52, 1.3), finale: f(0),
  }),
  golden: turn('golden', {
    intro: f(3.0), head: f(3.0, 82, 24, 2), mouth: f(3.0, 90, 27, 2.6), legs: f(3.0, 62, 80, 1.8),
    coat: f(2.5, 46, 38, 1.8), body: f(2.5, 45, 50, 1.3), finale: f(3.5),
  }),
  canaan: turn('canaan', {
    intro: f(2.6), head: f(2.6, 76, 17, 2), mouth: f(2.6, 85, 25, 2.6), legs: f(2.6, 55, 72, 2),
    coat: f(2.0, 50, 31, 1.8), body: f(2.0, 50, 50, 1.3), finale: f(3.1),
  }),
}
export const dogTurntable = (id: string): Turntable | undefined => turntables[id]
