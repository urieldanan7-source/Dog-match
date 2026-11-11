/** Foods that are dangerous to dogs. Based on widely published veterinary lists (ASPCA Animal Poison Control). */
export type Level = 'danger' | 'caution' | 'ok'
export interface Food { name: string; also?: string; level: Level; why: string }
export const foods: Food[] = [
  { name: 'שוקולד', also: 'קקאו, עוגות שוקולד', level: 'danger', why: 'מכיל תאוברומין. גורם להקאות, דופק מהיר ופרכוסים. מריר מסוכן יותר מחלב.' },
  { name: 'ענבים וצימוקים', level: 'danger', why: 'יכולים לגרום לכשל כליות, גם בכמות קטנה.' },
  { name: 'קסיליטול', also: 'מסטיק ללא סוכר, ממתקים דיאטטיים, חלק ממחמאות הבוטנים', level: 'danger', why: 'מוריד סוכר בדם בבת אחת ופוגע בכבד.' },
  { name: 'בצל, שום, כרישה ועירית', also: 'גם מבושלים או באבקה', level: 'danger', why: 'פוגעים בכדוריות הדם האדומות ויכולים לגרום לאנמיה.' },
  { name: 'אלכוהול', level: 'danger', why: 'גם כמות קטנה מסוכנת לכלב.' },
  { name: 'קפה, תה ומשקאות אנרגיה', level: 'danger', why: 'קפאין גורם לדופק מהיר, רעד ופרכוסים.' },
  { name: 'בצק שמרים חי', level: 'danger', why: 'תופח בקיבה ומייצר אלכוהול.' },
  { name: 'תרופות של בני אדם', also: 'אקמול, נורופן, אדוויל', level: 'danger', why: 'משככי כאבים רגילים יכולים להרעיל כלבים. רק לפי הוראת וטרינר.' },
  { name: 'אגוזי מקדמיה', level: 'danger', why: 'גורמים לחולשה ברגליים, הקאות וחום.' },
  { name: 'עצמות מבושלות', level: 'caution', why: 'מתפצלות לשברים חדים שיכולים לפצוע את מערכת העיכול.' },
  { name: 'גלעינים', also: 'אפרסק, שזיף, דובדבן, משמש', level: 'caution', why: 'יכולים לחסום את המעי. בחלק מהם יש חומרים רעילים.' },
  { name: 'אוכל שומני', also: 'עור עוף, נקניקים, שאריות על האש', level: 'caution', why: 'יכול לגרום לדלקת בלבלב.' },
  { name: 'מלח בכמות גדולה', also: 'חטיפים מלוחים', level: 'caution', why: 'גורם לצמא חזק, ובכמות גדולה להרעלה.' },
  { name: 'אבוקדו', level: 'caution', why: 'הקליפה והגלעין מסוכנים. הגלעין יכול לחסום את המעי.' },
  { name: 'חלב ומוצריו', level: 'caution', why: 'הרבה כלבים לא מעכלים לקטוז ומקבלים שלשול.' },
  { name: 'גזר', level: 'ok', why: 'חטיף טוב, נא או מבושל.' },
  { name: 'תפוח', also: 'בלי ליבה וגרעינים', level: 'ok', why: 'טוב במידה.' },
  { name: 'עוף מבושל בלי תיבול', level: 'ok', why: 'טוב, בלי עור ובלי עצמות.' },
  { name: 'אורז מבושל', level: 'ok', why: 'עדין לבטן.' },
  { name: 'דלעת מבושלת', level: 'ok', why: 'טובה לעיכול.' },
  { name: 'אבטיח', also: 'בלי גרעינים וקליפה', level: 'ok', why: 'מרווה בקיץ.' },
  { name: 'ביצה מבושלת', level: 'ok', why: 'חלבון טוב.' },
]
