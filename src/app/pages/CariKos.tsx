import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Search, MapPin, Star, Filter, Wind, Wifi, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

const ALL_FACILITIES = [
  'AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar',
  'Kursi', 'Parkir Motor', 'Kamar Mandi Luar', 'Dapur', 'Listrik Pasca Bayar', 'Laundry',
];

const PRICE_RANGES = [
  { label: 'Semua Harga', min: 0, max: Infinity },
  { label: '< Rp 1jt', min: 0, max: 1000000 },
  { label: 'Rp 1jt - 2jt', min: 1000000, max: 2000000 },
  { label: 'Rp 2jt - 3jt', min: 2000000, max: 3000000 },
  { label: '> Rp 3jt', min: 3000000, max: Infinity },
];

export function CariKos() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States untuk Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms`)
      .then(res => res.json())
      .then(data => {
        const mappedRooms = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          location: r.location,
          address: r.address || r.location,
          price: parseInt(r.price) || 0,
          rating: parseFloat(r.rating) || 0,
          gender: r.gender,
          image: r.image ? `${import.meta.env.VITE_API_URL}/${r.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
          facilities: typeof r.facilities === 'string' ? JSON.parse(r.facilities || '[]') : r.facilities || [],
          sisaKamar: parseInt(r.sisa_kamar) || 0,
          totalKamar: parseInt(r.total_kamar) || 0,
        }));
        setRooms(mappedRooms);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const toggleFacility = (fac: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setSelectedFacilities([]);
    setPriceRange(0);
  };

  // Logika Penyaringan (Filtering)
  let filteredRooms = rooms.filter((r) => {
    // Pencarian Teks (Lokasi atau Nama Kos)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchLoc = r.location.toLowerCase().includes(q);
      const matchAddr = r.address.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchAddr) return false;
    }

    // Filter Gender
    if (genderFilter !== 'all' && r.gender !== genderFilter) return false;

    // Filter Harga
    const pr = PRICE_RANGES[priceRange];
    if (r.price < pr.min || r.price >= (pr.max === Infinity ? Infinity : pr.max + 1)) return false;

    // Filter Fasilitas
    if (selectedFacilities.length > 0) {
      const roomFacs = r.facilities.map((f: string) => f.toLowerCase());
      if (!selectedFacilities.every((sf) => roomFacs.includes(sf.toLowerCase()))) return false;
    }

    return true;
  });

  // Logika Pengurutan (Sorting)
  filteredRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.price - b.price;
    return b.price - a.price;
  });

  const activeFilterCount = (genderFilter !== 'all' ? 1 : 0) + selectedFacilities.length + (priceRange !== 0 ? 1 : 0);

  if (isLoading) {
    return <div className="min-h-screen bg-[#faf9f6]"><Navigation /><div className="pt-32 text-center text-gray-500">Memuat daftar kos...</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cari Kos Impianmu</h1>
            <p className="text-gray-500">Temukan ribuan pilihan kos terbaik yang tersebar di seluruh Indonesia dengan mudah dan cepat.</p>
          </div>

          {/* ====== SEARCH & MAIN FILTERS ====== */}
          <div className="bg-white rounded-[32px] p-4 md:p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ketik lokasi, daerah, atau nama kos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 transition-all font-medium text-gray-800"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="flex-1 md:flex-none px-4 py-3.5 rounded-2xl text-sm bg-gray-50 border border-gray-200 outline-none font-bold text-gray-700 cursor-pointer focus:border-[#FF6B35]">
                  <option value="rating">Rating Tertinggi</option>
                  <option value="price-asc">Harga Termurah</option>
                  <option value="price-desc">Harga Termahal</option>
                </select>
                <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold border transition-colors shrink-0 ${showFilters || activeFilterCount > 0 ? 'bg-[#FF6B35] text-white border-[#FF6B35]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#FF6B35]/50'}`}>
                  <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filter</span>
                  {activeFilterCount > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${showFilters ? 'bg-white/20' : 'bg-orange-50 text-[#FF6B35]'}`}>{activeFilterCount}</span>}
                </button>
              </div>
            </div>

            {/* ====== EXPANDED FILTERS ====== */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-100 mt-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Tipe Kos</h4>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'Putra', 'Putri', 'Campur'].map((g) => (
                        <button key={g} onClick={() => setGenderFilter(g)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${genderFilter === g ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'}`}>
                          {g === 'all' ? 'Semua Tipe' : g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Rentang Harga</h4>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_RANGES.map((pr, i) => (
                        <button key={i} onClick={() => setPriceRange(i)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${priceRange === i ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'}`}>
                          {pr.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Fasilitas Prioritas</h4>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                      {ALL_FACILITIES.map((fac) => {
                        const isSelected = selectedFacilities.includes(fac);
                        return (
                          <button key={fac} onClick={() => toggleFacility(fac)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${isSelected ? 'bg-orange-50 text-[#FF6B35] border-orange-200' : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF6B35]/50'}`}>
                            {isSelected && <Check className="w-3 h-3" />} {fac}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">{activeFilterCount} Filter aktif</span>
                    <button onClick={resetAllFilters} className="text-xs font-bold text-red-500 hover:underline">Reset Semua Filter</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ====== ROOMS GRID ====== */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Hasil Pencarian <span className="text-gray-400 font-medium text-base ml-1">({filteredRooms.length} kos)</span></h2>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Kos Tidak Ditemukan</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Kami tidak dapat menemukan kos yang sesuai dengan kriteria pencarian Anda. Silakan ubah filter atau gunakan kata kunci lain.</p>
              <Button variant="outline" onClick={resetAllFilters} className="rounded-xl font-bold border-gray-300">Reset Semua Filter</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="group bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <Link to={`/kost/${room.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#FF6B35] text-white rounded-lg px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>{room.rating.toFixed(1)}</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {room.gender}
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col h-[220px]">
                    <Link to={`/kost/${room.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">{room.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-3 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-1">{room.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {room.facilities.slice(0, 3).map((facility: string) => (
                        <div key={facility} className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md border border-orange-100 text-[10px] font-medium text-gray-600">
                          {facility === 'AC' && <Wind className="w-3 h-3 text-[#FF6B35]" />}
                          {facility === 'Wi-Fi' && <Wifi className="w-3 h-3 text-[#FF6B35]" />}
                          <span>{facility}</span>
                        </div>
                      ))}
                      {room.facilities.length > 3 && <div className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md border border-gray-200">+{room.facilities.length - 3}</div>}
                    </div>

                    <div className="flex items-center gap-1.5 mt-auto mb-4 text-[11px] font-bold">
                      <div className={`w-2 h-2 rounded-full ${room.sisaKamar > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={room.sisaKamar > 0 ? 'text-green-600' : 'text-red-600'}>
                        {room.sisaKamar > 0 ? `Sisa ${room.sisaKamar} kamar` : 'Penuh'}
                      </span>
                      <span className="text-gray-400 font-medium">dari {room.totalKamar}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-[10px] text-gray-400 font-medium mb-0.5">Mulai dari</div>
                        <div className="text-base font-black text-[#FF6B35]">
                          Rp {(room.price / 1000000).toFixed(1)}jt<span className="text-[10px] font-medium text-gray-400">/bulan</span>
                        </div>
                      </div>
                      <Link to={`/kost/${room.id}`}>
                        <Button size="sm" className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-xs font-bold px-4 shadow-sm">Lihat Detail</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}