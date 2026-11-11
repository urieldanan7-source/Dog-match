import { describe, expect, it } from 'vitest'
import { answer } from './zanbi'

const dog = { id: 'a', name: 'לולה', breedId: 'golden', created: '2026-01-01', done: {}, duties: [] }
describe('zanbi', () => {
  it('warns about grapes', () => expect(answer('מותר לכלב לאכול ענבים?', []).text).toMatch(/^ענבים וצימוקים: אסור/))
  it('does not read "אתה" as tea', () => expect(answer('מי אתה', []).text).toMatch(/זנבי/))
  it('sends emergencies to the emergency page', () => expect(answer('הכלב מדמם', []).links?.[0][0]).toBe('/emergency'))
  it('answers symptoms', () => expect(answer('הכלב מקיא', []).text).toMatch(/מקיא/))
  it('lists reminders for the dog', () => expect(answer('מה התור הבא?', [dog]).text).toMatch(/לולה/))
  it('knows food amounts', () => expect(answer('כמה אוכל לתת ללולה', [dog]).text).toMatch(/גרם/))
  it('points to the map', () => expect(answer('איפה יש חוף לכלבים', []).links?.[0][0]).toBe('/places'))
})
