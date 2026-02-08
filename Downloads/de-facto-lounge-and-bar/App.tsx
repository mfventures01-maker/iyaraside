
import React, { useState, useEffect } from 'react';
import Homepage from './components/home/Homepage';
import Dashboard from './components/Dashboard';
import TableLanding from './components/ordering/TableLanding';
import EliteDashboard from './components/dashboard/EliteDashboard';
import ServicePipeline from './components/dashboard/ServicePipeline';
import { mockDb } from './services/mockDatabase';
import { OrderItem } from './types';
import { auditStore, getCurrentActorRole } from './services/auditService';

// Simple client-side router
type Route = 'home' | 'dashboard' | 'qr-order' | 'staff' | 'ceo';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [tableId, setTableId] = useState<string>('');

  // Global State for Orders
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');


  // Client-side routing based on URL path
  useEffect(() => {
    const determineRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // QR route: /q/:tableId
      if (path.startsWith('/q/')) {
        const extractedTableId = path.split('/q/')[1];
        if (extractedTableId) {
          setTableId(extractedTableId);
          setCurrentRoute('qr-order');
          return;
        }
      }

      // Dashboard route: /dashboard
      if (path === '/dashboard') {
        setCurrentRoute('dashboard');
        return;
      }

      // Hash-based routes for dashboards (optional, for demo)
      if (hash === '#staff') {
        setCurrentRoute('staff');
        return;
      }
      if (hash === '#ceo') {
        setCurrentRoute('ceo');
        return;
      }

      // Default: Homepage
      setCurrentRoute('home');
    };


    determineRoute();

    // Listen for navigation changes
    const handlePopState = () => determineRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePlaceOrder = async (items: OrderItem[]) => {
    try {
      const order = await mockDb.createOrder(tableId, items, 'qr_guest');

      // Fire audit event: order_created
      auditStore.addEvent({
        event_type: 'order_created',
        actor_role: getCurrentActorRole(),
        ref: {
          orderId: order.id,
          tableId: tableId
        },
        metadata: {
          itemCount: items.length,
          totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }
      });

      setLastOrderId(order.id);
      setShowOrderSuccess(true);
      setTimeout(() => setShowOrderSuccess(false), 5000);
    } catch (err) {
      console.error('Order failed', err);
      alert('Failed to place order. Please try again.');
    }
  };

  // Render based on current route
  return (
    <div className="min-h-screen font-sans">
      {/* HOMEPAGE */}
      {currentRoute === 'home' && <Homepage />}

      {/* DASHBOARD */}
      {currentRoute === 'dashboard' && <Dashboard />}

      {/* QR ORDERING FLOW */}
      {currentRoute === 'qr-order' && (
        <div className="min-h-screen bg-[#051f11] text-white">
          <TableLanding
            tableId={tableId}
            onPlaceOrder={handlePlaceOrder}
          />

          {/* Success Overlay */}
          {showOrderSuccess && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#c4a45a] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_#c4a45a]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#051f11" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-4xl font-black text-[#fdfae5] mb-4 tracking-tighter">Order Sent</h2>
                <p className="text-[#c4a45a] font-bold uppercase tracking-widest mb-8">Order ID: {lastOrderId}</p>
                <p className="text-white/60 max-w-xs mx-auto">Your items are being prepared. A waiter will bring your bill shortly.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAFF DASHBOARD */}
      {currentRoute === 'staff' && (
        <div className="min-h-screen bg-[#051f11]">
          <ServicePipeline />
        </div>
      )}

      {/* CEO DASHBOARD */}
      {currentRoute === 'ceo' && (
        <EliteDashboard onClose={() => {
          window.location.hash = '';
          setCurrentRoute('home');
        }} />
      )}

      {/* Demo Navigation (for testing, can be removed in production) */}
      <div className="fixed bottom-4 right-4 z-[100] flex gap-2 bg-black/80 p-2 rounded-full border border-white/10 backdrop-blur-md">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/');
            setCurrentRoute('home');
          }}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentRoute === 'home' ? 'bg-[#c4a45a] text-[#051f11]' : 'text-white/50 hover:text-white'
            }`}
        >
          Home
        </button>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/q/T1');
            setTableId('T1');
            setCurrentRoute('qr-order');
          }}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentRoute === 'qr-order' ? 'bg-[#c4a45a] text-[#051f11]' : 'text-white/50 hover:text-white'
            }`}
        >
          QR (T1)
        </button>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/dashboard');
            setCurrentRoute('dashboard');
          }}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentRoute === 'dashboard' ? 'bg-[#c4a45a] text-[#051f11]' : 'text-white/50 hover:text-white'
            }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            window.location.hash = '#staff';
            setCurrentRoute('staff');
          }}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentRoute === 'staff' ? 'bg-[#c4a45a] text-[#051f11]' : 'text-white/50 hover:text-white'
            }`}
        >
          Staff
        </button>
        <button
          onClick={() => {
            window.location.hash = '#ceo';
            setCurrentRoute('ceo');
          }}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentRoute === 'ceo' ? 'bg-[#c4a45a] text-[#051f11]' : 'text-white/50 hover:text-white'
            }`}
        >
          CEO
        </button>
      </div>
    </div>
  );
};

export default App;
