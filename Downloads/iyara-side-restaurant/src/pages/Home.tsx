
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, Award, ChevronRight, Star, Zap, ShieldCheck, Sparkles, ArrowDown, MessageSquare, BellRing } from 'lucide-react';
import { ALL_DISHES, TESTIMONIALS } from '../constants';
import { getMenuRecommendation } from '../services/geminiService';
import { useCart } from '../context/CartContext';
import DigitalMenu from '../components/DigitalMenu';

const Home: React.FC = () => {
  const { tableNumber, setTableNumber } = useCart();
  const [preference, setPreference] = useState('');
  const [aiRec, setAiRec] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [manualTable, setManualTable] = useState('');
  const location = useLocation();

  useEffect(() => {
    setIsVisible(true);
    // Detect table number from URL: ?table=5
    const params = new URLSearchParams(location.search);
    const table = params.get('table');
    if (table) {
      setTableNumber(table);
    }
  }, [location, setTableNumber]);

  const handleAskAI = async () => {
    if (!preference) return;
    setLoading(true);
    const rec = await getMenuRecommendation(preference);
    setAiRec(rec || '');
    setLoading(false);
  };

  const handleManualTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualTable) setTableNumber(manualTable);
  };

  const handleCallWaiter = () => {
    const phone = "2347048033575";
    const message = `Hello, I'm at Table #${tableNumber || 'Unknown'} and I need assistance from a waiter. Please come over.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative font-sans selection:bg-brand-gold selection:text-brand-green overflow-x-hidden">
      {/* Refined High-Impact Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1920')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-brand-dark/70" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/40 to-brand-dark" />

        <div className={`relative z-10 text-center px-4 max-w-6xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

          {tableNumber ? (
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-brand-gold text-brand-dark px-6 py-3 rounded-full mb-8 shadow-2xl border-4 border-white/20">
                <div className="bg-brand-dark text-brand-gold rounded-full w-8 h-8 flex items-center justify-center font-black">#</div>
                <span className="text-sm font-black tracking-widest uppercase">YOU ARE AT TABLE {tableNumber}</span>
              </div>

              <h1 className="text-5xl md:text-[8rem] font-serif text-white mb-8 leading-[0.85] font-black tracking-tighter">
                READY TO <br />
                <span className="text-brand-gold italic text-shadow-xl">FEAST?</span>
              </h1>

              <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-6 px-4 md:px-0 mb-12">
                <Link
                  to="/menu"
                  className="group relative bg-brand-gold text-brand-green px-14 py-7 rounded-3xl font-black text-3xl hover:bg-white transition-all shadow-[0_20px_60px_rgba(212,175,55,0.6)] hover:-translate-y-2 active:scale-95 flex items-center justify-center border-b-8 border-brand-green/20"
                >
                  <Zap className="mr-3 fill-brand-green group-hover:animate-bounce" size={32} />
                  ORDER NOW
                </Link>
                <button
                  onClick={handleCallWaiter}
                  className="group bg-white/10 backdrop-blur-xl border-2 border-white/40 text-white px-10 py-7 rounded-3xl font-black text-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                >
                  <BellRing className="group-hover:rotate-12 transition-transform" />
                  CALL WAITER
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-5 py-2 rounded-full mb-10">
                <Award size={18} className="animate-pulse" />
                <span className="text-xs font-black tracking-[0.25em] uppercase">Voted #1 Dining Experience in Asaba</span>
              </div>

              <h1 className="text-5xl md:text-[7rem] font-serif text-white mb-8 leading-[0.9] font-black tracking-tighter">
                WORLD-CLASS <br />
                <span className="text-brand-gold italic">FLAVOR.</span> <br />
                ZERO COMPROMISE.
              </h1>

              {/* Table Entry Hook for Walk-ins without QR params */}
              <div className="max-w-md mx-auto mb-12 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                <p className="text-white text-sm font-bold mb-4 uppercase tracking-widest">Sitting at a table?</p>
                <form onSubmit={handleManualTableSubmit} className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter Table #"
                    value={manualTable}
                    onChange={(e) => setManualTable(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold transition-all"
                  />
                  <button type="submit" className="bg-brand-gold text-brand-green px-6 py-3 rounded-xl font-black text-sm hover:bg-white transition-all">CHECK IN</button>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-6 px-4 md:px-0">
                <Link
                  to="/menu"
                  className="group bg-brand-gold text-brand-green px-12 py-5 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl flex items-center justify-center"
                >
                  VIEW DIGITAL MENU
                </Link>
                <Link
                  to="/reservations"
                  className="group bg-white/10 border-2 border-white/40 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  BOOK A TABLE
                </Link>
              </div>
            </div>
          )}

          {/* Rapid Social Proof */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-10 opacity-80">
            <div className="flex flex-col items-center group cursor-default">
              <div className="flex text-brand-gold mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-brand-gold" />)}
              </div>
              <p className="text-brand-cream text-[10px] font-black uppercase tracking-[0.3em]">Over 1,000+ 5-Star Reviews</p>
            </div>
            <div className="h-10 w-px bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-brand-gold" size={40} />
              <p className="text-white text-[11px] font-black uppercase tracking-widest leading-tight text-left">Asaba's Highest<br />Health & Safety Rating</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-brand-gold/60">
          <ArrowDown size={32} />
        </div>
      </section>

      {/* Digital Menu Section */}
      <section id="digital-menu-section" className="relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-lg mb-4 animate-bounce">
            <ChevronRight className="text-brand-gold rotate-90" />
          </div>
          <h2 className="text-3xl font-serif text-white drop-shadow-md">Explore Our Menu</h2>
        </div>
        <DigitalMenu />
      </section>

      {/* AI Intelligence Section */}
      <section id="ai-section" className="py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-5 py-2 rounded-full font-black text-[10px] tracking-[0.4em] uppercase mb-10">
            <Sparkles size={16} /> Iyarà Intelligence
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-8 font-black leading-tight">What are you <br />craving today?</h2>
          <div className="flex flex-col md:flex-row gap-5 mb-10">
            <input
              type="text"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              placeholder="e.g. 'Something light but spicy for lunch...'"
              className="flex-1 px-10 py-6 rounded-[2rem] bg-white/5 border border-white/10 focus:border-brand-gold outline-none text-white transition-all text-xl"
            />
            <button
              onClick={handleAskAI}
              disabled={loading}
              className="bg-brand-gold text-brand-green px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-white transition-all"
            >
              {loading ? 'Thinking...' : 'ADVISE ME'}
            </button>
          </div>

          {aiRec && (
            <div className="p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] text-left animate-fade-in relative group overflow-hidden">
              <p className="text-brand-gold font-black text-[10px] uppercase tracking-[0.5em] mb-6">Concierge Recommendation</p>
              <p className="text-white text-2xl leading-relaxed italic font-serif">"{aiRec}"</p>
              <Link to="/menu" className="inline-flex items-center gap-2 mt-8 text-brand-gold font-bold hover:underline">Go find this on the menu <ChevronRight size={18} /></Link>
            </div>
          )}
        </div>
      </section>

      {/* Global Final Action */}
      <section className="relative py-40 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1600')",
            filter: "brightness(0.3)"
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 font-black leading-none uppercase">Pure <span className="text-brand-gold">Heritage.</span></h2>
          <p className="text-2xl text-brand-cream/90 mb-14 font-medium tracking-tight">Asaba's true culinary landmark. Join us.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/menu" className="bg-brand-gold text-brand-green px-14 py-6 rounded-[1.5rem] font-black text-2xl hover:bg-white transition-all">
              ORDER NOW
            </Link>
            <Link to="/contact" className="backdrop-blur-xl border-2 border-white/40 text-white px-14 py-6 rounded-[1.5rem] font-black text-2xl hover:bg-white hover:text-brand-green transition-all">
              NEED HELP?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
