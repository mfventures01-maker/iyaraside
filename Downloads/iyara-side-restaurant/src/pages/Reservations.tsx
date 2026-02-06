
import React, { useState } from 'react';
import { Calendar, Users, Clock, MessageSquare, CheckCircle, Info, CalendarPlus } from '@/components/EmergencyLucideWrapper';

const Reservations: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    occasion: 'Casual Dining',
    requests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCalendarLinks = () => {
    const { name, date, time, guests, occasion, requests } = formData;
    
    // Format Date and Time for Calendar (e.g., 20231027T193000)
    const startDateTimeStr = `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00`;
    
    // Assume 2 hour duration
    const startDate = new Date(`${date}T${time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const endDateTimeStr = endDate.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15);

    const title = encodeURIComponent(`Table for ${guests} at Iyarà Side Restaurant`);
    const location = encodeURIComponent("123 Summit Road, GRA Phase 2, Asaba, Delta State, Nigeria");
    const description = encodeURIComponent(`Reservation for: ${name}\nOccasion: ${occasion}\nNotes: ${requests || 'None'}`);

    // Google Calendar Link
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTimeStr}/${endDateTimeStr}&details=${description}&location=${location}&sf=true&output=xml`;

    // Outlook & Apple (using .ics file format)
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${startDateTimeStr}`,
      `DTEND:${endDateTimeStr}`,
      `SUMMARY:${decodeURIComponent(title)}`,
      `DESCRIPTION:${decodeURIComponent(description)}`,
      `LOCATION:${decodeURIComponent(location)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const icsBlob = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

    return { googleUrl, icsBlob };
  };

  if (submitted) {
    const { googleUrl, icsBlob } = getCalendarLinks();

    return (
      <div className="min-h-screen pt-32 pb-24 px-4 bg-brand-cream flex items-center justify-center">
        <div className="max-w-xl w-full bg-white p-12 rounded-3xl shadow-2xl text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-serif text-brand-green mb-4">Reservation Confirmed!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you, {formData.name}. We've successfully reserved a table for {formData.guests} people on {formData.date} at {formData.time}. A confirmation email has been sent to {formData.email}.
          </p>
          
          <div className="bg-brand-cream p-6 rounded-2xl mb-8 text-left border border-brand-green/10">
            <h4 className="font-bold text-brand-green mb-2 flex items-center gap-2">
              <Info size={18} className="text-brand-gold" />
              Booking Summary
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Date:</span> {formData.date}</p>
              <p><span className="font-medium">Time:</span> {formData.time}</p>
              <p><span className="font-medium">Guests:</span> {formData.guests}</p>
              <p><span className="font-medium">Reference:</span> #IYR-{Math.floor(Math.random() * 90000) + 10000}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-bold text-brand-green mb-4 uppercase tracking-widest flex items-center justify-center gap-2">
              <CalendarPlus size={16} className="text-brand-gold" />
              Add to Calendar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a 
                href={googleUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm"
              >
                Google
              </a>
              <a 
                href={icsBlob} 
                download="iyara-side-reservation.ics"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm"
              >
                Apple
              </a>
              <a 
                href={icsBlob} 
                download="iyara-side-reservation.ics"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm"
              >
                Outlook
              </a>
            </div>
          </div>

          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-all"
          >
            Return to Reservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-brand-green mb-4">Reserve a Table</h1>
          <p className="text-gray-600 max-w-xl mx-auto italic">Join us for an unforgettable culinary experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-brand-green text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-serif mb-6 text-brand-gold">Opening Hours</h3>
              <ul className="space-y-4 text-sm font-light">
                <li className="flex justify-between pb-2 border-b border-white/10">
                  <span>Monday - Saturday</span>
                  <span className="font-bold">11:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-bold">12:00 PM - 10:00 PM</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-xs text-brand-gold/80 mb-2 uppercase font-bold tracking-widest">Immediate Assistance</p>
                <a href="tel:+2348034567890" className="text-xl font-bold flex items-center hover:text-brand-gold transition-colors">
                  +234 803 456 7890
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-green/5">
              <div className="flex items-center text-brand-gold mb-4">
                <Info size={24} className="mr-3" />
                <h4 className="text-lg font-serif text-brand-green">Booking Policy</h4>
              </div>
              <ul className="text-sm text-gray-500 space-y-3 leading-relaxed">
                <li>• Reservations recommended for parties of 4+.</li>
                <li>• We hold tables for a maximum of 20 minutes.</li>
                <li>• Private dining available for groups over 8.</li>
                <li>• Cancellations require at least 24h notice.</li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Full Name *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g., Jane Doe"
                    className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Phone Number *</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="+234 ..."
                    className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all"
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all"
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-green mb-2">Date *</label>
                    <input 
                      required 
                      type="date" 
                      className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all"
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-green mb-2">Time *</label>
                    <input 
                      required 
                      type="time" 
                      className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all"
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Number of Guests *</label>
                  <select 
                    className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all"
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  >
                    {[1,2,3,4,5,6,7,8,'10+'].map(num => <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-green mb-2">Occasion</label>
                  <select 
                    className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all"
                    onChange={e => setFormData({...formData, occasion: e.target.value})}
                  >
                    <option>Casual Dining</option>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Business Meeting</option>
                    <option>Date Night</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-green mb-2">Special Requirements</label>
                <textarea 
                  rows={4}
                  placeholder="e.g., Wheelchair access, food allergies, high chair needed..."
                  className="w-full px-4 py-3 bg-brand-cream border border-transparent focus:border-brand-gold rounded-xl outline-none transition-all resize-none"
                  onChange={e => setFormData({...formData, requests: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-gold text-brand-green py-5 rounded-2xl font-bold text-lg hover:bg-brand-green hover:text-white transition-all shadow-xl flex items-center justify-center group"
              >
                Confirm Reservation <CheckCircle className="ml-2 group-hover:scale-110 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
