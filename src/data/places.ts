/**
 * SAMPLE DATA. Places are stand-ins placed near real city centres so the map can be designed
 * and tested. They are not real businesses or verified locations. Replace before launch,
 * for example with a vetted list or an OpenStreetMap export (leisure=dog_park, dog=yes). See PLACEHOLDERS.md.
 */
export type PlaceKind = 'park' | 'beach' | 'cafe' | 'hotel' | 'nature' | 'shop' | 'vet'

export const kinds: [PlaceKind, string][] = [
  ['park', 'גינות כלבים'], ['beach', 'חופים'], ['cafe', 'בתי קפה ומסעדות'], ['nature', 'טבע ומסלולים'],
  ['hotel', 'לינה'], ['shop', 'חנויות'], ['vet', 'וטרינרים'],
]

export interface Place {
  id: string; name: string; kind: PlaceKind; city: string; lat: number; lng: number
  /** What a dog owner wants to know before going. */
  features: string[]; note?: string
}

export const places: Place[] = [
  { id: 'pl1', name: 'גינת כלבים בפארק העירוני', kind: 'park', city: 'תל אביב', lat: 32.0975, lng: 34.8052, features: ['מגודר', 'ברזיית מים', 'צל'], note: 'אזור נפרד לכלבים קטנים' },
  { id: 'pl2', name: 'חוף הכלבים בצפון העיר', kind: 'beach', city: 'תל אביב', lat: 32.0905, lng: 34.7725, features: ['אפשר בלי רצועה', 'מקלחת'], note: 'עמוס בסופי שבוע' },
  { id: 'pl3', name: 'קפה השכונה', kind: 'cafe', city: 'תל אביב', lat: 32.0718, lng: 34.7797, features: ['קערת מים', 'ישיבה בחוץ'] },
  { id: 'pl4', name: 'מרפאה וטרינרית במרכז', kind: 'vet', city: 'תל אביב', lat: 32.0790, lng: 34.7890, features: ['תורים בערב'] },
  { id: 'pl5', name: 'גינת כלבים ליד הנחל', kind: 'park', city: 'ירושלים', lat: 31.7745, lng: 35.2010, features: ['מגודר', 'מתקני אילוף'] },
  { id: 'pl6', name: 'מסלול יער ליד העיר', kind: 'nature', city: 'ירושלים', lat: 31.7720, lng: 35.1430, features: ['ברצועה', 'צל', 'בלי מים בדרך'], note: 'להביא מים לכלב' },
  { id: 'pl7', name: 'בית קפה במושבה', kind: 'cafe', city: 'ירושלים', lat: 31.7650, lng: 35.2180, features: ['כלבים גם בפנים'] },
  { id: 'pl8', name: 'חוף כלבים בדרום העיר', kind: 'beach', city: 'חיפה', lat: 32.7880, lng: 34.9590, features: ['אפשר בלי רצועה'], note: 'כדאי בבוקר, החול מתחמם' },
  { id: 'pl9', name: 'גינת כלבים על הכרמל', kind: 'park', city: 'חיפה', lat: 32.7940, lng: 34.9890, features: ['מגודר', 'ברזיית מים'] },
  { id: 'pl10', name: 'שביל ביער הכרמל', kind: 'nature', city: 'הכרמל', lat: 32.7300, lng: 35.0450, features: ['ברצועה', 'צל'] },
  { id: 'pl11', name: 'צימר שמקבל כלבים', kind: 'hotel', city: 'הגליל', lat: 32.9650, lng: 35.4960, features: ['חצר מגודרת', 'תוספת תשלום לכלב'] },
  { id: 'pl12', name: 'מלון ידידותי לכלבים', kind: 'hotel', city: 'אילת', lat: 29.5580, lng: 34.9520, features: ['עד כלב אחד בחדר'], note: 'חם מאוד בקיץ, לטייל רק בבוקר ובערב' },
  { id: 'pl13', name: 'גינת כלבים בשכונה החדשה', kind: 'park', city: 'באר שבע', lat: 31.2550, lng: 34.7920, features: ['מגודר', 'תאורה בלילה'] },
  { id: 'pl14', name: 'חנות לחיות מחמד', kind: 'shop', city: 'באר שבע', lat: 31.2480, lng: 34.7990, features: ['אפשר להיכנס עם הכלב'] },
  { id: 'pl15', name: 'גינת כלבים בפארק המרכזי', kind: 'park', city: 'ראשון לציון', lat: 31.9640, lng: 34.8040, features: ['מגודר', 'צל', 'ברזיית מים'] },
  { id: 'pl16', name: 'טיילת הים', kind: 'nature', city: 'נתניה', lat: 32.3290, lng: 34.8510, features: ['ברצועה', 'נוף'] },
  { id: 'pl17', name: 'חוף כלבים בצפון', kind: 'beach', city: 'הרצליה', lat: 32.1750, lng: 34.8000, features: ['אפשר בלי רצועה', 'חניה'] },
  { id: 'pl18', name: 'מסעדה עם גינה', kind: 'cafe', city: 'רעננה', lat: 32.1840, lng: 34.8710, features: ['קערת מים', 'פינה לכלבים'] },
  { id: 'pl19', name: 'גינת כלבים ליד האגם', kind: 'park', city: 'כפר סבא', lat: 32.1760, lng: 34.9100, features: ['מגודר', 'אזור לגורים'] },
  { id: 'pl20', name: 'חנות מזון ואביזרים', kind: 'shop', city: 'פתח תקווה', lat: 32.0880, lng: 34.8860, features: ['משלוחים'] },
  { id: 'pl21', name: 'מרפאה וטרינרית', kind: 'vet', city: 'מודיעין', lat: 31.8990, lng: 35.0080, features: ['חניה'] },
  { id: 'pl22', name: 'פארק מסלולים', kind: 'nature', city: 'מודיעין', lat: 31.9070, lng: 34.9920, features: ['ברצועה', 'מסלול מעגלי'] },
  { id: 'pl23', name: 'גינת כלבים בצפון העיר', kind: 'park', city: 'אשדוד', lat: 31.8050, lng: 34.6550, features: ['מגודר'] },
  { id: 'pl24', name: 'טיילת הכנרת', kind: 'nature', city: 'טבריה', lat: 32.7900, lng: 35.5390, features: ['ברצועה', 'מים בדרך'] },
  { id: 'pl25', name: 'בית קפה בשדרה', kind: 'cafe', city: 'רחובות', lat: 31.8940, lng: 34.8110, features: ['ישיבה בחוץ'] },
  { id: 'pl26', name: 'גינת כלבים ליד הספרייה', kind: 'park', city: 'חולון', lat: 32.0130, lng: 34.7790, features: ['מגודר', 'צל'] },
]

export const kindLabel = (k: PlaceKind) => kinds.find(([id]) => id === k)![1]

/** Distance in km, for "near me". */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}
