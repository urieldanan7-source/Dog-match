import type { Breed, TraitId } from '../lib/scoring'
import { traitById } from '../lib/scoring'
import { levelText, pct } from '../lib/traitCopy'

/** One trait as a percent bar, with what the level means and a mark when the score is an estimate. */
export function TraitBar({ breed, trait, color = 'var(--accent)', track = 'var(--color-line)', withText = true }: { breed: Breed; trait: TraitId; color?: string; track?: string; withText?: boolean }) {
  const v = breed.scores[trait]
  const estimate = breed.source[trait] === 'estimate'
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-[.9375rem] font-semibold">
        <span>
          {traitById[trait].name}
          {estimate && <span className="ms-2 rounded border px-1.5 py-px text-xs font-semibold opacity-80" style={{ borderColor: 'currentColor' }}>הערכה</span>}
        </span>
        <span className="text-end">{withText && <span className="font-normal opacity-90">{levelText(trait, v)} · </span>}{pct(v)}%</span>
      </div>
      <div className="h-1" style={{ background: track }} aria-hidden="true">
        <div className="h-1" style={{ width: `${pct(v)}%`, background: color }} />
      </div>
    </div>
  )
}
