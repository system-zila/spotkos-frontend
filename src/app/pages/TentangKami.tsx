import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function TentangKami() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-32 w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Tentang SpotKos</h1>
        <div className="w-24 h-24 bg-[#FF6B35] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/20">
           <span className="text-5xl">🏠</span>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          SpotKos didirikan pada tahun 2026 dengan visi untuk menyederhanakan proses pencarian dan penyewaan kos di seluruh Indonesia. Kami percaya bahwa setiap orang berhak mendapatkan tempat tinggal yang nyaman dengan cara yang transparan, mudah, dan aman.
        </p>
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl max-w-2xl mx-auto">
           <p className="text-gray-700 italic font-medium">"Misi kami adalah menghubungkan pencari kos dengan hunian idaman mereka secara digital, sekaligus memberdayakan pemilik kos lokal."</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}