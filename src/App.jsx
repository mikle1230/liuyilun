import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import RedirectToBlog from './components/RedirectToBlog'
import Seo from './components/Seo'
import './App.css'

// Route-level code splitting — each page becomes its own Vite chunk
const HomePage = lazy(() => import('./pages/Home/HomePage'))
const BlogList = lazy(() => import('./pages/Blog/BlogList'))
const BlogPost = lazy(() => import('./pages/Blog/BlogPost'))
const WritePage = lazy(() => import('./pages/Write/WritePage'))
const ExplorePage = lazy(() => import('./pages/Explore/ExplorePage'))
const AttractionDetail = lazy(() => import('./pages/Explore/AttractionDetail'))
const AboutPage = lazy(() => import('./pages/About/AboutPage'))

// Phase 3: Wallpapers
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
      <Route path="/" element={<Page seo={{ title: '首页' }}><HomePage /></Page>} />
      <Route path="/blog" element={<Page seo={{ title: '博客', path: '/blog' }}><BlogList /></Page>} />
      <Route path="/blog/:slug" element={<Page><BlogPost /></Page>} />

      {/* /ai routes → permanent redirect to /blog */}
      <Route path="/ai" element={<Navigate to="/blog" replace />} />
      <Route path="/ai/:slug" element={<RedirectToBlog />} />

      <Route path="/explore" element={<Page seo={{ title: '探索世界', path: '/explore' }}><ExplorePage /></Page>} />
      <Route path="/explore/attraction/:slug" element={<Page><AttractionDetail /></Page>} />
      <Route path="/about" element={<Page seo={{ title: '关于我', path: '/about' }}><AboutPage /></Page>} />
      <Route path="/write" element={<Page seo={{ title: '发布文章', path: '/write' }}><WritePage /></Page>} />

      {/* Wallpapers */}
      <Route path="/wallpapers" element={<Page seo={{ title: '壁纸', path: '/wallpapers' }}><WallpapersPage /></Page>} />

      <Route path="*" element={<Page><NotFound /></Page>} />
    </Routes>
  )
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
