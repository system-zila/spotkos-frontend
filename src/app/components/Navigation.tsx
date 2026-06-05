import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, History, PlusCircle, Home, Settings, MessageSquare, Ticket } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { AuthDialog } from './AuthDialog';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user: loggedInUser, login, logout } = useAuth();

  // --- STATE UNTUK JUMLAH PESAN BELUM DIBACA & AVATAR PENGGUNA ---
  const [unreadCount, setUnreadCount] = useState(0);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const openLogin = () => {
    setAuthMode('login');
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setAuthOpen(true);
  };

  const handleAuthSuccess = (user: { name: string; email: string }) => {
    login(user);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setUserAvatar(null);
  };

  const handleLogoClick = () => {
    if (!isHome) {
      window.location.href = '/';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- EFEK: MENGAMBIL DATA UNREAD CHAT & PROFIL (AVATAR) ---
  useEffect(() => {
    if (loggedInUser?.email) {
      // 1. Ambil data unread messages
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/kotak-masuk?email=${loggedInUser.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const totalUnread = data.reduce((acc, curr) => acc + (curr.unread || 0), 0);
            setUnreadCount(totalUnread);
          }
        })
        .catch(err => console.error("Gagal cek unread pesan:", err));

      // 2. Ambil data avatar pengguna dari profil
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile?email=${loggedInUser.email}`)
        .then(res => res.json())
        .then(data => {
          if (data?.avatar && typeof data.avatar === 'string') {
            if (data.avatar.startsWith('http')) {
              setUserAvatar(data.avatar); 
            } else {
              setUserAvatar(`${import.meta.env.VITE_API_URL}/${data.avatar}`); 
            }
          }
        })
        .catch(err => console.error("Gagal menarik avatar profil:", err));

    } else {
      setUnreadCount(0);
      setUserAvatar(null);
    }
  }, [loggedInUser, showUserMenu]); 

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            {isHome ? (
              <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                  <span className="text-xl">🏠</span>
                </div>
                <h1 className="text-2xl text-primary font-bold">SpotKos</h1>
              </div>
            ) : (
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                  <span className="text-xl">🏠</span>
                </div>
                <h1 className="text-2xl text-primary font-bold">SpotKos</h1>
              </Link>
            )}

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-6 font-medium">
              {isHome ? (
                <>
                  <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
                  <a href="#cari-kos" className="text-foreground hover:text-primary transition-colors">Cari Kos</a>
                  <a href="#kota-populer" className="text-foreground hover:text-primary transition-colors">Kota Populer</a>
                  <a href="#rekomendasi" className="text-foreground hover:text-primary transition-colors">Rekomendasi</a>
                  <a href="#bandingkan" className="text-foreground hover:text-primary transition-colors">Bandingkan Kos</a>
                  <a href="#artikel" className="text-foreground hover:text-primary transition-colors">Artikel</a>
                </>
              ) : (
                <>
                  <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
                  <a href="/#cari-kos" className="text-foreground hover:text-primary transition-colors">Cari Kos</a>
                  <a href="/#kota-populer" className="text-foreground hover:text-primary transition-colors">Kota Populer</a>
                  <a href="/#rekomendasi" className="text-foreground hover:text-primary transition-colors">Rekomendasi</a>
                  <a href="/#artikel" className="text-foreground hover:text-primary transition-colors">Artikel</a>
                </>
              )}
              <Link
                to="/indekos-input"
                className="text-foreground hover:text-primary transition-colors"
              >
                Indekos Input
              </Link>
            </nav>

            {/* Auth Buttons & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {loggedInUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors relative group"
                  >
                    {/* MENAMPILKAN AVATAR ATAU ICON DEFAULT JIKA TIDAK ADA GAMBAR */}
                    <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center relative overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-all">
                      {userAvatar ? (
                        <img 
                          src={userAvatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                      {/* TITIK MERAH NOTIFIKASI PADA AVATAR UTAMA (Jika ada unread) */}
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border border-white rounded-full"></span>
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-bold text-gray-700">{loggedInUser.name}</span>
                  </button>

                  {/* DROPDOWN USER MENU */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-border">
                        <div className="font-bold text-sm text-gray-900">{loggedInUser.name}</div>
                        <div className="text-xs text-muted-foreground">{loggedInUser.email}</div>
                      </div>
                      
                      <Link
                        to="/kotak-masuk" 
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary transition-colors font-medium text-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-[#FF6B35]" /> Kotak Masuk
                        </div>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-bold shadow-sm">
                            {unreadCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/kos-saya"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors border-t border-gray-50 font-medium text-gray-700"
                      >
                        <Home className="w-4 h-4 text-[#FF6B35]" /> Kos Saya
                      </Link>
                      
                      <Link
                        to="/booking-history"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors font-medium text-gray-700"
                      >
                        <History className="w-4 h-4 text-[#FF6B35]" /> Riwayat Booking
                      </Link>
                      
                      <Link
                        to="/indekos-input"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors font-medium text-gray-700"
                      >
                        <PlusCircle className="w-4 h-4 text-[#FF6B35]" /> Daftarkan Kost
                      </Link>
                      
                      <Link
                        to="/profil"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors border-t border-border font-medium text-gray-700"
                      >
                        <Settings className="w-4 h-4 text-gray-500" /> Pengaturan Profil
                      </Link>

                      {/* TOMBOL TIKET BANTUAN DITAMBAHKAN DI SINI */}
                      <Link
                        to="/my-tickets"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors border-t border-gray-50 font-medium text-gray-700"
                      >
                        <Ticket className="w-4 h-4 text-[#FF6B35]" /> Tiket Bantuan
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 transition-colors w-full text-left font-bold text-red-600 border-t border-border mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button variant="ghost" className="hidden md:inline-flex font-bold text-gray-600" onClick={openLogin}>
                    Masuk
                  </Button>
                  <Button className="bg-primary text-white hover:bg-primary/90 font-bold rounded-full px-6" onClick={openRegister}>
                    Daftar
                  </Button>
                </>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-in slide-in-from-top-4">
              <nav className="flex flex-col gap-4 font-medium">
                {isHome ? (
                  <>
                    <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Home</a>
                    <a href="#cari-kos" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Cari Kos</a>
                    <a href="#kota-populer" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Kota Populer</a>
                    <a href="#rekomendasi" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Rekomendasi</a>
                    <a href="#artikel" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Artikel</a>
                    <a href="#tentang" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Tentang</a>
                  </>
                ) : (
                  <>
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">Home</Link>
                    <a href="/#cari-kos" className="text-foreground hover:text-primary transition-colors">Cari Kos</a>
                    <a href="/#kota-populer" className="text-foreground hover:text-primary transition-colors">Kota Populer</a>
                    <a href="/#rekomendasi" className="text-foreground hover:text-primary transition-colors">Rekomendasi</a>
                    <a href="/#artikel" className="text-foreground hover:text-primary transition-colors">Artikel</a>
                  </>
                )}
                <Link to="/indekos-input" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">
                  Indekos Input
                </Link>
                {loggedInUser && (
                  <>
                    <Link to="/kotak-masuk" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between text-foreground hover:text-primary transition-colors">
                      Kotak Masuk {unreadCount > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">{unreadCount} Baru</span>}
                    </Link>
                    <Link to="/kos-saya" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">
                      Kos Saya
                    </Link>
                    <Link to="/booking-history" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">
                      Riwayat Booking
                    </Link>
                    <Link to="/profil" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">
                      Pengaturan Profil
                    </Link>
                    {/* TIKET BANTUAN UNTUK MOBILE */}
                    <Link to="/my-tickets" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">
                      Tiket Bantuan
                    </Link>
                  </>
                )}
                {!loggedInUser && (
                  <Button variant="ghost" className="md:hidden w-full font-bold bg-gray-50 mt-2" onClick={() => { setIsMenuOpen(false); openLogin(); }}>
                    Masuk atau Daftar
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Dialog */}
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}