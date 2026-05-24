import { useParams, Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { 
  ArrowLeft, MapPin, Ruler, Users, Bath, Building, Phone, Check, Clock, 
  MessageSquare, Image as ImageIcon, Sparkles, Star, Map,
  Wifi, AirVent, Tv, BedDouble, DoorOpen, Zap, Droplets, Refrigerator, 
  ParkingCircle, Cctv, Utensils, Grip, Shirt
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { BookingDialog } from '../components/BookingDialog';
import { useAuth } from '../context/AuthContext';

// IMPORT LEAFLET UNTUK PETA GRATIS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// PERBAIKAN BUG IKON LEAFLET
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- HELPER: MAPPING IKON FASILITAS (WARNA ORANGE) ---
const getFacilityIcon = (facilityName: string) => {
  const name = facilityName.toLowerCase().replace(/[-\s]/g, '');
  const iconClass = "w-6 h-6 text-[#FF6B35] shrink-0"; 

  if (name.includes('wifi') || name.includes('internet')) return <Wifi className={iconClass} />;
  if (name.includes('ac') || name.includes('pendingin')) return <AirVent className={iconClass} />;
  if (name.includes('tv') || name.includes('televisi')) return <Tv className={iconClass} />;
  if (name.includes('kasur') || name.includes('bed')) return <BedDouble className={iconClass} />;
  if (name.includes('lemari')) return <DoorOpen className={iconClass} />;
  if (name.includes('meja') || name.includes('kursi')) return <Utensils className={iconClass} />;
  if (name.includes('listrik')) return <Zap className={iconClass} />;
  if (name.includes('kmdalam') || name.includes('kamarmandi') || name.includes('bath')) return <Droplets className={iconClass} />;
  if (name.includes('dapur') || name.includes('kulkas')) return <Refrigerator className={iconClass} />;
  if (name.includes('parkir')) return <ParkingCircle className={iconClass} />;
  if (name.includes('cctv') || name.includes('keamanan')) return <Cctv className={iconClass} />;
  if (name.includes('laundry') || name.includes('cuci') || name.includes('mesin')) return <Shirt className={iconClass} />;
  
  return <Check className="w-5 h-5 text-[#FF6B35] shrink-0" />; 
};

export function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [allRooms, setAllRooms] = useState<any[]>([]); 
  const [room, setRoom] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Pertama, tarik semua kos untuk list 'Kost Serupa'
    // Pertama, tarik semua kos untuk list 'Kost Serupa'
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms?ngrok-skip-browser-warning=true`)
      .then(res => res.json())
      .then(data => setAllRooms(data))
      .catch(err => console.error("Gagal menarik data semua kos:", err));

    // Kedua, tarik kos ini SECARA SPESIFIK 
    // Kedua, tarik kos ini SECARA SPESIFIK 
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}?ngrok-skip-browser-warning=true`)
      .then(res => res.json())
      .then(data => {
        setRoom(data);
        setIsLoading(false);
      })
      .catch(err => { 
        console.error("Gagal menarik detail kos:", err); 
        setIsLoading(false); 
      });

    // Ketiga, tarik ulasan spesifik
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}/reviews?ngrok-skip-browser-warning=true`)
      .then(res => {
         if(!res.ok) throw new Error("API ulasan error");
         return res.json();
      })
      .then(data => {
         setReviews(data);
      })
      .catch(err => {
         console.warn("Gagal mengambil data ulasan", err);
      });
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-[#faf9f6]"><Navigation /><div className="pt-32 text-center">Memuat detail kos...</div></div>;

  if (!room || room.error) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Kost Tidak Ditemukan</h1>
          <Link to="/"><Button className="bg-[#FF6B35] rounded-full px-8">Kembali ke Beranda</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  // --- PARSING JSON DARI DATABASE ---
  let photoGallery: string[] = [];
  try { photoGallery = JSON.parse(room.images || '[]'); } catch(e) { photoGallery = room.image ? [room.image] : []; }
  
  let facList: string[] = [];
  try { facList = JSON.parse(room.facilities || '[]'); } catch(e) { facList = [room.facilities]; }
  
  let ruleList: string[] = [];
  try { ruleList = JSON.parse(room.rules || '[]'); } catch(e) { ruleList = [room.rules]; }

  const mainPhoto = photoGallery.length > 0 ? `${import.meta.env.VITE_API_URL}/${photoGallery[0]}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800';

  // --- PENENTUAN KOORDINAT PETA ---
  // Jika database memiliki titik koordinat aktual, gunakan. Jika tidak, gunakan Monas sebagai fallback.
  const mapCenter = {
    lat: room.latitude ? parseFloat(room.latitude) : -6.175392,
    lng: room.longitude ? parseFloat(room.longitude) : 106.827153
  };

  // --- ALGORITMA PENCARIAN KOST SERUPA ---
  const extractCity = (locStr: string) => {
      if(!locStr) return "";
      const parts = locStr.split(',');
      if(parts.length > 1) {
          return parts[parts.length - 1].trim().toLowerCase();
      }
      const spaces = locStr.split(' ');
      return spaces.length > 1 ? spaces[spaces.length - 1].toLowerCase() : locStr.toLowerCase();
  };

  const currentRoomCity = extractCity(room.location || room.address);

  const similarRooms = allRooms
    .filter(r => {
       if(r.id === room.id) return false;
       const otherRoomCity = extractCity(r.location || r.address);
       return otherRoomCity.includes(currentRoomCity) || currentRoomCity.includes(otherRoomCity);
    })
    .slice(0, 3); 

  const floorsData = room.floorsData || [];

  const calculateAverageRating = () => {
    if(reviews.length === 0) return "0.0";
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };
  const currentRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B35] transition-colors mb-6 text-sm mt-4">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          {/* ===== HEADER INFO ===== */}
          <div className="mb-6">
            <span className="px-3 py-1 bg-orange-100 text-[#FF6B35] rounded-full text-xs font-bold uppercase tracking-wider">
              Kost {room.gender}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2">{room.name}</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-5 h-5" />
              <span>{room.address || room.location}</span>
            </div>
          </div>

          {/* ===== GALERI FOTO ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 h-auto md:h-[450px]">
            <div className="md:col-span-2 aspect-[4/3] md:aspect-auto rounded-[32px] overflow-hidden bg-gray-100 h-full">
              <img src={mainPhoto} alt={room.name} className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:flex flex-col gap-4 h-full">
              {photoGallery.slice(1, 3).map((img, idx) => (
                <div key={idx} className="flex-1 rounded-[32px] overflow-hidden bg-gray-100">
                  <img src={`${import.meta.env.VITE_API_URL}/${img}`} alt={`Foto ${idx+2}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {photoGallery.length <= 1 && (
                <div className="flex-1 rounded-[32px] bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* KIRI: KONTEN UTAMA */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* --- SPESIFIKASI KAMAR --- */}
              <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#FF6B35]"/> Spesifikasi Kamar</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100 shadow-inner">
                    <Ruler className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                    <div className="text-xs text-gray-500 mb-1">Ukuran</div>
                    <div className="font-bold text-gray-900 text-sm">{room.room_size || '-'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100 shadow-inner">
                    <Users className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                    <div className="text-xs text-gray-500 mb-1">Kapasitas</div>
                    <div className="font-bold text-gray-900 text-sm">{room.capacity || '-'} Orang</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100 shadow-inner">
                    <Bath className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                    <div className="text-xs text-gray-500 mb-1">Kamar Mandi</div>
                    <div className="font-bold text-gray-900 text-sm">{room.bathroom_type || '-'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100 shadow-inner">
                    <Building className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                    <div className="text-xs text-gray-500 mb-1">Lantai</div>
                    <div className="font-bold text-gray-900 text-sm">{room.floor_range || '-'}</div>
                  </div>
                </div>
              </section>

              {/* --- KETERSSEDIAAN KAMAR --- */}
              <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Grip className="w-5 h-5 text-[#FF6B35]"/> Ketersediaan Kamar</h2>
                <div className="space-y-5">
                  {floorsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                      <DoorOpen className="w-10 h-10 text-gray-300 mb-3" />
                      <div className="text-sm text-gray-500 font-medium">Data ketersediaan kamar belum diatur oleh pemilik kos.</div>
                    </div>
                  ) : (
                    floorsData.map((avail: any, idx: number) => {
                      const availableCount = Math.max(0, avail.available_rooms); // MENCEGAH ANGKA MINUS
                      const totalCount = avail.total_rooms;
                      const occupiedCount = Math.min(totalCount, totalCount - availableCount); 
                      const percentage = totalCount > 0 ? (occupiedCount / totalCount) * 100 : 0;
                      const isFull = availableCount === 0;

                      return (
                        <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner hover:bg-orange-50/30 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-bold text-gray-900">{avail.floor_name}</div>
                              <div className="text-xs text-gray-500 mt-1">Total {totalCount} Kamar</div>
                            </div>
                            <div className="text-right">
                              {isFull ? (
                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold shadow-sm">Penuh</span>
                              ) : (
                                <div className="text-3xl font-bold text-[#FF6B35]">
                                  {availableCount} <span className="text-sm font-medium text-gray-500">Tersedia</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative border border-gray-100 shadow-inner">
                            <div 
                              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${isFull ? 'bg-red-500' : 'bg-[#FF6B35]'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 px-1 font-medium">
                            <span>Terisi: {occupiedCount}</span>
                            <span>Kapasitas: {totalCount}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5 bg-blue-50 p-2.5 rounded-lg border border-blue-100 text-blue-700">
                   <Clock className="w-3.5 h-3.5" /> Data ketersediaan bersifat real-time berdasarkan pemesanan yang telah disetujui.
                </p>
              </section>

              {/* --- DESKRIPSI KOST --- */}
              {room.description && (
                <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Kost</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{room.description}</p>
                </section>
              )}

              {/* --- FASILITAS KOST --- */}
              <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Fasilitas Kost</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facList.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner hover:border-orange-200 transition-colors">
                      {getFacilityIcon(fac)}
                      <span className="font-medium text-gray-800 text-sm">{fac}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* --- PERATURAN KOST --- */}
              {ruleList.length > 0 && ruleList[0] !== "" && (
                <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Peraturan Kost</h2>
                  <div className="space-y-3">
                    {ruleList.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner">
                        <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold border border-red-100">{idx+1}</div>
                        <p className="text-gray-600 pt-0.5 text-sm">{rule}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* --- LOKASI SEKITAR & PETA LEAFLET --- */}
              <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Lokasi Sekitar</h2>
                
                {/* Komponen Peta Leaflet */}
                <div className="w-full h-[300px] md:h-[400px] rounded-2xl mb-6 relative overflow-hidden border border-gray-200 shadow-inner z-0">
                  <MapContainer 
                    center={[mapCenter.lat, mapCenter.lng]} 
                    zoom={15} 
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[mapCenter.lat, mapCenter.lng]}>
                      <Popup>
                        <strong>{room.name}</strong><br/>
                        {room.address || room.location}
                      </Popup>
                    </Marker>
                  </MapContainer>
                  
                  {/* Badge Alamat Overlay */}
                  <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-sm font-bold text-[#FF6B35] flex items-center gap-2 border border-orange-100">
                    <MapPin className="w-4 h-4" /> {room.location || room.address}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 shadow-inner">
                    <Map className="w-5 h-5 text-[#FF6B35] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-sm text-gray-900 mb-1">Fasilitas Publik</div>
                      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        <li>Minimarket Terdekat</li>
                        <li>Halte Busway/Transportasi</li>
                        <li>ATM Center</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 shadow-inner">
                    <Building className="w-5 h-5 text-[#FF6B35] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-sm text-gray-900 mb-1">Area Penting</div>
                      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        <li>Kawasan Perkantoran</li>
                        <li>Pusat Pendidikan/Kampus</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- ULASAN PENGHUNI --- */}
              <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Ulasan Penghuni</h2>
                  <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200 shadow-inner">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-black text-gray-900">{currentRating}</span>
                    <span className="text-gray-500 text-sm font-medium border-l border-gray-300 pl-3">({reviews.length} Ulasan)</span>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {reviews.length === 0 ? (
                     <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        Belum ada ulasan untuk kos ini. Jadilah yang pertama memberikan penilaian setelah menginap!
                     </div>
                  ) : (
                     reviews.map((rev: any, i: number) => (
                      <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-orange-100 text-[#FF6B35] font-bold rounded-full flex items-center justify-center border border-orange-200">
                                {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                             </div>
                             <div>
                               <div className="font-bold text-sm text-gray-900">{rev.name || 'Pengguna Anonim'}</div>
                               <div className="text-[11px] text-gray-400 font-medium">{rev.date || 'Penghuni Kos'}</div>
                             </div>
                          </div>
                          <div className="flex gap-0.5 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                            {[...Array(5)].map((_, j) => (
                               <Star 
                                 key={j} 
                                 className={`w-3.5 h-3.5 ${j < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                               />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner">
                          "{rev.comment || 'Kos ini sangat direkomendasikan!'}"
                        </p>
                      </div>
                     ))
                  )}
                </div>
              </section>

            </div>

            {/* KANAN: SIDEBAR HARGA & PEMILIK */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Harga Sewa</div>
                    <div className="text-3xl font-bold text-[#FF6B35] flex items-baseline gap-1">
                      Rp {parseInt(room.price).toLocaleString('id-ID')}
                      <span className="text-base text-gray-500 font-normal"> / bln</span>
                    </div>
                  </div>
                  <Button onClick={() => setIsBookingOpen(true)} className="w-full rounded-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 py-7 text-lg font-bold mb-4 shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 hover:-translate-y-0.5">
                    Ajukan Sewa
                  </Button>
                  <p className="text-xs text-center text-gray-400 px-4 leading-relaxed">Pembayaran awal dan jadwal pindah dikoordinasikan setelah Anda menekan tombol di atas.</p>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Informasi Pemilik</h3>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#FF6B35] font-bold text-xl border border-orange-100 shadow-sm">
                      {room.owner_name ? room.owner_name.charAt(0).toUpperCase() : 'O'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{room.owner_name || 'Pemilik Kost'}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium bg-green-50 px-2 py-0.5 rounded-md w-fit border border-green-100">
                         <Clock className="w-3.5 h-3.5"/> Sangat Responsif
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full rounded-full border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-[#FF6B35] py-6 font-bold transition-all shadow-sm" 
                      onClick={async () => {
                        if (!user) {
                          alert("Silakan login terlebih dahulu untuk mengirim pesan.");
                          navigate('/');
                          return;
                        }
                        
                        if (user.email === room.owner_email) {
                          alert("Anda tidak bisa chat dengan kos milik sendiri.");
                          return;
                        }

                        try {
                          await fetch(`${import.meta.env.VITE_API_URL}/api/chats/initiate`, {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              'ngrok-skip-browser-warning': 'true'
                            },
                            body: JSON.stringify({ 
                              sender: user.email, 
                              receiver: room.owner_email,
                              message: `Halo, saya tertarik dengan kos ${room.name}. Apakah masih ada kamar kosong untuk saya?` 
                            })
                          });
                          
                          navigate('/kotak-masuk', { state: { activeChat: room.owner_email } });
                        } catch (err) {
                          console.error("Initiate chat error:", err);
                          alert("Gagal memulai obrolan dengan pemilik kos.");
                        }
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2 text-[#FF6B35]" /> Mulai Chat
                    </Button>
                    <div className="w-full rounded-full border border-gray-200 bg-gray-50 py-4 font-bold text-center text-sm text-gray-700 flex items-center justify-center shadow-inner">
                      <Phone className="w-4 h-4 mr-2 text-[#FF6B35]" /> {room.owner_phone || '-'}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ===== KOST SERUPA BERDASARKAN ALGORITMA KOTA/DAERAH ===== */}
          {similarRooms.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-900">Kost Serupa di Daerah {currentCityName(room.location || room.address)}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarRooms.map((simRoom: any) => {
                  let sFac: string[] = [];
                  try { sFac = JSON.parse(simRoom.facilities || '[]'); } catch(e) { sFac = []; }
                  const sImg = simRoom.image ? `${import.meta.env.VITE_API_URL}/${simRoom.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400';
                  
                  return (
                    <div key={simRoom.id} className="group bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <Link to={`/kost/${simRoom.id}`}>
                        <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                          <img src={sImg} alt={simRoom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#FF6B35] font-black rounded-lg px-3 py-1.5 text-xs shadow-sm border border-orange-100 uppercase tracking-widest">{simRoom.gender}</div>
                        </div>
                      </Link>
                      <div className="p-5 flex flex-col h-[180px]">
                        <Link to={`/kost/${simRoom.id}`}>
                          <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">{simRoom.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1.5 text-gray-500 mb-4 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> <span className="line-clamp-1">{simRoom.location}</span>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <div className="text-xl font-black text-[#FF6B35]">
                            Rp {parseInt(simRoom.price).toLocaleString('id-ID')} <span className="text-xs font-medium text-gray-400">/bulan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
      
      <BookingDialog 
        room={{
          id: room.id, 
          name: room.name, 
          price: room.price, 
          location: room.location,
          image: mainPhoto,
          paymentMethods: ['Visa', 'Mastercard', 'JCB', 'Transfer Bank'],
          availability: {
            floors: floorsData.map((f: any) => ({
              name: f.floor_name,
              availableRooms: f.available_rooms
            }))
          }
        }} 
        open={isBookingOpen} 
        onOpenChange={setIsBookingOpen} 
      />
    </div>
  );
}

function currentCityName(fullLocation: string) {
    if(!fullLocation) return "Sekitar Sini";
    const parts = fullLocation.split(',');
    if(parts.length > 1) {
        const city = parts[parts.length - 1].trim();
        return city.replace(/\b\w/g, c => c.toUpperCase());
    }
    const spaces = fullLocation.split(' ');
    return spaces.length > 1 ? spaces[spaces.length - 1].replace(/\b\w/g, c => c.toUpperCase()) : fullLocation;
}