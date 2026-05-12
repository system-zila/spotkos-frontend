import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function KebijakanPrivasi() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-32 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Kebijakan Privasi</h1>
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-gray-600 leading-relaxed space-y-6">
          <p className="text-lg">Privasi Anda adalah prioritas utama SpotKos. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.</p>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Pengumpulan Data</h3>
            <p>Kami mengumpulkan informasi identitas seperti nama, alamat email, nomor telepon, dan data kartu identitas (khusus verifikasi pemilik kos) untuk keperluan legalitas.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Penggunaan Data</h3>
            <p>Data Anda digunakan semata-mata untuk meningkatkan layanan, memfasilitasi komunikasi in-app antara pencari dan pemilik kos, serta memproses pembayaran secara transparan.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Keamanan Enkripsi</h3>
            <p>Kami menerapkan standar keamanan enkripsi terkini dan tidak pernah menjual atau membagikan data pribadi Anda kepada pihak ketiga untuk kepentingan komersial.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}