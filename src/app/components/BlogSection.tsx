import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BlogSection() {
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/articles`)
      .then(res => res.json())
      .then(data => {
        // Hanya mengambil 4 artikel terbaru untuk ditampilkan di Beranda
        setRecentArticles(data.slice(0, 4));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    // Penambahan id="artikel" agar terhubung dengan Footer
    <section id="artikel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl mb-2 font-bold text-gray-900">Artikel & Tips</h2>
          <p className="text-muted-foreground text-lg">
            Informasi berguna untuk pengalaman ngekos yang lebih baik
          </p>
        </div>
        <Link
          to="/artikel"
          className="hidden md:flex items-center gap-2 text-[#FF6B35] hover:gap-3 transition-all font-bold"
        >
          Lihat Semua Artikel
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground font-medium">Memuat artikel...</div>
      ) : recentArticles.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-gray-200 rounded-3xl font-medium">Belum ada artikel di database.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentArticles.map((article) => (
            <Link
              key={article.id}
              to={`/artikel/${article.id}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-border flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="inline-block px-2.5 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-xs font-bold uppercase tracking-wider">
                    {article.category}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{article.readTime}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-[#FF6B35] text-gray-900 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <span className="text-xs text-muted-foreground font-medium">{article.date}</span>
                  <div className="flex items-center gap-1 text-[#FF6B35] text-sm font-bold group-hover:gap-2 transition-all">
                    Baca
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/artikel"
        className="md:hidden mt-8 flex items-center justify-center gap-2 text-[#FF6B35] font-bold w-full py-3.5 border-2 border-[#FF6B35]/20 rounded-2xl hover:bg-[#FF6B35]/5 transition-colors"
      >
        Lihat Semua Artikel
        <ArrowRight className="w-5 h-5" />
      </Link>
    </section>
  );
}