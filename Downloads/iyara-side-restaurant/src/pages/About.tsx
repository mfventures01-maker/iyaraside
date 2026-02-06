
import React from 'react';
import { Award, ShieldCheck, Heart, Users, Utensils, Globe, ChevronRight } from '@/components/EmergencyLucideWrapper';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const values = [
    { icon: <Award size={32} />, title: "Quality", desc: "Using only the finest locally-sourced and imported ingredients." },
    { icon: <ShieldCheck size={32} />, title: "Authenticity", desc: "Honoring traditional recipes while embracing modern culinary innovation." },
    { icon: <Heart size={32} />, title: "Hospitality", desc: "Warm, exceptional service that makes every guest feel like royalty." },
    { icon: <Users size={32} />, title: "Community", desc: "Supporting local Asaba farmers and contributing to regional growth." },
    { icon: <Utensils size={32} />, title: "Excellence", desc: "A commitment to perfection in every plate we serve." },
    { icon: <Globe size={32} />, title: "Sustainability", desc: "Responsible sourcing and eco-friendly kitchen practices." },
  ];

  const team = [
    { name: "Chef Emeka Obi", role: "Executive Chef", bio: "With 15 years of experience in Michelin-starred kitchens across Europe and West Africa, Chef Emeka brings a visionary approach to contemporary African cuisine.", image: "https://i.pravatar.cc/300?u=chef1" },
    { name: "Chef Amaka Nwachukwu", role: "Head Chef", bio: "A master of traditional Delta flavors, Chef Amaka ensures every soup and stew maintains its authentic heart.", image: "https://i.pravatar.cc/300?u=chef2" },
    { name: "Mr. Tunde Ade", role: "Restaurant Manager", bio: "Dedicated to the art of service, Tunde ensures the Iyarà Side experience is seamless from greeting to farewell.", image: "https://i.pravatar.cc/300?u=manager" },
  ];

  return (
    <div className="min-h-screen bg-brand-cream pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center parallax"
          style={{ backgroundImage: "url('https://picsum.photos/seed/about-hero/1920/1080')", filter: "brightness(0.4)" }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Our Story</h1>
          <p className="text-xl text-brand-gold font-light tracking-widest uppercase">Passion • Heritage • Innovation</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif text-brand-green">The Vision Behind Iyarà Side</h2>
            <div className="w-20 h-1 bg-brand-gold"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Established in the heart of Asaba, Iyarà Side Restaurant was born from a desire to showcase the depth and sophistication of African cuisine to the world. The name "Iyarà" itself evokes a sense of sacred space and gathering—a place where food is more than sustenance; it is a celebration.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our journey began in 2020 with a simple mission: to bridge the gap between traditional heritage and contemporary fine dining. By applying global culinary techniques to indigenous ingredients like Banga, Yam, and local seafood, we've created a unique dining language that resonates with both local residents and international guests.
            </p>
            <div className="pt-6">
              <blockquote className="border-l-4 border-brand-gold pl-6 italic text-brand-green text-xl font-serif">
                "We don't just serve food; we serve memories of home, elevated by the artistry of the future."
                <footer className="mt-2 text-sm font-bold text-gray-500">— Founder's Vision</footer>
              </blockquote>
            </div>
          </div>
          <div className="relative">
            <img src="https://picsum.photos/seed/interior-1/800/1000" alt="Restaurant Interior" className="rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-10 -left-10 bg-brand-gold p-8 rounded-2xl shadow-xl hidden md:block">
              <p className="text-brand-green font-bold text-3xl">10k+</p>
              <p className="text-brand-dark text-sm uppercase tracking-tighter">Guests Served Yearly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-green text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">Our Core Values</h2>
            <p className="text-brand-gold font-light uppercase tracking-widest">What defines the Iyarà experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={i} className="group p-8 border border-white/10 rounded-2xl hover:border-brand-gold transition-all hover:bg-white/5">
                <div className="text-brand-gold mb-6 group-hover:scale-110 transition-transform inline-block">{v.icon}</div>
                <h3 className="text-2xl font-serif mb-4">{v.title}</h3>
                <p className="text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-brand-green mb-4">Meet Our Culinary Team</h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((m, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl group">
              <div className="h-80 overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-serif text-brand-green mb-1">{m.name}</h3>
                <p className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-4">{m.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Space */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-serif mb-6 text-brand-gold">Our Space</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Designed to reflect the elegance of contemporary Nigeria, our dining room features warm earth tones, handcrafted local art, and mood lighting that transitions from a bright, airy lunch spot to an intimate evening sanctuary.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                <p>Main Dining Hall: Capacity 120 Guests</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                <p>Private VIP Room: Capacity 12 Guests</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                <p>Outdoor Terrace: Capacity 40 Guests</p>
              </div>
            </div>
            <Link to="/gallery" className="inline-flex items-center gap-2 bg-brand-gold text-brand-green px-8 py-3 rounded-full font-bold hover:bg-white transition-all">
              Tour the Space <ChevronRight size={18} />
            </Link>
          </div>
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
            <img src="https://picsum.photos/seed/space1/400/400" className="rounded-2xl shadow-lg" alt="Dining Area" />
            <img src="https://picsum.photos/seed/space2/400/400" className="rounded-2xl shadow-lg translate-y-8" alt="Bar Area" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-serif text-brand-green mb-8">Ready to Experience Iyarà Side?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/reservations" className="bg-brand-green text-white px-10 py-4 rounded-full font-bold hover:bg-brand-gold hover:text-brand-green transition-all shadow-xl">
            Make a Reservation
          </Link>
          <Link to="/menu" className="border-2 border-brand-green text-brand-green px-10 py-4 rounded-full font-bold hover:bg-brand-green hover:text-white transition-all">
            View the Menu
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
