import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

const local = '/opt/pw-browsers/chromium'
export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 390, height: 844 },
    locale: 'he-IL',
    launchOptions: existsSync(local) ? { executablePath: local } : {},
  },
  webServer: { command: 'npm run build && npm run preview -- --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 120_000 },
})
