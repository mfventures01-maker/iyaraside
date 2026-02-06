
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import Reservations from './pages/Reservations';
import Catering from './pages/Catering';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import EliteDashboard from './pages/EliteDashboard';
import { CartProvider } from './context/CartContext';
import { LuxuryProvider } from './context/LuxuryContext';
import { OperationsProvider } from './context/OperationsContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <OperationsProvider>
        <LuxuryProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/catering" element={<Catering />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/elite" element={<EliteDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LuxuryProvider>
      </OperationsProvider>
    </CartProvider>
  );
};

export default App;
