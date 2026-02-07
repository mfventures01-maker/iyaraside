
import React from 'react';
import { useLuxury } from '../context/LuxuryContext';
import { useOperations } from '../context/OperationsContext';
import { ArrowUpRight, ShieldCheck, Zap, Activity } from 'lucide-react';

const EliteDashboard: React.FC = () => {
    const { isLuxuryMode, toggleLuxuryMode, liquidAssets, discretionScore } = useLuxury();
    const { orders } = useOperations();

    if (!isLuxuryMode) {
        // ... existing access denied code ...
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gold-500">
                <div className="text-center">
                    <h1 className="text-4xl font-serif text-white mb-8">Access Restricted</h1>
                    <p className="mb-8 text-gray-400">Only authorized personnel may view the Elite Dashboard.</p>
                    <button
                        onClick={toggleLuxuryMode}
                        className="px-6 py-3 border border-yellow-600 text-yellow-500 hover:bg-yellow-900 transition-colors uppercase tracking-widest text-xs"
                    >
                        Activate Protocol
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-200 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-white">Iyara Elite <span className="text-yellow-600">Nexus</span></h1>
                        <p className="text-xs text-gray-500 mt-2">Asaba Node • UTC +1 • Latency: 0.00ms</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-4 py-2 rounded border ${discretionScore === 10 ? 'border-green-900 bg-green-900/10 text-green-500' : 'border-red-900 text-red-500'}`}>
                            <ShieldCheck size={16} />
                            <span className="text-xs font-bold tracking-wider">SHIELD: {discretionScore === 10 ? 'ACTIVE' : 'COMPROMISED'}</span>
                        </div>
                        <button onClick={toggleLuxuryMode} className="text-xs text-gray-600 hover:text-white">DEACTIVATE</button>
                    </div>
                </header>

                {/* Real-time Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <MetricCard
                        label="Energy Density"
                        value="98.2%"
                        icon={<Zap size={18} />}
                        trend="+4.2%"
                    />
                    <MetricCard
                        label="Liquid Asset Velocity"
                        value="₦2.4M/hr"
                        icon={<Activity size={18} />}
                        trend="+12%"
                    />
                    <MetricCard
                        label="Anticipation Rate"
                        value="100%"
                        icon={<ArrowUpRight size={18} />}
                        trend="PERFECT"
                    />
                    <MetricCard
                        label="Privacy Breaches"
                        value="0"
                        icon={<ShieldCheck size={18} />}
                        trend="STABLE"
                    />
                </div>

                {/* Live Kitchen Display */}
                <section className="mb-12">
                    <h2 className="text-xl font-light uppercase tracking-widest mb-6 text-yellow-500 flex items-center gap-2">
                        <Activity className="animate-pulse" /> Live Kitchen Orders
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-gray-900/30 border border-gray-800 rounded-xl">
                                <p className="text-gray-500">No active orders in queue.</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-gray-900/50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-white">Table {order.tableNumber}</h3>
                                            <p className="text-xs text-gray-400 font-mono mt-1">{new Date(order.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs font-bold uppercase text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded mb-1">{order.paymentMethod}</span>
                                            <span className="block text-xs text-gray-500">Staff: {order.assignedStaff}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4 border-t border-gray-800 pt-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-300">{item.quantity}x {item.name}</span>
                                                <span className="text-gray-500 font-mono">₦{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-800">
                                        <span className="text-gray-500">Total</span>
                                        <span className="text-xl font-black text-white">₦{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Liquid Assets Vault */}
                <section className="mb-12">
                    <h2 className="text-xl font-light uppercase tracking-widest mb-6 text-gray-400">Vault Inventory</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-900 text-gray-500 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4">Asset Name</th>
                                    <th className="p-4">Vintage</th>
                                    <th className="p-4">Scarcity</th>
                                    <th className="p-4 text-right">Valuation (NGN)</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {liquidAssets.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-900/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{item.name}</td>
                                        <td className="p-4 text-gray-400">{item.vintage}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-yellow-900/20 text-yellow-600 text-[10px] uppercase tracking-wide border border-yellow-900/30">
                                                {item.scarcity?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-gray-300">
                                            ₦{item.pricing.amount.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-gray-500 text-xs">SECURE</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Client Evolution (Mock) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-900/30 p-6 border border-gray-800">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Active Elite in Zone</h3>
                        <div className="space-y-4">
                            <ClientRow name="Chief O. (Oil Magnate)" status="Arriving in 5m" preference="Macallan 72" />
                            <ClientRow name="Ambassador K." status="Seated (Whisper Zone)" preference="Martell L'Or" />
                        </div>
                    </div>
                    <div className="bg-gray-900/30 p-6 border border-gray-800">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Staff Choreography</h3>
                        <div className="space-y-4">
                            <StaffRow name="Butler Chioma" assignment="Chief O." state="Preparing Glassware" />
                            <StaffRow name="Sommelier Emeka" assignment="Ambassador K." state="Decanting" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, icon, trend }: any) => (
    <div className="bg-gray-900/30 p-6 border border-gray-800 hover:border-yellow-900/50 transition-all group">
        <div className="flex justify-between items-start mb-4 text-gray-500 group-hover:text-yellow-500 transition-colors">
            {icon}
            <span className="text-[10px] uppercase tracking-widest">{trend}</span>
        </div>
        <div className="text-2xl font-light text-white mb-1">{value}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
);

const ClientRow = ({ name, status, preference }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
        <div>
            <div className="text-white text-sm">{name}</div>
            <div className="text-gray-500 text-xs">{preference}</div>
        </div>
        <div className="text-yellow-600 text-xs text-right">{status}</div>
    </div>
);

const StaffRow = ({ name, assignment, state }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
        <div>
            <div className="text-white text-sm">{name}</div>
            <div className="text-gray-500 text-xs">Assign: {assignment}</div>
        </div>
        <div className="text-green-600 text-xs text-right">{state}</div>
    </div>
);

export default EliteDashboard;
