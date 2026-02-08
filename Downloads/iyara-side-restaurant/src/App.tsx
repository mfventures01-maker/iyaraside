
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
import { CarssProvider } from './carss/CarssContext';
import StaffLogin from './pages/StaffLogin';
import DashboardRouter from './pages/DashboardRouter';
import CeoHQ from './pages/CeoHQ';
import StaffAdmin from './pages/StaffAdmin';
import TransactionsLog from './pages/TransactionsLog';
import PosTerminal from './pages/PosTerminal';

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
      <CarssProvider>
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

                    {/* CARSS Protocol Routes */}
                    <Route path="/staff/login" element={<StaffLogin />} />
                    <Route path="/dashboard" element={<DashboardRouter />} />
                    <Route path="/dashboard/ceo" element={<CeoHQ />} />
                    <Route path="/dashboard/staff-admin" element={<StaffAdmin />} />
                    <Route path="/dashboard/staff-admin" element={<StaffAdmin />} />
                    <Route path="/dashboard/transactions" element={<TransactionsLog />} />
                    <Route path="/dashboard/pos" element={<PosTerminal />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </LuxuryProvider>
        </OperationsProvider>
      </CarssProvider>
    </CartProvider>
  );
};

export default App;
