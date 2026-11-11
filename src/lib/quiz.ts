import { defaultNeeds, traitById, type MatchOptions, type Needs, type TraitId } from './scoring'

export interface Option { id: string; label: string }
export interface Question {
  id: string
  n: number
  text: string
  help?: string
  multi?: boolean
  /** Questions 19 to 26 refine the result and are asked after the first result. */
  refine?: boolean
  options: Option[]
}

const o = (pairs: [string, string][]): Option[] => pairs.map(([id, label]) => ({ id, label }))

export const questions: Question[] = [
  { id: 'changes', n: 1, text: 'צפויים שינויים גדולים בשנתיים הקרובות?', help: 'מעבר דירה, תינוק, רילוקיישן או שינוי גדול בעבודה.', options: o([['yes', 'כן'], ['no', 'לא'], ['unsure', 'לא יודע']]) },
  { id: 'people', n: 2, text: 'כמה אנשים גרים בבית?', options: o([['1', 'רק אני'], ['2', 'שניים'], ['3+', 'שלושה ומעלה']]) },
  { id: 'kids', n: 3, text: 'יש ילדים בבית?', options: o([['none', 'אין'], ['0-5', 'עד גיל 5'], ['6-12', 'בני 6 עד 12'], ['13+', 'בני 13 ומעלה']]) },
  { id: 'pets', n: 4, text: 'יש חיות אחרות בבית?', options: o([['none', 'אין'], ['dog', 'כלב'], ['cat', 'חתול או חיה אחרת']]) },
  { id: 'allergy', n: 5, text: 'מישהו בבית אלרגי לכלבים?', options: o([['yes', 'כן'], ['unsure', 'לא יודע'], ['no', 'לא']]) },
  { id: 'home', n: 6, text: 'באיזה בית אתם גרים?', options: o([['walkup', 'דירה בלי מעלית'], ['elevator', 'דירה עם מעלית'], ['garden', 'דירת גן או בית']]) },
  { id: 'homeSize', n: 7, text: 'מה גודל הבית?', options: o([['<60', 'עד 60 מ"ר'], ['60-90', '60 עד 90 מ"ר'], ['90-130', '90 עד 130 מ"ר'], ['130+', 'מעל 130 מ"ר']]) },
  { id: 'garden', n: 8, text: 'יש גינה?', options: o([['big', 'גינה גדולה'], ['small', 'גינה קטנה או מרפסת'], ['none', 'אין']]) },
  { id: 'neighbors', n: 9, text: 'יש שכנים צמודים?', help: 'קיר משותף, או דירות מעל ומתחת.', options: o([['yes', 'כן'], ['no', 'לא']]) },
  { id: 'time', n: 10, text: 'כמה זמן ביום תוכלו להקדיש לכלב?', help: 'טיולים, משחק ואילוף יחד.', options: o([['<1', 'פחות משעה'], ['1-2', 'שעה עד שעתיים'], ['2-3', 'שעתיים עד שלוש'], ['3+', 'שלוש שעות ומעלה']]) },
  { id: 'aloneHours', n: 11, text: 'כמה שעות ביום הכלב יהיה לבד?', options: o([['<4', 'עד 4 שעות'], ['4-8', '4 עד 8 שעות'], ['8+', 'יותר מ־8 שעות']]) },
  { id: 'sport', n: 12, text: 'כמה אתם ספורטיביים?', options: o([['none', 'בכלל לא'], ['walks', 'הליכות קלות'], ['train', 'מתאמנים קבוע'], ['run', 'רצים או מטיילים הרבה']]) },
  { id: 'travel', n: 13, text: 'אתם נוסעים הרבה עם הכלב?', help: 'טיולים, ביקורים או נסיעות לחו"ל.', options: o([['lots', 'הרבה'], ['some', 'לפעמים'], ['rare', 'כמעט לא']]) },
  { id: 'budget', n: 14, text: 'מה התקציב החודשי לכלב?', help: 'אוכל, וטרינר, ציוד וטיפוח.', options: o([['<300', 'עד 300 ₪'], ['300-600', '300 עד 600 ₪'], ['600-1000', '600 עד 1,000 ₪'], ['1000+', 'מעל 1,000 ₪']]) },
  { id: 'experience', n: 15, text: 'יש לכם ניסיון עם כלבים?', options: o([['none', 'אין'], ['family', 'היה כלב במשפחה'], ['owned', 'גידלתי כלב בעצמי']]) },
  { id: 'priorities', n: 16, text: 'מה הכי חשוב לכם בכלב?', help: 'אפשר לבחור כמה. מה שתבחרו ישפיע פי שלושה על ההתאמה.', multi: true, options: o([['calm', 'רגוע'], ['sport', 'חבר לספורט'], ['kids', 'שמח עם ילדים'], ['trainable', 'קל לאלף'], ['quiet', 'שקט'], ['clean', 'כמה שפחות שיער'], ['independent', 'מסתדר לבד'], ['cheap', 'זול לגדל']]) },
  { id: 'climate', n: 17, text: 'איפה אתם גרים, ויש מזגן?', options: o([['hot', 'אין מזגן, או שאנחנו בערבה או בבקעה'], ['center', 'יש מזגן, במרכז או בשפלה'], ['cool', 'יש מזגן, בצפון או בירושלים']]) },
  { id: 'hair', n: 18, text: 'שיער של כלב בבית יפריע לכם?', options: o([['very', 'מאוד'], ['some', 'קצת'], ['no', 'לא']]) },
  { id: 'age', n: 19, refine: true, text: 'גור או כלב בוגר?', options: o([['puppy', 'גור'], ['adult', 'בוגר'], ['senior', 'מבוגר'], ['any', 'לא משנה']]) },
  { id: 'source', n: 20, refine: true, text: 'מאיפה תיקחו את הכלב?', options: o([['shelter', 'עמותה'], ['breeder', 'מגדל'], ['unsure', 'לא יודע']]) },
  { id: 'wfh', n: 21, refine: true, text: 'כמה ימים בשבוע מישהו עובד מהבית?', options: o([['0', 'אף יום'], ['1-2', 'יום או יומיים'], ['3+', 'שלושה ומעלה']]) },
  { id: 'groomTime', n: 22, refine: true, text: 'כמה תסרקו ותטפלו בפרווה?', options: o([['none', 'כמעט לא'], ['weekly', 'רבע שעה בשבוע'], ['few', 'כמה פעמים בשבוע'], ['daily', 'כל יום']]) },
  { id: 'trainer', n: 23, refine: true, text: 'תהיו מוכנים ללכת למאלף?', options: o([['yes', 'כן'], ['no', 'לא']]) },
  { id: 'car', n: 24, refine: true, text: 'יש לכם רכב?', options: o([['yes', 'כן'], ['no', 'לא']]) },
  { id: 'vetBill', n: 25, refine: true, text: 'אם יהיה צורך בטיפול של 3,000 ₪, מה תעשו?', options: o([['pay', 'אשלם'], ['insurance', 'יהיה לי ביטוח'], ['hard', 'יהיה קשה']]) },
  { id: 'stairs', n: 26, refine: true, text: 'יש הרבה מדרגות בבית או בדרך אליו?', options: o([['yes', 'כן'], ['no', 'לא']]) },
]

