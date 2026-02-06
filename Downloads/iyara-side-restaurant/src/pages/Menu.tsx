
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Plus, Minus, X, Trash2, MessageSquare, Flame, Leaf, ChevronRight, Check } from '@/components/EmergencyLucideWrapper';
import { ALL_DISHES } from '../constants';
import { Dish } from '../types';
import { useCart } from '../context/CartContext';

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const handleQtyInput = (id: string, value: string) => {
    const num = parseInt(value);
    setQuantities(prev => ({
      ...prev,
      [id]: isNaN(num) ? 1 : Math.max(1, num)
    }));
  };

  const handleAddToCart = (dish: Dish) => {
    const qty = quantities[dish.id] || 1;
    addToCart(dish, qty);
    
    // Visual feedback
    setAddingId(dish.id);
    setTimeout(() => setAddingId(null), 1500);
    
    // Optional: Reset local quantity to 1 after adding
    setQuantities(prev => ({ ...prev, [dish.id]: 1 }));
  };

  const handleCheckout = () => {
    const phone = "2347048033575";
    const tableHeader = tableNumber ? `*TABLE NUMBER: ${tableNumber}*%0A%0A` : '';
    const itemsText = cart.map(item => `- ${item.quantity}x ${item.name} (₦${(item.price * item.quantity).toLocaleString()})`).join('%0A');
    const totalText = `Total: ₦${totalPrice.toLocaleString()}`;
    const message = `${tableHeader}Hello Iyarà Side Restaurant, I'd like to place an order:%0A%0A${itemsText}%0A%0A${totalText}%0A%0APlease confirm my order.`;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleBuyNow = (dish: Dish) => {
    const qty = quantities[dish.id] || 1;
    addToCart(dish, qty);
    setIsCartOpen(true);
    // Reset local quantity
    setQuantities(prev => ({ ...prev, [dish.id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24 relative overflow-x-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          {tableNumber && (
            <div className="inline-block bg-brand-gold text-brand-green px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 animate-bounce">
              Ordering for Table {tableNumber}
            </div>
          )}
          <p className="text-brand-gold font-bold tracking-[0.3em] uppercase mb-4">Contemporary Delights</p>
          <h1 className="text-4xl md:text-6xl font-serif text-brand-green mb-6">Our Menu</h1>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex overflow-x-auto bg-brand-cream p-1 rounded-xl w-full lg:w-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeCategory === cat ? 'bg-brand-green text-white shadow-md' : 'text-brand-green/60 hover:text-brand-green'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for your favorite dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-cream pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
            />
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center text-brand-green font-bold text-sm bg-brand-gold px-6 py-3 rounded-xl hover:bg-brand-dark hover:text-white transition-all w-full lg:w-auto justify-center"
          >
            <ShoppingBag size={18} className="mr-2" /> View Cart ({totalItems})
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <div key={dish.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-brand-green/5">
                <div className="h-64 overflow-hidden relative">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {dish.tags?.map((tag, idx) => (
                    <span key={idx} className="absolute top-4 left-4 bg-brand-gold text-brand-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {tag}
                    </span>
                  ))}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {dish.isSpicy && <div className="bg-red-500 text-white p-2 rounded-full shadow-lg" title="Spicy"><Flame size={14} /></div>}
                    {dish.isVegetarian && <div className="bg-green-500 text-white p-2 rounded-full shadow-lg" title="Vegetarian"><Leaf size={14} /></div>}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif text-brand-green leading-tight">{dish.name}</h3>
                    <p className="text-brand-gold font-bold text-xl whitespace-nowrap ml-4">₦{dish.price.toLocaleString()}</p>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{dish.description}</p>
                  
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center bg-brand-cream rounded-lg p-1">
                      <button onClick={() => handleQtyChange(dish.id, -1)} className="p-2 hover:text-brand-gold transition-colors"><Minus size={16}/></button>
                      <input 
                        type="number"
                        min="1"
                        value={quantities[dish.id] || 1}
                        onChange={(e) => handleQtyInput(dish.id, e.target.value)}
                        className="w-12 text-center bg-transparent font-bold text-brand-green outline-none"
                      />
                      <button onClick={() => handleQtyChange(dish.id, 1)} className="p-2 hover:text-brand-gold transition-colors"><Plus size={16}/></button>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(dish)}
                      disabled={addingId === dish.id}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        addingId === dish.id ? 'bg-green-500 text-white' : 'bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white'
                      }`}
                    >
                      {addingId === dish.id ? <><Check size={18} /> Added</> : 'Add to Cart'}
                    </button>
                  </div>
                  <button 
                    onClick={() => handleBuyNow(dish)}
                    className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                  >
                    Quick Order <ChevronRight size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">No dishes found matching your search.</div>
        )}
      </div>

      {/* Shopping Cart Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b flex justify-between items-center bg-brand-green text-white">
              <h2 className="text-2xl font-serif">Your Order {tableNumber && `(Table ${tableNumber})`}</h2>
              <button onClick={() => setIsCartOpen(false)}><X size={28} /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-6">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-brand-green">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                      <p className="text-brand-gold font-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center bg-brand-cream rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus size={14}/></button>
                          <span className="px-3 font-bold text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-brand-cream border-t space-y-4">
                <div className="flex justify-between items-center text-brand-green font-bold text-xl">
                  <span>Total</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3"
                >
                  <MessageSquare size={24} /> Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
