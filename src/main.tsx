import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/frank-ruhl-libre/hebrew-700.css'
import '@fontsource/frank-ruhl-libre/hebrew-900.css'
import '@fontsource/frank-ruhl-libre/latin-700.css'
import '@fontsource/frank-ruhl-libre/latin-900.css'
import '@fontsource/heebo/hebrew-400.css'
import '@fontsource/heebo/hebrew-600.css'
import '@fontsource/heebo/latin-400.css'
import '@fontsource/heebo/latin-600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
