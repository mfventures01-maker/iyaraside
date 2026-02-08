import React, { useState, useEffect } from 'react';
import { mockDb } from '../../services/mockDatabase';
import { Payment, Order, Table } from '../../types';

const EliteDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [metrics, setMetrics] = useState({
        totalSales: 0,
        pendingAmount: 0,
        voidRate: 0,
        activeTables: 0
    });
    const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const [p, o, t] = await Promise.all([
            mockDb.getPayments(),
            mockDb.getOrders(),
            mockDb.getTables()
        ]);

        // Calculate Metrics
        const verifiedSales = p.filter(pay => pay.status === 'verified').reduce((sum, pay) => sum + pay.amount, 0);
        const pending = p.filter(pay => pay.status === 'pending').reduce((sum, pay) => sum + pay.amount, 0);
        const voided = o.filter(ord => ord.status === 'voided').length;
        const totalOrders = o.length;
        const activeT = t.filter(tbl => tbl.status !== 'idle').length;

        setMetrics({
            totalSales: verifiedSales,
            pendingAmount: pending,
            voidRate: totalOrders > 0 ? (voided / totalOrders) * 100 : 0,
            activeTables: activeT
        });

        setPendingPayments(p.filter(pay => pay.status === 'pending').sort((a, b) => b.timestamp - a.timestamp));
        setOrders(o);
        setTables(t);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000); // Live Pulse
        return () => clearInterval(interval);
    }, []);

    const handleVerifyPayment = async (paymentId: string, approve: boolean) => {
        await mockDb.verifyPayment(paymentId, 'ceo', approve);
        await fetchData();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#051f11] text-[#fdfae5] overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542241647-9cbb8788d2f5?q=80&w=2600&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#051f11] via-transparent to-[#051f11]"></div>

            {/* HUD Header */}
            <div className="relative z-10 flex justify-between items-center p-8 border-b border-[#c4a45a]/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#c4a45a] rounded-full animate-pulse shadow-[0_0_15px_#c4a45a]"></div>
                    <h1 className="text-2xl font-serif font-bold tracking-[0.2em] uppercase">
                        CARSS <span className="text-[#c4a45a] mx-2">|</span> TRUTH SCREEN <span className="text-xs align-top opacity-50 ml-2">v.CEO</span>
                    </h1>
                </div>
                <div className="flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-[#c4a45a]">
                    <span>Pending Action: <span className={pendingPayments.length > 0 ? "text-red-500 font-bold" : "text-[#fdfae5]"}>{pendingPayments.length}</span></span>
                    <button onClick={onClose} className="px-4 py-2 border border-[#c4a45a]/30 hover:bg-[#c4a45a] hover:text-[#051f11] transition-all rounded-sm">Exit HUD</button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="relative z-10 grid grid-cols-12 gap-8 p-8 h-[calc(100vh-100px)]">

                {/* Left Column: Metrics & Pilfering Watch */}
                <div className="col-span-3 space-y-6">
                    <MetricCard
                        label="Total Revenue (Verified)"
                        value={`₦${metrics.totalSales.toLocaleString()}`}
                        highlight
                    />
                    <MetricCard
                        label="Floating Cash (Pending)"
                        value={`₦${metrics.pendingAmount.toLocaleString()}`}
                        trend={metrics.pendingAmount > 50000 ? 'critical' : 'stable'}
                    />
                    <div className="p-6 rounded-xl bg-red-900/10 border border-red-500/20 backdrop-blur-sm">
                        <h4 className="text-red-400 text-[10px] uppercase tracking-widest mb-2">Pilfering Watch (Voids)</h4>
                        <div className="text-3xl font-light text-red-500">
                            {metrics.voidRate.toFixed(1)}% <span className="text-xs opacity-50">of Orders</span>
                        </div>
                        <p className="text-xs text-red-400/50 mt-2">Threshold: 5%</p>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[40vh]">
                        <h4 className="text-[#c4a45a] text-[10px] uppercase tracking-widest mb-4 sticky top-0 bg-[#051f11]/80 backdrop-blur py-2">Recent Voided Orders</h4>
                        <div className="space-y-3">
                            {orders.filter(o => o.status === 'voided').slice(0, 5).map(order => (
                                <div key={order.id} className="p-3 bg-red-500/5 border-l-2 border-red-500/30 text-xs">
                                    <div className="flex justify-between text-red-200/80">
                                        <span>#{order.id.split('-')[1]}</span>
                                        <span>₦{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-1 text-red-400 italic">"{order.notes?.replace('VOID REASON: ', '')}"</div>
                                </div>
                            ))}
                            {orders.filter(o => o.status === 'voided').length === 0 && <div className="text-xs opacity-30 italic">No suspicious voids detected.</div>}
                        </div>
                    </div>
                </div>

                {/* Center: Table Map (Live) */}
                <div className="col-span-5 flex flex-col gap-6">
                    <div className="flex-1 bg-[#fdfae5]/5 rounded-3xl border border-[#c4a45a]/10 backdrop-blur-md p-8 relative overflow-hidden">
                        <div className="absolute top-4 left-6 text-[10px] uppercase text-[#c4a45a] tracking-widest">Live Floor Map</div>

                        <div className="flex flex-wrap gap-6 mt-8 justify-center content-start">
                            {tables.map((table) => {
                                const tableOrder = orders.find(o => o.tableId === table.id && o.status !== 'closed' && o.status !== 'voided');
                                const isDistressed = tableOrder && tableOrder.paymentStatus === 'pending' && (Date.now() - tableOrder.createdAt > 3600000); // 1hr unpaid

                                return (
                                    <div key={table.id} className={`w-32 h-32 rounded-full border flex flex-col items-center justify-center relative transition-all
                                        ${table.status === 'occupied'
                                            ? isDistressed ? 'border-red-500 bg-red-900/20' : 'border-[#c4a45a] bg-[#c4a45a]/10'
                                            : 'border-[#fdfae5]/10 bg-[#051f11]/40 opacity-50'
                                        }`}>
                                        <span className="text-xs font-mono text-[#c4a45a] mb-1">{table.id}</span>
                                        <span className="text-[10px] uppercase tracking-wider">{table.zone}</span>
                                        {tableOrder && (
                                            <div className="absolute -bottom-2 px-2 py-0.5 bg-[#051f11] text-[#c4a45a] border border-[#c4a45a] text-[9px] rounded-full">
                                                ₦{tableOrder.totalAmount.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Ambiguity Solver */}
                <div className="col-span-4 flex flex-col h-full">
                    <div className="bg-[#fdfae5]/5 rounded-2xl border border-[#c4a45a]/10 p-6 flex-1 flex flex-col overflow-hidden">
                        <h4 className="text-[#c4a45a] text-[10px] uppercase tracking-widest mb-6 flex justify-between items-center">
                            <span>Payment Verification Queue</span>
                            <span className="bg-[#c4a45a] text-[#051f11] px-2 rounded">{pendingPayments.length}</span>
                        </h4>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {pendingPayments.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-white/20 text-sm uppercase tracking-widest text-center">
                                    All Clear<br />No Ambiguity
                                </div>
                            ) : (
                                pendingPayments.map(payment => (
                                    <div key={payment.id} className="bg-black/30 p-4 rounded-xl border border-white/10 animate-in slide-in-from-right duration-300">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-mono opacity-50">{new Date(payment.timestamp).toLocaleTimeString()}</span>
                                            <span className="text-xs font-bold uppercase text-[#c4a45a]">{payment.method}</span>
                                        </div>
                                        <div className="text-2xl font-light mb-1">₦{payment.amount.toLocaleString()}</div>
                                        {payment.referenceCode && (
                                            <div className={`text-xs p-2 rounded mb-3 font-mono break-all border ${
                                                // Check for duplicates in ALL payments (verified or pending)
                                                (pendingPayments.filter(p => p.referenceCode === payment.referenceCode).length > 1
                                                    // Hypothetical: In real app, we'd check against historical verified payments too. 
                                                    // For this view, we'll check against currently loaded pending items for demo.
                                                )
                                                    ? 'bg-red-900/40 text-red-200 border-red-500 animate-pulse'
                                                    : 'bg-white/5 text-blue-200 border-transparent'
                                                }`}>
                                                {pendingPayments.filter(p => p.referenceCode === payment.referenceCode).length > 1
                                                    ? `⚠️ DUPLICATE REF: ${payment.referenceCode}`
                                                    : `REF: ${payment.referenceCode}`
                                                }
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <button
                                                onClick={() => handleVerifyPayment(payment.id, false)}
                                                className="py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold uppercase transition-colors"
                                            >
                                                Reject (Fraud)
                                            </button>
                                            <button
                                                onClick={() => handleVerifyPayment(payment.id, true)}
                                                className="py-2 rounded-lg bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white text-xs font-bold uppercase transition-colors"
                                            >
                                                Verify (Clear)
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const MetricCard: React.FC<{ label: string; value: number | string; unit?: string; trend?: string; highlight?: boolean }> = ({ label, value, unit, trend, highlight }) => (
    <div className={`p-6 rounded-xl backdrop-blur-md border transition-all ${highlight ? 'bg-[#c4a45a]/20 border-[#c4a45a] shadow-[0_0_30px_rgba(196,164,90,0.1)]' : 'bg-[#fdfae5]/5 border-[#fdfae5]/10'}`}>
        <h4 className={`text-[10px] uppercase tracking-widest mb-2 ${highlight ? 'text-[#c4a45a]' : 'text-white/50'}`}>{label}</h4>
        <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-light tracking-tighter ${trend === 'critical' ? 'text-red-500' : 'text-[#fdfae5]'}`}>{value}</span>
            <span className="text-xs opacity-50">{unit}</span>
        </div>
    </div>
);

export default EliteDashboard;
