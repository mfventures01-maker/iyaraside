import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HotelLanding from '@/pages/HotelLanding';
import GuestHub from '@/pages/GuestHub';
// Legacy imports kept for reference but not actively linked in v1
// import Apartments from '@/pages/Apartments';
// import ApartmentDetail from '@/pages/ApartmentDetail';
// import Restaurant from '@/pages/Restaurant';
// import OrderCheckout from '@/pages/OrderCheckout';
// import Booking from '@/pages/Booking';
// import QROrdering from '@/pages/QROrdering';
// import AdminDashboard from '@/pages/AdminDashboard';
// import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

const AppContent: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* CARSS v1 Hotel Routes */}
        <Route path="/" element={<HotelLanding />} />
        <Route path="/hotel" element={<HotelLanding />} />
        <Route path="/fobbs" element={<HotelLanding />} />

        {/* Guest Services Hub */}
        <Route path="/services" element={<GuestHub />} />
        <Route path="/guest" element={<GuestHub />} />
        <Route path="/hub" element={<GuestHub />} />

        {/* Legacy / Optional Routes (Commented out to ensure V1 build stability) */}
        {/* <Route path="/apartments" element={<Apartments />} /> */}
        {/* <Route path="/apartments/:slug" element={<ApartmentDetail />} /> */}
        {/* <Route path="/restaurant" element={<Restaurant />} /> */}
        {/* <Route path="/restaurant/checkout" element={<OrderCheckout />} /> */}
        {/* <Route path="/book-legacy" element={<Booking />} /> */}
        {/* <Route path="/order" element={<QROrdering />} /> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      {/* AuthProvider kept but functionally optional for public booking */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;