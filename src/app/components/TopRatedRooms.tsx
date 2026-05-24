import { Star, MapPin, Wifi, Wind, CreditCard } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SearchFilters } from './SearchBar';
import { useState, useEffect } from 'react';

interface TopRatedRoomsProps {
  filters?: SearchFilters | null;
}

export function TopRatedRooms({ filters }: TopRatedRoomsProps) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // MENGAMBIL DATA KOS DARI MYSQL (DENGAN FORMAT API BARU)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Pemetaan data yang disesuaikan dengan query API baru
        const parsedRooms = data.map((room: any) => ({
          id: room.id,
          name: room.name,
          location: room.location,
          address: room.address || room.location,
          price: parseInt(room.price) || 0,
          rating: parseFloat(room.rating) || 0,
          gender: room.gender,
          // Tangkap URL gambar dengan prefix localhost
          image: room.image ? `${import.meta.env.VITE_API_URL}/${room.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
          facilities: typeof room.facilities === 'string' ? JSON.parse(room.facilities || '[]') : room.facilities || [],
          // Tangkap hasil kalkulasi kamar dari backend
          sisaKamar: parseInt(room.sisa_kamar) || 0,
          totalKamar: parseInt(room.total_kamar) || 0,
          paymentMethods: ['Visa', 'Mastercard', 'JCB'] // Template bawaan untuk UI
        }));
        setRooms(parsedRooms);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching rooms:", err);
        setIsLoading(false);
      });
  }, []);

  // Filter logika
  const filteredRooms = rooms.filter((room) => {
    if (!filters) return true;

    if (filters.location) {
      const query = filters.location.toLowerCase();
      const matchesLocation = room.location?.toLowerCase().includes(query);
      const matchesName = room.name?.toLowerCase().includes(query);
      const matchesAddress = room.address?.toLowerCase().includes(query);
      if (!matchesLocation && !matchesName && !matchesAddress) return false;
    }

    if (room.price < filters.priceRange[0] || room.price > filters.priceRange[1]) return false;

    if (filters.facilities.length > 0) {
      const hasAllFacilities = filters.facilities.every((facility: string) =>
        room.facilities.includes(facility)
      );
      if (!hasAllFacilities) return false;
    }

    if (filters.gender && filters.gender !== 'all' && room.gender !== filters.gender) return false;

    return true;
  });

  const isFiltered = filters && (filters.location || filters.facilities.length > 0 || (filters.gender && filters.gender !== 'all') || filters.priceRange[0] !== 500000 || filters.priceRange[1] !== 5000000);

  if (isLoading) {
    return <div className="text-center py-20 text-muted-foreground">Memuat daftar kos...</div>;
  }

  return (
    <>
      <div id="rekomendasi">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              {isFiltered ? 'Hasil Pencarian' : 'Rekomendasi Kos Terbaik'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {filteredRooms.length > 0 
                ? `Ditemukan ${filteredRooms.length} kos yang sesuai`
                : 'Pilihan favorit dengan rating tertinggi'}
            </p>
          </div>
          <Link to="/cari-kos">
            <Button variant="outline" className="rounded-full font-bold">Lihat Semua</Button>
          </Link>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold mb-2">Tidak Ada Kos yang Ditemukan</h3>
            <p className="text-muted-foreground text-sm">
              Coba ubah filter pencarian Anda atau jelajahi daerah lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRooms.slice(0, 4).map((room) => (
              <div key={room.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
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
                    <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {room.gender}
                    </Badge>
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
    </>
  );
}