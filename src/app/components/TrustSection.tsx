import { Shield, DollarSign, ThumbsUp, MapPin } from 'lucide-react';

export function TrustSection() {
  const features = [
    {
      icon: Shield,
      title: 'Kos Terverifikasi',
      description: 'Semua kos diverifikasi untuk memastikan informasi yang akurat.',
    },
    {
      icon: DollarSign,
      title: 'Harga Transparan',
      description: 'Tidak ada biaya tersembunyi, semua harga ditampilkan secara jelas.',
    },
    {
      icon: ThumbsUp,
      title: 'Rekomendasi Terbaik',
      description: 'Sistem membantu menemukan kos yang sesuai dengan kebutuhan pengguna.',
    },
    {
      icon: MapPin,
      title: 'Lokasi Strategis',
      description: 'Temukan kos dekat kampus, kantor, dan transportasi umum.',
    },
  ];

  return (
    // Penambahan id="trust" di sini agar bisa dipanggil oleh menu Footer
    <section id="trust" className="py-16 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}