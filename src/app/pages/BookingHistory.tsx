import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, MapPin, Calendar, Eye, Filter, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type BookingStatus = 'all' | 'confirmed' | 'pending' | 'cancelled';

interface BookingData {
  id: string;
  roomId: number;
  floorName: string;
  bookingDate: string;
  moveInDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  duration: number;
  roomName: string;
  roomLocation: string;
  roomImage: string;
}

const statusConfig = {
  confirmed: { label: 'Berhasil', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  pending: { label: 'Menunggu', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  cancelled: { label: 'Dibatalkan', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

export function BookingHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filter, setFilter] = useState<BookingStatus>('all');
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK MODAL REVIEW
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<BookingData | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const fetchBookings = () => {
    if (user?.email) {
      fetch(`${import.meta.env.VITE_API_URL}/api/bookings/user?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          const parsedBookings: BookingData[] = data.map((b: any) => {
            let uiStatus: 'confirmed' | 'pending' | 'cancelled' = 'pending';
            if (b.status === 'paid') uiStatus = 'confirmed';
            if (b.status === 'failed') uiStatus = 'cancelled';

            let finalImage = b.roomImage;
            if (!finalImage && b.roomImages) {
              const imagesArr = typeof b.roomImages === 'string' ? JSON.parse(b.roomImages) : b.roomImages;
              finalImage = imagesArr[0];
            }

            return { 
              id: b.booking_id || b.id, 
              roomId: b.roomId,
              floorName: b.floorName,
              bookingDate: b.bookingDate,
              moveInDate: b.moveInDate,
              status: uiStatus,
              totalPrice: b.totalPrice,
              duration: b.duration,
              roomName: b.roomName,
              roomLocation: b.roomLocation,
              roomImage: finalImage
            };
          });
          setBookings(parsedBookings);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handlePayment = async (booking: BookingData) => {
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/payment/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name,
          email: user?.email,
          phone: '08123456789', 
          amount: booking.totalPrice,
          kostName: booking.roomName
        })
      });
      const data = await response.json();
      
      if (data.token && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: async function() {
            try {
              await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${booking.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'paid',
                  roomId: booking.roomId,
                  floorName: booking.floorName
                })
              });
              alert("Pembayaran berhasil! Dana telah diteruskan ke pemilik kos.");
              fetchBookings(); 
            } catch (err) {
              console.error("Gagal update status DB", err);
            }
          },
          onPending: function() { alert("Menunggu pembayaran Anda!"); },
          onError: function() { alert("Pembayaran gagal!"); }
        });
      } else {
        alert("Sistem pembayaran belum siap.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  const submitReview = async () => {
    if(!reviewBooking) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${reviewBooking.roomId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            name: user?.name,
            rating: rating,
            comment: reviewComment,
            bookingId: reviewBooking.id
          })
      });
      
      const data = await res.json();
      if(res.ok) {
          alert('Terima kasih! Ulasan berhasil dikirim dan akan tampil di halaman Kos.');
          setReviewModalOpen(false);
      } else {
          alert(data.error || 'Gagal mengirim ulasan.');
      }
    } catch(e) {
      alert('Terjadi kesalahan server saat mengirim ulasan.');
    }
    setIsSubmittingReview(false);
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  if (isLoading || !user) return <div className="min-h-screen bg-background"><Navigation /><div className="pt-32 text-center">Memuat riwayat...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl mb-3">Riwayat Booking</h1>
            <p className="text-muted-foreground">Lihat dan pantau semua riwayat pemesanan kos Anda di SpotKos</p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-border">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg mb-2">Belum Ada Riwayat Booking</h3>
              <Link to="/"><Button className="rounded-xl bg-primary hover:bg-primary/90">Cari Kos Sekarang</Button></Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-border p-4 text-center">
                  <div className="text-3xl text-primary mb-1">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="bg-green-50 rounded-2xl border border-green-200 p-4 text-center">
                  <div className="text-3xl text-green-600 mb-1">{stats.confirmed}</div>
                  <div className="text-sm text-green-600/70">Berhasil</div>
                </div>
                <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-4 text-center">
                  <div className="text-3xl text-yellow-600 mb-1">{stats.pending}</div>
                  <div className="text-sm text-yellow-600/70">Menunggu</div>
                </div>
                <div className="bg-red-50 rounded-2xl border border-red-200 p-4 text-center">
                  <div className="text-3xl text-red-600 mb-1">{stats.cancelled}</div>
                  <div className="text-sm text-red-600/70">Dibatalkan</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === status ? 'bg-[#FF6B35] text-white' : 'bg-white border border-border hover:border-[#FF6B35]/50'
                    }`}
                  >
                    {status === 'all' ? 'Semua' : statusConfig[status].label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-border">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg mb-2">Tidak Ada Booking</h3>
                  </div>
                ) : (
                  filteredBookings.map((booking) => {
                    const config = statusConfig[booking.status];
                    const StatusIcon = config.icon;

                    return (
                      <div key={booking.id} className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                            <ImageWithFallback src={booking.roomImage} alt={booking.roomName} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1 p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                              <div>
                                <h3 className="text-lg mb-1 font-bold">{booking.roomName}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                  <MapPin className="w-4 h-4" /><span>{booking.roomLocation}</span>
                                </div>
                              </div>
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.border} border`}>
                                <StatusIcon className={`w-4 h-4 ${config.color}`} />
                                <span className={config.color}>{config.label}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4 bg-gray-50 p-4 rounded-2xl">
                              <div><span className="text-muted-foreground block text-xs mb-1">No. Invoice</span><span className="font-semibold text-gray-900">{booking.id || '-'}</span></div>
                              <div><span className="text-muted-foreground block text-xs mb-1">Tgl Booking</span><span className="font-semibold text-gray-900">{booking.bookingDate}</span></div>
                              <div><span className="text-muted-foreground block text-xs mb-1">Tgl Masuk</span><span className="font-semibold text-gray-900">{booking.moveInDate}</span></div>
                              <div><span className="text-muted-foreground block text-xs mb-1">Total Harga</span><span className="font-bold text-[#FF6B35]">Rp {booking.totalPrice.toLocaleString('id-ID')}</span></div>
                            </div>

                            {booking.status === 'pending' && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex items-start md:items-center justify-between flex-col md:flex-row gap-3">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5 md:mt-0" />
                                  <div>
                                    <p className="text-sm font-bold text-yellow-800">Selesaikan Pembayaran</p>
                                    <p className="text-xs text-yellow-700">Segera selesaikan pembayaran agar kamar tidak otomatis dibatalkan oleh sistem.</p>
                                  </div>
                                </div>
                                <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white whitespace-nowrap w-full md:w-auto" onClick={() => handlePayment(booking)}>
                                  Bayar Sekarang
                                </Button>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 flex-wrap">
                              {/* TOMBOL REVIEW HANYA MUNCUL JIKA BOOKING SUDAH BERHASIL DIBAYAR */}
                              {booking.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold"
                                  onClick={() => {
                                    setReviewBooking(booking);
                                    setRating(5);
                                    setReviewComment('');
                                    setReviewModalOpen(true);
                                  }}
                                >
                                  <Star className="w-4 h-4 mr-1.5 fill-current" /> Berikan Ulasan
                                </Button>
                              )}

                              {booking.roomId && (
                                <Link to={`/kost/${booking.roomId}`}>
                                  <Button size="sm" variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                                    <Eye className="w-4 h-4 mr-1.5" /> Lihat Detail Kos
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ==================== MODAL REVIEW ==================== */}
      {reviewModalOpen && reviewBooking && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-[#FF6B35]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Berikan Ulasan</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Bagaimana pengalaman Anda menginap di <span className="font-bold text-gray-800">{reviewBooking.roomName}</span>?</p>

            <div className="flex justify-center gap-2 mb-6 bg-gray-50 py-4 rounded-2xl border border-gray-100">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} className="hover:scale-110 transition-transform">
                  <Star className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>

            <textarea
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 outline-none min-h-[120px] mb-6 resize-none"
              placeholder="Ceritakan pengalaman Anda (kenyamanan, kebersihan, fasilitas, pelayanan pemilik, dll)..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
            />

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold text-gray-600 hover:bg-gray-50" onClick={() => setReviewModalOpen(false)}>Batal</Button>
              <Button className="flex-1 bg-[#FF6B35] text-white rounded-xl h-12 font-bold hover:bg-[#FF6B35]/90 shadow-md" onClick={submitReview} disabled={isSubmittingReview}>
                {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}