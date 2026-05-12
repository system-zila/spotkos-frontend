import { Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  occupation: string;
  rating: number;
  review: string;
  roomName: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Putri',
    avatar: 'https://images.unsplash.com/photo-1525786210598-d527194d3e9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc21pbGluZ3xlbnwxfHx8fDE3NzI5NTc3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occupation: 'Mahasiswa UI',
    rating: 5,
    review: 'Sangat puas dengan SpotKos! Prosesnya cepat dan mudah. Kamar yang saya dapat sesuai dengan foto dan sangat nyaman. Recommended!',
    roomName: 'Kost Melati Residence'
  },
  {
    id: 2,
    name: 'Andi Wijaya',
    avatar: 'https://images.unsplash.com/flagged/photo-1596479042555-9265a7fa7983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzAxNzY1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    occupation: 'Pekerja Kantoran',
    rating: 5,
    review: 'Platform terbaik untuk cari kost! Filternya lengkap dan harga transparan. Sudah 6 bulan tinggal di kost yang saya temukan di sini, very satisfied!',
    roomName: 'Kost Permata Hijau'
  },
  {
    id: 3,
    name: 'Dina Kusuma',
    avatar: 'https://images.unsplash.com/photo-1552900651-b2a53060a085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0dWRlbnQlMjB3b21hbnxlbnwxfHx8fDE3NzMwNjMxODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    occupation: 'Mahasiswa ITB',
    rating: 5,
    review: 'Awalnya ragu cari kost online, tapi SpotKos bikin segalanya mudah. Customer service responsif dan membantu. Thank you SpotKos!',
    roomName: 'Kost Asri Residence'
  }
];

export function Testimonials() {
  return (
    <div id="testimonials">
      <div className="text-center mb-12">
        <h2 className="text-4xl mb-3">Apa Kata Mereka?</h2>
        <p className="text-muted-foreground text-lg">Testimoni dari pengguna yang puas dengan SpotKos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>

            {/* Review */}
            <p className="text-foreground mb-6 leading-relaxed">
              "{testimonial.review}"
            </p>

            {/* Room Name */}
            <div className="mb-4 pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Kost: </span>
              <span className="text-sm text-primary font-medium">{testimonial.roomName}</span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.occupation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl text-primary mb-1">4.8</div>
          <div className="text-sm text-muted-foreground">Rating Rata-rata</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">💬</div>
          <div className="text-2xl text-primary mb-1">15K+</div>
          <div className="text-sm text-muted-foreground">Review Positif</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl text-primary mb-1">98%</div>
          <div className="text-sm text-muted-foreground">Kepuasan Pelanggan</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">🔒</div>
          <div className="text-2xl text-primary mb-1">100%</div>
          <div className="text-sm text-muted-foreground">Aman & Terpercaya</div>
        </div>
      </div>
    </div>
  );
}