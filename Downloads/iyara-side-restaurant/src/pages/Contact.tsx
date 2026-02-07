
import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState('idle'); // idle, loading, success

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setTimeout(() => setFormState('success'), 1500);
  };

  const contactOptions = [
    { icon: <MapPin size={24} />, title: "Visit Us", details: ["123 Summit Road, GRA Phase 2,", "Asaba, Delta State, Nigeria"], actionLabel: "Get Directions", actionLink: "#" },
    { icon: <Phone size={24} />, title: "Call Us", details: ["Main: +234 803 456 7890", "Catering: +234 805 123 4567"], actionLabel: "Call Now", actionLink: "tel:+2348034567890" },
    { icon: <Mail size={24} />, title: "Email Us", details: ["info@iyaraside.com", "reservations@iyaraside.com"], actionLabel: "Send Email", actionLink: "mailto:info@iyaraside.com" },
    { icon: <MessageSquare size={24} />, title: "WhatsApp", details: ["Chat with our team instantly", "Available 9 AM - 9 PM"], actionLabel: "Open WhatsApp", actionLink: "https://wa.me/2347048033575" },
  ];

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-green mb-6">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Have questions about our menu, need to book a special event, or want to discuss catering? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {contactOptions.map((opt, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-brand-green/5 hover:border-brand-gold transition-colors">
                  <div className="text-brand-gold mb-4">{opt.icon}</div>
                  <h3 className="text-xl font-bold text-brand-green mb-4">{opt.title}</h3>
                  <div className="text-sm text-gray-500 mb-6 space-y-1">
                    {opt.details.map((line, idx) => <p key={idx}>{line}</p>)}
                  </div>
                  <a href={opt.actionLink} className="text-brand-gold font-bold text-sm hover:underline">{opt.actionLabel}</a>
                </div>
              ))}
            </div>

            <div className="bg-brand-green text-white p-8 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-brand-gold" />
                <h3 className="text-2xl font-serif">Operating Hours</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Mon - Sat</span>
                  <span className="font-bold">11:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-bold">12:00 PM - 10:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-brand-green/5">
            {formState === 'success' ? (
              <div className="text-center py-12 animate-fade-in">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-serif text-brand-green mb-4">Message Sent!</h2>
                <p className="text-gray-600 mb-8">Thank you for reaching out. A member of our team will contact you shortly.</p>
                <button
                  onClick={() => setFormState('idle')}
                  className="bg-brand-green text-white px-10 py-3 rounded-full font-bold hover:bg-brand-gold transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-3xl font-serif text-brand-green mb-8">Send us a message</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                    <input required type="text" className="w-full bg-brand-cream border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                    <input required type="email" className="w-full bg-brand-cream border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                  <input required type="tel" className="w-full bg-brand-cream border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                  <select className="w-full bg-brand-cream border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold transition-all">
                    <option>General Inquiry</option>
                    <option>Event Booking</option>
                    <option>Catering Request</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Message</label>
                  <textarea required rows={5} className="w-full bg-brand-cream border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-gold transition-all resize-none"></textarea>
                </div>
                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="w-full bg-brand-green text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-xl group"
                >
                  {formState === 'loading' ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                  ) : (
                    <>Send Message <Send size={20} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="mt-24 px-4 max-w-7xl mx-auto h-[450px] rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-brand-green/10">
          <p className="text-xs font-bold text-brand-gold uppercase mb-1">Our Location</p>
          <p className="text-brand-green font-serif">123 Summit Road, Asaba</p>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15873.308736146205!2d6.7027!3d6.195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1043f22567866d93%3A0x6a0a095759a22199!2sAsaba%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1715800000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
