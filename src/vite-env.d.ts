/// <reference types="vite/client" />

declare module 'virtual:packed-dogs' {
  /** Dog files as data URLs, keyed by path under public/dogs. Empty outside the one-file build. */
  const files: Record<string, string>
  export default files
}
