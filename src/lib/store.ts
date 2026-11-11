import { useSyncExternalStore } from 'react'
import { loadAnswers, saveAnswers, type Answers } from './quiz'

interface State { answers: Answers; myDogs: string[]; night: boolean }

const DOGS_KEY = 'dogmatch.myDogs.v1'
const NIGHT_KEY = 'dogmatch.night.v1'
const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback } catch { return fallback }
}
const write = (key: string, v: unknown) => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage may be unavailable */ } }

let state: State = { answers: loadAnswers(), myDogs: read<string[]>(DOGS_KEY, []), night: read(NIGHT_KEY, false) }
const listeners = new Set<() => void>()
const set = (patch: Partial<State>) => { state = { ...state, ...patch }; listeners.forEach((l) => l()) }

export const useStore = () =>
  useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => state)

export const DEFAULT_DOG = 'border-collie'
export const actions = {
  answer(id: string, value: string | string[]) {
    const answers = { ...state.answers, [id]: value }
    saveAnswers(answers); set({ answers })
  },
  resetAnswers() { saveAnswers({}); set({ answers: {} }) },
  /** Choose "this is my dog". With `add`, keeps the first dog and adds a second. */
  setMyDog(id: string, add = false) {
    const myDogs = add && state.myDogs[0] && state.myDogs[0] !== id ? [state.myDogs[0], id] : [id]
    write(DOGS_KEY, myDogs); set({ myDogs })
  },
  setNight(night: boolean) { write(NIGHT_KEY, night); set({ night }) },
}

/** The dog sleeps between 22:00 and 07:00. */
export const isSleepTime = (d = new Date()) => d.getHours() >= 22 || d.getHours() < 7
