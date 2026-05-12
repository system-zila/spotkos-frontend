export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/20 pt-20 pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl mb-6 text-foreground">
            Temukan Kos Terbaik di <span className="text-primary">Spot Terbaik</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            SpotKos membantu kamu menemukan kos yang nyaman, aman, dan terjangkau di kota-kota besar Indonesia.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm">
              <span className="text-2xl">🏘️</span>
              <div className="text-left">
                <div className="text-sm text-muted-foreground">Total Kos</div>
                <div className="font-medium">10,000+</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <div className="text-sm text-muted-foreground">Pengguna Puas</div>
                <div className="font-medium">50,000+</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm">
              <span className="text-2xl">🏙️</span>
              <div className="text-left">
                <div className="text-sm text-muted-foreground">Kota</div>
                <div className="font-medium">100+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}