import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import Seo from './components/Seo'
import './App.css'

// Generic slug redirector: reads :slug param, redirects to /{base}/{slug}
function SlugRedirect({ base }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  useEffect(() => { navigate(`/${base}/${slug}`, { replace: true }) }, [slug, navigate, base])
  return null
}

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/Home/HomePage'))
const JournalList = lazy(() => import('./pages/Journal/JournalList'))
const JournalPost = lazy(() => import('./pages/Journal/JournalPost'))
const CollectionsPage = lazy(() => import('./pages/Collections/CollectionsPage'))
const TravelsPage = lazy(() => import('./pages/Travels/TravelsPage'))
const TravelDetail = lazy(() => import('./pages/Travels/TravelDetail'))
const AboutPage = lazy(() => import('./pages/About/AboutPage'))
const NowPage = lazy(() => import('./pages/Now/NowPage'))
const WritePage = lazy(() => import('./pages/Write/WritePage'))
const HKGate = lazy(() => import('./pages/HK/HKGate'))

function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

function Page({ children, seo }) {
  return (
    <AppLayout>
      {seo && <Seo {...seo} />}
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </AppLayout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Page seo={{ title: 'This Place' }}><HomePage /></Page>} />
      <Route path="/journal" element={<Page seo={{ title: 'Journal', path: '/journal' }}><JournalList /></Page>} />
      <Route path="/journal/:slug" element={<Page><JournalPost /></Page>} />
      <Route path="/collections" element={<Page seo={{ title: 'Collections', path: '/collections' }}><CollectionsPage /></Page>} />
      <Route path="/travels" element={<Page seo={{ title: 'Travels', path: '/travels' }}><TravelsPage /></Page>} />
      <Route path="/travels/:slug" element={<Page><TravelDetail /></Page>} />
      <Route path="/about" element={<Page seo={{ title: 'About', path: '/about' }}><AboutPage /></Page>} />
      <Route path="/now" element={<Page seo={{ title: 'Now', path: '/now' }}><NowPage /></Page>} />

      {/* Legacy redirects */}
      <Route path="/blog" element={<Navigate to="/journal" replace />} />
      <Route path="/blog/:slug" element={<SlugRedirect base="journal" />} />
      <Route path="/ai" element={<Navigate to="/journal" replace />} />
      <Route path="/ai/:slug" element={<SlugRedirect base="journal" />} />
      <Route path="/explore" element={<Navigate to="/travels" replace />} />
      <Route path="/explore/attraction/:slug" element={<SlugRedirect base="travels" />} />
      <Route path="/ai-nav" element={<Navigate to="/collections" replace />} />
      <Route path="/wallpapers" element={<Navigate to="/collections" replace />} />

      {/* Functional pages (keep) */}
      <Route path="/write" element={<Page seo={{ title: 'Write' }}><WritePage /></Page>} />
      <Route path="/hk" element={<HKGate />} />

      <Route path="*" element={<Page><NotFound /></Page>} />
    </Routes>
  )
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 24px', fontFamily: 'var(--font-serif)' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: 12 }}>404</h1>
      <p style={{ color: 'var(--text-secondary)' }}>This page doesn't exist.</p>
    </div>
  )
}
