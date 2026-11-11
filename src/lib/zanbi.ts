/**
 * Zanbi, the site's dog bot. It answers from the site's own content and the user's dog projects.
 * It runs on simple rules, on the device, and never pretends to be a vet.
 */
import { foods } from '../data/toxic'
import { symptoms } from '../data/health'
import { daysBetween, formatDate, today, type Project } from './projects'
import { upcoming, isSenior } from './reminders'
import { breedById } from './scoring'

export interface Reply { text: string; links?: [string, string][]; chips?: string[] }

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w))
const LEVEL = { danger: 'אסור. זה מסוכן לכלבים', caution: 'בזהירות', ok: 'מותר, בכמות קטנה' } as const

/** Splits "בצל, שום, כרישה" and "ענבים וצימוקים" into the words a user might type. */
const foodWords = foods.map((f) => ({ f, words: `${f.name}, ${f.also ?? ''}`.split(/[,،]| ו/).map((w) => w.trim().replace(/^ו/, '')).filter((w) => w.length > 1) }))

const SYMPTOM_WORDS: Record<string, string[]> = {
  vomit: ['מקיא', 'הקאה', 'הקיא', 'הקאות'], diarrhea: ['שלשול', 'משלשל'], noeat: ['לא אוכל', 'לא רוצה לאכול', 'לא אכל'],
  limp: ['צולע', 'צולעת', 'צליעה', 'לא דורך'], itch: ['מגרד', 'גירוד', 'מתגרד', 'פרעוש'], drink: ['שותה הרבה', 'צמא'],
  cough: ['משתעל', 'שיעול', 'מתעטש'], ate: ['אכל משהו', 'בלע'],
}

export const START_CHIPS = ['מה התור הבא של הכלב?', 'מותר לכלב לאכול ענבים?', 'הכלב מקיא', 'לאן אפשר לצאת עם הכלב?', 'איזה כלב מתאים לי?']

export function greet(dogs: Project[]): Reply {
  const name = dogs[0]?.name
  return {
    text: name ? `היי! אני זנבי. אני זוכר את ${dogs.map((d) => d.name).join(' ו')}, ויכול לעזור עם תזכורות, אוכל, בריאות ומקומות לטייל. מה תרצו לדעת?` : 'היי! אני זנבי. אני יכול לעזור לבחור כלב, לענות מה מותר לו לאכול, מה עושים כשהוא לא מרגיש טוב ולאן אפשר לצאת איתו. מה תרצו לדעת?',
    chips: START_CHIPS,
  }
}

