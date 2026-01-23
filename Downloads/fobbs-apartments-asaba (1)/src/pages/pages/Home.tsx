import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Shield, Wifi, Utensils, Gamepad2, MapPin, ChevronRight, Star } from 'lucide-react';
import { APARTMENTS } from '../constants';
import ApartmentCard from '../components/ApartmentCard';
import { useStore } from '../store/useStore';

const Home: React.FC = () => {
  const { booking, setBooking } = useStore();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setBooking({ checkIn: newCheckIn });
    if (booking.checkOut && newCheckIn >= booking.checkOut) {
      setBooking({ checkOut: '' });
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBooking({ checkOut: e.target.value });
  };

  const handleCheckAvailability = () => {
    if (booking.checkIn && booking.checkOut) {
      navigate('/apartments');
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/asaba-hero/1920/1080" 
            alt="Fobbs Exterior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl text-white space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">#1 Rated Serviced Apartments in Asaba</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Your Asaba Home Base – <span className="text-emerald-400">Luxury</span> Redefined.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
              Spacious serviced apartments with integrated restaurant, bar, and entertainment. Perfect for business and leisure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/apartments" 
                className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-center hover:bg-emerald-700 transition-all transform hover:-translate-y-1"
              >
                View Apartments
              </Link>
              <Link 
                to="/restaurant" 
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-center hover:bg-white/20 transition-all"
              >
                Explore Dining
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget (Mobile Centered Overlap) */}
      <section className="max-w-6xl mx-auto px-4 -mt-32 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end border border-gray-100">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check In</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <input 
                type="date" 
                min={today}
                value={booking.checkIn}
                onChange={handleCheckInChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check Out</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <input 
                type="date" 
                min={booking.checkIn || today}
                value={booking.checkOut}
                onChange={handleCheckOutChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guests</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <select 
                value={booking.guests}
                onChange={(e) => setBooking({ guests: parseInt(e.target.value) })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium appearance-none"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleCheckAvailability}
            className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
          >
            Check Availability
          </button>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">More Than Just a Stay</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Experience a unique blend of comfort, convenience, and community designed for the modern Nigerian traveler.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "24/7 Gated Security", desc: "Your safety is our priority. State-of-the-art surveillance and trained personnel." },
            { icon: Wifi, title: "High-Speed Wi-Fi", desc: "Blazing fast fiber internet for your work-from-home or streaming needs." },
            { icon: Utensils, title: "On-Site Dining", desc: "Authentic Nigerian and continental dishes delivered straight to your door." },
            { icon: Gamepad2, title: "Entertainment Zone", desc: "Relax in our lounge with a pool table, board games, and sports viewing." },
            { icon: MapPin, title: "Central Location", desc: "Minutes away from government offices and the main business districts." },
            { icon: Star, title: "Daily Housekeeping", desc: "Immaculate cleaning every morning so you can focus on your day." },
          ].map((item, i) => (
            <div key={i} className="group p-8 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Apartments */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4">
            <div className="space-y-2">
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">Our Residences</span>
              <h2 className="text-4xl font-bold">Curated for Comfort</h2>
            </div>
            <Link to="/apartments" className="inline-flex items-center space-x-2 text-emerald-700 font-bold hover:underline">
              <span>View All Rooms</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {APARTMENTS.map((apt) => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Preview */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-emerald-900 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2 h-[400px] lg:h-auto">
            <img 
              src="https://picsum.photos/seed/food-hero/800/800" 
              alt="Signature Dish" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center text-white space-y-8">
            <div className="space-y-4">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Fobbs Kitchen & Bar</span>
              <h2 className="text-4xl md:text-5xl font-bold">Dine & Unwind Without Stepping Out.</h2>
              <p className="text-emerald-100/70 leading-relaxed">
                Enjoy the best of Nigerian flavors—from our famous Catfish Pepper Soup to Smoky Jollof—all within the comfort of our gated compound. 
                Our bar stays open late for your nighttime cocktails and casual pool games.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/restaurant" className="px-8 py-4 bg-white text-emerald-900 rounded-full font-bold text-center hover:bg-emerald-50 transition-colors">
                Explore Menu
              </Link>
              <Link to="/menu-qr" className="px-8 py-4 bg-emerald-800 text-white rounded-full font-bold text-center hover:bg-emerald-700 transition-colors">
                Order Room Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Loved by Guests</h2>
          <div className="flex items-center justify-center space-x-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            <span className="ml-2 font-bold">4.8/5 on Google Reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Chukwudi A.", role: "Corporate Guest", quote: "The apartment was clean, modern, and the Wi-Fi was actually fast! Best place I've stayed in Asaba." },
            { name: "Blessing E.", role: "Leisure Traveler", quote: "The pepper soup is to die for. I didn't have to leave the compound for anything during my stay." },
            { name: "Tobi S.", role: "Digital Nomad", quote: "Security is top-notch. I felt safe working late nights. Highly recommend the 1-bedroom suite." },
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col space-y-6">
              <p className="text-gray-600 italic leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-50">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;