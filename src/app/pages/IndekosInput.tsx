import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Home, MapPin, DollarSign, Camera, CheckCircle2,
  Plus, X, Wifi, Wind, Bath, Car, Shield, CookingPot, Zap,
  Users, FileText, ArrowLeft, ArrowRight, ShieldAlert, PhoneOff, Clock, Upload, XCircle, AlertTriangle, Building, User
} from 'lucide-react';

// PERBAIKAN BUG IKON LEAFLET VIA CDN
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ALL_FACILITIES = [
  { name: 'Wi-Fi', icon: Wifi },
  { name: 'AC', icon: Wind },
  { name: 'Kamar Mandi Dalam', icon: Bath },
  { name: 'Parkir Motor', icon: Car },
  { name: 'Keamanan 24 Jam', icon: Shield },
  { name: 'Dapur', icon: CookingPot },
  { name: 'Listrik Pasca Bayar', icon: Zap },
  { name: 'Laundry', icon: Home },
  { name: 'Kasur', icon: Home },
  { name: 'Lemari', icon: Home },
  { name: 'Meja Belajar', icon: Home },
  { name: 'Kursi', icon: Home },
];

export function IndekosInput() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // ================= STATE PROTEKSI =================
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // STATE UPLOAD KTP & SELFIE
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState('');
  const [selfiePreview, setSelfiePreview] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  // STATE MAP KOORDINAT (Default: Pusat Jakarta)
  const [coordinates, setCoordinates] = useState({ lat: -6.200000, lng: 106.816666 });

  // ================= STATE FORM 4 TAHAP =================
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  
  // State untuk Lantai Dinamis
  const [floorCount, setFloorCount] = useState<number | ''>('');
  const [floorsData, setFloorsData] = useState<{ name: string, capacity: number }[]>([]);

  const [form, setForm] = useState({
    name: '',
    location: '',
    address: '',
    price: '',
    gender: 'Campur',
    description: '',
    roomSize: '',
    capacity: '1 orang',
    facilities: [] as string[],
    rules: [''] as string[],
    photos: [] as string[],
  });

  // Komponen Helper untuk Menangkap Klik di Peta
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return <Marker position={coordinates} />;
  };

  useEffect(() => {
    if (!user) {
      navigate('/'); 
    }
  }, [user, navigate]);

  const fetchProfile = () => {
    if (user?.email) {
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile?email=${user.email}`)
        .then(res => res.json())
        .then(data => { setProfile(data); setIsLoading(false); })
        .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => { 
    if (user) fetchProfile(); 
  }, [user]);

  const handleKtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKtpFile(e.target.files[0]);
      setKtpPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0]);
      setSelfiePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ktpFile || !selfieFile) { alert('Harap unggah kedua foto.'); return; }
    try {
      const formData = new FormData();
      formData.append('email', user?.email || '');
      formData.append('ktp', ktpFile);
      formData.append('selfie', selfieFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-owner`, {
        method: 'PUT',
        body: formData
      });
      if (res.ok) { 
        alert('Dokumen terkirim dan menunggu verifikasi Admin!'); 
        fetchProfile(); 
      } else { alert('Gagal mengirim dokumen.'); }
    } catch (err) { alert('Kesalahan server.'); }
  };

  // Handler Generator Lantai Dinamis
  const handleFloorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val <= 0) {
      setFloorCount('');
      setFloorsData([]);
      return;
    }
    setFloorCount(val);
    const newFloors = [];
    for (let i = 1; i <= val; i++) {
      const existing = floorsData[i - 1];
      newFloors.push({
        name: `Lantai ${i}`,
        capacity: existing ? existing.capacity : 0
      });
    }
    setFloorsData(newFloors);
  };

  const toggleFacility = (name: string) => {
    setForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(name) ? prev.facilities.filter(f => f !== name) : [...prev.facilities, name]
    }));
  };
  
  const addRule = () => setForm(prev => ({ ...prev, rules: [...prev.rules, ''] }));
  const updateRule = (index: number, value: string) => {
    const newRules = [...form.rules];
    newRules[index] = value;
    setForm({ ...form, rules: newRules });
  };
  const removeRule = (index: number) => setForm(prev => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && form.photos.length < 6) {
      const file = e.target.files[0];
      setPhotoFiles(prev => [...prev, file]);
      setForm(prev => ({ ...prev, photos: [...prev.photos, URL.createObjectURL(file)] }));
    }
  };

  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const handleSubmitKos = async () => {
    try {
      const formData = new FormData();
      formData.append('email', user?.email || '');
      formData.append('name', form.name);
      formData.append('location', form.location);
      formData.append('address', form.address);
      formData.append('price', form.price);
      formData.append('gender', form.gender);
      formData.append('description', form.description);
      formData.append('roomSize', form.roomSize);
      formData.append('capacity', form.capacity);

      // ✅ FIX TYPESCRIPT: Bypass error AuthUser type
      const anyUser = user as any;
      const finalOwnerName = profile?.name || anyUser?.full_name || anyUser?.name || 'Owner';
      const finalOwnerPhone = profile?.phone || anyUser?.phone || '-';
      
      formData.append('ownerName', finalOwnerName);
      formData.append('ownerPhone', finalOwnerPhone);

      // Detail Lantai Dinamis
      formData.append('floorsData', JSON.stringify(floorsData));
      formData.append('floor', String(floorCount)); // Fallback kompatibilitas
      
      const totalAllRooms = floorsData.reduce((acc, curr) => acc + curr.capacity, 0);
      formData.append('totalRooms', String(totalAllRooms));

      formData.append('facilities', JSON.stringify(form.facilities));
      formData.append('rules', JSON.stringify(form.rules.filter(Boolean)));
      
      // Koordinat Leaflet
      formData.append('latitude', coordinates.lat.toString());
      formData.append('longitude', coordinates.lng.toString());
      
      photoFiles.forEach(file => formData.append('photos', file));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/register`, {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData 
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        window.scrollTo(0, 0);
      } else {
        alert(`Gagal: ${data.error}`);
      }
    } catch (err) { alert('Terjadi kesalahan koneksi server.'); }
  };

  const isStepValid = () => {
    if (step === 1) return !!(form.name && form.location && form.address && form.price && form.description);
    if (step === 2) return !!(form.roomSize && floorCount !== '' && floorsData.length > 0 && floorsData.every(f => f.capacity > 0));
    if (step === 3) return form.rules[0]?.trim() !== '' && form.photos.length > 0;
    if (step === 4) return true; // Data owner otomatis
    return false;
  };

  if (isLoading || !user) return null;

  // Cek apakah phone tersedia (profil phone ATAU anyUser phone)
  const anyUser = user as any;
  const userHasPhone = profile?.phone || anyUser?.phone;

  if (!userHasPhone) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4 pt-20">
          <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
            <PhoneOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Verifikasi Nomor HP Diperlukan</h2>
            <p className="text-gray-500 text-sm mb-6">Anda wajib memverifikasi Nomor Handphone di profil sebelum mendaftar sebagai Pemilik Kost.</p>
            <Link to="/profil"><Button className="w-full bg-[#FF6B35] hover:bg-orange-600 rounded-xl py-6 font-bold">Pergi ke Profil</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile?.owner_status || profile.owner_status === 'unverified' || profile.owner_status === 'rejected') {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col">
        <Navigation />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-24">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-[#FF6B35]"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda</Link>
          
          {profile.owner_status === 'rejected' && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-r-2xl mb-6 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-red-500" />
              <div>
                <h3 className="font-bold text-lg">Verifikasi Identitas Ditolak Admin</h3>
                <p className="text-sm mt-1">Dokumen KTP Anda sebelumnya ditolak (kemungkinan buram atau tidak valid). Akses pendaftaran Kost ditutup. Silakan unggah ulang foto yang jelas.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#002855] p-8 text-white">
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-[#FF6B35]" /> Verifikasi Identitas Pemilik</h1>
              <p className="text-sm text-white/80">Sebelum mengakses formulir Daftarkan Kost, Anda wajib melengkapi data identitas untuk keamanan.</p>
            </div>
            <form onSubmit={handleVerifySubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block font-bold text-gray-700">Foto KTP Asli</Label>
                  <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors h-48">
                    {ktpPreview ? (
                      <div className="relative w-full h-full bg-black">
                        <img src={ktpPreview} alt="KTP" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => {setKtpFile(null); setKtpPreview('')}} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-center p-4">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-500">Klik untuk upload KTP</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleKtpChange} required />
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block font-bold text-gray-700">Selfie Memegang KTP</Label>
                  <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors h-48">
                    {selfiePreview ? (
                      <div className="relative w-full h-full bg-black">
                        <img src={selfiePreview} alt="Selfie" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => {setSelfieFile(null); setSelfiePreview('')}} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-center p-4">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-500">Klik untuk upload Selfie</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleSelfieChange} required />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#002855] hover:bg-[#003570] rounded-xl py-6 text-lg mt-4 font-bold">Kirim Dokumen Verifikasi</Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (profile.owner_status === 'pending') {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4 pt-20">
          <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sedang Diverifikasi</h2>
            <p className="text-gray-500 text-sm mb-8">Dokumen identitas Anda sedang ditinjau oleh Admin SpotKos. Anda baru dapat mengakses halaman Daftarkan Kost setelah disetujui (Maks. 1x24 Jam).</p>
            <Link to="/"><Button variant="outline" className="w-full rounded-xl py-6 font-bold">Kembali ke Beranda</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <Navigation />
        <div className="pt-32 pb-16 flex justify-center">
          <div className="max-w-md w-full px-4 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-gray-900">Kost Berhasil Ditayangkan!</h1>
            <p className="text-gray-500 mb-8">Data properti kost Anda berhasil disubmit dan kini sedang ditinjau atau telah aktif di platform SpotKos.</p>
            <Link to="/"><Button className="w-full rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 py-6 text-lg font-bold">Kembali ke Beranda</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      <div className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#FF6B35] transition-colors font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" /> Batal & Kembali
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl text-gray-900 font-bold mb-3">Daftarkan Kost Anda</h1>
            <p className="text-gray-500 text-sm">Isi formulir di bawah untuk mendaftarkan kos Anda secara detail di SpotKos</p>
          </div>

          <div className="flex items-center justify-center mb-10">
            {[1, 2, 3, 4].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                  s === step ? 'bg-[#FF6B35] text-white font-bold shadow-md' : 
                  s < step ? 'bg-[#FF6B35] text-white font-bold' : 'bg-gray-200 text-gray-400 font-bold'
                }`}>
                  {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {idx < 3 && (
                  <div className={`w-12 h-1 ${s < step ? 'bg-[#FF6B35]' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100">
            
            {/* TAHAP 1: INFO DASAR */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-6 border-b border-gray-100 pb-4">
                  <Home className="w-6 h-6 text-[#FF6B35]" /> Informasi Dasar
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-gray-700">Nama Kos <span className="text-red-500">*</span></Label>
                    <Input placeholder="Contoh: Kost Melati Residence" className="rounded-xl h-12 bg-gray-50 focus:bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-gray-700">Lokasi (Kota/Area) <span className="text-red-500">*</span></Label>
                    <Input placeholder="Contoh: Menteng, Jakarta Pusat" className="rounded-xl h-12 bg-gray-50 focus:bg-white" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-gray-700">Alamat Lengkap <span className="text-red-500">*</span></Label>
                    <textarea placeholder="Jl. Menteng Raya No. 45, Menteng, Jakarta Pusat" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-[#FF6B35] min-h-[100px] resize-none" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>

                  {/* ===== UI PETA LEAFLET ===== */}
                  <div className="pt-2">
                    <Label className="mb-2 block text-sm font-bold text-gray-700">Tandai Lokasi Presisi di Peta</Label>
                    <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-gray-200 relative z-0">
                      <MapContainer 
                        center={[coordinates.lat, coordinates.lng]} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker />
                      </MapContainer>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Klik pada area peta untuk memindahkan pin ke lokasi persis kos Anda.</p>
                  </div>
                  {/* ============================= */}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block text-sm font-bold text-gray-700">Harga Sewa per Bulan (Rp) <span className="text-red-500">*</span></Label>
                      <Input type="number" placeholder="1500000" className="rounded-xl h-12 bg-gray-50 focus:bg-white font-bold text-[#FF6B35]" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-bold text-gray-700">Tipe Kos <span className="text-red-500">*</span></Label>
                      <div className="flex gap-2 h-12">
                        {(['Putra', 'Putri', 'Campur'] as const).map((g) => (
                          <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })} className={`flex-1 rounded-xl border text-sm font-bold transition-colors ${form.gender === g ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-gray-700">Deskripsi Kost <span className="text-red-500">*</span></Label>
                    <textarea placeholder="Jelaskan keunggulan dan fasilitas kost Anda..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm outline-none focus:border-[#FF6B35] min-h-[100px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {/* TAHAP 2: DETAIL KAMAR & LANTAI (REVISI LANTAI DINAMIS) */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-6 border-b border-gray-100 pb-4">
                  <FileText className="w-6 h-6 text-[#FF6B35]" /> Spesifikasi & Kamar
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-gray-700">Ukuran Kamar <span className="text-red-500">*</span></Label>
                    <Input placeholder="Contoh: 3 x 4 meter" className="rounded-xl h-12 bg-gray-50 focus:bg-white" value={form.roomSize} onChange={(e) => setForm({ ...form, roomSize: e.target.value })} />
                  </div>
                  <div>
                    <Label className="mb-3 block text-sm font-bold text-gray-700">Kapasitas Penghuni per Kamar</Label>
                    <div className="flex gap-3">
                      {['1 orang', '2 orang'].map((cap) => (
                        <button key={cap} type="button" onClick={() => setForm({ ...form, capacity: cap })} className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-colors ${form.capacity === cap ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ===== GENERATOR LANTAI DINAMIS ===== */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Label className="text-gray-900 font-bold text-lg mb-1 block">Alokasi Kamar per Lantai <span className="text-red-500">*</span></Label>
                  <p className="text-sm text-gray-500 mb-6">Tentukan jumlah lantai bangunan, lalu isi ketersediaan kamar secara presisi di masing-masing lantai.</p>
                  
                  <div className="w-full md:w-1/2 mb-6">
                    <Label className="text-gray-700 font-bold text-sm block mb-2">Total Jumlah Lantai Kos</Label>
                    <Input type="number" placeholder="Ketik angka (misal: 2)" value={floorCount} onChange={handleFloorCountChange} className="h-12 rounded-xl bg-gray-50 focus:bg-white font-bold" />
                  </div>

                  {floorsData.length > 0 && (
                    <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl">
                      <h4 className="font-bold text-[#FF6B35] mb-4">Atur Jumlah Kamar</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {floorsData.map((floor, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <Label className="text-sm font-bold text-gray-700 block mb-2">{floor.name}</Label>
                            <div className="relative">
                              <Input 
                                type="number" 
                                placeholder="Jumlah kamar..." 
                                value={floor.capacity || ''} 
                                onChange={(e) => {
                                  const newFloors = [...floorsData];
                                  newFloors[index].capacity = parseInt(e.target.value) || 0;
                                  setFloorsData(newFloors);
                                }} 
                                className="h-11 rounded-lg pr-16 font-bold" 
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Kamar</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-orange-200 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Total Akumulasi Seluruh Kamar:</span>
                        <span className="text-[#FF6B35] text-lg font-black bg-orange-100 px-4 py-1.5 rounded-lg shadow-sm border border-orange-200">
                          {floorsData.reduce((acc, curr) => acc + curr.capacity, 0)} Kamar
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Label className="mb-4 block text-sm font-bold text-gray-700">Fasilitas Kos & Kamar</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ALL_FACILITIES.map(({ name, icon: Icon }) => (
                      <button key={name} type="button" onClick={() => toggleFacility(name)} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${form.facilities.includes(name) ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-orange-200'}`}>
                        <Icon className="w-4 h-4" /> <span>{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAHAP 3: ATURAN & FOTO */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-6 border-b border-gray-100 pb-4">
                  <Camera className="w-6 h-6 text-[#FF6B35]" /> Aturan & Foto
                </h2>
                
                <div className="mb-8">
                  <Label className="mb-3 block text-sm font-bold text-gray-700">Peraturan Kos <span className="text-red-500">*</span></Label>
                  <div className="space-y-3">
                    {form.rules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input placeholder={`Aturan ${index + 1} (Misal: Dilarang bawa hewan)`} className="rounded-xl h-12 bg-gray-50 focus:bg-white flex-1" value={rule} onChange={(e) => updateRule(index, e.target.value)} />
                        {form.rules.length > 1 && <button type="button" onClick={() => removeRule(index)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl hover:bg-red-50"><X className="w-5 h-5" /></button>}
                      </div>
                    ))}
                    <button type="button" onClick={addRule} className="flex items-center gap-1 text-sm font-bold text-[#FF6B35] hover:text-[#e55a2b] mt-3">
                      <Plus className="w-4 h-4" /> Tambah Aturan
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-sm font-bold text-gray-700">Foto Kos (Maks 6) <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {form.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 group shadow-sm">
                        <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePhoto(index)} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {form.photos.length < 6 && (
                      <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#FF6B35] bg-gray-50 hover:bg-orange-50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#FF6B35] transition-colors cursor-pointer">
                        <Camera className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-wider">Upload Foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAHAP 4: PREVIEW & FINALISASI (REVISI AUTO-BIND PEMILIK) */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-6 border-b border-gray-100 pb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#FF6B35]" /> Finalisasi Data Kos
                </h2>
                
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><User className="w-5 h-5"/> Data Resmi Pengelola</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                      <span className="text-gray-400 text-xs font-bold tracking-wider uppercase block mb-1">Nama Sesuai Profil/KTP</span>
                      <span className="font-bold text-gray-900">{profile?.name || (user as any)?.full_name || (user as any)?.name || 'Pemilik Kos'}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                      <span className="text-gray-400 text-xs font-bold tracking-wider uppercase block mb-1">Nomor Telepon Valid</span>
                      <span className="font-bold text-gray-900">{profile?.phone || (user as any)?.phone || '-'}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-blue-700 mt-4">Demi perlindungan pengguna, sistem secara otomatis mengunci identitas pengelola sesuai akun profil terverifikasi Anda.</p>
                </div>

                <div className="bg-[#faf9f6] rounded-[24px] p-8 border border-gray-200">
                  <h3 className="text-base font-bold mb-5 text-gray-900 border-b border-gray-200 pb-3">Ringkasan Spesifikasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-sm">
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Nama Kost</span><span className="font-bold text-gray-900">{form.name || '-'}</span></div>
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Lokasi</span><span className="font-bold text-gray-900">{form.location || '-'}</span></div>
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Harga per Bulan</span><span className="font-bold text-green-600">{form.price ? `Rp ${parseInt(form.price).toLocaleString('id-ID')}` : '-'}</span></div>
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Peruntukan</span><span className="font-bold text-gray-900">{form.gender}</span></div>
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Ukuran Kamar</span><span className="font-bold text-gray-900">{form.roomSize || '-'}</span></div>
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Jumlah Lantai</span><span className="font-bold text-gray-900">{floorCount || '-'} Lantai</span></div>
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Total Kamar Kosong</span><span className="font-bold text-[#FF6B35]">{floorsData.reduce((acc, curr) => acc + curr.capacity, 0)} Kamar</span></div>
                    <div className="flex flex-col gap-1"><span className="text-gray-400 text-xs font-bold uppercase">Kelengkapan</span><span className="font-bold text-gray-900">{form.facilities.length} Fasilitas, {form.rules.filter(Boolean).length} Aturan</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl px-6 h-12 font-bold border-gray-300 text-gray-700 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
              ) : <div></div>}
              
              {step < 4 ? (
                <Button 
                  onClick={() => setStep(step + 1)} 
                  disabled={!isStepValid()} 
                  className="rounded-xl px-8 h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold disabled:opacity-50 shadow-md"
                >
                  Selanjutnya <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitKos} 
                  disabled={!isStepValid()} 
                  className="rounded-xl px-8 h-12 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Publikasikan Kos!
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}