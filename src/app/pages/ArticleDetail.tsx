import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react'; // TAMBAHKAN useState
import { ArrowLeft, Clock, Calendar, User, Facebook, Twitter, Link2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function ArticleDetail() {
  const { id } = useParams();
  
  // 1. BUAT STATE UNTUK MENAMPUNG SEMUA ARTIKEL DAN ARTIKEL SPESIFIK
  const [articlesData, setArticlesData] = useState<any[]>([]);
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. FETCH DATA DARI MYSQL
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    setIsLoading(true);

    fetch('http://localhost:5000/api/articles')
      .then(res => res.json())
      .then(data => {
        // Karena MySQL mengembalikan string JSON untuk kolom 'content', 
        // kita perlu melakukan parsing (JSON.parse) agar formatnya kembali menjadi Object
        const parsedData = data.map((item: any) => ({
          ...item,
          content: typeof item.content === 'string' ? JSON.parse(item.content) : item.content
        }));

        setArticlesData(parsedData);
        // Cari artikel spesifik berdasarkan ID dari URL
        const foundArticle = parsedData.find((a: any) => a.id.toString() === id);
        setArticle(foundArticle);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil artikel:", err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat artikel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Maaf, artikel yang Anda cari tidak ditemukan.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'copy':
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          textArea.remove();
          const button = document.activeElement;
          if (button instanceof HTMLElement) {
            const originalText = button.innerHTML;
            button.innerHTML = '✓ Disalin!';
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          }
        } catch (err) {
          console.error('Failed to copy:', err);
          textArea.remove();
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Article Header */}
      <article className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </Link>

          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm mb-6">
            {article.category || 'Tips & Trik'}
          </div>

          <h1 className="text-4xl md:text-5xl mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{article.author || 'Tim SpotKos'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date(article.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{article.readTime || '5 menit'} baca</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
            <span className="text-sm text-muted-foreground">Bagikan:</span>
            <button onClick={() => handleShare('facebook')} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </button>
            <button onClick={() => handleShare('twitter')} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </button>
            <button onClick={() => handleShare('copy')} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
              <Link2 className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </button>
          </div>

          <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12">
            <ImageWithFallback
              src={article.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed mb-8 text-foreground/90">
              {article.content?.intro}
            </p>

            {article.content?.sections?.map((section: any, index: number) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl md:text-3xl mb-4">{section.heading}</h2>
                <p className="text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}

            {article.content?.conclusion && (
              <div className="mt-12 p-8 bg-secondary/50 rounded-3xl border-l-4 border-primary">
                <h3 className="text-2xl mb-4">Kesimpulan</h3>
                <p className="text-lg leading-relaxed text-foreground/80">
                  {article.content.conclusion}
                </p>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8">Artikel Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articlesData
              .filter((a: any) => a.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle: any) => (
                <Link
                  key={relatedArticle.id}
                  to={`/artikel/${relatedArticle.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={relatedArticle.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-3">
                      {relatedArticle.category || 'Tips'}
                    </div>
                    <h3 className="text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {relatedArticle.readTime || '5 menit baca'}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}