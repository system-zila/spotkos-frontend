import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router';

export function PopularCities() {
  const cities = [
    {
      name: 'Jakarta',
      available: '1.234',
      image: 'https://images.unsplash.com/photo-1680244116826-467f252cf503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWthcnRhJTIwY2l0eSUyMHNreWxpbmUlMjBJbmRvbmVzaWF8ZW58MXx8fHwxNzczMDY5MDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Bandung',
      available: '876',
      image: 'https://images.unsplash.com/photo-1707993467310-a5b2bb858d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYW5kdW5nJTIwY2l0eSUyMHNreWxpbmUlMjBnZWR1bmclMjBzYXRlfGVufDF8fHx8MTc3NjE2Njg1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Yogyakarta',
      available: '654',
      image: 'https://images.unsplash.com/photo-1619934958564-78898c5906f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxZb2d5YWthcnRhJTIwSW5kb25lc2lhJTIwdGVtcGxlfGVufDF8fHx8MTc3MzA2OTA0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Surabaya',
      available: '923',
      image: 'https://images.unsplash.com/photo-1689304806212-5b17ef28d246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTdXJhYmF5YSUyMGNpdHklMjBJbmRvbmVzaWF8ZW58MXx8fHwxNzcyOTY1ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Malang',
      available: '542',
      image: 'https://images.unsplash.com/photo-1559628151-ef85aab5bb21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxhbmclMjBjaXR5JTIwSW5kb25lc2lhJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczMDY5MDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Semarang',
      available: '432',
      image: 'https://images.unsplash.com/photo-1657594873796-4a121883192a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW1hcmFuZyUyMEluZG9uZXNpYSUyMGNpdHl8ZW58MXx8fHwxNzczMDY5MDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <section id="kota-populer" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Kota Populer</h2>
          <p className="text-muted-foreground text-lg">
            Temukan kos terbaik di kota-kota besar Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <Link
              key={index}
              to={`/kota/${encodeURIComponent(city.name)}`}
              className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl mb-1">{city.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}