import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bed, Users, Square, Wifi, Wind, MapPin, Coffee, Utensils, Laptop, ArrowLeft, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { APARTMENTS } from '../constants';
import { useStore } from '../store/useStore';

const ApartmentDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { booking, setBooking } = useStore();
  const apartment = APARTMENTS.find(a => a.slug === slug);
  const today = new Date().toISOString().split('T')[0];

  if (!apartment) return (
    <div className="py-24 text-center">
      <h2 className="text-2xl font-bold">Apartment not found</h2>
      <Link to="/apartments" className="text-emerald-600 hover:underline">Back to listings</Link>
    </div>
  );

  const handleBookNow = () => {
    if (!booking.checkIn || !booking.checkOut) {
      alert("Please select your stay dates first.");
      return;
    }
    setBooking({ apartmentId: apartment.id, roomType: apartment.type });
    navigate('/book');
  };

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

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      {/* Mobile Header Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md px-4 h-16 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <span className="ml-4 font-bold text-gray-900 line-clamp-1">{apartment.name}</span>
      </div>

      {/* Photo Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[450px] md:h-[600px] p-4 pt-20 lg:pt-4">
        <div className="rounded-[2rem] overflow-hidden relative shadow-lg group">
          <img src={apartment.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={apartment.name} />
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-xs uppercase text-emerald-900 tracking-widest shadow-sm">
            {apartment.type}
          </div>
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4">
          <div className="rounded-[2rem] overflow-hidden shadow-lg hover:brightness-90 transition-all">
            <img src={apartment.images[1] || 'https://picsum.photos/seed/detail1/800/600'} className="w-full h-full object-cover" alt="Interior" />
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-lg relative hover:brightness-90 transition-all">
            <img src="https://picsum.photos/seed/detail2/800/600" className="w-full h-full object-cover" alt="Amenities" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <button className="bg-white/90 backdrop-blur text-emerald-900 px-6 py-3 rounded-full font-bold text-sm shadow-xl">
                View 12+ Photos
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600">
              <Star className="w-4 h-4 fill-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest">Premium Selection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{apartment.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Asaba Central District</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Up to {apartment.maxGuests} Guests</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Listing</span>
              </span>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Bed, label: "Queen Bed", sub: "Premium Linens" },
              { icon: Wind, label: "Air Conditioning", sub: "Silent Units" },
              { icon: Wifi, label: "Fiber Internet", sub: "Unlimited 5G" },
              { icon: Square, label: `${apartment.size}m² Area`, sub: "Spacious Layout" },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-emerald-200 transition-colors">
                <item.icon className="w-6 h-6 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-sm text-gray-900">{item.label}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-l-4 border-emerald-600 pl-4">Your Private Sanctuary</h2>
            <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed">
              <p>{apartment.description}</p>
              <p>Experience luxury in the heart of Delta State. Our {apartment.name} is meticulously designed to provide a serene escape for both corporate travelers and tourists. With 24/7 power, high-speed fiber internet, and silent air conditioning, it's the perfect environment to rest or stay productive during your visit to Asaba.</p>
            </div>
          </div>

          {/* Detailed Amenities */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Standard Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Kitchen & Dining</h3>
                </div>
                <ul className="space-y-3">
                  {['Full Refrigerator', 'Stovetop & Microwave', 'Kitchen Utensils', 'Coffee & Tea Set'].map(item => (
                    <li key={item} className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <Laptop className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Work & Entertainment</h3>
                </div>
                <ul className="space-y-3">
                  {['43" Smart TV with DSTV', 'Ergonomic Desk & Chair', 'High-speed Fiber Wi-Fi', '24/7 Uninterrupted Power'].map(item => (
                    <li key={item} className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-8 space-y-6">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-4xl font-bold text-emerald-900">₦{apartment.pricePerNight.toLocaleString()}</span>
                <span className="text-gray-500 font-medium ml-2 text-sm">/ night</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold uppercase">
                <Star className="w-3 h-3 fill-emerald-600" />
                <span>Top Choice</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Check In</label>
                  <input 
                    type="date" 
                    min={today}
                    value={booking.checkIn}
                    onChange={handleCheckInChange}
                    className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0" 
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Check Out</label>
                  <input 
                    type="date" 
                    min={booking.checkIn || today}
                    value={booking.checkOut}
                    onChange={handleCheckOutChange}
                    className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0" 
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Number of Guests</label>
                <select 
                  value={booking.guests}
                  onChange={(e) => setBooking({ guests: parseInt(e.target.value) })}
                  className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0 appearance-none"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                </select>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Direct Booking Discount</span>
                <span className="text-emerald-600 font-bold">- 15%</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-emerald-900 border-t border-gray-50 pt-3">
                <span>Total Estimate</span>
                <span>₦{apartment.pricePerNight.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleBookNow}
              className="w-full py-5 bg-emerald-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transform active:scale-95 transition-all"
            >
              Reserve This Room
            </button>
            
            <p className="text-center text-[11px] text-gray-400 font-medium px-4">
              By clicking reserve, you agree to our standard house rules and cancellation policy.
            </p>

            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-50">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Secure</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-1">
                  <Coffee className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Breakfast</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-1">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Centric</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetail;