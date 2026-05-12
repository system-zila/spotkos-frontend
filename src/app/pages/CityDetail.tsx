import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, Star, MapPin, Filter, X, Check, Minus, GitCompareArrows, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface Room {
  id: number;
  name: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  gender: string;
  image: string;
  facilities: string[];
  sisaKamar: number;
  totalKamar: number;
  roomDetails: {
    size: string;
    capacity: string;
    bathroom: string;
    floor: string;
  };
}

const cityImages: Record<string, string> = {
  Jakarta: 'https://images.unsplash.com/photo-1680244116826-467f252cf503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWthcnRhJTIwY2l0eSUyMHNreWxpbmUlMjBJbmRvbmVzaWF8ZW58MXx8fHwxNzczMDY5MDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  Bandung: 'https://images.unsplash.com/photo-1707993467310-a5b2bb858d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYW5kdW5nJTIwY2l0eSUyMHNreWxpbmUlMjBnZWR1bmclMjBzYXRlfGVufDF8fHx8MTc3NjE2Njg1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  Yogyakarta: 'https://images.unsplash.com/photo-1619934958564-78898c5906f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxZb2d5YWthcnRhJTIwSW5kb25lc2lhJTIwdGVtcGxlfGVufDF8fHx8MTc3MzA2OTA0NXww&ixlib=rb-4.1.0&q=80&w=1080',
  Surabaya: 'https://images.unsplash.com/photo-1689304806212-5b17ef28d246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTdXJhYmF5YSUyMGNpdHklMjBJbmRvbmVzaWF8ZW58MXx8fHwxNzcyOTY1ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  Malang: 'https://images.unsplash.com/photo-1559628151-ef85aab5bb21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxhbmclMjBjaXR5JTIwSW5kb25lc2lhJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczMDY5MDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  Semarang: 'https://images.unsplash.com/photo-1657594873796-4a121883192a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW1hcmFuZyUyMEluZG9uZXNpYSUyMGNpdHl8ZW58MXx8fHwxNzczMDY5MDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
};

const ALL_FACILITIES = [
  'AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar',
  'Kursi', 'Parkir Motor', 'Kamar Mandi Luar', 'Dapur', 'Listrik Pasca Bayar', 'Laundry',
];

const citySubRegions: Record<string, string[]> = {
  Jakarta: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'],
  Bandung: ['Dago', 'Coblong', 'Cicendo', 'Buahbatu', 'Cimahi', 'Antapani', 'Rancasari'],
  Semarang: ['Tembalang', 'Banyumanik', 'Pedurungan', 'Gajahmungkur', 'Candisari', 'Semarang Tengah'],
  Surabaya: ['Gubeng', 'Mulyorejo', 'Sukolilo', 'Wonokromo', 'Rungkut', 'Tegalsari'],
  Yogyakarta: ['Seturan', 'Sleman', 'Gondokusuman', 'Mantrijeron', 'Kotagede', 'Depok'],
  Malang: ['Lowokwaru', 'Klojen', 'Blimbing', 'Sukun', 'Kedungkandang'],
};

const PRICE_RANGES = [
  { label: 'Semua Harga', min: 0, max: Infinity },
  { label: '< Rp 1jt', min: 0, max: 1000000 },
  { label: 'Rp 1jt - 2jt', min: 1000000, max: 2000000 },
  { label: 'Rp 2jt - 3jt', min: 2000000, max: 3000000 },
  { label: '> Rp 3jt', min: 3000000, max: Infinity },
];

