/**
 * SAMPLE DATA. Every store, product, coupon and insurance plan in this file is a stand-in
 * so the screens can be designed and tested. Names, prices and codes are invented.
 * Replace this file with the real partners before launch. See PLACEHOLDERS.md.
 */
export const IS_SAMPLE = true

export interface Store { id: string; name: string; kind: string; area: string; coupon?: { code: string; text: string } }
export const stores: Store[] = [
  { id: 's1', name: 'פטשופ דוגמה', kind: 'רשת חנויות', area: 'ארצי, 40 סניפים', coupon: { code: 'DOG10', text: '10% הנחה על מזון יבש' } },
  { id: 's2', name: 'זנב ושות׳', kind: 'חנות אונליין', area: 'משלוח לכל הארץ', coupon: { code: 'TAIL15', text: '15% בהזמנה ראשונה' } },
  { id: 's3', name: 'הכלבייה', kind: 'חנות שכונתית', area: 'תל אביב', coupon: { code: 'HELLO5', text: '5% על כל החנות' } },
  { id: 's4', name: 'מרכז המזון לחיות', kind: 'רשת חנויות', area: 'מרכז ושפלה' },
]

export interface Vet { id: string; name: string; city: string; coupon?: { code: string; text: string } }
export const vets: Vet[] = [
  { id: 'v1', name: 'מרפאה וטרינרית דוגמה', city: 'תל אביב', coupon: { code: 'VET50', text: '50 ₪ הנחה על בדיקה ראשונה' } },
  { id: 'v2', name: 'וטרינר השכונה', city: 'חיפה', coupon: { code: 'PUPPY', text: 'חיסון ראשון לגור ב־20% הנחה' } },
  { id: 'v3', name: 'מרפאת הגבעה', city: 'ירושלים' },
]

export type Category = 'food' | 'health' | 'walk' | 'sleep' | 'play' | 'groom'
export const categories: [Category, string][] = [['food', 'מזון'], ['health', 'בריאות'], ['walk', 'טיולים'], ['sleep', 'שינה'], ['play', 'משחק'], ['groom', 'טיפוח']]

export interface Product { id: string; name: string; category: Category; price: number; store: string; note: string; sizes?: ('small' | 'medium' | 'large')[] }
export const products: Product[] = [
  { id: 'p1', name: 'מזון יבש לכלב בוגר, 12 ק״ג', category: 'food', price: 189, store: 's1', note: 'מתאים לרוב הכלבים הבוגרים' },
  { id: 'p2', name: 'מזון יבש לגורים, 3 ק״ג', category: 'food', price: 79, store: 's2', note: 'לגורים עד גיל שנה' },
  { id: 'p3', name: 'טיפות נגד פרעושים וקרציות', category: 'health', price: 65, store: 's1', note: 'פעם בחודש, לפי משקל הכלב' },
  { id: 'p4', name: 'רצועה וקולר עם תג שם', category: 'walk', price: 89, store: 's2', note: 'עם מספר טלפון חרוט' },
  { id: 'p5', name: 'רתמה רכה', category: 'walk', price: 119, store: 's3', note: 'לא לוחצת על הצוואר', sizes: ['small', 'medium'] },
  { id: 'p6', name: 'מיטה אורתופדית', category: 'sleep', price: 249, store: 's2', note: 'טובה לכלבים מבוגרים ולגדולים', sizes: ['medium', 'large'] },
  { id: 'p7', name: 'צעצוע לעיסה עמיד', category: 'play', price: 45, store: 's3', note: 'לכלבים שאוהבים ללעוס' },
  { id: 'p8', name: 'משחק חשיבה עם פרסים', category: 'play', price: 69, store: 's1', note: 'מעסיק כלבים חכמים כשהם לבד' },
  { id: 'p9', name: 'מברשת להסרת פרווה מתה', category: 'groom', price: 59, store: 's2', note: 'לכלבים שנושרים הרבה' },
  { id: 'p10', name: 'שמפו עדין לכלבים', category: 'groom', price: 39, store: 's3', note: 'בלי בושם חזק' },
]

export interface Plan {
  id: string; company: string; name: string; monthly: number; deductible: number; yearlyCap: number
  joinAge: string; covers: string[]; excludes: string[]; coupon?: { code: string; text: string }
}
export const plans: Plan[] = [
  { id: 'i1', company: 'ביטוח דוגמה א׳', name: 'בסיסי', monthly: 69, deductible: 500, yearlyCap: 10000, joinAge: 'מגיל חודשיים עד 8',
    covers: ['ניתוחים', 'אשפוז', 'תאונות'], excludes: ['חיסונים', 'מחלות שהיו לפני ההצטרפות'], coupon: { code: 'INS1', text: 'חודש ראשון חינם' } },
  { id: 'i2', company: 'ביטוח דוגמה ב׳', name: 'מורחב', monthly: 119, deductible: 300, yearlyCap: 25000, joinAge: 'מגיל חודשיים עד 8',
    covers: ['ניתוחים', 'אשפוז', 'תאונות', 'בדיקות דם והדמיה', 'תרופות'], excludes: ['מחלות שהיו לפני ההצטרפות'] },
  { id: 'i3', company: 'ביטוח דוגמה ג׳', name: 'מלא', monthly: 169, deductible: 200, yearlyCap: 40000, joinAge: 'מגיל חודשיים עד 6',
    covers: ['ניתוחים', 'אשפוז', 'תאונות', 'בדיקות דם והדמיה', 'תרופות', 'חיסונים שנתיים', 'טיפולי שיניים'], excludes: ['מחלות שהיו לפני ההצטרפות'], coupon: { code: 'FULL10', text: '10% הנחה בשנה הראשונה' } },
]

export interface Shelter { id: string; name: string; area: string; dogs: number; note: string }
export const shelters: Shelter[] = [
  { id: 'sh1', name: 'עמותת אימוץ דוגמה', area: 'מרכז', dogs: 40, note: 'יום אימוץ בכל שישי' },
  { id: 'sh2', name: 'בית לכלבים', area: 'צפון', dogs: 25, note: 'אפשר לבוא להתנדב לפני שמאמצים' },
  { id: 'sh3', name: 'כלבים מחפשים בית', area: 'דרום', dogs: 60, note: 'הרבה כלבים מעורבים בגודל בינוני' },
]

export interface Sitter { id: string; name: string; area: string; dog: string; canHost: string[]; note: string }
export const sitters: Sitter[] = [
  { id: 'st1', name: 'נועה', area: 'תל אביב, הצפון הישן', dog: 'לברדור בן 4', canHost: ['כלבים בינוניים', 'כלבים גדולים'], note: 'עובדת מהבית' },
  { id: 'st2', name: 'דניאל', area: 'רמת גן', dog: 'שיצו בת 7', canHost: ['כלבים קטנים'], note: 'יש חצר מגודרת' },
  { id: 'st3', name: 'מיכל ויואב', area: 'גבעתיים', dog: 'מעורב בן 2', canHost: ['כלבים קטנים', 'כלבים בינוניים'], note: 'בלי חתולים בבית' },
]
