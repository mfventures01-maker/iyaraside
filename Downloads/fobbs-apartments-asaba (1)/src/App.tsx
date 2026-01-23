import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HotelLanding from '@/pages/HotelLanding';

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
        <Route path="/" element={<HotelLanding />} />
        <Route path="/hotel" element={<HotelLanding />} />
        <Route path="/fobbs" element={<HotelLanding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;