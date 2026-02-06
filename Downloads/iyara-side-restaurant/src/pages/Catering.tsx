
import React, { useState } from 'react';
import { ChefHat, Music, PartyPopper, Briefcase, Heart, CheckCircle, Send, Plus } from '@/components/EmergencyLucideWrapper';

const Catering: React.FC = () => {
  const [formState, setFormState] = useState('idle');

  const services = [
    { 
      title: "Wedding Catering", 
      icon: <Heart size={32} />, 
      desc: "From traditional ceremonies to contemporary receptions, we provide a full-service culinary experience.",
      price: "From ₦5,000 / guest",
      img: "https://picsum.photos/seed/cat-wedding/600/400"
    },
    { 
      title: "Corporate Events", 
      icon: <Briefcase size={32} />, 
      desc: "Impress clients and treat your team with executive lunch boxes or professional conference buffets.",
      price: "From ₦3,500 / guest",
      img: "https://picsum.photos/seed/cat-corp/600/400"
    },
    { 
      title: "Private Parties", 
      icon: <PartyPopper size={32} />, 
      desc: "Celebrate birthdays, anniversaries, or house warmings with our curated party menus and staff.",
      price: "From ₦4,000 / guest",
      img: "https://picsum.photos/seed/cat-party/600/400"
    },
    { 
      title: "Small Chops & Snacks", 
      icon: <ChefHat size={32} />, 
      desc: "Light bites, authentic finger foods, and cocktail snacks for launches and casual gatherings.",
      price: "From ₦2,500 / guest",
      img: "https://picsum.photos/seed/cat-snack/600/400"
    },
  ];

  const packages = [
    {
      name: "Bronze Package",
      price: "₦4,500 / Person",
      features: ["Traditional Jollof/Fried Rice", "2 Protein Choices", "Coleslaw & Plantain", "Soft Drinks & Water", "Basic Buffet Setup"],
      tag: "Great Value"
    },
    {
      name: "Silver Package",
      price: "₦6,500 / Person",
      features: ["All Bronze Items", "Diced Chicken/Assorted Meat", "Moimoi & Salad", "Small Chops Selection", "Professional Servers", "Premium Buffet Decor"],
      tag: "Most Popular"
    },
    {
      name: "Gold Package",
      price: "₦10,000 / Person",
      features: ["All Silver Items", "Fresh Catfish/Snails", "Pounded Yam & Choice of Soup", "Intercontinental Side (Pasta/Salad)", "Dessert Table", "Executive Bartending Service"],
      tag: "Premium Experience"
    }
  ];

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/seed/cat-hero/1920/1080')", filter: "brightness(0.3)" }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Premium Catering</h1>
          <p className="text-xl text-brand-gold italic">Bringing the Iyarà Side experience to your special events</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-serif text-brand-green mb-6">Excellence Outside Our Walls</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-16">
          Whether you're hosting 50 or 500, our team brings the same passion for flavor and dedication to quality service to your chosen venue. We handle everything from menu design to cleanup.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition-all">
              <img src={s.img} alt={s.title} className="w-full h-48 object-cover" />
              <div className="p-8">
                <div className="text-brand-gold mb-4 inline-block">{s.icon}</div>
                <h3 className="text-2xl font-serif text-brand-green mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{s.desc}</p>
                <p className="text-brand-gold font-bold">{s.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-brand-green text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">Sample Packages</h2>
            <p className="text-brand-gold font-light tracking-widest uppercase">Customizable to your needs</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((p, i) => (
              <div key={i} className={`relative bg-white/5 border border-white/10 p-10 rounded-3xl ${i === 1 ? 'lg:scale-110 border-brand-gold bg-white/10 z-10' : ''}`}>
                {i === 1 && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-green font-bold text-xs py-1 px-4 rounded-full uppercase">{p.tag}</span>}
                <h3 className="text-2xl font-serif mb-2">{p.name}</h3>
                <p className="text-brand-gold font-bold text-2xl mb-8">{p.price}</p>
                <ul className="space-y-4 mb-10">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                      <CheckCircle size={18} className="text-brand-gold shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 rounded-xl font-bold border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition-all"
                >
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry-form" className="py-24 max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
          {formState === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-serif text-brand-green mb-4">Inquiry Submitted!</h2>
              <p className="text-gray-600 mb-8">We've received your request and will provide a personalized quote within 24 hours.</p>
              <button onClick={() => setFormState('idle')} className="text-brand-gold font-bold hover:underline">Send Another Request</button>
            </div>
          ) : (
            <form onSubmit={handleInquiry} className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-serif text-brand-green mb-2">Catering Inquiry</h2>
                <p className="text-gray-500">Tell us about your event and we'll handle the rest.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                  <input required type="text" className="w-full bg-brand-cream px-4 py-3 rounded-xl outline-none border border-transparent focus:border-brand-gold transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Event Type</label>
                  <select className="w-full bg-brand-cream px-4 py-3 rounded-xl outline-none border border-transparent focus:border-brand-gold transition-all">
                    <option>Wedding</option>
                    <option>Corporate Dinner</option>
                    <option>Birthday Party</option>
                    <option>Product Launch</option>
                    <option>Private Home Party</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Event Date</label>
                  <input required type="date" className="w-full bg-brand-cream px-4 py-3 rounded-xl outline-none border border-transparent focus:border-brand-gold transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Estimated Guests</label>
                  <input required type="number" placeholder="50+" className="w-full bg-brand-cream px-4 py-3 rounded-xl outline-none border border-transparent focus:border-brand-gold transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Special Requests / Menu Preferences</label>
                <textarea rows={4} className="w-full bg-brand-cream px-4 py-3 rounded-xl outline-none border border-transparent focus:border-brand-gold transition-all resize-none"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={formState === 'loading'}
                className="w-full bg-brand-green text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                {formState === 'loading' ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div> : <>Submit Inquiry <Send size={20}/></>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catering;
