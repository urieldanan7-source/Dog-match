import { defaultNeeds, traitById, type Match, type MatchOptions, type Needs, type TraitId } from './scoring'

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
  { id: 'changes', n: 1, text: 'צפוי אצלכם שינוי גדול בשנתיים הקרובות?', help: 'למשל מעבר דירה, תינוק בדרך, רילוקיישן או עבודה חדשה. כלב חי 10 עד 15 שנה.', options: o([['yes', 'כן, משהו כבר מתוכנן'], ['no', 'לא נראה לי'], ['unsure', 'עוד לא יודעים']]) },
  { id: 'sizePref', n: 2, text: 'איזה גודל של כלב אתם מדמיינים?', help: 'אם אין לכם העדפה, נמליץ לפי שאר התשובות.', options: o([['small', 'קטן, עד 10 ק"ג (כמו שיצו או צ׳יוואווה)'], ['medium', 'בינוני, 10 עד 25 ק"ג (כמו ביגל או בורדר קולי)'], ['large', 'גדול, מעל 25 ק"ג (כמו לברדור או רועה גרמני)'], ['any', 'אין לנו העדפה']]) },
  { id: 'kids', n: 3, text: 'יש ילדים שגרים איתכם או מבקרים הרבה?', options: o([['none', 'אין ילדים'], ['0-5', 'פעוטות, עד גיל 5'], ['6-12', 'ילדים בני 6 עד 12'], ['13+', 'נוער, מגיל 13']]) },
  { id: 'pets', n: 4, text: 'יש בבית עוד חיות?', options: o([['none', 'אין'], ['dog', 'יש כלב'], ['cat', 'יש חתול או חיה קטנה אחרת']]) },
  { id: 'allergy', n: 5, text: 'למישהו בבית יש אלרגיה לכלבים?', options: o([['yes', 'כן'], ['unsure', 'לא בטוחים'], ['no', 'אין אלרגיה']]) },
  { id: 'home', n: 6, text: 'באיזה בית אתם גרים?', options: o([['walkup', 'דירה בבניין בלי מעלית'], ['elevator', 'דירה בבניין עם מעלית'], ['garden', 'דירת גן או בית פרטי']]) },
  { id: 'homeSize', n: 7, text: 'מה גודל הבית, בערך?', options: o([['<60', 'עד 60 מ"ר'], ['60-90', '60 עד 90 מ"ר'], ['90-130', '90 עד 130 מ"ר'], ['130+', 'יותר מ־130 מ"ר']]) },
  { id: 'garden', n: 8, text: 'יש חצר או גינה שהכלב יכול להיות בה?', options: o([['big', 'כן, חצר גדולה'], ['small', 'חצר קטנה או מרפסת גדולה'], ['none', 'אין']]) },
  { id: 'neighbors', n: 9, text: 'יש שכנים שישמעו את הכלב?', help: 'קיר משותף, או דירות מעליכם ומתחתיכם. כלב שנובח הרבה עלול להביא תלונות.', options: o([['yes', 'כן, השכנים קרובים'], ['no', 'לא ממש']]) },
  { id: 'time', n: 10, text: 'כמה זמן ביום תוכלו להקדיש לכלב?', help: 'טיולים, משחק ואילוף. לא כולל את הזמן שהוא סתם נמצא לידכם בבית.', options: o([['<1', 'פחות משעה'], ['1-2', 'שעה עד שעתיים'], ['2-3', 'שעתיים עד שלוש'], ['3+', 'יותר משלוש שעות']]) },
  { id: 'aloneHours', n: 11, text: 'ביום רגיל, כמה שעות הכלב יישאר לבד?', options: o([['<4', 'עד 4 שעות'], ['4-8', '4 עד 8 שעות'], ['8+', 'יותר מ־8 שעות']]) },
  { id: 'sport', n: 12, text: 'כמה אתם פעילים בדרך כלל?', options: o([['none', 'אוהבים להיות בבית, על הספה'], ['walks', 'הליכה רגועה בשכונה או בפארק'], ['train', 'פעילות קבועה, כמו הליכות ארוכות או אופניים'], ['run', 'ריצות, טיולי שטח וטבע']]) },
  { id: 'travel', n: 13, text: 'כמה תיקחו את הכלב איתכם כשאתם יוצאים?', help: 'ביקורים, בתי קפה, טיולים או נסיעות.', options: o([['lots', 'כמעט לכל מקום'], ['some', 'לפעמים'], ['rare', 'כמעט אף פעם']]) },
  { id: 'budget', n: 14, text: 'כמה תוכלו להוציא על הכלב בחודש?', help: 'אוכל, וטרינר, ציוד וטיפוח, בלי המחיר של הכלב עצמו.', options: o([['<300', 'עד 300 ₪'], ['300-600', '300 עד 600 ₪'], ['600-1000', '600 עד 1,000 ₪'], ['1000+', 'יותר מ־1,000 ₪']]) },
  { id: 'experience', n: 15, text: 'כמה ניסיון יש לכם עם כלבים?', options: o([['none', 'זה יהיה הכלב הראשון שלנו'], ['family', 'גדל אצלנו כלב במשפחה'], ['owned', 'כבר גידלתי כלב בעצמי']]) },
  { id: 'priorities', n: 16, text: 'מה הכי חשוב לכם בכלב?', help: 'אפשר לבחור כמה. מה שתבחרו ישפיע על התוצאה יותר מכל השאר.', multi: true, options: o([['calm', 'שיהיה רגוע בבית'], ['sport', 'שיצטרף לריצות ולטיולים'], ['kids', 'שיהיה טוב עם ילדים'], ['trainable', 'שיהיה קל לאלף'], ['quiet', 'שלא ינבח הרבה'], ['clean', 'שלא ינשור הרבה'], ['independent', 'שיסתדר לבד כמה שעות'], ['cheap', 'שלא יעלה הרבה']]) },
  { id: 'climate', n: 17, text: 'יש מזגן בבית, ובאיזה אזור אתם גרים?', help: 'כלבים עם אף קצר או פרווה עבה סובלים מאוד בחום.', options: o([['hot', 'אין מזגן, או שאנחנו באזור חם במיוחד (ערבה, בקעה, אילת)'], ['center', 'יש מזגן, ואנחנו במרכז, בשרון, בשפלה או בדרום'], ['cool', 'יש מזגן, ואנחנו בצפון או באזור ירושלים']]) },
  { id: 'hair', n: 18, text: 'שערות של כלב על הספה ועל הבגדים, זה יפריע לכם?', options: o([['very', 'מאוד יפריע'], ['some', 'קצת, אפשר לחיות עם זה'], ['no', 'לא אכפת לנו']]) },
  { id: 'age', n: 19, refine: true, text: 'אתם מחפשים גור או כלב בוגר?', options: o([['puppy', 'גור'], ['adult', 'כלב בוגר'], ['senior', 'כלב מבוגר, מגיל 8 בערך'], ['any', 'לא משנה לנו']]) },
  { id: 'source', n: 20, refine: true, text: 'מאיפה אתם חושבים לקחת את הכלב?', options: o([['shelter', 'אימוץ מעמותה'], ['breeder', 'ממגדל'], ['unsure', 'עוד לא החלטנו']]) },
  { id: 'wfh', n: 21, refine: true, text: 'כמה ימים בשבוע מישהו נמצא בבית במהלך היום?', help: 'עבודה מהבית, משמרות, או מישהו שפשוט בבית.', options: o([['0', 'אף יום'], ['1-2', 'יום או יומיים'], ['3+', 'שלושה ימים או יותר']]) },
  { id: 'groomTime', n: 22, refine: true, text: 'כמה זמן תשקיעו בסירוק ובטיפוח הפרווה?', options: o([['none', 'כמעט כלום'], ['weekly', 'רבע שעה בשבוע'], ['few', 'כמה פעמים בשבוע'], ['daily', 'כל יום']]) },
  { id: 'trainer', n: 23, refine: true, text: 'תהיו מוכנים להביא מאלף או ללכת לקורס אילוף?', options: o([['yes', 'כן'], ['no', 'מעדיפים שלא']]) },
  { id: 'car', n: 24, refine: true, text: 'יש לכם רכב?', options: o([['yes', 'כן'], ['no', 'לא']]) },
  { id: 'vetBill', n: 25, refine: true, text: 'אם הכלב יצטרך פתאום טיפול של 3,000 ₪, איך תסתדרו?', options: o([['pay', 'נשלם, זה בסדר'], ['insurance', 'יהיה לנו ביטוח'], ['hard', 'יהיה לנו קשה']]) },
  { id: 'stairs', n: 26, refine: true, text: 'יש הרבה מדרגות בבית או בדרך החוצה?', help: 'כלב גדול שמזדקן או נפצע צריך לפעמים לסחוב בידיים.', options: o([['yes', 'כן'], ['no', 'לא']]) },
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
  // Big dogs live well in Israeli flats with a lift; only a small flat or many stairs sets a real limit.
  set('size', pick('home', { walkup: 4, elevator: 5, garden: 5 }))
  set('size', pick('homeSize', { '<60': 3, '60-90': 4, '90-130': 5, '130+': 5 }))
  set('barking', pick('neighbors', { yes: 3, no: 5 }))
  const time = pick('time', { '<1': 2, '1-2': 3, '2-3': 4, '3+': 5 })
  if (time !== undefined) strict('exercise', clamp(time + (a.garden === 'big' ? 1 : 0)))
  set('alone', pick('aloneHours', { '<4': 1, '4-8': 3, '8+': 5 }))
  set('energy', pick('sport', { none: 2, walks: 3, train: 4, run: 5 }))
  if (a.travel === 'lots') strict('size', 4)
  // Food for a 30 kg Labrador is about 130 to 290 ILS a month, so 300 to 600 does fit a big dog.
  set('cost', pick('budget', { '<300': 2, '300-600': 3, '600-1000': 4, '1000+': 5 }))
  if (a.budget === '<300') strict('grooming', 3)
  set('trainability', pick('experience', { none: 4, family: 3, owned: 2 }))
  set('heat', pick('climate', { hot: 4, center: 2, cool: 1 }))
  set('shedding', pick('hair', { very: 2, some: 3, no: 5 }))

  const chosen = Array.isArray(a.priorities) ? a.priorities : []
  const priorities = [...new Set(chosen.map((p) => PRIORITY_TRAIT[p]).filter(Boolean))]
  if (chosen.includes('calm')) needs.energy = 2
  if (chosen.includes('sport')) needs.energy = 5

  // Preferences: what the user wants, not only what they can handle.
  const prefs: Partial<Record<TraitId, number>> = {}
  const weights: Partial<Record<TraitId, number>> = {}
  const size = pick('sizePref', { small: 1.5, medium: 3, large: 4.5 })
  if (size !== undefined) {
    prefs.size = Math.min(size, needs.size)
    weights.size = 3
    if (size > needs.size) notes.push('ביקשתם כלב גדול יותר ממה שהבית שתיארתם מתאים לו בנוחות. לכן הצגנו קודם כלבים בגודל שיהיה להם טוב אצלכם.')
  }
  // Someone with hours a day for a dog will be bored by a dog that needs ten minutes.
  if (time !== undefined) prefs.exercise = needs.exercise
  if (chosen.includes('sport') || a.sport === 'run') prefs.exercise = 5

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
    options: { priorities, allergy: a.allergy === 'yes', noAircon: a.climate === 'hot', prefs, weights },
    notes,
    source: a.source === 'shelter' || a.source === 'breeder' ? a.source : undefined,
    flags: { hardVetBill: a.vetBill === 'hard', stairs: a.stairs === 'yes', noCar: a.car === 'no' },
  }
}