export function CityDetail() {
  const { city } = useParams();
  const cityName = decodeURIComponent(city || '');
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSubRegion('all');
    setSelectedFacilities([]);
    setPriceRange(0);

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
          reviews: parseInt(r.reviews_count) || 0,
          gender: r.gender,
          image: r.image ? `${import.meta.env.VITE_API_URL}/${r.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
          facilities: typeof r.facilities === 'string' ? JSON.parse(r.facilities || '[]') : r.facilities || [],
          sisaKamar: parseInt(r.sisa_kamar) || 0,
          totalKamar: parseInt(r.total_kamar) || 0,
          roomDetails: {
            size: r.room_size || '-',
            capacity: r.capacity || '-',
            bathroom: r.bathroom_type || '-',
            floor: r.floor_range || '-'
          }
        }));
        setRooms(mappedRooms);
        setIsLoadingDb(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingDb(false);
      });
  }, [city]);

  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [subRegion, setSubRegion] = useState<string>('all');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [facilitySearch, setFacilitySearch] = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const subRegions = citySubRegions[cityName] || [];

  const cityRooms = rooms.filter((r) =>
    r.location.toLowerCase().includes(cityName.toLowerCase()) ||
    r.address.toLowerCase().includes(cityName.toLowerCase())
  );

  const filteredFacilityOptions = ALL_FACILITIES.filter((f) =>
    f.toLowerCase().includes(facilitySearch.toLowerCase())
  );

  const toggleFacility = (fac: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  let filteredRooms = cityRooms.filter((r) => {
    if (genderFilter !== 'all' && r.gender !== genderFilter) return false;
    if (subRegion !== 'all') {
      const loc = (r.location + ' ' + r.address).toLowerCase();
      if (!loc.includes(subRegion.toLowerCase())) return false;
    }
    if (selectedFacilities.length > 0) {
      const roomFacs = r.facilities.map((f) => f.toLowerCase());
      if (!selectedFacilities.every((sf) => roomFacs.includes(sf.toLowerCase()))) return false;
    }
    const pr = PRICE_RANGES[priceRange];
    if (r.price < pr.min || r.price >= (pr.max === Infinity ? Infinity : pr.max + 1)) {
      if (pr.max !== Infinity && r.price > pr.max) return false;
      if (r.price < pr.min) return false;
    }
    return true;
  });

  filteredRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.price - b.price;
    return b.price - a.price;
  });

  const toggleCompare = (id: number) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((cid) => cid !== id));
    } else if (compareIds.length < 3) {
      setCompareIds([...compareIds, id]);
    }
  };

  const compareRooms = compareIds.map((id) => rooms.find((r) => r.id === id)).filter(Boolean) as Room[];

  const cheapestId = compareRooms.length >= 2
    ? compareRooms.reduce((min, r) => (r.price < min.price ? r : min)).id
    : null;
  const bestRatedId = compareRooms.length >= 2
    ? compareRooms.reduce((max, r) => (r.rating > max.rating ? r : max)).id
    : null;

  const heroImage = cityImages[cityName] || cityImages['Jakarta'];
  const activeFilterCount = (genderFilter !== 'all' ? 1 : 0) + (subRegion !== 'all' ? 1 : 0) + selectedFacilities.length + (priceRange !== 0 ? 1 : 0);

  const resetAllFilters = () => {
    setGenderFilter('all');
    setSubRegion('all');
    setSelectedFacilities([]);
    setPriceRange(0);
    setFacilitySearch('');
  };

  if (isLoadingDb) return <div className="min-h-screen bg-background"><Navigation /><div className="pt-32 text-center">Memuat...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <ImageWithFallback src={heroImage} alt={cityName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-3">
              <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
            </Link>
            <h1 className="text-4xl md:text-5xl text-white mb-2 font-bold">Kos di {cityName}</h1>
            <p className="text-white/80 font-medium">{filteredRooms.length} kos tersedia</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ====== SUB-REGION FILTER ====== */}
        {subRegions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm text-muted-foreground mb-3 flex items-center gap-2 font-bold">
              <MapPin className="w-4 h-4" /> Filter Daerah
            </h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSubRegion('all')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${subRegion === 'all' ? 'bg-[#FF6B35] text-white' : 'bg-white border border-border hover:border-[#FF6B35]/50'}`}>
                Semua {cityName}
              </button>
              {subRegions.map((sr) => (
                <button key={sr} onClick={() => setSubRegion(sr)} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${subRegion === sr ? 'bg-[#FF6B35] text-white' : 'bg-white border border-border hover:border-[#FF6B35]/50'}`}>
                  {sr}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ====== MAIN FILTERS BAR ====== */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              {['all', 'Putra', 'Putri', 'Campur'].map((g) => (
                <button key={g} onClick={() => setGenderFilter(g)} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${genderFilter === g ? 'bg-[#FF6B35] text-white' : 'bg-white border border-border hover:border-[#FF6B35]/50'}`}>
                  {g === 'all' ? 'Semua Tipe' : g}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 h-10 rounded-full text-sm bg-white border border-border outline-none font-bold">
              <option value="rating">Rating Tertinggi</option>
              <option value="price-asc">Harga Termurah</option>
              <option value="price-desc">Harga Termahal</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border font-bold transition-colors ${showFilters || activeFilterCount > 0 ? 'bg-[#FF6B35] text-white border-[#FF6B35]' : 'bg-white border-border hover:border-[#FF6B35]/50'}`}>
              <Filter className="w-4 h-4" /> Filter Lanjutan
              {activeFilterCount > 0 && <span className={`px-1.5 py-0.5 rounded-full text-xs ${showFilters ? 'bg-white/20' : 'bg-white text-[#FF6B35]'}`}>{activeFilterCount}</span>}
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {compareIds.length > 0 && (
              <Button onClick={() => setShowCompare(!showCompare)} className="rounded-full font-bold bg-[#FF6B35] hover:bg-[#FF6B35]/90">
                <GitCompareArrows className="w-4 h-4 mr-2" /> Bandingkan ({compareIds.length}/3)
              </Button>
            )}
          </div>
        </div>

        {/* ====== EXPANDED FILTERS ====== */}
        {showFilters && (
          <div className="bg-white rounded-3xl border border-border p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold mb-3">Rentang Harga</h4>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((pr, i) => (
                    <button key={i} onClick={() => setPriceRange(i)} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${priceRange === i ? 'bg-[#FF6B35] text-white' : 'bg-gray-50 hover:bg-gray-100 border border-border'}`}>{pr.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-3">Fasilitas</h4>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={facilitySearch} onChange={(e) => setFacilitySearch(e.target.value)} placeholder="Cari fasilitas... (AC, Wi-Fi, Kasur)" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-gray-50 text-sm outline-none focus:bg-white focus:border-[#FF6B35] transition-colors" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredFacilityOptions.map((fac) => {
                    const isSelected = selectedFacilities.includes(fac);
                    return (
                      <button key={fac} onClick={() => toggleFacility(fac)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isSelected ? 'bg-[#FF6B35] text-white' : 'bg-gray-50 hover:bg-gray-100 border border-border'}`}>
                        {isSelected && <Check className="w-3 h-3" />} {fac}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-medium">Filter aktif:</span>
                  {subRegion !== 'all' && <span className="px-2 py-1 bg-orange-50 text-[#FF6B35] font-bold rounded-full text-xs flex items-center gap-1 border border-orange-100">{subRegion} <button onClick={() => setSubRegion('all')}><X className="w-3 h-3" /></button></span>}
                  {genderFilter !== 'all' && <span className="px-2 py-1 bg-orange-50 text-[#FF6B35] font-bold rounded-full text-xs flex items-center gap-1 border border-orange-100">{genderFilter} <button onClick={() => setGenderFilter('all')}><X className="w-3 h-3" /></button></span>}
                  {priceRange !== 0 && <span className="px-2 py-1 bg-orange-50 text-[#FF6B35] font-bold rounded-full text-xs flex items-center gap-1 border border-orange-100">{PRICE_RANGES[priceRange].label} <button onClick={() => setPriceRange(0)}><X className="w-3 h-3" /></button></span>}
                  {selectedFacilities.map((f) => <span key={f} className="px-2 py-1 bg-orange-50 text-[#FF6B35] font-bold rounded-full text-xs flex items-center gap-1 border border-orange-100">{f} <button onClick={() => toggleFacility(f)}><X className="w-3 h-3" /></button></span>)}
                </div>
                <button onClick={resetAllFilters} className="text-xs text-red-500 font-bold hover:underline">Reset Semua</button>
              </div>
            )}
          </div>
        )}

        {/* Compare Bar (sticky) */}
        {compareIds.length > 0 && !showCompare && (
          <div className="sticky top-20 z-40 bg-white rounded-2xl border border-[#FF6B35]/30 p-4 mb-6 shadow-lg flex flex-wrap items-center gap-3">
            <GitCompareArrows className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-sm font-bold">Perbandingan:</span>
            {compareRooms.map((room) => (
              <div key={room.id} className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-1.5 border border-orange-100">
                <span className="text-sm font-bold text-gray-800">{room.name}</span>
                <button onClick={() => toggleCompare(room.id)} className="text-[#FF6B35] hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {compareIds.length >= 2 && <Button size="sm" onClick={() => setShowCompare(true)} className="rounded-xl font-bold bg-[#FF6B35] hover:bg-[#FF6B35]/90 ml-auto shadow-sm">Bandingkan Sekarang</Button>}
            <button onClick={() => setCompareIds([])} className="text-xs font-bold text-gray-400 hover:text-red-500 ml-2">Reset</button>
          </div>
        )}

        {/* Compare Table */}
        {showCompare && compareRooms.length >= 2 && (
          <div className="bg-white rounded-3xl border border-border p-6 mb-8 shadow-lg overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><GitCompareArrows className="w-6 h-6 text-[#FF6B35]" /> Perbandingan Kos</h2>
              <Button variant="outline" size="sm" onClick={() => setShowCompare(false)} className="rounded-xl font-bold"><X className="w-4 h-4 mr-1" /> Tutup</Button>
            </div>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-3 text-sm text-muted-foreground w-40 font-bold">Kriteria</th>
                  {compareRooms.map((room) => (
                    <th key={room.id} className="p-3 text-center">
                      <Link to={`/kost/${room.id}`} className="hover:text-[#FF6B35] transition-colors">
                        <div className="w-20 h-14 rounded-xl overflow-hidden mx-auto mb-2 border border-gray-100"><ImageWithFallback src={room.image} alt={room.name} className="w-full h-full object-cover" /></div>
                        <span className="text-sm font-bold">{room.name}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 text-sm text-muted-foreground font-bold">Harga</td>
                  {compareRooms.map((room) => (
                    <td key={room.id} className={`p-3 text-center text-sm ${room.id === cheapestId ? 'bg-green-50/50' : ''}`}>
                      <span className={`font-bold ${room.id === cheapestId ? 'text-green-600' : 'text-gray-900'}`}>Rp {(room.price / 1000000).toFixed(1)}jt/bln</span>
                      {room.id === cheapestId && <Badge className="ml-1 bg-green-100 text-green-700 text-[10px] font-bold border-green-200">Termurah</Badge>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-sm text-muted-foreground font-bold">Rating</td>
                  {compareRooms.map((room) => (
                    <td key={room.id} className={`p-3 text-center text-sm ${room.id === bestRatedId ? 'bg-yellow-50/50' : ''}`}>
                      <div className="flex items-center justify-center gap-1">
                        <Star className={`w-4 h-4 ${room.id === bestRatedId ? 'fill-yellow-500 text-yellow-500' : 'fill-[#FF6B35] text-[#FF6B35]'}`} />
                        <span className={`font-bold ${room.id === bestRatedId ? 'text-yellow-600' : 'text-gray-900'}`}>{room.rating}</span>
                      </div>
                      {room.id === bestRatedId && <Badge className="bg-yellow-100 text-yellow-700 text-[10px] font-bold border-yellow-200 mt-1">Tertinggi</Badge>}
                    </td>
                  ))}
                </tr>
                <tr><td className="p-3 text-sm text-muted-foreground font-bold">Lokasi</td>{compareRooms.map((room) => <td key={room.id} className="p-3 text-center text-sm text-gray-700">{room.location}</td>)}</tr>
                <tr><td className="p-3 text-sm text-muted-foreground font-bold">Tipe</td>{compareRooms.map((room) => <td key={room.id} className="p-3 text-center text-sm font-medium text-gray-700">{room.gender}</td>)}</tr>
                <tr><td className="p-3 text-sm text-muted-foreground font-bold">Ukuran</td>{compareRooms.map((room) => <td key={room.id} className="p-3 text-center text-sm text-gray-700">{room.roomDetails.size}</td>)}</tr>
                <tr><td className="p-3 text-sm text-muted-foreground font-bold">Kamar Mandi</td>{compareRooms.map((room) => <td key={room.id} className="p-3 text-center text-sm text-gray-700">{room.roomDetails.bathroom}</td>)}</tr>
                {ALL_FACILITIES.map((fac) => {
                  const anyHas = compareRooms.some((r) => r.facilities.includes(fac));
                  if (!anyHas) return null;
                  return (
                    <tr key={fac}>
                      <td className="p-3 text-sm text-muted-foreground font-bold">{fac}</td>
                      {compareRooms.map((room) => (
                        <td key={room.id} className="p-3 text-center">
                          {room.facilities.includes(fac) ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <Minus className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr>
                  <td className="p-3 text-sm text-muted-foreground font-bold">Aksi</td>
                  {compareRooms.map((room) => (
                    <td key={room.id} className="p-3 text-center">
                      <Link to={`/kost/${room.id}`}><Button size="sm" className="rounded-xl font-bold bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-xs shadow-sm">Lihat Detail</Button></Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Room Cards Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-sm">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Kos</h3>
            <p className="text-muted-foreground mb-6 text-sm">Belum ada kos yang terdaftar di {cityName}{subRegion !== 'all' ? ` daerah ${subRegion}` : ''} dengan kriteria ini.</p>
            <Button variant="outline" onClick={resetAllFilters} className="rounded-xl font-bold border-gray-300">Reset Semua Filter</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => {
              const isComparing = compareIds.includes(room.id);
              return (
                <div key={room.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 ${isComparing ? 'ring-2 ring-[#FF6B35] border-transparent' : ''}`}>
                  <Link to={`/kost/${room.id}`}>
                    <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                      <ImageWithFallback src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* BINTANG RATING DI POJOK KIRI ATAS */}
                      <div className="absolute top-3 left-3 bg-[#FF6B35] text-white rounded-lg px-2.5 py-1 flex items-center gap-1 text-xs font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>{room.rating}</span>
                      </div>
                      
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">{room.gender}</div>
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col h-[210px]">
                    <Link to={`/kost/${room.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">{room.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-3 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> <span className="line-clamp-1">{room.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {room.facilities.slice(0, 3).map((f) => (
                        <span key={f} className={`px-2 py-1 text-[10px] font-medium rounded-md border ${selectedFacilities.includes(f) ? 'bg-orange-50 text-[#FF6B35] border-orange-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{f}</span>
                      ))}
                      {room.facilities.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md border border-gray-200">+{room.facilities.length - 3}</span>}
                    </div>

                    {/* INDIKATOR SISA KAMAR */}
                    <div className="flex items-center gap-1.5 mt-auto mb-4 text-[11px] font-bold">
                      <div className={`w-2 h-2 rounded-full ${room.sisaKamar > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={room.sisaKamar > 0 ? 'text-green-600' : 'text-red-600'}>
                        {room.sisaKamar > 0 ? `Sisa ${room.sisaKamar} kamar` : 'Penuh'}
                      </span>
                      <span className="text-gray-400 font-medium">dari {room.totalKamar}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-base font-black text-[#FF6B35]">
                        Rp {(room.price / 1000000).toFixed(1)}jt <span className="text-[10px] font-medium text-gray-400">/bulan</span>
                      </div>
                      <button onClick={() => toggleCompare(room.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors shadow-sm ${isComparing ? 'bg-[#FF6B35] text-white border-[#FF6B35]' : 'border-gray-200 hover:border-[#FF6B35] text-gray-600 hover:text-[#FF6B35] bg-white'}`}>
                        <GitCompareArrows className="w-3.5 h-3.5" /> {isComparing ? 'Dipilih' : 'Bandingkan'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}