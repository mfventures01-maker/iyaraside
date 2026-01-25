import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';

import Login from '@/pages/auth/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import Payments from '@/pages/dashboard/Payments';
import Disputes from '@/pages/dashboard/Disputes';
import Outbox from '@/pages/dashboard/Outbox';

const AppContent: React.FC = () => {
  return (
    <React.Fragment>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Hotel Routes */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<HotelLanding />} />
          <Route path="/hotel" element={<HotelLanding />} />
          <Route path="/fobbs" element={<HotelLanding />} />
        </Route>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Internal Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="payments" element={<Payments />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="outbox" element={<Outbox />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Fragment>
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