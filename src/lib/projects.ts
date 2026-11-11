import { useSyncExternalStore } from 'react'

/** "The dog's project": one per dog, kept on this device only. */
export interface Project {
  id: string
  name: string
  breedId: string
  birth?: string
  created: string
  /** Reminder id to the date it was last done (ISO). */
  done: Record<string, string>
  duties: string[]
  /** Food bag tracking, for the reorder reminder. */
  bag?: { kg: number; opened: string }
}

const KEY = 'dogmatch.projects.v1'
const load = (): Project[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] } }
let list: Project[] = load()
const subs = new Set<() => void>()
const save = (next: Project[]) => {
  list = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* storage may be unavailable */ }
  subs.forEach((s) => s())
}

export const useProjects = () => useSyncExternalStore((s) => { subs.add(s); return () => subs.delete(s) }, () => list)
export const today = () => new Date().toISOString().slice(0, 10)

export const projects = {
  create(p: Pick<Project, 'name' | 'breedId' | 'birth'>): string {
    const id = Math.random().toString(36).slice(2, 9)
    save([...list, { ...p, id, created: today(), done: {}, duties: [] }])
    return id
  },
  update(id: string, patch: Partial<Project>) { save(list.map((p) => (p.id === id ? { ...p, ...patch } : p))) },
  remove(id: string) { save(list.filter((p) => p.id !== id)) },
}

export const addDays = (iso: string, days: number) => {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b + 'T12:00:00') - Date.parse(a + 'T12:00:00')) / 86_400_000)
export const formatDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })
