import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { RoomDetail } from './pages/RoomDetail';
import { IndekosInput } from './pages/IndekosInput';
import { BookingHistory } from './pages/BookingHistory';
import { Articles } from './pages/Articles';
import { AdminPanel } from './pages/AdminPanel';
import { CityDetail } from './pages/CityDetail';
import { MyKost } from './pages/MyKost';
import { ProfileSettings } from './pages/ProfileSettings';
import { CustomerService } from './pages/CustomerService';
import { Laporan } from './pages/Laporan';
import { KotakMasuk } from './pages/KotakMasuk';
import { CariKos } from './pages/CariKos';

// Import komponen halaman info tambahan
import { FAQ } from './pages/FAQ';
import { SyaratKetentuan } from './pages/SyaratKetentuan';
import { KebijakanPrivasi } from './pages/KebijakanPrivasi';
import { TentangKami } from './pages/TentangKami';

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/artikel', Component: Articles },
  { path: '/artikel/:id', Component: ArticleDetail },
  { path: '/kost/:id', Component: RoomDetail },
  { path: '/kota/:city', Component: CityDetail },
  { path: '/indekos-input', Component: IndekosInput },
  { path: '/booking-history', Component: BookingHistory },
  { path: '/admin', Component: AdminPanel },
  { path: '/kos-saya', Component: MyKost },
  { path: '/profil', Component: ProfileSettings },
  { path: '/laporan', Component: Laporan },
  { path: '/customer-service', Component: CustomerService },
  { path: '/kotak-masuk', Component: KotakMasuk },
  { path: '/cari-kos', Component: CariKos },

  // Tambahan rute dari Footer
  { path: '/faq', Component: FAQ },
  { path: '/syarat-ketentuan', Component: SyaratKetentuan },
  { path: '/privasi', Component: KebijakanPrivasi },
  { path: '/tentang', Component: TentangKami },
]);