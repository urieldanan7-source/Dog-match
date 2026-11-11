import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Forward } from '../components/Icons'
import { Sample, SectionHead } from '../components/ui'
import { IS_SAMPLE, shelters } from '../data/sample'

const ASK = [
  'מאיפה הוא הגיע, וכמה זמן הוא בעמותה?', 'איך הוא עם ילדים, עם כלבים אחרים ועם חתולים?', 'האם הוא רגיל להישאר לבד? לכמה זמן?',
  'האם הוא מחונך לצרכים בחוץ?', 'יש לו בעיות בריאות או תרופות קבועות?', 'מה כבר עשו לו: שבב, חיסונים, עיקור או סירוס?',
  'אפשר לבוא לטייל איתו לפני שמחליטים?', 'מה קורה אם זה לא מסתדר?',
]
const FIRST = [
  ['יומיים של שקט', 'בלי אורחים ובלי טיולים ארוכים. נותנים לו להכיר את הבית.'],
  ['פינה משלו', 'מיטה במקום שקט, ומים תמיד.'],
  ['אותו סדר יום', 'אוכל וטיולים באותן שעות. ככה הוא נרגע מהר יותר.'],
  ['ביקור אצל הווטרינר', 'בשבוע הראשון, ולהעביר את השבב לשם שלכם.'],
] as const

export default function Adopt() {
  return (
    <Page title="אימוץ" wide>
      <div className="pt-10"><SectionHead eyebrow="אימוץ" title="לאמץ כלב, ולעשות את זה נכון">הרבה כלבים בעמותות מחכים לבית. כדאי להגיע מוכנים, כדי שזה יהיה לתמיד.</SectionHead></div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-[#160F11] p-6 text-[#F6E4E2] sm:p-8" style={{ borderRadius: 'var(--radius-card)' }}>
        <p className="m-0 max-w-xl text-lg">קודם עושים את השאלון. הוא אומר איזה גודל, אנרגיה ואופי מתאימים לכם, גם כשמאמצים כלב מעורב.</p>
        <Link to="/quiz" className="btn btn-light">לשאלון<Forward /></Link>
      </div>

      <section aria-labelledby="ask-h" className="mt-14">
        <h2 id="ask-h" className="text-3xl">מה לשאול בעמותה</h2>
        <ol className="m-0 mt-5 grid list-none gap-x-8 p-0 sm:grid-cols-2">
          {ASK.map((q, i) => <li key={q} className="flex gap-4 border-t border-line py-4"><span className="numeral text-2xl" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span><span className="text-lg">{q}</span></li>)}
        </ol>
      </section>

      <section aria-labelledby="first-h" className="mt-14">
        <h2 id="first-h" className="text-3xl">השבוע הראשון בבית</h2>
        <ul className="m-0 mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {FIRST.map(([t, x]) => <li key={t} className="card p-5"><h3 className="text-xl">{t}</h3><p className="m-0 mt-2 text-ink-soft">{x}</p></li>)}
        </ul>
        <Link to="/my-dog" className="btn btn-primary mt-6">לפתוח לו פרויקט עם תזכורות</Link>
      </section>

      <section aria-labelledby="sh-h" className="mt-14">
        <div className="flex flex-wrap items-center gap-3"><h2 id="sh-h" className="text-3xl">עמותות</h2>{IS_SAMPLE && <Sample />}</div>
        <ul className="m-0 mt-5 grid list-none gap-px overflow-hidden border border-line bg-line p-0 md:grid-cols-3">
          {shelters.map((s) => (
            <li key={s.id} className="bg-bg p-5">
              <span className="eyebrow">{s.area}</span>
              <h3 className="mt-1 text-xl">{s.name}</h3>
              <p className="m-0 mt-1 text-ink-soft">כ־{s.dogs} כלבים · {s.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}