export const coreQuestions = questions.filter((q) => !q.refine)
export const refineQuestions = questions.filter((q) => q.refine)

export type Answers = Record<string, string | string[] | undefined>

export interface Profile {
  needs: Needs
  options: MatchOptions
  /** Notes shown on the results screen that do not change the percent. */
  notes: string[]
  /** Which path the result should point at next. */
  source?: 'shelter' | 'breeder'
  flags: { hardVetBill: boolean; stairs: boolean; noCar: boolean }
}

const PRIORITY_TRAIT: Record<string, TraitId> = {
  calm: 'energy', sport: 'energy', kids: 'kids', trainable: 'trainability',
  quiet: 'barking', clean: 'shedding', independent: 'alone', cheap: 'cost',
}

const clamp = (v: number) => Math.min(5, Math.max(1, v))

/** Turn quiz answers into per-trait needs. When several questions touch a trait, the stricter value wins. */
export function profileFromAnswers(a: Answers): Profile {
  const needs = defaultNeeds()
  const notes: string[] = []
  const strict = (t: TraitId, v: number) => {
    const mode = traitById[t].mode
    needs[t] = mode === 'max' ? Math.min(needs[t], v) : mode === 'min' ? Math.max(needs[t], v) : v
  }
  const pick = <T,>(id: string, map: Record<string, T>): T | undefined => {
    const v = a[id]
    return typeof v === 'string' ? map[v] : undefined
  }
  const set = (t: TraitId, v: number | undefined) => { if (v !== undefined) strict(t, v) }

  if (a.changes === 'yes') notes.push('סיפרתם שצפוי שינוי גדול בשנתיים הקרובות. כלב חי 10 עד 15 שנה, אז כדאי לחשוב איך הוא משתלב גם אחרי השינוי.')
  set('kids', pick('kids', { none: 1, '0-5': 5, '6-12': 4, '13+': 3 }))
  set('pets', pick('pets', { none: 1, dog: 4, cat: 5 }))
  if (a.allergy === 'unsure') strict('shedding', 3)
  set('size', pick('home', { walkup: 3, elevator: 4, garden: 5 }))
  set('size', pick('homeSize', { '<60': 2, '60-90': 3, '90-130': 4, '130+': 5 }))
  set('barking', pick('neighbors', { yes: 2, no: 5 }))
  const time = pick('time', { '<1': 2, '1-2': 3, '2-3': 4, '3+': 5 })
  if (time !== undefined) strict('exercise', clamp(time + (a.garden === 'big' ? 1 : 0)))
  set('alone', pick('aloneHours', { '<4': 1, '4-8': 3, '8+': 5 }))
  set('energy', pick('sport', { none: 2, walks: 3, train: 4, run: 5 }))
  if (a.travel === 'lots') strict('size', 3)
  set('cost', pick('budget', { '<300': 1, '300-600': 2, '600-1000': 3, '1000+': 5 }))
  if (a.budget === '<300') strict('grooming', 3)
  set('trainability', pick('experience', { none: 4, family: 3, owned: 2 }))
  set('heat', pick('climate', { hot: 4, center: 2, cool: 1 }))
  set('shedding', pick('hair', { very: 2, some: 3, no: 5 }))

  const chosen = Array.isArray(a.priorities) ? a.priorities : []
  const priorities = [...new Set(chosen.map((p) => PRIORITY_TRAIT[p]).filter(Boolean))]
  if (chosen.includes('calm')) needs.energy = 2
  if (chosen.includes('sport')) needs.energy = 5

  // Refining questions (19 to 26)
  if (a.age === 'puppy') {
    needs.trainability = clamp(needs.trainability + 1)
    strict('alone', 4)
    notes.push('גור לא יכול להישאר לבד שעות ארוכות בחודשים הראשונים.')
  }
  if (a.wfh === '3+') needs.alone = clamp(needs.alone - 1)
  set('grooming', pick('groomTime', { none: 2, weekly: 3, few: 4, daily: 5 }))
  if (a.trainer === 'yes') needs.trainability = clamp(needs.trainability - 1)
  if (a.car === 'no') {
    strict('size', 4)
    notes.push('בלי רכב, כדאי לבדוק מראש איך מגיעים לווטרינר. כלב גדול קשה להעביר במונית או באוטובוס.')
  }

  return {
    needs,
    options: { priorities, allergy: a.allergy === 'yes', noAircon: a.climate === 'hot' },
    notes,
    source: a.source === 'shelter' || a.source === 'breeder' ? a.source : undefined,
    flags: { hardVetBill: a.vetBill === 'hard', stairs: a.stairs === 'yes', noCar: a.car === 'no' },
  }
}

const KEY = 'dogmatch.answers.v1'
export function loadAnswers(): Answers {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Answers } catch { return {} }
}
export function saveAnswers(a: Answers) {
  try { localStorage.setItem(KEY, JSON.stringify(a)) } catch { /* storage may be unavailable */ }
}
