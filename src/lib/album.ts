import { useEffect, useState } from 'react'

/** Growth album photos, kept in IndexedDB on this device only. */
export interface Photo { id: string; projectId: string; date: string; note: string; blob: Blob }

const DB = 'dogmatch-album', STORE = 'photos'
let dbp: Promise<IDBDatabase> | null = null
const db = () => (dbp ??= new Promise((res, rej) => {
  const r = indexedDB.open(DB, 1)
  r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' }).createIndex('project', 'projectId')
  r.onsuccess = () => res(r.result)
  r.onerror = () => rej(r.error)
}))
const tx = async <T,>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) => {
  const s = (await db()).transaction(STORE, mode).objectStore(STORE)
  return new Promise<T>((res, rej) => { const r = fn(s); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) })
}

const subs = new Set<() => void>()
const changed = () => subs.forEach((s) => s())

export const album = {
  list: (projectId: string) => tx<Photo[]>('readonly', (s) => s.index('project').getAll(projectId)).then((l) => l.sort((a, b) => b.date.localeCompare(a.date))),
  async add(projectId: string, file: File, date: string, note: string) {
    const blob = await shrink(file)
    await tx('readwrite', (s) => s.put({ id: Math.random().toString(36).slice(2, 10), projectId, date, note, blob }))
    changed()
  },
  async remove(id: string) { await tx('readwrite', (s) => s.delete(id)); changed() },
}

export function useAlbum(projectId: string) {
  const [photos, setPhotos] = useState<(Photo & { url: string })[]>([])
  const [error, setError] = useState(false)
  useEffect(() => {
    let urls: string[] = []
    const load = () => album.list(projectId).then((l) => {
      urls.forEach(URL.revokeObjectURL)
      const next = l.map((p) => ({ ...p, url: URL.createObjectURL(p.blob) }))
      urls = next.map((p) => p.url)
      setPhotos(next)
    }).catch(() => setError(true))
    load(); subs.add(load)
    return () => { subs.delete(load); urls.forEach(URL.revokeObjectURL) }
  }, [projectId])
  return { photos, error }
}

/** Scales a photo down to 1200px so the album stays small. */
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file)
    const k = Math.min(1, 1200 / Math.max(bmp.width, bmp.height))
    const c = document.createElement('canvas')
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
    return await new Promise((res) => c.toBlob((b) => res(b ?? file), 'image/jpeg', 0.82))
  } catch { return file }
}
