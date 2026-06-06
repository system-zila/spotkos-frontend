import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react'; 
import { ArrowLeft, Clock, Calendar, User, Facebook, Twitter, Link2, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function ArticleDetail() {
  const { id } = useParams();
  
  const [articlesData, setArticlesData] = useState<any[]>([]);
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/articles?ngrok-skip-browser-warning=true`)
      .then(res => res.json())
      .then(data => {
        const parsedData = data.map((item: any) => ({
          ...item,
          content: typeof item.content === 'string' ? JSON.parse(item.content) : item.content,
          image: item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}/${item.image}`
        }));

        setArticlesData(parsedData);
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
          <p className="text-muted-foreground mb-8">Maaf, artikel yang Anda cari tidak ditemukan.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
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
            setTimeout(() => { button.innerHTML = originalText; }, 2000);
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
      
      <article className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" /> Kembali
          </Link>

          {/* MENERAPKAN DESAIN BADGE LIVE PREVIEW */}
          <div className="inline-block px-4 py-1.5 bg-[#FF6B35] text-white font-bold rounded-full text-xs uppercase tracking-widest mb-6 shadow-sm">
            {article.category || 'Kategori'}
          </div>

          {/* MENERAPKAN DESAIN JUDUL LIVE PREVIEW */}
          <h1 className="text-3xl md:text-5xl font-black mb-5 leading-tight text-gray-900 tracking-tight">
            {article.title}
          </h1>

          {/* MENERAPKAN DESAIN META INFO LIVE PREVIEW */}
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <User className="w-4 h-4 text-gray-400" />
              <span>{article.author || 'Tim SpotKos'}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{new Date(article.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{article.read_time || '5 menit'} baca</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm text-muted-foreground font-medium">Bagikan:</span>
            <button onClick={() => handleShare('facebook')} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
            <button onClick={() => handleShare('twitter')} className="p-2 bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button onClick={() => handleShare('copy')} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white rounded-full transition-colors">
              <Link2 className="w-5 h-5" />
            </button>
          </div>

          {/* MENERAPKAN DESAIN GAMBAR LIVE PREVIEW */}
          <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-sm border border-gray-100">
            <ImageWithFallback
              src={article.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            
            {/* TAMBAHAN: Memunculkan Ringkasan Singkat (Excerpt) */}
            {article.excerpt && (
              <p className="text-xl font-bold italic text-gray-800 mb-8 pb-8 border-b border-gray-200">
                "{article.excerpt}"
              </p>
            )}

            {/* MENERAPKAN DESAIN INTRO DROP-CAP LIVE PREVIEW */}
            {article.content?.intro && (
              <p className="text-base leading-loose mb-10 text-gray-700 first-letter:text-5xl first-letter:font-black first-letter:text-[#FF6B35] first-letter:mr-1 first-letter:float-left">
                {article.content.intro}
              </p>
            )}

            {/* MENERAPKAN DESAIN SUB-TOPIK LIVE PREVIEW */}
            <div className="space-y-10">
              {article.content?.sections?.map((section: any, index: number) => (
                <div key={index}>
                  {(section.subtitle || section.heading) && (
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                      <div className="w-2 h-6 bg-[#FF6B35] rounded-full"></div> 
                      {section.subtitle || section.heading}
                    </h2>
                  )}
                  <div 
                    className="text-base leading-loose text-gray-600 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>

            {/* MENERAPKAN DESAIN KESIMPULAN LIVE PREVIEW */}
            {article.content?.conclusion && (
              <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-white rounded-2xl border-l-4 border-[#FF6B35] shadow-sm">
                <h3 className="text-lg font-bold mb-3 text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B35]"/> Kesimpulan
                </h3>
                <p className="text-base leading-loose text-gray-700 font-medium whitespace-pre-wrap">
                  {article.content.conclusion}
                </p>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Articles - Tetap Dipertahankan */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black mb-8 text-gray-900">Artikel Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articlesData
              .filter((a: any) => a.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle: any) => (
                <Link
                  key={relatedArticle.id}
                  to={`/artikel/${relatedArticle.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={relatedArticle.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] font-bold uppercase tracking-wider rounded-full text-[10px] mb-3 w-max">
                      {relatedArticle.category || 'Tips'}
                    </div>
                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-auto">
                      {relatedArticle.read_time || '5 menit'}
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