import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PawCursorTrail from './components/PawCursorTrail';
import Curtain from './components/Curtain';

// Pages
import Home from './pages/Home';
import Puppies from './pages/Puppies';
import HappyFamilies from './pages/HappyFamilies';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import GoneHome from './pages/GoneHome';
import PuppyDetail from './pages/PuppyDetail';

/**
 * ScrollToTop helper: scrolls window to top on route navigation
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PawCursorTrail />
      <Curtain />
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>
      <Navbar />
      <main id="main" style={{ paddingTop: 'var(--header-h, 4.75rem)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/puppies" element={<Puppies />} />
          <Route path="/happy-families" element={<HappyFamilies />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gone-home" element={<GoneHome />} />
          <Route path="/puppies/:slug" element={<PuppyDetail />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
