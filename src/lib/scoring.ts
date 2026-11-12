import data from '../data/breeds.json'

export type TraitId =
  | 'shedding' | 'energy' | 'barking' | 'exercise' | 'trainability' | 'kids'
  | 'pets' | 'size' | 'alone' | 'grooming' | 'heat' | 'cost'
export type Mode = 'max' | 'min' | 'target'

export interface Trait { id: TraitId; name: string; mode: Mode }
export interface Breed {
  id: string
  name: string
  scores: Record<TraitId, number>
  source: Record<TraitId, 'chayuta' | 'estimate'>
  care: {
    weightKg: number
    foodGramsPerDay: number
    waterLitersPerDay: number
    monthlyFoodILS: { budget: number; premium: number }
    source: string
  }
}

export const traits = data.traits as Trait[]
export const allBreeds = data.breeds as unknown as Breed[]
/**
 * Real breeds only. "Mixed" is not a breed: every mixed dog is different, so the quiz, the library
 * and the comparison leave it out. The mixed entries stay in the data for owners of a mixed dog
 * (food and care estimates by size in "my dog").
 */
export const breeds = allBreeds.filter((b) => !b.id.startsWith('mixed-'))
export const traitById = Object.fromEntries(traits.map((t) => [t.id, t])) as Record<TraitId, Trait>
export const breedById = (id: string) => allBreeds.find((b) => b.id === id)

export type Needs = Record<TraitId, number>

/** The most lenient value for a trait: nothing is excluded until a question says so. */
export const lenient = (mode: Mode) => (mode === 'max' ? 5 : mode === 'min' ? 1 : 3)
export const defaultNeeds = (): Needs =>
  Object.fromEntries(traits.map((t) => [t.id, lenient(t.mode)])) as Needs

/** Distance between what the breed is and what the user needs, per the trait's mode. */
export function distance(mode: Mode, breedValue: number, need: number) {
  if (mode === 'target') return Math.abs(breedValue - need)
  if (mode === 'max') return Math.max(0, breedValue - need)
  return Math.max(0, need - breedValue)
}

export interface TraitScore { trait: TraitId; score: number; weight: number }
export interface MatchOptions {
  priorities?: TraitId[]
  allergy?: boolean
  noAircon?: boolean
  /**
   * What the user would like, on top of what they can handle. Needs are limits ("no bigger than 4");
   * a preference also costs a breed points for missing it on the other side ("I want a big dog").
   * Without this, the gentlest small breeds win almost every quiz, since they never break a limit.
   */
  prefs?: Partial<Record<TraitId, number>>
  /** Extra weight for a trait the user asked about directly, below the weight of a priority. */
  weights?: Partial<Record<TraitId, number>>
}
export interface Match {
  breed: Breed
  percent: number
  parts: TraitScore[]
  /** Traits that fit best (score times weight), up to 3. */
  reasons: TraitId[]
  /** Traits that fit worst, 2 to 3, shown as "worth knowing". */
  caveats: TraitId[]
  overBudget: boolean
  heatWarning: boolean
}

export function scoreBreed(breed: Breed, needs: Needs, opts: MatchOptions = {}): Match | null {
  if (opts.allergy && breed.scores.shedding > 2) return null
  const prio = new Set(opts.priorities ?? [])
  let total = 0
  let weights = 0
  const parts: TraitScore[] = traits.map((t) => {
    const value = breed.scores[t.id]
    const d = distance(t.mode, value, needs[t.id])
    const pref = opts.prefs?.[t.id]
    // A missed preference counts like a broken limit, on the side the limit does not cover.
    const miss = d === 0 && pref !== undefined ? Math.abs(value - pref) : 0
    const score = Math.max(0, 1 - (d + miss) / 2)
    const weight = prio.has(t.id) ? 3 : opts.weights?.[t.id] ?? 1
    total += weight * score
    weights += weight
    return { trait: t.id, score, weight }
  })
  const byBest = [...parts].sort((a, b) => b.score * b.weight - a.score * a.weight)
  const byWorst = [...parts].sort((a, b) => a.score - b.score)
  const weak = byWorst.filter((p) => p.score < 1).slice(0, 3)
  return {
    breed,
    percent: Math.round((100 * total) / weights),
    parts,
    reasons: byBest.slice(0, 3).map((p) => p.trait),
    caveats: (weak.length >= 2 ? weak : byWorst.slice(0, 2)).map((p) => p.trait),
    overBudget: breed.scores.cost - needs.cost >= 2,
    heatWarning: !!opts.noAircon && breed.scores.heat === 1,
  }
}

export const NOT_YET_THRESHOLD = 60

export interface MatchResult {
  matches: Match[]
  /** True when no breed within budget reaches the threshold: show the honest "not yet" message. */
  notYet: boolean
}

/** Rank all breeds. Breeds over budget drop to the bottom, keeping their order by percent. Ties go by name, as in the spec's example. */
export function rankBreeds(needs: Needs, opts: MatchOptions = {}, list: Breed[] = breeds): MatchResult {
  const all = list.map((b) => scoreBreed(b, needs, opts)).filter((m): m is Match => m !== null)
  const sorted = all
    .sort((a, b) =>
      Number(a.overBudget) - Number(b.overBudget) || b.percent - a.percent ||
      (a.breed.name < b.breed.name ? -1 : a.breed.name > b.breed.name ? 1 : 0),
    )
  const best = sorted.find((m) => !m.overBudget) ?? sorted[0]
  return { matches: sorted, notYet: !best || best.percent < NOT_YET_THRESHOLD }
}
