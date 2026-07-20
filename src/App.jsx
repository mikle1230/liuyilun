import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import Seo from './components/Seo'
import './App.css'

// Route-level code splitting — each page becomes its own Vite chunk
const HomePage = lazy(() => import('./pages/Home/HomePage'))
const JournalList = lazy(() => import('./pages/Journal/JournalList'))
const JournalPost = lazy(() => import('./pages/Journal/JournalPost'))
const WritePage = lazy(() => import('./pages/Write/WritePage'))
const ExplorePage = lazy(() => import('./pages/Explore/ExplorePage'))
const AttractionDetail = lazy(() => import('./pages/Explore/AttractionDetail'))
const AboutPage = lazy(() => import('./pages/About/AboutPage'))
const WallpapersPage = lazy(() => import('./pages/Wallpapers/WallpapersPage'))


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
      <Seo {...seo} />
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </AppLayout>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    // Retry after lazy components mount
    const t = setTimeout(() => window.scrollTo(0, 0), 100)
    return () => clearTimeout(t)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Page seo={{ title: 'Home' }}><HomePage /></Page>} />

      {/* Journal — merged blog + AI */}
      <Route path="/journal" element={<Page seo={{ title: 'Journal', path: '/journal' }}><JournalList /></Page>} />
      <Route path="/journal/:slug" element={<Page><JournalPost /></Page>} />

      {/* Legacy redirects */}
      <Route path="/blog" element={<Navigate to="/journal" replace />} />
      <Route path="/blog/:slug" element={<LegacyRedirect to="/journal" />} />
      <Route path="/ai" element={<Navigate to="/journal" replace />} />
      <Route path="/ai/:slug" element={<LegacyRedirect to="/journal" />} />
      <Route path="/ai-nav" element={<Navigate to="/journal" replace />} />

      <Route path="/explore" element={<Page seo={{ title: 'Explore', path: '/explore' }}><ExplorePage /></Page>} />
      <Route path="/explore/attraction/:slug" element={<Page><AttractionDetail /></Page>} />
      <Route path="/about" element={<Page seo={{ title: 'About', path: '/about' }}><AboutPage /></Page>} />
      <Route path="/write" element={<Page seo={{ title: 'Write', path: '/write' }}><WritePage /></Page>} />

      {/* Collection (was Wallpapers) */}
      <Route path="/collection" element={<Page seo={{ title: 'Collection', path: '/collection' }}><WallpapersPage /></Page>} />
      <Route path="/wallpapers" element={<Navigate to="/collection" replace />} />


      <Route path="*" element={<Page><NotFound /></Page>} />
    </Routes>
    </>
  )
}

function LegacyRedirect({ to }) {
  const { slug } = useParams()
  return <Navigate to={`${to}/${slug}`} replace />
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 24px' }}>
      <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', color: 'var(--accent)', marginBottom: 16 }}>
        404
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>页面未找到</p>
    </div>
  )
}
