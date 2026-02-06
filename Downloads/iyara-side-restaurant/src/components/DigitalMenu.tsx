
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Plus, Minus, X, Trash2, MessageSquare, Flame, Leaf, ChevronRight, Check } from '@/components/EmergencyLucideWrapper';
import { ALL_DISHES } from '../constants';
import { Dish } from '../types';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [addingId, setAddingId] = useState<string | null>(null);

    const { cart, addToCart, removeFromCart, updateQuantity, totalPrice, totalItems, tableNumber } = useCart();

    const categories = ['All', ...Array.from(new Set(ALL_DISHES.map(d => d.category)))];

    useEffect(() => {
        let combined = [...ALL_DISHES];
        if (activeCategory !== 'All') {
            combined = combined.filter(d => d.category === activeCategory);
        }
        if (searchTerm) {
            combined = combined.filter(d =>
                d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredDishes(combined);
    }, [activeCategory, searchTerm]);

    const handleQtyChange = (id: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    };

    const handleAddToCart = (dish: Dish) => {
        const qty = quantities[dish.id] || 1;
        addToCart(dish, qty);
        setAddingId(dish.id);
        setTimeout(() => setAddingId(null), 1500);
        setQuantities(prev => ({ ...prev, [dish.id]: 1 }));
    };

    const handleBuyNow = (dish: Dish) => {
        const qty = quantities[dish.id] || 1;
        addToCart(dish, qty);
        setIsCartOpen(true);
        setQuantities(prev => ({ ...prev, [dish.id]: 1 }));
    };

    return (
        <div id="digital-menu" className="py-12 bg-gray-50 w-full relative">
            {/* Checkout Modal */}
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

            {/* Header Controls */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-6 items-center justify-between sticky top-24 z-40">
                    {/* Categories */}
                    <div className="flex overflow-x-auto bg-gray-50 p-2 rounded-xl w-full lg:w-auto hide-scrollbar gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-brand-green text-white shadow-lg' : 'text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-brand-gold transition-all"
                        />
                    </div>

                    {/* Cart Toggle */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="flex items-center text-white font-bold text-sm bg-brand-green px-8 py-4 rounded-xl hover:bg-brand-gold hover:text-brand-green transition-all w-full lg:w-auto justify-center shadow-lg"
                    >
                        <ShoppingBag size={20} className="mr-3" />
                        <span>Cart ({totalItems})</span>
                        {totalItems > 0 && <span className="ml-2 bg-white text-brand-green px-2 py-0.5 rounded-full text-xs">₦{totalPrice.toLocaleString()}</span>}
                    </button>
                </div>
            </div>

            {/* Dishes Grid */}
            <div className="max-w-7xl mx-auto px-4">
                {filteredDishes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDishes.map((dish) => (
                            <div key={dish.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 hover:-translate-y-2">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    {dish.tags?.map((tag, idx) => (
                                        <span key={idx} className="absolute top-4 left-4 bg-brand-gold text-brand-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-serif text-brand-green leading-tight font-bold">{dish.name}</h3>
                                        <p className="text-brand-gold font-black text-lg whitespace-nowrap ml-2">₦{dish.price.toLocaleString()}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">{dish.description}</p>

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                            <button onClick={() => handleQtyChange(dish.id, -1)} className="p-3 hover:text-brand-gold"><Minus size={16} /></button>
                                            <span className="w-8 text-center font-bold text-brand-green">{quantities[dish.id] || 1}</span>
                                            <button onClick={() => handleQtyChange(dish.id, 1)} className="p-3 hover:text-brand-gold"><Plus size={16} /></button>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(dish)}
                                            className={`flex-1 py-4 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${addingId === dish.id ? 'bg-green-500 text-white' : 'bg-brand-green text-white hover:bg-brand-gold hover:text-brand-green'
                                                }`}
                                        >
                                            {addingId === dish.id ? <Check size={18} /> : 'ADD'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 font-serif text-xl">Sorry, no items match your taste.</div>
                )}
            </div>

            {/* Cart Drawer */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b flex justify-between items-center bg-brand-green text-white">
                            <div>
                                <h2 className="text-2xl font-serif">Order Summary</h2>
                                {tableNumber && <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mt-1">Table {tableNumber}</p>}
                            </div>
                            <button onClick={() => setIsCartOpen(false)}><X size={28} /></button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                                    <p>Your cart is empty.</p>
                                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-brand-gold font-bold underline">Start Ordering</button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-brand-green w-3/4">{item.name}</h4>
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                            <p className="text-brand-gold font-bold text-sm mt-1">₦{(item.price * item.quantity).toLocaleString()}</p>

                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 rounded"><Minus size={12} /></button>
                                                    <span className="px-3 font-bold text-xs">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 rounded"><Plus size={12} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 bg-brand-cream border-t border-brand-gold/10 space-y-4">
                                <div className="flex justify-between items-center text-brand-green font-bold text-xl mb-4">
                                    <span>Total Due</span>
                                    <span>₦{totalPrice.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        setIsCheckoutOpen(true);
                                    }}
                                    className="w-full bg-brand-green text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-xl shadow-brand-green/20"
                                >
                                    PROCEED TO CHECKOUT <ChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DigitalMenu;
