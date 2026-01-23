import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  User,
  MapPin,
  CreditCard,
  History,
  ChevronRight,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

type TabType = 'overview' | 'bookings' | 'orders' | 'customers';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    pendingOrders: 0,
    totalCustomers: 0
  });
  const [data, setData] = useState<any>({
    bookings: [],
    orders: [],
    customers: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, ordersRes, customersRes] = await Promise.all([
        supabase.from('bookings').select('*, loyalty_accounts(tier)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*, loyalty_accounts(*)').order('created_at', { ascending: false })
      ]);

      const bookings = bookingsRes.data || [];
      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];

      setData({ bookings, orders, customers });

      const totalRev = [...bookings, ...orders].reduce((acc, curr) => acc + (curr.total_price || curr.total_amount || 0), 0);
      setStats({
        totalRevenue: totalRev,
        activeBookings: bookings.filter(b => b.status === 'confirmed').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalCustomers: customers.length
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state for immediate feedback
      setData((prev: any) => ({
        ...prev,
        orders: prev.orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o)
      }));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status. Please check your connection.");
    } finally {
      setUpdatingId(null);
    }
  };

  const StatusBadge = ({ status, onUpdate }: { status: string, onUpdate?: (s: string) => void }) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      preparing: 'bg-orange-50 text-orange-700 border-orange-100',
      ready: 'bg-purple-50 text-purple-700 border-purple-100',
      completed: 'bg-blue-50 text-blue-700 border-blue-100',
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      cancelled: 'bg-red-50 text-red-700 border-red-100',
      paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      pending_payment: 'bg-yellow-50 text-yellow-700 border-yellow-100'
    };
    
    const s = status?.toLowerCase() || 'pending';
    const badgeStyle = `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${colors[s] || 'bg-gray-50 text-gray-500 border-gray-100'}`;

    const getDisplayLabel = (val: string) => {
        if (val === 'ready') return 'Ready for Pickup';
        return val.replace('_', ' ');
    };

    if (!onUpdate) {
      return (
        <span className={badgeStyle}>
          {getDisplayLabel(status)}
        </span>
      );
    }

    return (
      <div className="relative inline-block">
        <select 
          value={s}
          onChange={(e) => onUpdate(e.target.value)}
          className={`${badgeStyle} pr-6 appearance-none outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 cursor-pointer bg-transparent`}
        >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready for Pickup</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 lg:flex gap-8">
        
        <aside className="lg:w-64 shrink-0 mb-8 lg:mb-0">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-4 shadow-sm sticky top-24">
            <div className="px-4 py-6">
              <h2 className="text-xl font-serif font-bold text-emerald-900">Admin Portal</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Fobbs Asaba</p>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                { id: 'bookings', icon: Calendar, label: 'Room Stays' },
                { id: 'orders', icon: ShoppingBag, label: 'Food Orders' },
                { id: 'customers', icon: Users, label: 'Loyalty Guests' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === item.id 
                      ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' 
                      : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-50 px-4">
              <div className="p-4 bg-emerald-50 rounded-2xl flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-900 truncate">Management</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">System Admin</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-grow space-y-8">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-gray-500">Real-time health of your business operations.</p>
                </div>
                <button 
                  onClick={fetchDashboardData}
                  className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-emerald-900"
                >
                  <History className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'emerald', trend: '+12%' },
                  { label: 'Active Stays', value: stats.activeBookings, icon: Calendar, color: 'blue', trend: '85% Cap' },
                  { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'yellow', trend: 'Live Feed' },
                  { label: 'Loyalty Guests', value: stats.totalCustomers, icon: Users, color: 'purple', trend: 'New: 4' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Live Kitchen Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-emerald-600 text-[10px] font-bold uppercase hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{order.customer_name || 'Guest'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{order.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-900">₦{order.total_amount.toLocaleString()}</p>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    ))}
                    {data.orders.length === 0 && <p className="p-8 text-center text-gray-400 italic text-sm">No recent orders.</p>}
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Upcoming Stays</h3>
                    <button onClick={() => setActiveTab('bookings')} className="text-emerald-600 text-[10px] font-bold uppercase hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.bookings.slice(0, 5).map((booking: any) => (
                      <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{booking.guest_name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(booking.check_in).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-900">₦{(booking.total_price || 0).toLocaleString()}</p>
                          <StatusBadge status={booking.status} />
                        </div>
                      </div>
                    ))}
                    {data.bookings.length === 0 && <p className="p-8 text-center text-gray-400 italic text-sm">No upcoming bookings.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Master Booking Registry</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Search guests..." className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium w-48" />
                    </div>
                    <button className="p-2 bg-gray-50 rounded-xl text-gray-400"><Filter className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guest</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Apartment</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stay Duration</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.bookings.map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-900">{booking.guest_name}</p>
                            <p className="text-[10px] text-gray-400">{booking.guest_phone}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                              {booking.apartment_id?.split('-')[1]?.toUpperCase() || 'STD'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                              <span>{booking.check_in}</span>
                              <ChevronRight className="w-3 h-3" />
                              <span>{booking.check_out}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-emerald-900">₦{(booking.total_price || 0).toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-2 text-gray-300 hover:text-emerald-900"><MoreVertical className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Restaurant Orders</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Export History</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Manage Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono font-bold text-gray-400">#{order.reference || order.id.slice(0, 6)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-900">{order.customer_name || 'Counter Order'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
                              <MapPin className="w-3 h-3" />
                              <span>{order.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase">
                              <CreditCard className="w-3 h-3" />
                              <span>{order.payment_method || 'Table'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-900">₦{order.total_amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            {updatingId === order.id ? (
                              <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-600" />
                            ) : (
                              <StatusBadge 
                                status={order.status} 
                                onUpdate={(newStatus) => updateOrderStatus(order.id, newStatus)} 
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {['Bronze', 'Silver', 'Gold'].map(tier => (
                  <div key={tier} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tier} Members</p>
                      <h4 className="text-xl font-bold text-gray-900">{data.customers.filter((c: any) => c.loyalty_accounts?.[0]?.tier === tier).length || 0}</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Loyalty Database</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guest</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Membership</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lifetime Spend</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.customers.map((customer: any) => {
                        const loyalty = customer.loyalty_accounts?.[0] || {};
                        return (
                          <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">{customer.full_name}</p>
                              <p className="text-[10px] text-gray-400">{customer.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                loyalty.tier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                loyalty.tier === 'Silver' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                                {loyalty.tier || 'BRONZE'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">{loyalty.points || 0}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-emerald-900">₦{(loyalty.lifetime_spend || 0).toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">{loyalty.total_visits || 1}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;