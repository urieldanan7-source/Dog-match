/** Owner duties and care schedule. General guidance, to be checked with a vet and the local authority. */
export const duties: { id: string; title: string; text: string }[] = [
  { id: 'chip', title: 'שבב אלקטרוני', text: 'כל כלב בישראל צריך שבב עם פרטי הבעלים. הווטרינר משתיל אותו ורושם במאגר.' },
  { id: 'rabies', title: 'חיסון נגד כלבת', text: 'חובה מגיל 3 חודשים, ואחר כך פעם בשנה.' },
  { id: 'license', title: 'רישיון החזקת כלב', text: 'מוציאים ברשות המקומית אחרי החיסון, ומחדשים כל שנה.' },
  { id: 'leash', title: 'רצועה במרחב הציבורי', text: 'מחוץ לבית ולגינות כלבים הכלב צריך להיות קשור.' },
  { id: 'clean', title: 'איסוף צרכים', text: 'רוב הרשויות מחייבות לאסוף ויש קנסות. כדאי שקיות תמיד ברצועה.' },
]

export interface Reminder { id: string; title: string; everyDays?: number; atAgeWeeks?: number; note: string }
/** Typical schedule. Ages are for puppies. The vet decides the exact plan. */
export const reminders: Reminder[] = [
  { id: 'v1', title: 'חיסון משושה ראשון', atAgeWeeks: 6, note: 'בדרך כלל בגיל 6 עד 8 שבועות' },
  { id: 'v2', title: 'חיסון משושה שני', atAgeWeeks: 10, note: 'בדרך כלל בגיל 10 עד 12 שבועות' },
  { id: 'v3', title: 'חיסון משושה שלישי', atAgeWeeks: 14, note: 'בדרך כלל בגיל 14 עד 16 שבועות' },
  { id: 'rabies', title: 'חיסון כלבת', atAgeWeeks: 13, note: 'מגיל 3 חודשים, ואז פעם בשנה' },
  { id: 'rabies-yearly', title: 'חיסון כלבת שנתי', everyDays: 365, note: 'חובה לפי החוק' },
  { id: 'yearly', title: 'בדיקה שנתית ומשושה', everyDays: 365, note: 'בדיקה כללית אצל הווטרינר' },
  { id: 'flea', title: 'טיפול נגד פרעושים וקרציות', everyDays: 30, note: 'לפי המוצר, בדרך כלל פעם בחודש' },
  { id: 'worm', title: 'טיפול נגד תולעים', everyDays: 90, note: 'בדרך כלל כל 3 חודשים' },
  { id: 'license', title: 'חידוש רישיון ברשות המקומית', everyDays: 365, note: 'אחרי חיסון הכלבת' },
]
