
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems, tableNumber } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Catering', path: '/catering' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-green py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center group">
            <span className="text-brand-gold font-serif text-2xl md:text-3xl font-bold tracking-tighter transition-transform group-hover:scale-105">
              IYARÀ <span className="text-white font-light">SIDE</span>
            </span>
            {tableNumber && (
              <span className="ml-3 bg-brand-gold/20 text-brand-gold px-2 py-1 rounded-md text-[10px] font-black border border-brand-gold/30 flex items-center gap-1">
                <MapPin size={10} /> TABLE {tableNumber}
              </span>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide uppercase transition-colors ${location.pathname === link.path ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/menu" className="relative text-white hover:text-brand-gold transition-colors p-2">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-gold text-brand-green text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/reservations" className="bg-brand-gold text-brand-green px-6 py-2 rounded-full text-sm font-bold hover:bg-white transition-all shadow-md">
              RESERVE
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/menu" className="relative text-white p-2">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-gold text-brand-green text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-brand-green z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-white">
            <X size={32} />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-serif text-white hover:text-brand-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-8 w-full space-y-4">
            <Link
              to="/menu"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-white text-brand-green text-center py-4 rounded-xl font-bold"
            >
              VIEW MENU
            </Link>
            <Link
              to="/reservations"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-brand-gold text-brand-green text-center py-4 rounded-xl font-bold shadow-xl"
            >
              MAKE A RESERVATION
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
