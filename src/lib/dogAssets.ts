/**
 * The one place that maps a breed to its visuals. Replacing the prototype dogs with
 * better models means swapping files in public/dogs and, if the rig differs, the anchors here.
 */
export type Vec3 = [number, number, number]
export type StopId = 'intro' | 'head' | 'mouth' | 'legs' | 'coat' | 'body' | 'finale'

const file = (id: string) => (id.startsWith('mixed') ? 'mixed' : id.replaceAll('-', '_'))
const base = import.meta.env.BASE_URL + 'dogs/'

export const dogImage = (id: string) => `${base}${file(id)}.webp`
export const dogRun = (id: string) => `${base}${file(id)}_run.webp`
export const dogModel = (id: string) => `${base}${file(id)}.glb`

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
