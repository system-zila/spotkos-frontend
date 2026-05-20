import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import {
  ArrowLeft, MapPin, Calendar, ChevronDown, ChevronUp,
  Home, PlusCircle, Clock, Receipt,
} from 'lucide-react';

export function MyKost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myKosts, setMyKosts] = useState<any[]>([]); // State untuk data dari MySQL
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // === LOGIKA KICK UNTUK YANG BELUM LOGIN ===
  useEffect(() => {
    if (!user) {
      navigate('/'); // Tendang kembali ke halaman utama
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.email) {
      // ✅ FIX: Tambahkan header bypass ngrok
      fetch(`${import.meta.env.VITE_API_URL}/api/rooms/my-kosts?email=${user.email}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.error) setMyKosts(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Gagal tarik data kos:", err);
          setIsLoading(false);
        });
    }
  }, [user]);

  // Mencegah halaman membocorkan UI jika user belum login atau sedang loading
  if (!user || isLoading) return null; 

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-28 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-medium text-gray-900 mb-2">My Kost</h1>
            <p className="text-muted-foreground">Kelola properti kos yang sudah Anda tayangkan di SpotKos</p>
          </div>
          <Link to="/indekos-input">
            <Button className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90">
              <PlusCircle className="w-4 h-4 mr-2" /> Daftarkan Kos Baru
            </Button>
          </Link>
        </div>

        {myKosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
            <Home className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Belum Ada Properti</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Anda belum memiliki kos yang terdaftar. Mulai sewakan properti Anda sekarang.
            </p>
            <Link to="/indekos-input">
              <Button className="rounded-full bg-[#FF6B35] px-8">Daftar Sekarang</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myKosts.map((kost) => {
              const isExpanded = expandedId === kost.id;
              // Mengambil gambar dari backend, jika kosong pakai fallback
              const mainPhoto = kost.image ? `${import.meta.env.VITE_API_URL}/${kost.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400';

              return (
                <div key={kost.id} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-56 h-40 md:h-auto flex-shrink-0">
                      <img src={mainPhoto} alt={kost.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-medium text-gray-900">{kost.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {kost.location}
                          </div>
                        </div>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          kost.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {kost.status === 'approved' ? 'Aktif' : 'Menunggu'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-lg font-bold text-[#FF6B35]">
                          Rp {parseInt(kost.price).toLocaleString('id-ID')} <span className="text-xs font-normal text-muted-foreground">/ bulan</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#FF6B35] hover:bg-orange-50 rounded-xl"
                          onClick={() => setExpandedId(isExpanded ? null : kost.id)}
                        >
                          {isExpanded ? 'Tutup Detail' : 'Lihat Detail'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 bg-[#faf9f6] border-t border-gray-50">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-xs uppercase">Ukuran</span>
                            <span className="font-medium">{kost.room_size || '-'}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-xs uppercase">Lantai</span>
                            <span className="font-medium">{kost.floor_range || '-'}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-xs uppercase">Kamar Mandi</span>
                            <span className="font-medium">{kost.bathroom_type || '-'}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-xs uppercase">Kapasitas</span>
                            <span className="font-medium">{kost.capacity || '-'}</span>
                          </div>
                       </div>
                    </div>
                  )}
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