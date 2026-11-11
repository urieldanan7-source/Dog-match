import { describe, expect, it } from 'vitest'
import { profileFromAnswers, type Answers } from './quiz'
import { distance, rankBreeds, scoreBreed, breedById } from './scoring'

/**
 * The worked example from the spec ("בסיס לבנייה"): a couple with an 8-year-old,
 * a 70 sqm flat with a lift, attached neighbours, one to two hours a day, dog alone
 * 4 to 8 hours, light walks, 300 to 600 ILS, no experience, air-conditioning in the
 * centre, hair bothers a little. Priorities: happy with kids, easy to train.
 */
const example: Answers = {
  changes: 'no', people: '3+', kids: '6-12', pets: 'none', allergy: 'no',
  home: 'elevator', homeSize: '60-90', garden: 'none', neighbors: 'yes',
  time: '1-2', aloneHours: '4-8', sport: 'walks', travel: 'rare',
  budget: '300-600', experience: 'none', priorities: ['kids', 'trainable'],
  climate: 'center', hair: 'some',
}

describe('profileFromAnswers', () => {
  it('maps the worked example to the needs in the spec', () => {
    const { needs, options } = profileFromAnswers(example)
    expect(needs).toEqual({
      energy: 3, shedding: 3, barking: 2, exercise: 3, size: 3, grooming: 5, cost: 2,
      trainability: 4, kids: 4, pets: 1, alone: 3, heat: 2,
    })
    expect(options.priorities?.sort()).toEqual(['kids', 'trainability'])
    expect(options.allergy).toBe(false)
  })

  it('uses the lenient value for traits no question set', () => {
    const { needs } = profileFromAnswers({})
    expect(needs.shedding).toBe(5)
    expect(needs.kids).toBe(1)
    expect(needs.energy).toBe(3)
  })

  it('takes the stricter value when two questions touch one trait', () => {
    expect(profileFromAnswers({ home: 'garden', homeSize: '<60' }).needs.size).toBe(2)
    expect(profileFromAnswers({ home: 'garden', travel: 'lots' }).needs.size).toBe(3)
  })
})

describe('distance', () => {
  it('follows each mode', () => {
    expect(distance('max', 5, 3)).toBe(2)
    expect(distance('max', 2, 3)).toBe(0)
    expect(distance('min', 2, 4)).toBe(2)
    expect(distance('min', 5, 4)).toBe(0)
    expect(distance('target', 5, 3)).toBe(2)
    expect(distance('target', 2, 3)).toBe(1)
  })
})

describe('rankBreeds reproduces the worked example', () => {
  const { needs, options } = profileFromAnswers(example)
  const { matches, notYet } = rankBreeds(needs, options)
  const pct = (id: string) => matches.find((m) => m.breed.id === id)!.percent

  it('gives the percentages in the spec', () => {
    expect(pct('shih-tzu')).toBe(88)
    expect(pct('mixed-small')).toBe(84)
    expect(pct('poodle')).toBe(84)
    expect(pct('beagle')).toBe(81)
    expect(pct('mixed-medium')).toBe(81)
  })

  it('orders the top five as in the spec', () => {
    expect(matches.slice(0, 5).map((m) => m.breed.id)).toEqual([
      'shih-tzu', 'mixed-small', 'poodle', 'beagle', 'mixed-medium',
    ])
    expect(notYet).toBe(false)
  })

  it('drops the French Bulldog to the bottom for cost despite 88%', () => {
    const fb = matches.find((m) => m.breed.id === 'french-bulldog')!
    expect(fb.percent).toBe(88)
    expect(fb.overBudget).toBe(true)
    const firstOver = matches.findIndex((m) => m.overBudget)
    expect(matches.slice(firstOver).every((m) => m.overBudget)).toBe(true)
    expect(matches.indexOf(fb)).toBeGreaterThanOrEqual(firstOver)
  })

  it('always gives at least two caveats, even for the best match', () => {
    for (const m of matches) expect(m.caveats.length).toBeGreaterThanOrEqual(2)
  })
})

describe('filters', () => {
  it('allergy hides breeds that shed more than 2', () => {
    const { needs } = profileFromAnswers({ allergy: 'yes' })
    const { matches } = rankBreeds(needs, { allergy: true })
    expect(matches.length).toBeGreaterThan(0)
    expect(matches.every((m) => m.breed.scores.shedding <= 2)).toBe(true)
    expect(scoreBreed(breedById('labrador')!, needs, { allergy: true })).toBeNull()
  })

  it('warns about heat for breeds with heat tolerance 1 when there is no air-conditioning', () => {
    const { needs, options } = profileFromAnswers({ climate: 'hot' })
    const husky = scoreBreed(breedById('husky')!, needs, options)!
    expect(husky.heatWarning).toBe(true)
    expect(scoreBreed(breedById('canaan')!, needs, options)!.heatWarning).toBe(false)
  })

  it('reports "not yet" when nothing reaches 60%', () => {
    const impossible = { ...profileFromAnswers({}).needs, shedding: 1, barking: 1, exercise: 1, size: 1, grooming: 1, cost: 1, trainability: 5, kids: 5, pets: 5, alone: 5, heat: 5, energy: 1 }
    expect(rankBreeds(impossible).notYet).toBe(true)
  })
})
