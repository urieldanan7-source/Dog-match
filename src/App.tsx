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
const Owner = lazy(() => import('./pages/Owner'))
const Store = lazy(() => import('./pages/Store'))
const Insurance = lazy(() => import('./pages/Insurance'))
const Toxic = lazy(() => import('./pages/Toxic'))
const Health = lazy(() => import('./pages/Health'))
const MyDogList = lazy(() => import('./pages/MyDog').then((m) => ({ default: m.MyDogList })))
const MyDogProject = lazy(() => import('./pages/MyDog').then((m) => ({ default: m.MyDogProject })))
const pick = (name: 'Emergency' | 'Accessibility' | 'NotFound') => lazy(() => import('./pages/Static').then((m) => ({ default: m[name] })))
const Emergency = pick('Emergency'), Accessibility = pick('Accessibility'), NotFound = pick('NotFound')

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
          <Route path="/owner" element={<Owner />} />
          <Route path="/soon" element={<Owner />} />
          <Route path="/my-dog" element={<MyDogList />} />
          <Route path="/my-dog/:id" element={<MyDogProject />} />
          <Route path="/store" element={<Store />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/toxic" element={<Toxic />} />
          <Route path="/health" element={<Health />} />
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
