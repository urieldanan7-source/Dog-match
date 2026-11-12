import { describe, expect, it } from 'vitest'
import { profileFromAnswers, sizeNote, type Answers } from './quiz'
import { distance, rankBreeds, scoreBreed, breedById } from './scoring'

/**
 * The spec's worked example ("בסיס לבנייה"), updated for the 2026-11-12 quiz fix: the household-size
 * question became "what size of dog", the home, budget and neighbour limits were loosened to match
 * real costs, and wanting a size or having lots of time now counts against breeds that miss it.
 */
const example: Answers = {
  changes: 'no', sizePref: 'any', kids: '6-12', pets: 'none', allergy: 'no',
  home: 'elevator', homeSize: '60-90', garden: 'none', neighbors: 'yes',
  time: '1-2', aloneHours: '4-8', sport: 'walks', travel: 'rare',
  budget: '300-600', experience: 'none', priorities: ['kids', 'trainable'],
  climate: 'center', hair: 'some',
}

const base: Answers = {
  changes: 'no', sizePref: 'any', kids: 'none', pets: 'none', allergy: 'no',
  home: 'elevator', homeSize: '90-130', garden: 'none', neighbors: 'yes',
  time: '1-2', aloneHours: '4-8', sport: 'walks', travel: 'some',
  budget: '600-1000', experience: 'family', priorities: [], climate: 'center', hair: 'some',
}
const run = (a: Answers) => { const p = profileFromAnswers(a); return rankBreeds(p.needs, p.options).matches }
const size = (m: { breed: { scores: { size: number } } }) => m.breed.scores.size

describe('profileFromAnswers', () => {
  it('maps the worked example to needs', () => {
    const { needs, options } = profileFromAnswers(example)
    expect(needs).toEqual({
      energy: 3, shedding: 3, barking: 3, exercise: 3, size: 4, grooming: 5, cost: 3,
      trainability: 4, kids: 4, pets: 1, alone: 3, heat: 2,
    })
    expect(options.priorities?.sort()).toEqual(['kids', 'trainability'])
    expect(options.allergy).toBe(false)
    expect(options.prefs).toEqual({ exercise: 3 })
  })

  it('uses the lenient value for traits no question set', () => {
    const { needs } = profileFromAnswers({})
    expect(needs.shedding).toBe(5)
    expect(needs.kids).toBe(1)
    expect(needs.energy).toBe(3)
  })

  it('takes the stricter value when two questions touch one trait', () => {
    expect(profileFromAnswers({ home: 'garden', homeSize: '<60' }).needs.size).toBe(3)
    expect(profileFromAnswers({ home: 'garden', travel: 'lots' }).needs.size).toBe(4)
  })

  it('keeps a size wish inside what the home allows, and says so', () => {
    const p = profileFromAnswers({ sizePref: 'large', homeSize: '<60' })
    expect(p.options.prefs?.size).toBe(3)
    expect(p.notes.length).toBe(1)
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

describe('results follow the answers', () => {
  it('asking for a large dog puts a large dog first and no small dog in the top three', () => {
    const top = run({ ...base, sizePref: 'large' }).slice(0, 3)
    expect(size(top[0])).toBeGreaterThanOrEqual(4)
    expect(top.every((m) => size(m) >= 3)).toBe(true)
  })

  it('asking for a small dog puts small dogs first', () => {
    expect(run({ ...base, sizePref: 'small' }).slice(0, 3).every((m) => size(m) <= 2)).toBe(true)
  })

  it('an active owner with a garden gets active dogs, not lap dogs', () => {
    const top = run({ ...base, home: 'garden', garden: 'big', neighbors: 'no', time: '3+', aloneHours: '<4', sport: 'run', priorities: ['sport'], hair: 'no' }).slice(0, 3)
    expect(top.every((m) => m.breed.scores.exercise >= 4 && size(m) >= 3)).toBe(true)
  })

  it('a quiet single in a small flat gets small, calm dogs', () => {
    const top = run({ ...base, home: 'walkup', homeSize: '<60', time: '<1', sport: 'none', budget: '<300', experience: 'none', priorities: ['calm', 'quiet'], hair: 'very' }).slice(0, 2)
    expect(top.every((m) => size(m) <= 2)).toBe(true)
  })

  it('two very different people get different top two', () => {
    const a = run({ ...base, sizePref: 'small', time: '<1', sport: 'none' }).slice(0, 2).map((m) => m.breed.id)
    const b = run({ ...base, sizePref: 'large', time: '3+', sport: 'run', home: 'garden', garden: 'big' }).slice(0, 2).map((m) => m.breed.id)
    expect(a.filter((id) => b.includes(id))).toEqual([])
  })

  it('shows at most one mixed-breed group in the top three', () => {
    expect(run(example).slice(0, 3).filter((m) => m.breed.id.startsWith('mixed-')).length).toBeLessThanOrEqual(1)
  })

  it('explains when the size asked for is not on top', () => {
    const a: Answers = { ...base, sizePref: 'large', time: '<1', aloneHours: '8+', budget: '<300' }
    const matches = run(a)
    if (size(matches[0]) < 4) expect(sizeNote(a, matches)).toMatch(/הכלב הגדול שהכי מתאים לכם/)
    expect(sizeNote({ ...a, sizePref: 'any' }, matches)).toBeUndefined()
  })
})

describe('budget', () => {
  const { needs, options } = profileFromAnswers(example)
  const { matches } = rankBreeds(needs, options)
  it('drops breeds two steps over budget to the bottom', () => {
    const firstOver = matches.findIndex((m) => m.overBudget)
    if (firstOver >= 0) expect(matches.slice(firstOver).every((m) => m.overBudget)).toBe(true)
    expect(matches.find((m) => m.breed.id === 'labrador')!.overBudget).toBe(false)
    expect(rankBreeds(profileFromAnswers({ budget: '<300' }).needs).matches.find((m) => m.breed.id === 'labrador')!.overBudget).toBe(true)
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
