import React, { useState, useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useCarssAuth } from '../carss/CarssContext';
import { createTransaction, PaymentMethod, Transaction } from '../carss/storage';
import { ALL_DISHES } from '../constants';
import { Dish } from '../types';

type CartItem = Dish & { qty: number };

export default function PosTerminal() {
    const { staff, logoutNow } = useCarssAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [lastTx, setLastTx] = useState<Transaction | null>(null);

    if (!staff) return <Navigate to="/staff/login" replace />;

    const addToCart = (dish: Dish) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === dish.id);
            if (existing) {
                return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...dish, qty: 1 }];
        });
    };

    const removeFromCart = (dishId: string) => {
        setCart(prev => prev.filter(i => i.id !== dishId));
    };

    const updateQty = (dishId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.id === dishId) {
                const newQty = Math.max(1, i.qty + delta);
                return { ...i, qty: newQty };
            }
            return i;
        }));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleCheckout = (method: PaymentMethod) => {
        if (cart.length === 0) return;

        const tx = createTransaction({
            created_by_staff_id: staff.id,
            department: staff.department || 'bar', // default or derived
            payment_method: method,
            line_items: cart.map(i => ({ name: i.name, qty: i.qty, unit_price: i.price })),
            notes: "POS Order"
        });

        setLastTx(tx);
        setCart([]);
        setIsCheckingOut(false);

        // Auto-hide success message after 3s
        setTimeout(() => setLastTx(null), 3000);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Left: Menu */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">CARSS POS</h1>
                        <p className="text-sm text-gray-500">
                            Operator: <span className="font-semibold text-brand-green">{staff.full_name}</span>
                            <span className="mx-2">|</span>
                            Role: {staff.role}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/dashboard/transactions" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors">
                            History
                        </Link>
                        {staff.role === 'ceo' && (
                            <Link to="/dashboard/ceo" className="px-4 py-2 bg-brand-gold text-brand-green rounded font-bold hover:bg-brand-green hover:text-white transition-colors">
                                CEO HQ
                            </Link>
                        )}
                        <button onClick={logoutNow} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {ALL_DISHES.map(dish => (
                            <button
                                key={dish.id}
                                onClick={() => addToCart(dish)}
                                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left border border-transparent hover:border-brand-gold flex flex-col h-full"
                            >
                                <div className="aspect-video w-full bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <h3 className="font-bold text-gray-800 line-clamp-1">{dish.name}</h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">{dish.category}</p>
                                <div className="mt-auto flex justify-between items-center">
                                    <span className="font-bold text-brand-green">₦{dish.price.toLocaleString()}</span>
                                    <span className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold font-bold">+</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-96 bg-white border-l shadow-xl flex flex-col z-20">
                <div className="p-6 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
                    <p className="text-sm text-gray-500">{cart.length} items</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">
                            <p>Cart is empty</p>
                            <p className="text-sm">Select items from the menu</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div className="flex-1 min-w-0 mr-4">
                                    <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                                    <p className="text-xs text-gray-500">₦{item.price.toLocaleString()} x {item.qty}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-white border flex items-center justify-center text-gray-600 hover:bg-gray-100">-</button>
                                    <span className="w-4 text-center text-sm font-bold">{item.qty === 1 && <span className="text-xs text-transparent">.</span>}{item.qty}</span>
                                    <button onClick={() => addToCart(item)} className="w-6 h-6 rounded bg-white border flex items-center justify-center text-gray-600 hover:bg-gray-100">+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg text-gray-600">Total</span>
                        <span className="text-3xl font-bold text-brand-green">₦{total.toLocaleString()}</span>
                    </div>

                    {!isCheckingOut ? (
                        <button
                            onClick={() => setIsCheckingOut(true)}
                            disabled={cart.length === 0}
                            className="w-full py-4 bg-brand-green text-white rounded-xl font-bold text-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            Checkout
                        </button>
                    ) : (
                        <div className="space-y-3 animate-fade-in-up">
                            <p className="text-center font-bold text-gray-700 mb-2">Select Payment Method</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleCheckout('POS')} className="py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">POS</button>
                                <button onClick={() => handleCheckout('CASH')} className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">CASH</button>
                                <button onClick={() => handleCheckout('TRANSFER')} className="py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">TRF</button>
                            </div>
                            <button onClick={() => setIsCheckingOut(false)} className="w-full py-2 text-gray-500 hover:text-gray-800 text-sm">Cancel</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Toast */}
            {lastTx && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-900 text-white px-8 py-6 rounded-2xl shadow-2xl z-50 animate-bounce flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
                    <p className="opacity-90">Transaction #{lastTx.id.slice(-6)}</p>
                    <p className="font-mono text-xl mt-2">₦{lastTx.total_amount.toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}
