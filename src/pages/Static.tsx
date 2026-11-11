import { useState } from 'react'
import { Link } from 'react-router-dom'
import { A11Y_CONTACT, APP_NAME, SIGNUP_ENDPOINT } from '../config'
import { Page } from '../components/Layout'
import { Alert, Phone } from '../components/Icons'
import vets from '../data/emergency-vets.json'

export function Soon() {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('sending')
    try {
      const res = await fetch(SIGNUP_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: new FormData(e.currentTarget).get('email') }) })
      setState(res.ok ? 'ok' : 'error')
    } catch { setState('error') }
  }
  return (
    <Page title="כבר יש לי כלב">
      <h1 className="pt-6 text-4xl font-extrabold">בקרוב</h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">החלק למי שכבר יש לו כלב עדיין בבנייה: תזכורות, הבית של הכלב ואלבום הגדילה. בינתיים אפשר לעבור על ספריית הכלבים.</p>
      <section aria-labelledby="signup-h" className="card mt-6 max-w-xl p-5">
        <h2 id="signup-h" className="text-xl">עדכנו אותי כשזה מוכן</h2>
        {!SIGNUP_ENDPOINT ? (
          <p className="m-0 mt-2 text-ink-soft">ההרשמה לעדכונים תיפתח בקרוב.</p>
        ) : state === 'ok' ? (
          <p role="status" className="m-0 mt-2 rounded-xl bg-good-bg p-3 font-semibold text-good-ink">נרשמתם. נעדכן אתכם במייל.</p>
        ) : (
          <form onSubmit={submit} className="mt-3 grid gap-3">
            <label htmlFor="email" className="font-semibold">כתובת מייל</label>
            <input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className="field" />
            <p className="m-0 text-sm text-ink-soft">נשתמש בכתובת רק כדי להודיע שהחלק הזה נפתח.</p>
            <button className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'שולח' : 'הרשמה'}</button>
            <p role="alert" className="m-0 min-h-6 font-semibold text-warn-ink">{state === 'error' ? 'ההרשמה לא הצליחה. נסו שוב בעוד רגע.' : ''}</p>
          </form>
        )}
      </section>
      <Link to="/library" className="btn btn-ghost mt-6">לספריית הכלבים</Link>
    </Page>
  )
}

/** High contrast, no animation, big dial buttons. */
export function Emergency() {
  return (
    <div className="min-h-dvh bg-white text-black" style={{ colorScheme: 'light' }}>
      <a href="#main" className="skip-link">דילוג לתוכן</a>
      <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-4 py-6 outline-none">
        <Link to="/" className="inline-flex min-h-11 items-center font-bold text-black">חזרה לדף הבית</Link>
        <h1 className="mt-2 text-4xl font-extrabold">חירום</h1>
        <p className="mt-3 border-4 border-black p-4 text-xl font-bold">אל תסמכו עלינו, פנו לווטרינר. אם הכלב בסכנה, התקשרו עכשיו למרפאה הקרובה או לווטרינר שלכם.</p>
        <p className="mt-4 flex gap-2 bg-[#FFE38A] p-4 text-lg font-semibold"><Alert className="shrink-0" />הרשימה עדיין לא אומתה. היא ממקור משנת 2020, והטלפונים והשעות אולי השתנו. התקשרו לפני שיוצאים לדרך.</p>
        <h2 className="mt-6 text-2xl">מרכזי חירום וטרינריים</h2>
        <ul className="m-0 mt-3 grid list-none gap-4 p-0">
          {vets.centers.map((c) => (
            <li key={c.phone} className="border-2 border-black p-4">
              <h3 className="text-xl">{c.name}</h3>
              <p className="m-0 text-lg">{c.city}{c.hours24 ? ' · לפי המקור, פתוח 24 שעות' : ' · שעות הפעילות לא ידועות'}</p>
              <a href={`tel:${c.phone.replaceAll('-', '')}`} className="mt-3 flex min-h-16 items-center justify-center gap-3 rounded-xl bg-black px-4 text-2xl font-bold text-white no-underline">
                <Phone /><span>חיוג</span><span dir="ltr">{c.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export function Accessibility() {
  const c = A11Y_CONTACT
  return (
    <Page title="הצהרת נגישות">
      <article className="max-w-2xl pt-6 [&_h2]:mt-7 [&_h2]:text-2xl [&_li]:mt-1 [&_p]:mt-2">
        <h1 className="text-4xl font-extrabold">הצהרת נגישות</h1>
        <p>אנחנו רוצים שכל אחד יוכל להשתמש באתר {APP_NAME}, גם אנשים עם מוגבלות. האתר נבנה לפי התקן הישראלי ת״י 5568, שמבוסס על WCAG 2.1 ברמה AA.</p>
        <h2>מה עשינו</h2>
        <ul className="ps-5">
          <li>אפשר להשתמש בכל האתר מהמקלדת, וסימון המיקוד תמיד נראה.</li>
          <li>האתר עובד עם קוראי מסך: כותרות מסודרות, תוויות לכפתורים ולשדות, והודעות על שינויים בעמוד.</li>
          <li>ניגודיות הצבעים של הטקסט היא 4.5:1 לפחות.</li>
          <li>אפשר להגדיל את התצוגה עד 200% בלי לאבד תוכן.</li>
          <li>מי שביקש במכשיר שלו פחות תנועה לא רואה אנימציות. כלב התלת ממד מוחלף בתמונה, וכל המידע עליו מופיע גם כטקסט.</li>
          <li>כפתורים וקישורים בגודל 44 פיקסלים לפחות.</li>
          <li>אין באתר תוסף נגישות חיצוני. הנגישות בנויה בקוד עצמו.</li>
        </ul>
        <h2>מה עדיין לא נגיש</h2>
        <ul className="ps-5">
          <li>הסיור בגוף הכלב בתלת ממד הוא חזותי. כל המידע שבו מופיע גם כטקסט באותו עמוד.</li>
          <li>האתר עוד לא נבדק על ידי יועץ נגישות מורשה.</li>
        </ul>
        <h2>נתקלתם בבעיה?</h2>
        {c.name || c.email || c.phone ? (
          <p>רכז הנגישות: {c.name}. {c.email && <>מייל: <a href={`mailto:${c.email}`} dir="ltr">{c.email}</a>. </>}{c.phone && <>טלפון: <a href={`tel:${c.phone}`} dir="ltr">{c.phone}</a>.</>}</p>
        ) : (
          <p>פרטי רכז הנגישות יתפרסמו כאן לפני השקת האתר.</p>
        )}
        <p>ההצהרה עודכנה בנובמבר 2026.</p>
      </article>
    </Page>
  )
}

export function NotFound() {
  return (
    <Page title="העמוד לא נמצא">
      <section className="card mt-10 p-6 text-center">
        <h1 className="text-3xl">העמוד הזה ברח מהרצועה</h1>
        <p className="text-ink-soft">לא מצאנו את העמוד שחיפשתם.</p>
        <Link to="/" className="btn btn-primary">לדף הבית</Link>
      </section>
    </Page>
  )
}
