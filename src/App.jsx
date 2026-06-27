import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/Home/HomePage'
import BlogList from './pages/Blog/BlogList'
import BlogPost from './pages/Blog/BlogPost'
import AIList from './pages/AI/AIList'
import AIPost from './pages/AI/AIPost'
import WritePage from './pages/Write/WritePage'
import ExplorePage from './pages/Explore/ExplorePage'
import AttractionDetail from './pages/Explore/AttractionDetail'
import AboutPage from './pages/About/AboutPage'
import './App.css'

function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/blog" element={<AppLayout><BlogList /></AppLayout>} />
      <Route path="/blog/:slug" element={<AppLayout><BlogPost /></AppLayout>} />
      <Route path="/ai" element={<AppLayout><AIList /></AppLayout>} />
      <Route path="/ai/:slug" element={<AppLayout><AIPost /></AppLayout>} />
      <Route path="/explore" element={<AppLayout><ExplorePage /></AppLayout>} />
      <Route path="/explore/attraction/:slug" element={<AppLayout><AttractionDetail /></AppLayout>} />
      <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
      <Route path="/write" element={<AppLayout><WritePage /></AppLayout>} />
    </Routes>
  )
}
