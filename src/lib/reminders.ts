import { reminders, type Reminder } from '../data/care'
import { addDays, daysBetween, today, type Project } from './projects'
import { breedById } from './scoring'

/** Senior from 7 years, large dogs (over 25 kg) from 6. A rough rule, the vet decides. */
export const seniorFromYears = (breedId: string) => ((breedById(breedId)?.care.weightKg ?? 15) > 25 ? 6 : 7)
export const ageDays = (p: Project) => (p.birth ? daysBetween(p.birth, today()) : null)
export const isSenior = (p: Project) => { const d = ageDays(p); return d !== null && d / 365 >= seniorFromYears(p.breedId) }

/** Seniors see the vet twice a year. */
const seniorCheck: Reminder = { id: 'senior', title: 'בדיקה תקופתית לכלב מבוגר', everyDays: 182, note: 'לכלב מבוגר מומלצת בדיקה פעמיים בשנה' }

export function dueDate(p: Project, r: Reminder): string | null {
  const last = p.done[r.id]
  if (r.atAgeWeeks !== undefined) {
    if (!p.birth || last) return null
    const due = addDays(p.birth, r.atAgeWeeks * 7)
    return daysBetween(p.birth, today()) > 365 ? null : due
  }
  return addDays(last ?? p.created, r.everyDays!)
}

export function upcoming(p: Project) {
  const list = isSenior(p) ? [...reminders.filter((r) => r.id !== 'yearly'), seniorCheck] : reminders
  return list.map((r) => ({ r, due: dueDate(p, r) })).filter((x): x is { r: Reminder; due: string } => !!x.due).sort((a, b) => a.due.localeCompare(b.due))
}

/** A calendar file with the next date of every reminder, so the phone reminds the owner. */
export function toICS(p: Project) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => '\\' + c)
  const events = upcoming(p).map(({ r, due }) => {
    const d = due.replaceAll('-', '')
    const next = addDays(due, 1).replaceAll('-', '')
    const rule = r.everyDays ? (r.everyDays % 365 === 0 ? `RRULE:FREQ=YEARLY;INTERVAL=${r.everyDays / 365}` : r.everyDays % 30 === 0 ? `RRULE:FREQ=MONTHLY;INTERVAL=${r.everyDays / 30}` : `RRULE:FREQ=DAILY;INTERVAL=${r.everyDays}`) : null
    return ['BEGIN:VEVENT', `UID:${p.id}-${r.id}@dogmatch`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${next}`, rule,
      `SUMMARY:${esc(`${p.name}: ${r.title}`)}`, `DESCRIPTION:${esc(r.note)}`,
      'BEGIN:VALARM', 'TRIGGER:-PT15H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(r.title)}`, 'END:VALARM', 'END:VEVENT'].filter(Boolean).join('\r\n')
  })
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//dogmatch//he', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n')
}
