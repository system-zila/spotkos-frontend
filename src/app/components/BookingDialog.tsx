import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from './ui/button';
import { Clock, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BookingDialogProps {
  room: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DURATION_OPTIONS = [
  { label: '1 Bulan', value: 1, discount: 0 },
  { label: '3 Bulan', value: 3, discount: 5 },
  { label: '6 Bulan', value: 6, discount: 10 },
  { label: '12 Bulan', value: 12, discount: 15 },
];

export function BookingDialog({ room, open, onOpenChange }: BookingDialogProps) {
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(1);
  const [moveInDate, setMoveInDate] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  
  const today = new Date().toISOString().split('T')[0];

  const selectedDuration = DURATION_OPTIONS.find((d) => d.value === duration)!;
  
  // LOGIKA KALKULASI HARGA BARU (Ditanggung Penyewa)
  const subtotal = room ? room.price * duration : 0;
  const discountAmount = Math.round(subtotal * (selectedDuration.discount / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  const ppnAmount = Math.round(subtotalAfterDiscount * 0.11); // PPN 11%
  const serviceFee = 25000; // Biaya Admin
  
  // Total yang harus dibayar penyewa via Midtrans
  const totalPrice = subtotalAfterDiscount + ppnAmount + serviceFee;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveInDate || !selectedFloor) {
      alert('Mohon lengkapi Tanggal Masuk dan Lantai!');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. SIMPAN DATA KE MYSQL
      const dbRes = await fetch('${import.meta.env.VITE_API_URL}/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          roomId: room.id,
          floorName: selectedFloor,
          checkInDate: moveInDate,
          duration: duration,
          totalPrice: totalPrice
        })
      });
      const dbData = await dbRes.json();
      
      if (!dbRes.ok) throw new Error('Gagal menyimpan pesanan ke database');
      const invoiceId = dbData.id || dbData.invoiceId; 

      // 2. MINTA TOKEN MIDTRANS KE BACKEND
      const tokenRes = await fetch('${import.meta.env.VITE_API_URL}/api/payment/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          phone: "081234567890", 
          amount: totalPrice,
          kostName: room.name
        }),
      });

      const data = await tokenRes.json();

      if (data.token) {
        // 3. TUTUP DIALOG BOOKING AGAR KUNCI LAYAR TERLEPAS
        onOpenChange(false);
        setIsProcessing(false);

        // 4. BERI JEDA AGAR UI SELESAI TERTUTUP, BARU PANGGIL MIDTRANS
        setTimeout(() => {
          // @ts-ignore
          window.snap.pay(data.token, {
            onSuccess: async function () {
              await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${invoiceId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'paid', roomId: room.id, floorName: selectedFloor })
              });
              window.location.href = '/booking-history';
            },
            onPending: function () {
              window.location.href = '/booking-history';
            },
            onError: async function () {
              await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${invoiceId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'failed' })
              });
              window.location.href = '/booking-history';
            },
            onClose: async function () {
              await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${invoiceId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'failed' })
              });
              window.location.href = '/booking-history';
            }
          });
        }, 500); 
        
      } else {
        alert('Gagal mendapatkan token dari payment gateway.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Terjadi kesalahan koneksi ke server.');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setDuration(1);
      setMoveInDate('');
      setSelectedFloor('');
      setIsProcessing(false);
    }, 200);
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined}>
        <VisuallyHidden.Root><DialogTitle>Booking Kost</DialogTitle></VisuallyHidden.Root>

        {/* Header Dialog */}
        <div className="bg-[#002855] text-white px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-bold">Detail Booking</h3>
              <p className="text-white/60 text-xs mt-0.5">{room.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <ShieldCheck className="w-4 h-4" /><span>Secure Gateway</span>
          </div>
        </div>

        <div className="px-6 py-5">
          {isProcessing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-[#FF6B35] animate-spin mb-4" />
              <h3 className="text-lg font-bold mb-2">Menyiapkan Payment Gateway...</h3>
              <p className="text-gray-500 text-sm max-w-[250px]">Mohon tunggu sebentar, Anda akan diarahkan ke halaman pembayaran aman Midtrans.</p>
            </div>
          ) : (
            <form onSubmit={handlePayNow} className="space-y-5">
              <div className="bg-secondary/50 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Data Pemesan</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35] text-sm font-bold border border-orange-100">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@email.com'}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-xs mb-1.5 block font-bold">Tanggal Masuk</label>
                <input 
                  type="date" min={today} required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm outline-none focus:border-[#FF6B35] transition-colors"
                  value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-700 text-xs mb-1.5 block font-bold">Pilih Kamar / Lantai</label>
                <select 
                  required value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm outline-none focus:border-[#FF6B35] transition-colors"
                >
                  <option value="" disabled>-- Pilih Lantai --</option>
                  {room?.availability?.floors?.map((floor: any, index: number) => (
                    <option key={index} value={floor.name}>{floor.name} ({floor.availableRooms} kamar tersedia)</option>
                  )) || <option value="Lantai 1">Lantai 1</option>}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800">
                  <Clock className="w-4 h-4 text-[#FF6B35]" /> Durasi Sewa
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value} type="button" onClick={() => setDuration(opt.value)}
                      className={`relative p-3 rounded-xl border-2 text-left transition-all shadow-sm ${
                        duration === opt.value ? 'border-[#FF6B35] bg-orange-50/50' : 'border-gray-200 hover:border-[#FF6B35]/40 bg-white'
                      }`}
                    >
                      <span className="text-sm font-bold block text-gray-800">{opt.label}</span>
                      {opt.discount > 0 && <span className="text-xs text-green-600 font-bold block mt-0.5">Hemat {opt.discount}%</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 font-medium">Subtotal ({duration} bln)</span><span className="font-bold text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-green-600"><span className="font-medium">Diskon {selectedDuration.discount}%</span><span className="font-bold">-Rp {discountAmount.toLocaleString('id-ID')}</span></div>}
                
                {/* BARIS PPN 11% */}
                <div className="flex justify-between"><span className="text-gray-500 font-medium">PPN (11%)</span><span className="font-bold text-gray-800">Rp {ppnAmount.toLocaleString('id-ID')}</span></div>
                
                <div className="flex justify-between"><span className="text-gray-500 font-medium">Biaya Layanan Aplikasi</span><span className="font-bold text-gray-800">Rp {serviceFee.toLocaleString('id-ID')}</span></div>
                
                <div className="flex justify-between pt-3 mt-3 border-t border-dashed border-gray-200 text-base font-bold bg-orange-50/30 -mx-2 px-2 pb-2 rounded-lg">
                  <span className="text-gray-900 mt-1">Total Pembayaran</span><span className="text-[#FF6B35] text-lg">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <Button type="submit" disabled={isProcessing} className="w-full rounded-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white mt-2 py-6 text-lg font-bold shadow-lg shadow-[#FF6B35]/20">
                Pesan Kost Sekarang <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}