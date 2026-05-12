import { useState, useEffect } from 'react';
import { Search, MapPin, CheckCircle2, XCircle, Star, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CompareKos() {
  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [room1, setRoom1] = useState<any>(null);
  const [room2, setRoom2] = useState<any>(null);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  // MENGAMBIL DATA KOS DARI DATABASE
  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/rooms')
      .then(res => res.json())
      .then(data => {
        const parsed = data.map((r: any) => ({
          ...r,
          // FIX: Injeksi URL Backend ke path gambar agar terbaca di browser
          image: r.image ? `${import.meta.env.VITE_API_URL}/${r.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
          images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images || [],
          facilities: typeof r.facilities === 'string' ? JSON.parse(r.facilities) : r.facilities || [],
          roomDetails: typeof r.roomDetails === 'string' ? JSON.parse(r.roomDetails) : r.roomDetails || {},
          price: parseInt(r.price) || 0,
          rating: parseFloat(r.rating) || 0
        }));
        setAllRooms(parsed);
      })
      .catch(err => console.error("Gagal mengambil data kos:", err));
  }, []);

  // Logika pencarian dinamis (berdasarkan Nama Kos atau Kota)
  const getSearchResults = (query: string, excludeRoomId?: number) => {
    if (!query) return [];
    return allRooms.filter(r => 
      r.id !== excludeRoomId && 
      (r.name.toLowerCase().includes(query.toLowerCase()) || r.location.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5); // Maksimal 5 hasil dropdown
  };

  const results1 = getSearchResults(search1, room2?.id);
  const results2 = getSearchResults(search2, room1?.id);

  // Daftar fasilitas umum untuk dibandingkan
  const commonFacilities = ['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar', 'Dapur'];

  return (
    <section className="py-16 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl mb-4 font-bold text-gray-900">Bandingkan Kos Pilihanmu</h2>
          <p className="text-muted-foreground text-lg">
            Bingung pilih yang mana? Bandingkan fasilitas, harga, dan lokasi kos dari database kami untuk menemukan yang paling pas.
          </p>
        </div>

        {/* Area Pencarian */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-border mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Input Kos 1 */}
            <div className="relative">
              <label className="text-sm font-semibold mb-2 block">Kos Pertama</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama kos atau kota (Cth: Jakarta)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#FF6B35] bg-gray-50/50"
                  value={room1 ? room1.name : search1}
                  onChange={(e) => {
                    setSearch1(e.target.value);
                    setRoom1(null);
                    setShowDropdown1(true);
                  }}
                  onFocus={() => setShowDropdown1(true)}
                />
                {room1 && (
                  <button onClick={() => { setRoom1(null); setSearch1(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              {/* Dropdown 1 */}
              {showDropdown1 && search1 && !room1 && results1.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {results1.map(r => (
                    <div key={r.id} className="p-3 hover:bg-orange-50 cursor-pointer border-b last:border-b-0 border-gray-100 flex items-center gap-3"
                      onClick={() => { setRoom1(r); setShowDropdown1(false); }}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"><ImageWithFallback src={r.image || r.images[0]} alt={r.name} className="w-full h-full object-cover"/></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{r.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Kos 2 */}
            <div className="relative">
              <label className="text-sm font-semibold mb-2 block">Kos Kedua</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama kos atau kota (Cth: Bandung)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#FF6B35] bg-gray-50/50"
                  value={room2 ? room2.name : search2}
                  onChange={(e) => {
                    setSearch2(e.target.value);
                    setRoom2(null);
                    setShowDropdown2(true);
                  }}
                  onFocus={() => setShowDropdown2(true)}
                />
                {room2 && (
                  <button onClick={() => { setRoom2(null); setSearch2(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              {/* Dropdown 2 */}
              {showDropdown2 && search2 && !room2 && results2.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {results2.map(r => (
                    <div key={r.id} className="p-3 hover:bg-orange-50 cursor-pointer border-b last:border-b-0 border-gray-100 flex items-center gap-3"
                      onClick={() => { setRoom2(r); setShowDropdown2(false); }}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"><ImageWithFallback src={r.image || r.images[0]} alt={r.name} className="w-full h-full object-cover"/></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{r.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tabel Komparasi (Muncul jika 2 kos dipilih) */}
        {room1 && room2 ? (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              
              {/* Kolom Kos 1 */}
              <div className="p-6">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative">
                  <ImageWithFallback src={room1.image || room1.images[0]} alt={room1.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-lg text-xs font-bold text-gray-900 flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/> {Number(room1.rating).toFixed(1)}</div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{room1.name}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4"><MapPin className="w-4 h-4"/> {room1.location}</div>
                <div className="text-2xl text-[#FF6B35] font-bold mb-6">Rp {(room1.price / 1000000).toFixed(1)}jt<span className="text-sm text-gray-500 font-normal">/bln</span></div>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Ukuran</span><span className="font-medium">{room1.roomDetails?.size || '-'}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Tipe</span><span className="font-medium">{room1.gender}</span></div>
                  
                  <div className="pt-4">
                    <p className="font-semibold mb-3">Fasilitas Utama</p>
                    <div className="space-y-2">
                      {commonFacilities.map(fac => (
                        <div key={fac} className="flex items-center gap-2 text-sm">
                          {room1.facilities.includes(fac) ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                          <span className={room1.facilities.includes(fac) ? 'text-gray-900' : 'text-gray-400 line-through'}>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to={`/kost/${room1.id}`}><Button className="w-full mt-6 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-xl">Lihat Detail Kos 1</Button></Link>
              </div>

              {/* Kolom Kos 2 */}
              <div className="p-6">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative">
                  <ImageWithFallback src={room2.image || room2.images[0]} alt={room2.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-lg text-xs font-bold text-gray-900 flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/> {Number(room2.rating).toFixed(1)}</div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{room2.name}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4"><MapPin className="w-4 h-4"/> {room2.location}</div>
                <div className="text-2xl text-[#FF6B35] font-bold mb-6">Rp {(room2.price / 1000000).toFixed(1)}jt<span className="text-sm text-gray-500 font-normal">/bln</span></div>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Ukuran</span><span className="font-medium">{room2.roomDetails?.size || '-'}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Tipe</span><span className="font-medium">{room2.gender}</span></div>
                  
                  <div className="pt-4">
                    <p className="font-semibold mb-3">Fasilitas Utama</p>
                    <div className="space-y-2">
                      {commonFacilities.map(fac => (
                        <div key={fac} className="flex items-center gap-2 text-sm">
                          {room2.facilities.includes(fac) ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                          <span className={room2.facilities.includes(fac) ? 'text-gray-900' : 'text-gray-400 line-through'}>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to={`/kost/${room2.id}`}><Button className="w-full mt-6 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-xl">Lihat Detail Kos 2</Button></Link>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Mulai Bandingkan</h3>
            <p className="text-gray-500 text-sm max-w-sm">Ketik nama kos atau kota di kedua kolom pencarian di atas, lalu pilih kos dari daftar yang muncul untuk melihat perbandingannya.</p>
          </div>
        )}

      </div>
    </section>
  );
}