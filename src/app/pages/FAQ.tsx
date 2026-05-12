import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function FAQ() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-32 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions (FAQ)</h1>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-[#FF6B35]">Bagaimana cara memesan kos di SpotKos?</h3>
            <p className="text-gray-600">Cari kos yang Anda inginkan, klik "Lihat Detail", lalu tekan tombol "Ajukan Sewa". Anda akan diarahkan ke sistem pembayaran aman kami melalui Midtrans.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-[#FF6B35]">Apakah pembayaran di SpotKos aman?</h3>
            <p className="text-gray-600">Sangat aman. Kami menggunakan sistem payment gateway pihak ketiga yang terverifikasi (OJK) dan dana akan diteruskan ke pemilik kos secara transparan.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-[#FF6B35]">Bagaimana jika saya ingin membatalkan pesanan?</h3>
            <p className="text-gray-600">Pembatalan dapat dilakukan melalui halaman "Riwayat Booking" dengan syarat dan ketentuan pengembalian dana yang berlaku sesuai kebijakan pemilik kos.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-[#FF6B35]">Apakah saya bisa chat pemilik kos sebelum menyewa?</h3>
            <p className="text-gray-600">Bisa! Anda cukup menekan tombol "Mulai Chat" di halaman detail kos untuk berkomunikasi langsung dengan pemilik kos tersebut.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}