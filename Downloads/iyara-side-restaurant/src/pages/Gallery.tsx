
import React, { useState } from 'react';
import { X, Search, ChevronLeft, ChevronRight, Maximize2 } from '@/components/EmergencyLucideWrapper';

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = [
    { src: "https://picsum.photos/seed/g-food1/800/800", cat: "Food", title: "Signature Jollof" },
    { src: "https://picsum.photos/seed/g-int1/800/600", cat: "Interior", title: "Main Dining Room" },
    { src: "https://picsum.photos/seed/g-event1/600/800", cat: "Events", title: "Wedding Catering" },
    { src: "https://picsum.photos/seed/g-food2/800/1000", cat: "Food", title: "Banga Soup" },
    { src: "https://picsum.photos/seed/g-bts1/800/600", cat: "Behind the Scenes", title: "Chef at Work" },
    { src: "https://picsum.photos/seed/g-food3/600/600", cat: "Food", title: "Peppered Fish" },
    { src: "https://picsum.photos/seed/g-int2/800/800", cat: "Interior", title: "VIP Lounge" },
    { src: "https://picsum.photos/seed/g-event2/800/600", cat: "Events", title: "Corporate Brunch" },
    { src: "https://picsum.photos/seed/g-food4/800/600", cat: "Food", title: "Grilled Ribeye" },
    { src: "https://picsum.photos/seed/g-bts2/600/800", cat: "Behind the Scenes", title: "Fresh Ingredients" },
    { src: "https://picsum.photos/seed/g-food5/800/800", cat: "Food", title: "Ofada Rice" },
    { src: "https://picsum.photos/seed/g-int3/800/600", cat: "Interior", title: "The Bar" },
  ];

  const filters = ["All", "Food", "Interior", "Events", "Behind the Scenes"];
  const filteredImages = activeFilter === 'All' ? images : images.filter(img => img.cat === activeFilter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-green mb-6">A Visual Feast</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">Explore our culinary creations, vibrant space, and the magic behind the scenes.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-8 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                activeFilter === f ? 'bg-brand-green text-white scale-105' : 'bg-white text-brand-green hover:bg-brand-gold/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, idx) => (
            <div 
              key={idx} 
              className="relative group overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all"
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-green/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">{img.cat}</p>
                <h4 className="text-white text-xl font-serif mb-4">{img.title}</h4>
                <div className="bg-white/20 p-3 rounded-full text-white">
                  <Maximize2 size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-brand-dark/95 backdrop-blur-md flex items-center justify-center p-4" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 text-white hover:text-brand-gold transition-colors">
            <X size={48} />
          </button>
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <button onClick={prevImage} className="absolute left-0 text-white p-4 hover:text-brand-gold transition-all">
              <ChevronLeft size={64} />
            </button>
            <div className="text-center" onClick={e => e.stopPropagation()}>
              <img 
                src={filteredImages[lightboxIndex].src} 
                alt={filteredImages[lightboxIndex].title} 
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
              />
              <div className="mt-6">
                <p className="text-brand-gold uppercase text-xs font-bold tracking-[0.3em] mb-2">{filteredImages[lightboxIndex].cat}</p>
                <h3 className="text-white text-3xl font-serif">{filteredImages[lightboxIndex].title}</h3>
              </div>
            </div>
            <button onClick={nextImage} className="absolute right-0 text-white p-4 hover:text-brand-gold transition-all">
              <ChevronRight size={64} />
            </button>
          </div>
        </div>
      )}

      {/* Social CTA */}
      <section className="py-24 text-center mt-12 bg-white">
        <h2 className="text-3xl font-serif text-brand-green mb-4">Craving more?</h2>
        <p className="text-gray-500 mb-8">Follow us on Instagram for daily updates and specials.</p>
        <a 
          href="#" 
          className="inline-flex items-center gap-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all"
        >
          @iyaraside_restaurant
        </a>
      </section>
    </div>
  );
};

export default Gallery;
