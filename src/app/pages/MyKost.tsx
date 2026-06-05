import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, MapPin, Home, PlusCircle, Star, ExternalLink, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';

export function MyKost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myKosts, setMyKosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.email) {
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

  // ✅ LOGIKA BARU: Eksekutor Hapus Kos
  const handleDeleteKost = async (id: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus properti ini secara permanen? Data yang dihapus tidak dapat dikembalikan.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      
      if (res.ok) {
        // Hapus dari UI tanpa perlu refresh halaman
        setMyKosts(prev => prev.filter(k => k.id !== id));
      } else {
        alert('Gagal menghapus properti kos.');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi saat menghapus.');
    }
  };

  if (!user || isLoading) return null; 

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-28 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#FF6B35] transition-colors mb-6 font-medium text-sm">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">My Kost</h1>
            <p className="text-gray-500 text-sm md:text-base">Kelola properti kos yang sudah Anda tayangkan di SpotKos</p>
          </div>
          <Link to="/indekos-input">
            <Button className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 font-bold h-12 shadow-sm w-full md:w-auto">
              <PlusCircle className="w-5 h-5 mr-2" /> Daftarkan Kos Baru
            </Button>
          </Link>
        </div>

        {myKosts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
              <Home className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Properti</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              Anda belum memiliki kos yang terdaftar di platform kami. Mulai sewakan properti Anda sekarang untuk mendapatkan penghasilan.
            </p>
            <Link to="/indekos-input">
              <Button className="rounded-full bg-[#FF6B35] hover:bg-orange-600 px-8 h-12 font-bold shadow-md">Daftar Sekarang</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {myKosts.map((kost) => {
              const isExpanded = expandedId === kost.id;
              const mainPhoto = kost.image ? `${import.meta.env.VITE_API_URL}/${kost.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400';
              const ratingVal = parseFloat(kost.rating || 0).toFixed(1);

              return (
                <div key={kost.id} className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto flex-shrink-0 relative">
                      <img src={mainPhoto} alt={kost.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400')} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-900">{ratingVal}</span>
                        <span className="text-[10px] text-gray-500 font-medium">({kost.reviews_count || 0})</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{kost.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1.5 font-medium">
                              <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> <span className="line-clamp-1">{kost.location}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shrink-0 border shadow-sm ${
                            kost.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                            kost.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {kost.status === 'approved' ? 'Aktif' : kost.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
                        <div className="text-xl font-black text-[#FF6B35]">
                          Rp {parseInt(kost.price).toLocaleString('id-ID')} <span className="text-xs font-bold text-gray-400 uppercase">/ bulan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* ✅ TOMBOL HAPUS KOS */}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteKost(kost.id)}
                            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-10 px-3 transition-colors"
                            title="Hapus Properti"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          {/* ✅ TOMBOL LIHAT KOS (Ke Halaman Publikasi) */}
                          <Link to={`/kost/${kost.id}`}>
                            <Button variant="outline" size="sm" className="rounded-xl border-gray-300 font-bold text-gray-700 hover:bg-gray-50 h-10 px-4 transition-colors">
                              <ExternalLink className="w-4 h-4 mr-2" /> Lihat Kos
                            </Button>
                          </Link>

                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`rounded-xl h-10 px-4 font-bold transition-colors ${isExpanded ? 'bg-orange-50 text-[#FF6B35]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                            onClick={() => setExpandedId(isExpanded ? null : kost.id)}
                          >
                            {isExpanded ? <><ChevronUp className="w-4 h-4 mr-1.5" /> Tutup</> : <><ChevronDown className="w-4 h-4 mr-1.5" /> Detail</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ PENAMBAHAN KOTAK RATING DI DETAIL */}
                  {isExpanded && (
                    <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Ukuran Kamar</span>
                            <span className="font-bold text-gray-900">{kost.room_size || '-'}</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Jumlah Lantai</span>
                            <span className="font-bold text-gray-900">{kost.floor_range ? `${kost.floor_range} Lantai` : '-'}</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Kapasitas Maks</span>
                            <span className="font-bold text-gray-900">{kost.capacity || '-'}</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Peruntukan</span>
                            <span className="font-bold text-gray-900">{kost.gender || 'Campur'}</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Rating Review</span>
                            <span className="font-bold text-gray-900">{ratingVal} / 5.0</span>
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