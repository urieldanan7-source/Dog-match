import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { IrisProvider } from './components/Iris'
import { usePawPrints, useTheme } from './components/Layout'
import Home from './pages/Home'

const Quiz = lazy(() => import('./pages/Quiz'))
const Results = lazy(() => import('./pages/Results'))
const Library = lazy(() => import('./pages/Library'))
const Breed = lazy(() => import('./pages/Breed'))
const Compare = lazy(() => import('./pages/Compare'))
const pick = (name: 'Soon' | 'Emergency' | 'Accessibility' | 'NotFound') => lazy(() => import('./pages/Static').then((m) => ({ default: m[name] })))
const Soon = pick('Soon'), Emergency = pick('Emergency'), Accessibility = pick('Accessibility'), NotFound = pick('NotFound')

function Shell() {
  useTheme()
  usePawPrints()
  return (
    <IrisProvider>
      <Suspense fallback={<div className="grid min-h-dvh place-items-center bg-bg text-ink-soft" role="status">טוען</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz key="core" />} />
          <Route path="/quiz/refine" element={<Quiz key="refine" refine />} />
          <Route path="/results" element={<Results />} />
          <Route path="/library" element={<Library />} />
          <Route path="/breed/:id" element={<Breed />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/soon" element={<Soon />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </IrisProvider>
  )
}

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><Shell /></BrowserRouter>
}
