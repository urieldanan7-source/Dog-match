/** Stage colours per breed, taken from the coat (see the library spec). `ui` is the accent on light screens. */
export interface BreedTheme { stage: string; glow: string; accent: string; ui: string; uiStrong: string }

const t = (stage: string, glow: string, accent: string, ui: string, uiStrong: string): BreedTheme =>
  ({ stage, glow, accent, ui, uiStrong })

export const defaultTheme = t('#0E0F12', '#2A2D33', '#0E7C74', '#0E7C74', '#0A5C56')
const fluffy = t('#0C0A0B', '#8E7F86', '#F1E3EA', '#75586A', '#5A4251')
const flat = t('#0B0908', '#7D6650', '#E8C9A4', '#735534', '#574027')
const hound = t('#0D0805', '#9A5426', '#F09A5B', '#964A14', '#74380E')

const themes: Record<string, BreedTheme> = {
  'border-collie': t('#07080B', '#3B4A63', '#9FB7E0', '#3A5488', '#2B4069'),
  labrador: t('#0D0904', '#B8742A', '#F2B25C', '#8A5410', '#6A400B'),
  golden: t('#0E0803', '#C9822F', '#FFC46B', '#8C570C', '#6B4208'),
  gsd: t('#0B0705', '#8A4B1E', '#E39A55', '#8A4B1E', '#6A3915'),
  husky: t('#06080C', '#4F6A8A', '#BFD8FF', '#3E6088', '#2E4968'),
  poodle: fluffy, maltese: fluffy, 'shih-tzu': fluffy,
  'french-bulldog': flat, pug: flat,
  beagle: hound, boxer: hound, dachshund: hound,
  canaan: t('#0D0A06', '#A88B5C', '#F3D9A6', '#765C2A', '#5A461F'),
}

export const themeFor = (id?: string | null): BreedTheme => (id && themes[id]) || defaultTheme
