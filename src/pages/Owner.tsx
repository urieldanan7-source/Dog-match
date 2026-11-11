import { Link } from 'react-router-dom'
import { Page } from '../components/Layout'
import { Forward } from '../components/Icons'
import { SectionHead } from '../components/ui'

export const OWNER_LINKS: { to: string; n: string; title: string; text: string }[] = [
  { to: '/my-dog', n: '01', title: 'הכלב שלי', text: 'פרויקט לכל כלב: חיסונים, תזכורות, אוכל ומים, וחובות של בעלי כלבים.' },
  { to: '/store', n: '02', title: 'חנות וקופונים', text: 'מוצרים שמתאימים לכלב שלכם, וקודי הנחה לחנויות ולווטרינרים.' },
  { to: '/insurance', n: '03', title: 'ביטוח בריאות', text: 'השוואה בין פוליסות: כמה עולה, מה מכוסה ומה לא.' },
  { to: '/health', n: '04', title: 'שאלות בריאות', text: 'מה יכול להיות, ומתי לא לחכות ולנסוע לווטרינר.' },
  { to: '/toxic', n: '05', title: 'מה אסור לכלב לאכול', text: 'חיפוש מהיר לפני שנותנים לו מהצלחת.' },
  { to: '/places', n: '06', title: 'מפת מקומות', text: 'גינות כלבים, חופים, בתי קפה, מסלולים ולינה שמקבלים כלבים.' },
  { to: '/zanbi', n: '07', title: 'זנבי', text: 'הבוט שעונה: מה מותר לאכול, מתי החיסון הבא, ולאן לצאת.' },
  { to: '/lost', n: '08', title: 'כלב אבד או נמצא', text: 'מה עושים מיד, ומודעה מוכנה להדפסה.' },
  { to: '/sitters', n: '09', title: 'החלפת שמירה', text: 'שכנים ששומרים אחד על הכלב של השני, ודף מסודר לשומר.' },
  { to: '/kids', n: '10', title: 'מצב ילדים', text: 'כללים פשוטים לילדים ולוח משימות שבועי.' },
  { to: '/adopt', n: '11', title: 'אימוץ', text: 'מה לשאול בעמותה, ואיך עובר השבוע הראשון.' },
  { to: '/emergency', n: '12', title: 'חירום', text: 'מוקדים וטרינריים עם כפתור חיוג.' },
]

export function OwnerGrid() {
  return (
    <ul className="m-0 mt-8 grid list-none gap-px overflow-hidden border border-line bg-line p-0 sm:grid-cols-2 lg:grid-cols-3">
      {OWNER_LINKS.map((l) => (
        <li key={l.to} className="bg-bg">
          <Link to={l.to} className="group flex h-full flex-col gap-3 p-6 text-ink no-underline transition-colors hover:bg-blush">
            <span className="numeral text-3xl" style={{ color: 'var(--accent)' }}>{l.n}</span>
            <span className="font-display text-2xl font-bold">{l.title}</span>
            <span className="text-ink-soft">{l.text}</span>
            <span className="mt-auto flex items-center gap-1 pt-2 font-semibold" style={{ color: 'var(--accent)' }}>כניסה<Forward width={18} height={18} /></span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function Owner() {
  return (
    <Page title="כבר יש לי כלב" wide>
      <div className="pt-10">
        <SectionHead eyebrow="כבר יש לי כלב" title="כל מה שצריך לחיים עם הכלב">
          תזכורות, הנחות, ביטוח, ומה עושים כשמשהו לא בסדר. הכל נשמר רק במכשיר שלכם.
        </SectionHead>
      </div>
      <OwnerGrid />
    </Page>
  )
}