export function answer(input: string, dogs: Project[]): Reply {
  const t = input.trim().replace(/[?!.]/g, ' ')
  const dog = dogs.find((d) => t.includes(d.name)) ?? dogs[0]

  // Emergencies first, always.
  if (has(t, 'חירום', 'דחוף', 'דימום', 'מדמם', 'פרכוס', 'לא נושם', 'קשה לו לנשום', 'התעלף', 'דרסו', 'נדרס', 'הרעלה', 'הורעל', 'מכת חום')) {
    return { text: 'זה נשמע דחוף. אל תסמכו עליי, התקשרו עכשיו לווטרינר או למוקד חירום. בדף החירום יש כפתורי חיוג.', links: [['/emergency', 'לדף החירום']] }
  }

  const tokens = t.split(/\s+/).filter(Boolean)
  const PREFIX = ['', 'ו', 'ה', 'ב', 'ל', 'מ', 'וה', 'של', 'שה']
  const said = (w: string) => (w.includes(' ') ? t.includes(w) : tokens.some((k) => PREFIX.some((pre) => k === pre + w)))
  const food = foodWords.find(({ words }) => words.some(said))?.f
  if (food) {
    return {
      text: `${food.name}: ${LEVEL[food.level]}. ${food.why}${food.level === 'danger' ? ' אם הוא כבר אכל, התקשרו לווטרינר עכשיו.' : ''}`,
      links: food.level === 'danger' ? [['/emergency', 'חירום'], ['/toxic', 'כל רשימת המזונות']] : [['/toxic', 'כל רשימת המזונות']],
    }
  }

  const sym = symptoms.find((s) => SYMPTOM_WORDS[s.id]?.some((w) => t.includes(w)))
  if (sym) {
    return {
      text: `כשכלב ${sym.title}, זה יכול להיות: ${sym.maybe.slice(0, 3).join(', ')}. לנסוע לווטרינר בלי לחכות אם: ${sym.now.slice(0, 3).join(', ')}. אני לא וטרינר, אז כשיש ספק, מתקשרים.`,
      links: [['/health', 'עוד בשאלות בריאות'], ['/emergency', 'חירום']],
    }
  }

  if (has(t, 'אבד', 'ברח', 'נעלם', 'מצאתי כלב', 'כלב משוטט', 'הלך לאיבוד')) {
    return { text: has(t, 'מצאתי', 'משוטט') ? 'תודה שעצרתם! הכי חשוב: לקחת אותו לווטרינר או לווטרינר העירוני כדי לסרוק שבב. יש לנו רשימה של מה עושים.' : 'אני מצטער, זה מלחיץ. מתחילים מיד: מתקשרים לווטרינר העירוני, מעדכנים את מאגר השבבים ומפיצים מודעה. הכנו לכם רשימה ומודעה להדפסה.', links: [['/lost', 'כלב אבד או נמצא']] }
  }

  if (has(t, 'כמה אוכל', 'כמה לאכול', 'כמה מים', 'כמה לתת', 'שק', 'מזון')) {
    const b = dog && breedById(dog.breedId)
    if (b) return { text: `ל${dog!.name} (${b.name}) בערך ${b.care.foodGramsPerDay} גרם אוכל יבש ו־${b.care.waterLitersPerDay} ליטר מים ביום. הכמות המדויקת לפי השק והווטרינר. אוכל לחודש עולה בערך ${b.care.monthlyFoodILS.budget} עד ${b.care.monthlyFoodILS.premium} ₪.`, links: [[`/my-dog/${dog!.id}`, 'מתי נגמר השק'], ['/store?c=food', 'מזון בחנות']] }
    return { text: 'זה תלוי בגודל הכלב. פתחו פרויקט לכלב ואחשב לפי הזן שלו.', links: [['/my-dog', 'פתיחת פרויקט']] }
  }

  if (has(t, 'תזכורת', 'תור', 'חיסון', 'מתי', 'תולעים', 'פרעושים', 'קרציות', 'רישיון')) {
    if (!dog) return { text: 'עוד לא פתחתם פרויקט לכלב, אז אין לי תזכורות. פתחו פרויקט ואני אזכור בשבילכם.', links: [['/my-dog', 'פתיחת פרויקט']] }
    const next = upcoming(dog).slice(0, 3)
    if (!next.length) return { text: `אין כרגע תזכורות פתוחות ל${dog.name}.`, links: [[`/my-dog/${dog.id}`, `הפרויקט של ${dog.name}`]] }
    const lines = next.map(({ r, due }) => { const d = daysBetween(today(), due); return `${r.title}: ${d < 0 ? `עבר המועד (${formatDate(due)})` : d === 0 ? 'היום' : `בעוד ${d} ימים`}` })
    return { text: `הבא בתור ל${dog.name}: ${lines.join('. ')}.`, links: [[`/my-dog/${dog.id}`, `הפרויקט של ${dog.name}`]] }
  }

  if (has(t, 'מבוגר', 'זקן', 'זקנה', 'גיל הזהב')) {
    return { text: dog && isSenior(dog) ? `${dog.name} כבר בגיל הזהב. בפרויקט שלו יש עכשיו בדיקה פעמיים בשנה וטיפים לכלב מבוגר.` : 'רוב הכלבים נחשבים מבוגרים מגיל 7, וכלבים גדולים כבר מגיל 6. אז כדאי בדיקה אצל הווטרינר פעמיים בשנה.', links: dog ? [[`/my-dog/${dog.id}`, `הפרויקט של ${dog.name}`]] : undefined }
  }

  if (has(t, 'ילד', 'ילדים', 'הילדה', 'הילד')) return { text: 'יש לנו מצב ילדים: כללים פשוטים איך מתנהגים עם כלב, ולוח משימות שהילדים מסמנים.', links: [['/kids', 'מצב ילדים']] }
  if (has(t, 'גינה', 'גינת', 'חוף', 'לאן', 'לטייל', 'מסלול', 'בית קפה', 'מסעדה', 'מלון', 'צימר', 'מקום')) return { text: 'יש לנו מפה של מקומות שמקבלים כלבים: גינות, חופים, בתי קפה, מסלולים ולינה. אפשר לסדר לפי מה שקרוב אליכם.', links: [['/places', 'למפה']] }
  if (has(t, 'ביטוח')) return { text: 'השוויתי בשבילכם כמה פוליסות: כמה עולה, מה ההשתתפות העצמית ומה לא מכוסה. שימו לב לגיל ההצטרפות.', links: [['/insurance', 'ביטוח בריאות']] }
  if (has(t, 'קופון', 'הנחה', 'קוד', 'לקנות', 'חנות', 'צעצוע', 'רצועה', 'מיטה')) return { text: 'בחנות יש מוצרים לפי קטגוריות וקודי הנחה לחנויות ולווטרינרים.', links: [['/store', 'חנות וקופונים']] }
  if (has(t, 'שמירה', 'שומר', 'בייביסיטר', 'חופשה', 'פנסיון', 'לטוס')) return { text: 'נוסעים? אפשר להחליף שמירה עם בעלי כלבים מהשכונה: אתם שומרים על הכלב שלהם, והם על שלכם.', links: [['/sitters', 'החלפת שמירה']] }
  if (has(t, 'לאמץ', 'אימוץ', 'עמותה', 'מעורב')) return { text: 'מעולה! לפני אימוץ כדאי לעשות את השאלון, ואז ללכת לעמותה עם רשימת שאלות.', links: [['/adopt', 'אימוץ'], ['/quiz', 'לשאלון']] }
  if (has(t, 'תמונה', 'אלבום', 'גדל')) return { text: dog ? `בפרויקט של ${dog.name} יש אלבום גדילה. מוסיפים תמונה ואני רושם את הגיל.` : 'פתחו פרויקט לכלב, ויהיה לכם אלבום גדילה.', links: [[dog ? `/my-dog/${dog.id}#album` : '/my-dog', 'לאלבום']] }
  if (has(t, 'איזה כלב', 'מתאים לי', 'לבחור', 'זן', 'גזע', 'לקנות כלב', 'כלב ראשון')) return { text: 'השאלון לוקח כמה דקות, ואני מראה את הזנים שהכי מתאימים לכם, כולל מה כדאי לדעת על כל אחד.', links: [['/quiz', 'לשאלון'], ['/library', 'ספריית הכלבים']] }
  if (has(t, 'תודה')) return { text: 'בכיף! אני פה. ליקוק קטן ממני 🐾' }
  if (has(t, 'היי', 'שלום', 'הי ', 'מה נשמע', 'מי אתה')) return greet(dogs)

  return { text: 'לא בטוח שהבנתי. אפשר לשאול אותי על תזכורות, מה מותר לאכול, בעיות בריאות, מקומות לטייל, או איזה כלב מתאים לכם.', chips: START_CHIPS }
}
