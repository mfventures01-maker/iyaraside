
import React, { useState, useEffect } from 'react';
import DishCard from '../../components/DishCard';
import HeroCarousel from '../../components/HeroCarousel';
import { WHATSAPP_CONFIG, TELEGRAM_CONFIG } from '../../constants';
import { mockDb } from '../../services/mockDatabase';
import { Table, Dish, OrderItem, Department } from '../../types';
import { INITIAL_MENU } from '../../constants'; // Assuming this exists or simulated
import { Dish as OldDishType } from '../../types'; // Conflict check

// Adapter to ensure types match if needed
const MENU_ITEMS = INITIAL_MENU.map(item => ({
    ...item,
    department: (item.category === 'drink' || item.category === 'cocktail') ? 'Bar' : 'Kitchen' as Department
}));

interface TableLandingProps {
    tableId: string;
    onPlaceOrder: (items: OrderItem[]) => void;
}

const TableLanding: React.FC<TableLandingProps> = ({ tableId, onPlaceOrder }) => {
    const [table, setTable] = useState<Table | null>(null);
    const [activeCategory, setActiveCategory] = useState<'All' | 'Bar' | 'Kitchen' | 'Hookah'>('All');
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    useEffect(() => {
        const loadTable = async () => {
            const t = await mockDb.getTable(tableId);
            setTable(t || null);
            setLoading(false);
        };
        loadTable();
    }, [tableId]);

    // Persistence for "Rushed Guest" scenarios
    useEffect(() => {
        setIsCartLoaded(false); // Reset on table change
        try {
            const saved = localStorage.getItem(`defacto_cart_${tableId}`);
            if (saved) {
                setCart(JSON.parse(saved));
            } else {
                setCart([]);
            }
        } catch (e) {
            console.error("Failed to load cart persistence", e);
        } finally {
            setIsCartLoaded(true);
        }
    }, [tableId]);

    useEffect(() => {
        if (isCartLoaded) {
            localStorage.setItem(`defacto_cart_${tableId}`, JSON.stringify(cart));
        }
    }, [cart, tableId, isCartLoaded]);

    const addToCart = (dish: any) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === dish.id);
            if (existing) {
                return prev.map(i => i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, {
                id: dish.id,
                name: dish.name,
                price: dish.price,
                quantity: 1,
                department: dish.department,
                status: 'pending'
            }];
        });
    };

    const removeFromCart = (dishId: string) => {
        setCart(prev => prev.filter(i => i.id !== dishId));
    };

    const updateQty = (dishId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.id === dishId) return { ...i, quantity: Math.max(0, i.quantity + delta) };
            return i;
        }).filter(i => i.quantity > 0));
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        onPlaceOrder(cart);
        setCart([]); // Optimistic clear, parent handles actual creation
        setIsCartOpen(false);
    };

    const handleWhatsAppOrder = async () => {
        if (cart.length === 0) return;

        // Create order first to get orderId
        const order = await mockDb.createOrder(tableId, cart, 'qr_guest');

        // Create payment intent with verification code
        const { paymentIntentStore } = await import('../../services/paymentIntentService');
        const { auditStore, getCurrentActorRole } = await import('../../services/auditService');

        const paymentIntent = paymentIntentStore.createIntent(order.id, tableId, cartTotal);

        // Log payment intent creation
        auditStore.addEvent({
            event_type: 'payment_intent_created',
            actor_role: getCurrentActorRole(),
            ref: {
                orderId: order.id,
                tableId: tableId,
                paymentIntentId: paymentIntent.paymentIntentId
            },
            metadata: {
                totalAmount: cartTotal,
                paymentStatus: 'pending',
                channel: 'whatsapp',
                verificationCode: paymentIntent.verificationCode
            }
        });

        // Log channel selection
        auditStore.addEvent({
            event_type: 'channel_selected',
            actor_role: getCurrentActorRole(),
            ref: {
                orderId: order.id,
                tableId: tableId,
                paymentIntentId: paymentIntent.paymentIntentId
            },
            metadata: {
                channel: 'whatsapp'
            }
        });

        // Format order message with verification code
        const orderText = cart.map(item =>
            `${item.quantity}x ${item.name} - ₦${(item.price * item.quantity).toLocaleString()}`
        ).join('%0A');

        const message = `🍽️ *New Order from ${table?.name || tableId}*%0A%0A` +
            `${orderText}%0A%0A` +
            `*Total: ₦${cartTotal.toLocaleString()}*%0A%0A` +
            `Order ID: ${order.id}%0A` +
            `Verify Code: ${paymentIntent.verificationCode}%0A%0A` +
            `⚠️ Payment verification required by staff`;

        window.open(`https://wa.me/${WHATSAPP_CONFIG.targetNumber}?text=${message}`, '_blank');

        // Log message opened
        auditStore.addEvent({
            event_type: 'message_opened',
            actor_role: getCurrentActorRole(),
            ref: {
                orderId: order.id,
                tableId: tableId,
                paymentIntentId: paymentIntent.paymentIntentId
            },
            metadata: {
                channel: 'whatsapp'
            }
        });

        // Clear cart and close
        setCart([]);
        setIsCartOpen(false);
    };

    const handleTelegramOrder = async () => {
        if (cart.length === 0) return;

        // Create order first to get orderId
        const order = await mockDb.createOrder(tableId, cart, 'qr_guest');

        // Create payment intent with verification code
        const { paymentIntentStore } = await import('../../services/paymentIntentService');
        const { auditStore, getCurrentActorRole } = await import('../../services/auditService');

        const paymentIntent = paymentIntentStore.createIntent(order.id, tableId, cartTotal);

        // Log payment intent creation
        auditStore.addEvent({
            event_type: 'payment_intent_created',
            actor_role: getCurrentActorRole(),
            ref: {
                orderId: order.id,
                tableId: tableId,
                paymentIntentId: paymentIntent.paymentIntentId
            },
            metadata: {
                totalAmount: cartTotal,
                paymentStatus: 'pending',
                channel: 'telegram',
                verificationCode: paymentIntent.verificationCode
            }
        });

        // Log channel selection
        auditStore.addEvent({
            event_type: 'channel_selected',
            actor_role: getCurrentActorRole(),
            ref: {
                orderId: order.id,
                tableId: tableId,
                paymentIntentId: paymentIntent.paymentIntentId
            },
            metadata: {
                channel: 'telegram'
            }
        });

        // Format order message for Telegram with verification code
        const orderText = cart.map(item =>
            `${item.quantity}x ${item.name} - ₦${(item.price * item.quantity).toLocaleString()}`
        ).join('%0A');

        const message = `🍽️ New Order from ${table?.name || tableId}%0A%0A` +
            `${orderText}%0A%0A` +
            `Total: ₦${cartTotal.toLocaleString()}%0A%0A` +
            `Order ID: ${order.id}%0A` +
            `Verify Code: ${paymentIntent.verificationCode}%0A%0A` +
            `⚠️ Payment verification required by staff`;

        // Telegram bot/channel - uses config
        window.open(`https://t.me/${TELEGRAM_CONFIG.botUsername}?text=${message}`, '_blank');

        // Log message opened
        auditStore.addEvent({
            event_type: 'message_opened',
            actor_role: getCurrentActorRole(),
            ref: {
                orderId: order.id,
                tableId: tableId,
                paymentIntentId: paymentIntent.paymentIntentId
            },
            metadata: {
                channel: 'telegram'
            }
        });

        // Clear cart and close
        setCart([]);
        setIsCartOpen(false);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const filteredMenu = activeCategory === 'All'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(item => {
            // @ts-ignore
            if (activeCategory === 'Hookah') return (item as any).category === 'hookah';
            if (activeCategory === 'Bar') return item.department === 'Bar';
            if (activeCategory === 'Kitchen') return item.department === 'Kitchen';
            return true;
        });

    const handleBookTable = () => {
        window.open(`https://wa.me/${WHATSAPP_CONFIG.targetNumber}?text=I%20would%20like%20to%20book%20a%20VIP%20table`, '_blank');
    };

    if (loading) return <div className="min-h-screen bg-[#051f11] flex items-center justify-center text-[#c4a45a] animate-pulse">CONNECTING...</div>;
    if (!table) return <div className="min-h-screen bg-[#fdfae5] flex items-center justify-center text-[#0a3d21]">TABLE NOT FOUND OR OFFLINE</div>;

    return (
        <div className="min-h-screen bg-[#fdfae5] pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#0a3d21] text-[#fdfae5] px-6 py-4 shadow-xl flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-black tracking-tight">{table.name}</h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#c4a45a]">{table.zone} ZONE</span>
                </div>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c4a45a] text-[#051f11] text-xs font-bold">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <HeroCarousel
                onCategorySelect={(cat) => setActiveCategory(cat)}
                onBookTable={handleBookTable}
            />

            {/* Categories */}
            <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar sticky top-[72px] bg-[#fdfae5] z-20 pb-4 border-b border-[#0a3d21]/10">
                {['All', 'Bar', 'Kitchen'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat
                            ? 'bg-[#0a3d21] text-[#fdfae5] shadow-lg scale-105'
                            : 'bg-white border boundary-[#0a3d21]/10 text-[#0a3d21] opacity-60'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map(item => (
                    <DishCard key={item.id} dish={item} onAddToCart={() => addToCart(item)} />
                ))}
            </div>

            {/* Floating Cart Button (Mobile) */}
            {cartCount > 0 && !isCartOpen && (
                <div className="fixed bottom-6 left-6 right-6 z-40">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-[#0a3d21] text-[#fdfae5] py-4 rounded-2xl shadow-2xl flex justify-between items-center px-6 font-black uppercase tracking-widest"
                    >
                        <span>{cartCount} Items</span>
                        <span>View Order</span>
                        <span>₦{cartTotal.toLocaleString()}</span>
                    </button>
                </div>
            )}

            {/* Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
                    <div className="w-full max-w-md bg-[#fdfae5] h-full flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 bg-[#0a3d21] text-[#fdfae5] flex justify-between items-center">
                            <h2 className="font-black text-xl italic">Review Order</h2>
                            <button onClick={() => setIsCartOpen(false)} className="text-[#c4a45a] text-sm font-bold uppercase tracking-widest">Close</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="text-center opacity-50 mt-12 font-bold uppercase tracking-widest">Cart is empty</div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-start border-b border-[#0a3d21]/10 pb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${item.department === 'Bar' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                                                    {item.department}
                                                </span>
                                                <h4 className="font-bold text-[#0a3d21]">{item.name}</h4>
                                            </div>
                                            <p className="text-[#c4a45a] font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white border border-[#0a3d21]/10 rounded-lg p-1">
                                            <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-bold text-[#0a3d21] hover:bg-black/5 rounded">-</button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-bold text-[#0a3d21] hover:bg-black/5 rounded">+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t border-[#0a3d21]/10 bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-bold uppercase text-[#0a3d21]/60">Total</span>
                                <span className="text-2xl font-black text-[#0a3d21]">₦{cartTotal.toLocaleString()}</span>
                            </div>

                            {/* Primary: In-App Order */}
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="w-full py-5 bg-[#c4a45a] text-[#0a3d21] rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50 mb-3"
                            >
                                Confirm Order
                            </button>

                            {/* Alternative: Messaging Apps */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleWhatsAppOrder}
                                    disabled={cart.length === 0}
                                    className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <span>📱</span>
                                    <span>WhatsApp</span>
                                </button>
                                <button
                                    onClick={handleTelegramOrder}
                                    disabled={cart.length === 0}
                                    className="flex-1 py-3 bg-[#0088cc] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <span>✈️</span>
                                    <span>Telegram</span>
                                </button>
                            </div>

                            <p className="text-xs text-[#0a3d21]/60 text-center mt-3 italic">
                                WhatsApp/Telegram orders require staff confirmation and payment verification.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableLanding;
