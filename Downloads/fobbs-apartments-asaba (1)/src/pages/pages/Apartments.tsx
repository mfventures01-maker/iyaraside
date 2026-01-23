import React, { useState, useMemo } from 'react';
import { Bed, Users, Square, Wifi, Wind, ChevronDown, SlidersHorizontal, Check, X, ArrowUpDown, Star } from 'lucide-react';
import { APARTMENTS } from '../constants';
import ApartmentCard from '../components/ApartmentCard';
import { RoomType } from '../types';

type SortOption = 'popularity' | 'price-low' | 'price-high' | 'size-large' | 'size-small';

const Apartments: React.FC = () => {
  const [filterType, setFilterType] = useState<RoomType | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(60000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract all unique amenities from the constants
  const allAmenities = useMemo(() => {
    const amenities = new Set<string>();
    APARTMENTS.forEach(apt => apt.amenities.forEach(ame => amenities.add(ame)));
    return Array.from(amenities).sort();
  }, []);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...APARTMENTS];

    // 1. Filter by Room Type
    if (filterType !== 'All') {
      result = result.filter(a => a.type === filterType);
    }

    // 2. Filter by Price
    result = result.filter(a => a.pricePerNight <= maxPrice);

    // 3. Filter by Amenities
    if (selectedAmenities.length > 0) {
      result = result.filter(apt => 
        selectedAmenities.every(ame => apt.amenities.includes(ame))
      );
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.pricePerNight - b.pricePerNight;
        case 'price-high': return b.pricePerNight - a.pricePerNight;
        case 'size-large': return b.size - a.size;
        case 'size-small': return a.size - b.size;
        case 'popularity': 
        default:
          // Use price as a fallback for popularity for now, or ID
          return b.id.localeCompare(a.id);
      }
    });

    return result;
  }, [filterType, maxPrice, selectedAmenities, sortBy]);

  const resetFilters = () => {
    setFilterType('All');
    setMaxPrice(60000);
    setSelectedAmenities([]);
    setSortBy('popularity');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero */}
      <section className="bg-emerald-900 pt-16 pb-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Space</h1>
          <p className="text-emerald-200 max-w-2xl mx-auto">From cozy studios for solo travelers to spacious 2-bedroom suites for families. Managed by Fobbs with world-class hospitality.</p>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center gap-4 border border-gray-100">
          
          {/* Main Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Studio', '1-Bedroom', '2-Bedroom'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                  filterType === type 
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200'
                }`}
              >
                {filterType === type && <Check className="w-3 h-3" />}
                <span>{type}</span>
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-gray-100 hidden lg:block mx-2"></div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-gray-50 text-gray-700 px-6 py-2.5 pr-10 rounded-2xl text-xs font-bold border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="size-large">Size: Largest First</option>
                <option value="size-small">Size: Smallest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                isFilterOpen || selectedAmenities.length > 0 || maxPrice < 60000
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>More Filters</span>
              {(selectedAmenities.length > 0) && (
                <span className="ml-1 bg-emerald-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                  {selectedAmenities.length}
                </span>
              )}
            </button>
          </div>

          <div className="ml-auto text-xs font-bold text-gray-400">
            Showing {filteredAndSorted.length} Apartments
          </div>
        </div>

        {/* Expanded Filters Drawer */}
        {isFilterOpen && (
          <div className="mt-4 bg-white rounded-[2.5rem] shadow-lg p-8 border border-gray-100 animate-slide-up grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Price Range</h4>
                <span className="text-xs font-bold text-emerald-600">Up to ₦{maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="60000" 
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                <span>₦10,000</span>
                <span>₦60,000+</span>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAmenities.map((ame) => (
                  <button
                    key={ame}
                    onClick={() => toggleAmenity(ame)}
                    className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all text-left ${
                      selectedAmenities.includes(ame)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-100'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                      selectedAmenities.includes(ame) ? 'bg-emerald-600 border-emerald-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {selectedAmenities.includes(ame) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs font-medium">{ame}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 pt-6 border-t border-gray-50 flex items-center justify-between">
              <button 
                onClick={resetFilters}
                className="text-xs font-bold text-gray-400 hover:text-emerald-900 transition-colors"
              >
                Clear All Filters
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="px-8 py-3 bg-emerald-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSorted.map((apt) => (
            <ApartmentCard key={apt.id} apartment={apt} />
          ))}
        </div>
        
        {filteredAndSorted.length === 0 && (
          <div className="text-center py-24 space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Bed className="w-10 h-10 text-gray-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">No rooms match your criteria</h3>
              <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any apartments that match all your filters. Try removing some amenities or increasing your price range.</p>
            </div>
            <button 
              onClick={resetFilters}
              className="px-10 py-4 bg-emerald-900 text-white rounded-full font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all"
            >
              Show All Apartments
            </button>
          </div>
        )}
      </div>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Direct Booking Perks</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">Why Book Direct with Fobbs?</h2>
            <p className="text-gray-500">
              Skip the third-party fees and enjoy exclusive benefits when you book directly through our official website.
            </p>
            <ul className="space-y-4">
              {[
                "Best Rate Guaranteed — Found lower? We'll beat it by 10%.",
                "Free Welcome Drink — One signature Chapman cocktail on arrival.",
                "15% Off Restaurant Bill — Throughout your entire stay.",
                "Flexible Cancellation — Change your dates up to 48 hours before."
              ].map((benefit, i) => (
                <li key={i} className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                  <div className="p-1 bg-emerald-100 rounded-full">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/trust/800/600" 
                alt="Happy Guest" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-emerald-900 text-white p-8 rounded-3xl shadow-2xl hidden md:block animate-bounce-slow">
              <p className="text-2xl font-bold">15% OFF</p>
              <p className="text-[10px] font-bold text-emerald-400 tracking-widest">FIRST BOOKING</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apartments;