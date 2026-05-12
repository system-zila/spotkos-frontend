import { Button } from './ui/button';
import { Search } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl mb-6">
          Temukan Kos yang Tepat untuk Anda Hari Ini
        </h2>
        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Ribuan pilihan kos terbaik di seluruh Indonesia menunggu Anda. Mulai pencarian sekarang dan temukan hunian impian Anda.
        </p>
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90 shadow-lg h-14 px-8 text-lg rounded-full"
        >
          <Search className="w-5 h-5 mr-2" />
          Mulai Cari Kos
        </Button>
      </div>
    </section>
  );
}
