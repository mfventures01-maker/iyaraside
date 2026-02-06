
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from '@/components/EmergencyLucideWrapper';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-serif font-bold text-brand-gold tracking-tighter">
              IYARÀ <span className="text-white font-light">SIDE</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Contemporary African flavors meet Intercontinental excellence in the heart of Asaba. Experience culinary artistry and warm Nigerian hospitality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-brand-green rounded-full hover:bg-brand-gold transition-colors text-white"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-brand-green rounded-full hover:bg-brand-gold transition-colors text-white"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-brand-green rounded-full hover:bg-brand-gold transition-colors text-white"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-brand-gold">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/menu" className="hover:text-white transition-colors">Our Menu</Link></li>
              <li><Link to="/reservations" className="hover:text-white transition-colors">Table Booking</Link></li>
              <li><Link to="/catering" className="hover:text-white transition-colors">Event Catering</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-brand-gold">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-brand-gold shrink-0" />
                <span>123 Summit Road, GRA Phase 2, Asaba, Delta State, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-brand-gold shrink-0" />
                <span>+234 803 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-brand-gold shrink-0" />
                <span>info@iyaraside.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-brand-gold">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to receive updates on seasonal menus and special events.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-brand-green/30 border border-brand-green/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
              />
              <button className="bg-brand-gold text-brand-green font-bold py-3 rounded-lg text-sm hover:bg-white transition-all">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© 2024 Iyarà Side Restaurant. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
