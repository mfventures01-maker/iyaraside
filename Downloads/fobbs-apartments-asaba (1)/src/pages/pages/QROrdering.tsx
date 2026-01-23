import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, MapPin, Search, Plus, Minus, Info, X, Edit2, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { useStore } from '../store/useStore';

const QROrdering: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQuantity, setCartOpen, orderLocation, setOrderLocation } = useStore();
  const [activeTab, setActiveTab] = useState('Rice & Swallow');
  const [showTablePrompt, setShowTablePrompt] = useState(false);
  const [tableInput, setTableInput] = useState('');

  // Check for table/room in URL on mount
  useEffect(() => {
    const table = searchParams.get('table');
    const room = searchParams.get('room');
    
    if (table) {
      setOrderLocation(`Table ${table}`);
      setShowTablePrompt(false);
    } else if (room) {
      setOrderLocation(`Room ${room}`);
      setShowTablePrompt(false);
    } else {
      // If no param and location is default, prompt user
      if (orderLocation === 'Main Restaurant') {
        setShowTablePrompt(true);
      }
    }
  }, [searchParams, setOrderLocation, orderLocation]);

  const handleTableSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tableInput.trim()) {
      const location = isNaN(Number(tableInput)) ? tableInput : `Table ${tableInput}`;
      setOrderLocation(location);
      setShowTablePrompt(false);
      setTableInput('');
    }
  };

  const categories = ['Breakfast', 'Soups', 'Rice & Swallow', 'Proteins', 'Drinks'];
  const filteredItems = MENU_ITEMS.filter(item => item.category === activeTab);
  
  const getItemQuantity = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Mobile-First Header */}
      <div className="bg-emerald-900 pt-16 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex items-center justify-between text-white">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-emerald-400" />
              Fobbs Kitchen
            </h1>
            <button 
              onClick={() => setShowTablePrompt(true)}
              className="flex items-center space-x-2 text-emerald-400 group hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                {orderLocation}
              </span>
              <Edit2 className="w-3 h-3 ml-1 opacity-50" />
            </button>
          </div>
          <button className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
            <Search className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Table Number Prompt Modal/Input */}
      {showTablePrompt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-all" 
            onClick={() => setShowTablePrompt(false)}
          />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-sm animate-slide-up border border-gray-100">
            <button 
              onClick={() => setShowTablePrompt(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-emerald-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif">Identify Your Spot</h2>
              <p className="text-sm text-gray-500 mt-2">Enter your Table or Room number so we can serve you better.</p>
            </div>
            <form onSubmit={handleTableSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Table 5 or Room 201"
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-3xl focus:border-emerald-500 focus:bg-white focus:ring-0 font-bold text-xl text-center placeholder:font-medium placeholder:text-gray-300 transition-all shadow-inner"
                  value={tableInput}
                  onChange={(e) => setTableInput(e.target.value)}
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                disabled={!tableInput.trim()}
                className="w-full py-5 bg-emerald-900 text-white rounded-[1.5rem] font-bold text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Service Location</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Categories (Sticky) */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-xl p-2 flex overflow-x-auto no-scrollbar space-x-2 border border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-6 py-3.5 rounded-2xl text-xs font-bold transition-all uppercase tracking-widest ${
                activeTab === cat 
                  ? 'bg-emerald-900 text-white shadow-lg ring-4 ring-emerald-900/10' 
                  : 'text-gray-400 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{activeTab} Specials</h3>
          <div className="h-px bg-gray-200 flex-grow ml-4 opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex items-center space-x-4 animate-fade-in group hover:shadow-md transition-shadow">
              <div className="relative shrink-0">
                <img src={item.image} className="w-24 h-24 rounded-2xl object-cover" alt={item.name} />
                {item.isSpicy && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-lg shadow-lg">
                    <Info className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className="font-bold text-gray-900 leading-tight truncate">{item.name}</h4>
                  <span className="font-bold text-emerald-700 whitespace-nowrap">₦{item.price.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Available Now</span>
                  </div>
                  
                  {getItemQuantity(item.id) > 0 ? (
                    <div className="flex items-center space-x-4 bg-emerald-50 rounded-2xl px-2 py-1.5 border border-emerald-100">
                      <button 
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1.5 text-emerald-600 hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold text-emerald-900 min-w-[1.2rem] text-center">{getItemQuantity(item.id)}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1.5 text-emerald-600 hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(item)}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-900 text-white rounded-[1rem] text-xs font-bold active:scale-95 transition-all shadow-lg shadow-emerald-900/10 hover:bg-emerald-800"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Order Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-[70] animate-bounce-in">
          <button 
            onClick={() => setCartOpen(true)}
            className="w-full bg-emerald-900 text-white rounded-3xl p-5 shadow-2xl shadow-emerald-900/40 flex items-center justify-between border border-emerald-800"
          >
            <div className="flex items-center space-x-4">
              <div className="relative p-2.5 bg-white/10 rounded-2xl">
                <ShoppingBag className="w-7 h-7" />
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full ring-4 ring-emerald-900">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.2em] mb-0.5">Kitchen Order</p>
                <p className="text-lg font-bold">₦{cart.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white text-emerald-900 px-5 py-2.5 rounded-2xl shadow-lg active:scale-95 transition-transform">
              <span className="text-sm font-bold">Review Order</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default QROrdering;