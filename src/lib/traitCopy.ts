import type { Breed, TraitId } from './scoring'

/** Percent shown for a 1 to 5 score. */
export const pct = (v: number) => v * 20

/** What each level of each trait means in daily life. Index 0 is score 1. */
const LEVELS: Record<TraitId, [string, string, string, string, string]> = {
  shedding: ['כמעט לא נושר', 'נושר מעט', 'נושר בינוני', 'נושר הרבה', 'נושר הרבה מאוד'],
  energy: ['רגוע מאוד', 'רגוע', 'אנרגיה בינונית', 'אנרגטי', 'אנרגטי מאוד'],
  barking: ['כמעט לא נובח', 'נובח מעט', 'נובח לפעמים', 'נובח לא מעט', 'נובח הרבה'],
  exercise: ['מסתפק בטיולים קצרים', 'צריך מעט פעילות', 'צריך פעילות בינונית', 'צריך הרבה פעילות', 'צריך הרבה מאוד פעילות'],
  trainability: ['קשה מאוד לאלף', 'קשה לאלף', 'אילוף בינוני', 'קל לאלף', 'לומד מהר מאוד'],
  kids: ['לא מתאים לילדים', 'פחות מתאים לילדים', 'מסתדר עם ילדים', 'טוב עם ילדים', 'מצוין עם ילדים'],
  pets: ['לא מסתדר עם חיות אחרות', 'מתקשה עם חיות אחרות', 'מסתדר עם חיות אחרות', 'טוב עם חיות אחרות', 'מצוין עם חיות אחרות'],
  size: ['קטן מאוד', 'קטן', 'בינוני', 'גדול', 'גדול מאוד'],
  alone: ['קשה לו מאוד לבד', 'קשה לו לבד', 'מסתדר לבד כמה שעות', 'מסתדר לבד', 'מסתדר לבד שעות ארוכות'],
  grooming: ['כמעט בלי טיפוח', 'מעט טיפוח', 'טיפוח בינוני', 'הרבה טיפוח', 'צריך מספרה קבועה'],
  heat: ['סובל מאוד בחום', 'מתקשה בחום', 'מסתדר בחום עם מזגן', 'מסתדר בחום', 'מסתדר בקיץ הישראלי'],
  cost: ['עד 300 ₪ בחודש', '300 עד 600 ₪ בחודש', '600 עד 1,000 ₪ בחודש', '1,000 עד 1,500 ₪ בחודש', 'מעל 1,500 ₪ בחודש'],
}

export const levelText = (trait: TraitId, v: number) => LEVELS[trait][Math.min(5, Math.max(1, v)) - 1]

/** Which end of the scale is easier to live with. */
const HIGH_IS_GOOD: Record<TraitId, boolean | null> = {
  shedding: false, energy: null, barking: false, exercise: false, trainability: true, kids: true,
  pets: true, size: null, alone: true, grooming: false, heat: true, cost: false,
}

/** "The good and the bad", read straight off the scores: the easy end and the hard end of each scale. */
export function goodAndBad(breed: Breed) {
  const good: TraitId[] = []
  const bad: TraitId[] = []
  for (const [id, hi] of Object.entries(HIGH_IS_GOOD) as [TraitId, boolean | null][]) {
    if (hi === null) continue
    const v = breed.scores[id]
    if (hi ? v >= 4 : v <= 2) good.push(id)
    if (hi ? v <= 2 : v >= 4) bad.push(id)
  }
  return { good, bad }
}

/** One line under the breed name, built from its three most extreme scores. */
export function tagline(breed: Breed) {
  const order: TraitId[] = ['trainability', 'energy', 'kids', 'alone', 'shedding', 'barking', 'heat', 'grooming']
  const ranked = [...order].sort((a, b) => Math.abs(breed.scores[b] - 3) - Math.abs(breed.scores[a] - 3))
  return ranked.slice(0, 3).map((id) => levelText(id, breed.scores[id])).join(', ') + '.'
}

export interface Stop { id: 'head' | 'mouth' | 'legs' | 'coat' | 'body'; part: string; label: string; traits: TraitId[] }
export const stops: Stop[] = [
  { id: 'head', part: 'ראש', label: 'קלות אילוף', traits: ['trainability'] },
  { id: 'mouth', part: 'אוזניים ופה', label: 'נביחות', traits: ['barking'] },
  { id: 'legs', part: 'רגליים', label: 'אנרגיה ופעילות', traits: ['energy', 'exercise'] },
  { id: 'coat', part: 'פרווה', label: 'נשירה וטיפוח', traits: ['shedding', 'grooming'] },
  { id: 'body', part: 'גוף ולב', label: 'גודל, משפחה וחום', traits: ['size', 'kids', 'pets', 'heat', 'alone'] },
]

/** What the score asks of the owner, shown as the paragraph at each stop. */
const ASKS: Partial<Record<TraitId, [string, string, string]>> = {
  trainability: ['יצטרך הרבה סבלנות ועקביות, וכדאי לתכנן מאלף.', 'ילמד את הבסיס עם תרגול קבוע.', 'לומד מהר, וצריך אתגר לראש כדי שלא ישתעמם.'],
  barking: ['שקט יחסית, מתאים גם לבניין עם שכנים צמודים.', 'ינבח מדי פעם. כדאי לעבוד על זה מגיל צעיר.', 'נובח הרבה. בבניין עם שכנים צמודים זה ידרוש עבודה.'],
  energy: ['רגוע, מסתפק בטיולים קצרים ובמנוחה.', 'צריך טיולים יומיים ומשחק.', 'בלי ריצה, משחק ואתגר הוא ימצא לעצמו תעסוקה לבד.'],
  shedding: ['מעט שיער בבית.', 'שיער בבית, בעיקר בעונות המעבר.', 'שיער על הספה, על הבגדים וברכב. שואב אבק יהיה חבר.'],
}
export function askText(trait: TraitId, v: number) {
  const a = ASKS[trait]
  return a ? a[v <= 2 ? 0 : v === 3 ? 1 : 2] : ''
}
