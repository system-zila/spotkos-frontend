import { Search, Filter, MessageCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: Search,
      title: 'Cari Lokasi',
      description: 'Masukkan kota atau area yang ingin kamu tinggali.',
    },
    {
      number: '2',
      icon: Filter,
      title: 'Pilih Kos Terbaik',
      description: 'Gunakan filter harga, fasilitas, dan lokasi.',
    },
    {
      number: '3',
      icon: MessageCircle,
      title: 'Hubungi Pemilik Kos',
      description: 'Dapatkan informasi lebih lanjut dengan mudah.',
    },
  ];

  return (
    // Penambahan id="cara-kerja" agar terhubung dengan Footer
    <section id="cara-kerja" className="py-16 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 font-bold text-gray-900">Cara SpotKos Bekerja</h2>
          <p className="text-muted-foreground text-lg">
            Temukan kos impian kamu dalam 3 langkah mudah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-primary/20" />
              )}

              {/* Step Card */}
              <div className="relative bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
                  <step.icon className="w-9 h-9 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-primary font-bold">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}