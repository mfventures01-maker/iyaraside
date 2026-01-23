import React, { useState } from 'react';
import { Utensils, ShoppingBag, Plus, Minus, Info, Flame, Leaf, ShoppingCart } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { useStore } from '../store/useStore';

const Restaurant: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { addToCart, cart, updateCartQuantity, removeFromCart, setCartOpen } = useStore();

  const categories = ['All', 'Soups', 'Rice & Swallow', 'Proteins', 'Drinks'];
  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const getItemQuantity = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  const handleCardClick = (item: any) => {
    if (getItemQuantity(item.id) === 0) {
      addToCart(item);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <img 
          src="https://picsum.photos/seed/restaurant-bg/1200/400" 
          alt="Restaurant Ambiance" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Fobbs Kitchen</h1>
          <p className="text-emerald-300 font-medium">Authentic Flavors, Delivered to Your Room</p>
        </div>
      </section>

      {/* Category Slider */}
      <div className="sticky top-16 z-30 bg-white shadow-sm overflow-x-auto no-scrollbar border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex space-x-2 py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-emerald-900 text-white' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleCardClick(item)}
              className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group transition-all duration-300 ${
                getItemQuantity(item.id) === 0 ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''
              }`}
            >
              <div className="relative h-48">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {item.isSpicy && (
                    <div className="bg-red-500 text-white p-1.5 rounded-xl shadow-lg">
                      <Flame className="w-4 h-4" />
                    </div>
                  )}
                  {item.isVegetarian && (
                    <div className="bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg">
                      <Leaf className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-emerald-900 shadow-sm">
                  ₦{item.price.toLocaleString()}
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</span>
                  
                  {getItemQuantity(item.id) > 0 ? (
                    <div 
                      className="flex items-center space-x-4 bg-emerald-50 rounded-full px-2 py-1.5 border border-emerald-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 text-emerald-600 hover:bg-white rounded-full transition-all shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold text-emerald-900 min-w-[1.5rem] text-center">{getItemQuantity(item.id)}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 text-emerald-600 hover:bg-white rounded-full transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(item)}
                      className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-900 text-white rounded-full text-xs font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
          <button 
            onClick={() => setCartOpen(true)}
            className="flex items-center justify-between w-full p-4 bg-emerald-900 text-white rounded-[2rem] shadow-2xl shadow-emerald-900/40 border border-emerald-800"
          >
            <div className="flex items-center space-x-4">
              <div className="relative p-2 bg-white/10 rounded-xl">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-900">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Your Order</p>
                <p className="text-sm font-bold">₦{cart.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white text-emerald-900 px-6 py-2 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-transform">
              Review Cart
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Restaurant;