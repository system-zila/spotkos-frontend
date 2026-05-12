import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function SyaratKetentuan() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-32 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Syarat & Ketentuan Layanan</h1>
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-gray-600 leading-relaxed space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">1. Pendahuluan</h3>
            <p>Dengan mendaftar, mengakses, dan menggunakan aplikasi SpotKos, Anda menyatakan telah membaca, memahami, dan setuju untuk terikat oleh Syarat & Ketentuan ini.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">2. Akun Pengguna</h3>
            <p>Pengguna wajib memberikan informasi yang akurat dan valid saat mendaftar. Kerahasiaan kata sandi dan seluruh aktivitas akun merupakan tanggung jawab penuh pengguna.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">3. Kewajiban Pemilik Kos</h3>
            <p>Pemilik kos bertanggung jawab penuh atas keakuratan foto, informasi kos, fasilitas, dan ketersediaan kamar yang dicantumkan. Pelanggaran dapat mengakibatkan pembekuan akun.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">4. Transaksi & Biaya</h3>
            <p>SpotKos memfasilitasi transaksi pembayaran sewa antara pencari dan pemilik kos. Platform mengenakan PPN 11% dan Biaya Layanan Aplikasi kepada pihak penyewa.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}