const SIZE_CLASS = { small: (v: number) => v <= 2, medium: (v: number) => v === 3, large: (v: number) => v >= 4 }
const SIZE_WORD = { small: 'הקטן', medium: 'הבינוני', large: 'הגדול' }

/**
 * When the user asked for a size and the top result is a different size, say why:
 * name the best breed of the size they asked for and what holds it back.
 */
export function sizeNote(a: Answers, matches: Match[]): string | undefined {
  const want = a.sizePref
  if (want !== 'small' && want !== 'medium' && want !== 'large') return undefined
  const fits = SIZE_CLASS[want]
  if (!matches.length || fits(matches[0].breed.scores.size)) return undefined
  const best = matches.find((m) => fits(m.breed.scores.size))
  if (!best) return undefined
  const why = best.caveats.filter((t) => t !== 'size').slice(0, 2).map((t) => traitById[t].name)
  return `הכלב ${SIZE_WORD[want]} שהכי מתאים לכם הוא ${best.breed.name} (${best.percent}%).` +
    (why.length ? ` מה שמוריד אותו בהתאמה: ${why.join(' ו')}.` : '') +
    ' אם תשנו את התשובות בנושאים האלה, הוא יעלה ברשימה.'
}

/**
 * Most dogs in shelters are mixed, and each one is different, so we cannot score "mixed" as a breed.
 * Instead, tell the user what to look for, taken from what their top breeds have in common.
 */
export function mixedNote(top: Match[]): string | undefined {
  const lead = top.slice(0, 3)
  if (!lead.length) return undefined
  const avg = (t: TraitId) => lead.reduce((s, m) => s + m.breed.scores[t], 0) / lead.length
  const size = avg('size'), energy = avg('energy')
  const sizeWord = size <= 2 ? 'קטן' : size < 3.5 ? 'בינוני' : 'גדול'
  const energyWord = energy <= 3 ? 'רגוע' : energy < 4.5 ? 'פעיל במידה' : 'מאוד פעיל'
  return `בעמותות רוב הכלבים מעורבים, וכל אחד מהם שונה. לכן אנחנו לא מדרגים "מעורב" כמו זן. ` +
    `לפי התשובות שלכם, חפשו כלב ${sizeWord} ו${energyWord}, וספרו לעמותה מה חשוב לכם. הם מכירים את האופי של כל כלב.`
}

const KEY = 'dogmatch.answers.v1'
export function loadAnswers(): Answers {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Answers } catch { return {} }
}
export function saveAnswers(a: Answers) {
  try { localStorage.setItem(KEY, JSON.stringify(a)) } catch { /* storage may be unavailable */ }
}
