import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  ArrowLeft, ArrowRight, Search, Filter, FileText,
  Calendar,
} from 'lucide-react';

export function Articles() {
  // Menggunakan state kosong di awal, bukan dari file dummy
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // PRIORITAS 1: Ambil data asli dari MySQL saat halaman dimuat
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();
        setAllArticles(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter artikel berdasarkan pencarian dan kategori (Data Real)
  const filteredArticles = allArticles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Ambil kategori unik langsung dari data database
  const uniqueCategories = [...new Set(allArticles.map((a) => a.category))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl mb-3">Artikel & Tips</h1>
              <p className="text-muted-foreground">
                Informasi berguna untuk pengalaman ngekos yang lebih baik dari database SpotKos.
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari artikel dari database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-border outline-none focus:border-primary text-sm shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-[#FF6B35] text-white' : 'bg-white border border-border hover:border-[#FF6B35]/50'
                }`}
              >
                Semua
              </button>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat ? 'bg-[#FF6B35] text-white' : 'bg-white border border-border hover:border-[#FF6B35]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {isLoading ? (
             <div className="text-center py-20">Memuat artikel...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-border">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg mb-2 text-gray-900 font-semibold">Tidak Ada Artikel</h3>
              <p className="text-muted-foreground">Belum ada artikel di database yang sesuai dengan pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/artikel/${article.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-xs font-bold uppercase tracking-wider">
                        {article.category}
                      </div>
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#FF6B35] text-sm font-semibold group-hover:gap-3 transition-all">
                        Baca
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}