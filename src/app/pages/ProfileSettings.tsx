import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, User, Phone, Mail, Edit3, Save, CheckCircle2,
  Camera, Shield, Eye, EyeOff, X, AlertCircle, Smartphone,
  UserCircle, AtSign, Lock, Search, ChevronRight, ShieldAlert, 
  Clock, Upload, XCircle, Building, Plus, MapPin, Wallet, CreditCard, CalendarDays
} from 'lucide-react';

const INDONESIA_CITIES = [
  "Kab. Aceh Barat", "Kab. Aceh Besar", "Kab. Aceh Selatan", "Kota Banda Aceh", "Kota Sabang",
  "Kab. Asahan", "Kab. Deli Serdang", "Kab. Karo", "Kab. Simalungun", "Kota Binjai", "Kota Medan", "Kota Pematangsiantar",
  "Kab. Agam", "Kab. Padang Pariaman", "Kota Bukittinggi", "Kota Padang", "Kota Pariaman",
  "Kab. Bengkalis", "Kab. Kampar", "Kota Dumai", "Kota Pekanbaru",
  "Kab. Batanghari", "Kab. Muaro Jambi", "Kota Jambi",
  "Kab. Lahat", "Kab. Muara Enim", "Kab. Musi Banyuasin", "Kota Lubuklinggau", "Kota Palembang", "Kota Prabumulih",
  "Kab. Bengkulu Selatan", "Kab. Bengkulu Utara", "Kota Bengkulu",
  "Kab. Lampung Selatan", "Kab. Lampung Tengah", "Kab. Lampung Timur", "Kota Bandar Lampung", "Kota Metro",
  "Kab. Bangka", "Kab. Belitung", "Kota Pangkal Pinang",
  "Kab. Bintan", "Kab. Karimun", "Kota Batam", "Kota Tanjung Pinang",
  "Kota Jakarta Barat", "Kota Jakarta Pusat", "Kota Jakarta Selatan", "Kota Jakarta Timur", "Kota Jakarta Utara", "Kab. Kepulauan Seribu",
  "Kab. Bandung", "Kab. Bekasi", "Kab. Bogor", "Kab. Ciamis", "Kab. Cianjur", "Kab. Cirebon", "Kab. Garut", "Kab. Indramayu", "Kab. Karawang", "Kab. Kuningan", "Kab. Majalengka", "Kab. Purwakarta", "Kab. Subang", "Kab. Sukabumi", "Kab. Sumedang", "Kab. Tasikmalaya", "Kota Bandung", "Kota Banjar", "Kota Bekasi", "Kota Bogor", "Kota Cimahi", "Kota Cirebon", "Kota Depok", "Kota Sukabumi", "Kota Tasikmalaya",
  "Kab. Banjarnegara", "Kab. Banyumas", "Kab. Batang", "Kab. Blora", "Kab. Boyolali", "Kab. Brebes", "Kab. Cilacap", "Kab. Demak", "Kab. Grobogan", "Kab. Jepara", "Kab. Karanganyar", "Kab. Kebumen", "Kab. Kendal", "Kab. Klaten", "Kab. Kudus", "Kab. Magelang", "Kab. Pati", "Kab. Pekalongan", "Kab. Pemalang", "Kab. Purbalingga", "Kab. Purworejo", "Kab. Rembang", "Kab. Semarang", "Kab. Sragen", "Kab. Sukoharjo", "Kab. Tegal", "Kab. Temanggung", "Kab. Wonogiri", "Kab. Wonosobo", "Kota Magelang", "Kota Pekalongan", "Kota Salatiga", "Kota Semarang", "Kota Surakarta", "Kota Tegal",
  "Kab. Bantul", "Kab. Gunungkidul", "Kab. Kulon Progo", "Kab. Sleman", "Kota Yogyakarta",
  "Kab. Bangkalan", "Kab. Banyuwangi", "Kab. Blitar", "Kab. Bojonegoro", "Kab. Bondowoso", "Kab. Gresik", "Kab. Jember", "Kab. Jombang", "Kab. Kediri", "Kab. Lamongan", "Kab. Lumajang", "Kab. Madiun", "Kab. Magetan", "Kab. Malang", "Kab. Mojokerto", "Kab. Nganjuk", "Kab. Ngawi", "Kab. Pacitan", "Kab. Pamekasan", "Kab. Pasuruan", "Kab. Ponorogo", "Kab. Probolinggo", "Kab. Sampang", "Kab. Sidoarjo", "Kab. Situbondo", "Kab. Sumenep", "Kab. Trenggalek", "Kab. Tuban", "Kab. Tulungagung", "Kota Batu", "Kota Blitar", "Kota Kediri", "Kota Madiun", "Kota Malang", "Kota Mojokerto", "Kota Pasuruan", "Kota Probolinggo", "Kota Surabaya",
  "Kab. Lebak", "Kab. Pandeglang", "Kab. Serang", "Kab. Tangerang", "Kota Cilegon", "Kota Serang", "Kota Tangerang", "Kota Tangerang Selatan",
  "Kab. Badung", "Kab. Bangli", "Kab. Buleleng", "Kab. Gianyar", "Kab. Jembrana", "Kab. Karangasem", "Kab. Klungkung", "Kab. Tabanan", "Kota Denpasar",
  "Kab. Bima", "Kab. Dompu", "Kab. Lombok Barat", "Kab. Lombok Tengah", "Kab. Lombok Timur", "Kab. Lombok Utara", "Kab. Sumbawa", "Kab. Sumbawa Barat", "Kota Bima", "Kota Mataram",
  "Kab. Alor", "Kab. Belu", "Kab. Ende", "Kab. Flores Timur", "Kab. Kupang", "Kab. Lembata", "Kab. Manggarai", "Kab. Manggarai Barat", "Kab. Manggarai Timur", "Kab. Nagekeo", "Kab. Ngada", "Kab. Rote Ndao", "Kab. Sabu Raijua", "Kab. Sikka", "Kab. Sumba Barat", "Kab. Sumba Barat Daya", "Kab. Sumba Tengah", "Kab. Sumba Timur", "Kab. Timor Tengah Selatan", "Kab. Timor Tengah Utara", "Kota Kupang",
  "Kab. Bengkayang", "Kab. Kapuas Hulu", "Kab. Kayong Utara", "Kab. Ketapang", "Kab. Kubu Raya", "Kab. Landak", "Kab. Melawi", "Kab. Mempawah", "Kab. Sambas", "Kab. Sanggau", "Kab. Sekadau", "Kab. Sintang", "Kota Pontianak", "Kota Singkawang",
  "Kab. Barito Selatan", "Kab. Barito Timur", "Kab. Barito Utara", "Kab. Gunung Mas", "Kab. Kapuas", "Kab. Katingan", "Kab. Kotawaringin Barat", "Kab. Kotawaringin Timur", "Kab. Lamandau", "Kab. Murung Raya", "Kab. Pulang Pisau", "Kab. Sukamara", "Kab. Seruyan", "Kota Palangka Raya",
  "Kab. Balangan", "Kab. Banjar", "Kab. Barito Kuala", "Kab. Hulu Sungai Selatan", "Kab. Hulu Sungai Tengah", "Kab. Hulu Sungai Utara", "Kab. Kotabaru", "Kab. Tabalong", "Kab. Tanah Bumbu", "Kab. Tanah Laut", "Kab. Tapin", "Kota Banjarbaru", "Kota Banjarmasin",
  "Kab. Berau", "Kab. Kutai Barat", "Kab. Kutai Kartanegara", "Kab. Kutai Timur", "Kab. Mahakam Ulu", "Kab. Paser", "Kab. Penajam Paser Utara", "Kota Balikpapan", "Kota Bontang", "Kota Samarinda",
  "Kab. Bulungan", "Kab. Malinau", "Kab. Nunukan", "Kab. Tana Tidung", "Kota Tarakan",
  "Kab. Bolaang Mongondow", "Kab. Bolaang Mongondow Selatan", "Kab. Bolaang Mongondow Timur", "Kab. Bolaang Mongondow Utara", "Kab. Kepulauan Sangihe", "Kab. Kepulauan Siau Tagulandang Biaro", "Kab. Kepulauan Talaud", "Kab. Minahasa", "Kab. Minahasa Selatan", "Kab. Minahasa Tenggara", "Kab. Minahasa Utara", "Kota Bitung", "Kota Kotamobagu", "Kota Manado", "Kota Tomohon",
  "Kab. Banggai", "Kab. Banggai Kepulauan", "Kab. Banggai Laut", "Kab. Buol", "Kab. Donggala", "Kab. Morowali", "Kab. Morowali Utara", "Kab. Parigi Moutong", "Kab. Poso", "Kab. Sigi", "Kab. Tojo Una-Una", "Kab. Tolitoli", "Kota Palu",
  "Kab. Bantaeng", "Kab. Barru", "Kab. Bone", "Kab. Bulukumba", "Kab. Enrekang", "Kab. Gowa", "Kab. Jeneponto", "Kab. Kepulauan Selayar", "Kab. Luwu", "Kab. Luwu Timur", "Kab. Luwu Utara", "Kab. Maros", "Kab. Pangkajene dan Kepulauan", "Kab. Pinrang", "Kab. Sidenreng Rappang", "Kab. Sinjai", "Kab. Soppeng", "Kab. Takalar", "Kab. Tana Toraja", "Kab. Toraja Utara", "Kab. Wajo", "Kota Makassar", "Kota Palopo", "Kota Parepare",
  "Kab. Bombana", "Kab. Buton", "Kab. Buton Selatan", "Kab. Buton Tengah", "Kab. Buton Utara", "Kab. Kolaka", "Kab. Kolaka Timur", "Kab. Kolaka Utara", "Kab. Konawe", "Kab. Konawe Kepulauan", "Kab. Konawe Selatan", "Kab. Konawe Utara", "Kab. Muna", "Kab. Muna Barat", "Kab. Wakatobi", "Kota Baubau", "Kota Kendari",
  "Kab. Boalemo", "Kab. Bone Bolango", "Kab. Gorontalo", "Kab. Gorontalo Utara", "Kab. Pohuwato", "Kota Gorontalo",
  "Kab. Majene", "Kab. Mamasa", "Kab. Mamuju", "Kab. Mamuju Tengah", "Kab. Mamuju Utara", "Kab. Polewali Mandar",
  "Kab. Buru", "Kab. Buru Selatan", "Kab. Kepulauan Aru", "Kab. Maluku Barat Daya", "Kab. Maluku Tengah", "Kab. Maluku Tenggara", "Kab. Maluku Tenggara Barat", "Kab. Seram Bagian Barat", "Kab. Seram Bagian Timur", "Kota Ambon", "Kota Tual",
  "Kab. Halmahera Barat", "Kab. Halmahera Selatan", "Kab. Halmahera Tengah", "Kab. Halmahera Timur", "Kab. Halmahera Utara", "Kab. Kepulauan Sula", "Kab. Pulau Morotai", "Kab. Pulau Taliabu", "Kota Ternate", "Kota Tidore Kepulauan",
  "Kab. Asmat", "Kab. Biak Numfor", "Kab. Boven Digoel", "Kab. Deiyai", "Kab. Dogiyai", "Kab. Intan Jaya", "Kab. Jayapura", "Kab. Jayawijaya", "Kab. Keerom", "Kab. Kepulauan Yapen", "Kab. Lanny Jaya", "Kab. Mamberamo Raya", "Kab. Mamberamo Tengah", "Kab. Mappi", "Kab. Merauke", "Kab. Mimika", "Kab. Nabire", "Kab. Nduga", "Kab. Paniai", "Kab. Pegunungan Bintang", "Kab. Puncak", "Kab. Puncak Jaya", "Kab. Sarmi", "Kab. Supiori", "Kab. Tolikara", "Kab. Waropen", "Kab. Yahukimo", "Kab. Yalimo", "Kota Jayapura",
  "Kab. Fakfak", "Kab. Kaimana", "Kab. Manokwari", "Kab. Manokwari Selatan", "Kab. Maybrat", "Kab. Pegunungan Arfak", "Kab. Raja Ampat", "Kab. Sorong", "Kab. Sorong Selatan", "Kab. Tambrauw", "Kab. Teluk Bintuni", "Kab. Teluk Wondama", "Kota Sorong"
];

export function ProfileSettings() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [myKosts, setMyKosts] = useState<any[]>([]);

  const [profile, setProfile] = useState<any>({
    name: user?.name || '',
    nickname: '',
    birth_info: '', // Akan disimpan dengan format "Kota/Kabupaten | YYYY-MM-DD"
    email: user?.email || '',
    phone: '',
    gender: '',
    owner_status: '',
    avatar: '',
    bank_name: '',
    bank_account: '',
    bank_account_name: '',
    balance: 0
  });

  const [editSection, setEditSection] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State untuk Tempat, Tanggal Lahir
  const [tempBirthProvince, setTempBirthProvince] = useState('');
  const [tempBirthDate, setTempBirthDate] = useState('');
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Phone verification
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp' | 'done'>('input');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  // KTP Verification (MULTER)
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState('');
  const [selfiePreview, setSelfiePreview] = useState('');

  // Password change
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Withdrawal Dialog
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  // === LOGIKA KICK UNTUK YANG BELUM LOGIN ===
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchProfile = () => {
    if (user?.email) {
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setProfile((prev: any) => ({ ...prev, ...data }));
        })
        .catch(err => console.error("Gagal menarik profil:", err));

      fetch(`${import.meta.env.VITE_API_URL}/api/rooms/my-kosts?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setMyKosts(data);
        })
        .catch(err => console.error("Gagal menarik data kos:", err));
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  // Tutup dropdown kota jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cityDropdownRef]);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3500);
  };

  // Kalkulasi Kelengkapan Profil
  const calculateCompleteness = () => {
    // Definisi kolom inti untuk semua pengguna
    const coreFields = ['name', 'nickname', 'birth_info', 'phone', 'gender', 'avatar'];
    let filled = coreFields.filter(f => profile[f] && profile[f].toString().trim() !== '').length;
    let total = coreFields.length + 1; // +1 untuk email yang otomatis terisi dari akun Google/Register

    filled += 1; // Email

    // Jika pengguna adalah pemilik kos, tambahkan data rekening bank ke kriteria wajib
    if (profile.owner_status === 'approved') {
      const bankFields = ['bank_name', 'bank_account', 'bank_account_name'];
      filled += bankFields.filter(f => profile[f] && profile[f].toString().trim() !== '').length;
      total += bankFields.length;
    }
    return Math.round((filled / total) * 100);
  };
  const completeness = calculateCompleteness();

  // Helper render format tanggal lahir
  const renderBirthInfo = () => {
    if (!profile.birth_info) return <span className="text-muted-foreground italic font-normal">Belum diatur</span>;
    const parts = profile.birth_info.split(' | ');
    if (parts.length === 2) {
      const dateObj = new Date(parts[1]);
      const formattedDate = `${dateObj.getDate()} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][dateObj.getMonth()]} ${dateObj.getFullYear()}`;
      return `${parts[0]}, ${formattedDate}`;
    }
    return profile.birth_info;
  };

  // ================= AVATAR UPLOAD HANDLER =================
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('email', user?.email || '');
      formData.append('avatar', file);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update-avatar`, {
          method: 'PUT',
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          setProfile((prev: any) => ({ ...prev, avatar: data.avatarUrl }));
          showToast('Foto profil berhasil diperbarui!');
        } else {
          showToast('Gagal mengunggah foto profil.');
        }
      } catch (error) {
        showToast('Kesalahan koneksi ke server.');
      }
    }
  };

  // ================= UPLOAD FILE HANDLERS (KTP) =================
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
    if (!ktpFile || !selfieFile) {
      showToast('Harap unggah kedua foto.');
      return;
    }
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
        setProfile((prev: any) => ({ ...prev, owner_status: 'pending' }));
        showToast('Pengajuan verifikasi berhasil dikirim!');
      } else {
        showToast('Gagal mengirim dokumen.');
      }
    } catch (error) {
      showToast('Kesalahan server.');
    }
  };

  // ================= WITHDRAWAL HANDLER =================
  const submitWithdrawal = async () => {
    if (profile.balance <= 0) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, amount: profile.balance })
      });
      if (response.ok) {
        showToast('Pengajuan pencairan berhasil. Maksimal 3 Hari Kerja.');
        setShowWithdrawDialog(false);
        fetchProfile(); 
      } else {
        showToast('Gagal mengajukan pencairan dana.');
      }
    } catch (error) {
      showToast('Kesalahan koneksi ke server.');
    }
  };

  // ================= PROFILE HANDLERS =================
  const handleSaveField = async (field: string, value: string) => {
    if (!user?.email) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, field, value })
      });
      if (response.ok) {
        setProfile((prev: any) => ({ ...prev, [field]: value }));
        if (field === 'name' && login) login({ ...user, name: value });
        setEditSection(null);
        setTempValue('');
        showToast('Profil berhasil diperbarui!');
      } else {
        showToast('Gagal memperbarui profil.');
      }
    } catch (error) { showToast('Terjadi kesalahan koneksi.'); }
  };

  const handlePhoneSubmit = async () => {
    if (phoneStep === 'input') {
      if (!phoneInput || phoneInput.length < 10) return;
      setPhoneStep('otp');
    } else if (phoneStep === 'otp') {
      if (otpInput.length < 4) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update-phone`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user?.email, phone: phoneInput })
        });
        if (response.ok) {
          setProfile((prev: any) => ({ ...prev, phone: phoneInput }));
          setPhoneStep('done');
          setTimeout(() => {
            setShowPhoneDialog(false);
            setPhoneStep('input');
            setPhoneInput('');
            setOtpInput('');
            showToast('Nomor telepon berhasil disimpan!');
          }, 1500);
        } else { showToast('Gagal menyimpan nomor HP.'); }
      } catch (error) { showToast('Kesalahan server.'); }
    }
  };

  // ================= PASSWORD HANDLER =================
  const handlePasswordChange = async () => {
    // 1. Validasi Input Lokal
    if (!passwords.new || passwords.new !== passwords.confirm) {
      showToast('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    if (passwords.new.length < 6) {
      showToast('Password minimal 6 karakter!');
      return;
    }

    // 2. Kirim ke Database Backend
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email, 
          newPassword: passwords.new 
        })
      });

      if (response.ok) {
        // 3. Reset UI jika sukses
        setShowPasswordDialog(false);
        setPasswords({ current: '', new: '', confirm: '' });
        showToast('Password berhasil diubah!');
      } else {
        const data = await response.json();
        showToast(data.error || 'Gagal mengubah password.');
      }
    } catch (error) {
      console.error(error);
      showToast('Kesalahan koneksi ke server.');
    }
  };

  const startEdit = (field: string, currentValue: string) => {
    setEditSection(field);
    setTempValue(currentValue || '');
  };

  if (!user) return null;
  const displayName = profile.nickname || profile.name;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
          </Link>

          <h1 className="text-4xl md:text-5xl mb-2">Pengaturan Profil</h1>
          <p className="text-muted-foreground mb-8">Kelola informasi pribadi dan preferensi akunmu</p>

          {showSuccess && (
            <div className="fixed top-24 right-6 z-[60] bg-white border border-green-200 rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm">{successMsg}</span>
            </div>
          )}

          {/* ===== PROFILE CARD W/ COMPLETENESS & AVATAR UPLOAD ===== */}
          <div className="bg-white rounded-3xl border border-border p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="relative group cursor-pointer shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {profile.avatar ? (
                    <img 
                      src={profile?.avatar?.startsWith('http') ? profile.avatar : `${import.meta.env.VITE_API_URL}/${profile.avatar}`}
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-4xl text-white font-bold">{(displayName || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-secondary transition-colors cursor-pointer z-10">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {profile.owner_status === 'approved' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pemilik Kos
                    </span>
                  ) : profile.phone ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full border border-yellow-200">
                      <AlertCircle className="w-3.5 h-3.5" /> Belum verifikasi HP
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress Bar Kelengkapan */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium text-gray-600">Kelengkapan Profil</span>
                <span className="font-bold text-[#FF6B35]">{completeness}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#FF6B35] h-2 rounded-full transition-all duration-500" style={{ width: `${completeness}%` }}></div>
              </div>
              {completeness < 100 && (
                <p className="text-[10px] text-gray-400 mt-2">Lengkapi data diri Anda untuk keamanan dan kenyamanan bertransaksi.</p>
              )}
            </div>
          </div>

          {/* ===== INFORMASI PRIBADI ===== */}
          <div className="bg-white rounded-3xl border border-border overflow-hidden mb-6 shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-medium flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                Informasi Pribadi
              </h3>
            </div>

            <div className="p-5 border-b border-border flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Nama Lengkap</div>
                  {editSection === 'name' ? (
                    <div className="flex items-center gap-2">
                      <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="rounded-lg h-8 text-sm w-56" autoFocus />
                      <Button size="sm" onClick={() => handleSaveField('name', tempValue)} className="rounded-lg h-8 bg-primary"><Save className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditSection(null)} className="rounded-lg h-8"><X className="w-3.5 h-3.5" /></Button>
                    </div>
                  ) : <div className="text-sm font-medium">{profile.name}</div>}
                </div>
              </div>
              {editSection !== 'name' && <button onClick={() => startEdit('name', profile.name)} className="text-primary hover:underline text-sm flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Ubah</button>}
            </div>

            <div className="p-5 border-b border-border flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <AtSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Nama Panggilan</div>
                  {editSection === 'nickname' ? (
                    <div className="flex items-center gap-2">
                      <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="rounded-lg h-8 text-sm w-56" autoFocus />
                      <Button size="sm" onClick={() => handleSaveField('nickname', tempValue)} className="rounded-lg h-8 bg-primary"><Save className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditSection(null)} className="rounded-lg h-8"><X className="w-3.5 h-3.5" /></Button>
                    </div>
                  ) : <div className="text-sm font-medium">{profile.nickname || <span className="text-muted-foreground italic font-normal">Belum diatur</span>}</div>}
                </div>
              </div>
              {editSection !== 'nickname' && <button onClick={() => startEdit('nickname', profile.nickname)} className="text-primary hover:underline text-sm flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> {profile.nickname ? 'Ubah' : 'Tambah'}</button>}
            </div>

            {/* TEMPAT TANGGAL LAHIR (DI BAWAH NAMA PANGGILAN) */}
            <div className="p-5 border-b border-border flex items-start justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-start gap-3 flex-1 mt-1">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Tempat, Tanggal Lahir</div>
                  {editSection === 'birth_info' ? (
                    <div className="flex flex-col gap-3 max-w-sm">
                      {/* Searchable Custom Dropdown untuk Kota/Kabupaten */}
                      <div className="relative" ref={cityDropdownRef}>
                        <div className="flex items-center border border-input rounded-lg h-10 px-3 bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                          <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                          <input 
                            type="text" 
                            placeholder="Cari Kota / Kabupaten Lahir..." 
                            className="flex-1 outline-none text-sm bg-transparent w-full"
                            value={searchCityQuery}
                            onChange={(e) => {
                              setSearchCityQuery(e.target.value);
                              setShowCityDropdown(true);
                            }}
                            onFocus={() => setShowCityDropdown(true)}
                          />
                        </div>
                        {showCityDropdown && (
                          <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
                            {INDONESIA_CITIES.filter(c => c.toLowerCase().includes(searchCityQuery.toLowerCase())).length === 0 ? (
                              <div className="p-3 text-sm text-gray-500 text-center">Kota/Kabupaten tidak ditemukan</div>
                            ) : (
                              INDONESIA_CITIES.filter(c => c.toLowerCase().includes(searchCityQuery.toLowerCase())).map((city) => (
                                <button 
                                  key={city} 
                                  type="button"
                                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-[#FF6B35] transition-colors border-b border-gray-50 last:border-0"
                                  onClick={() => {
                                    setTempBirthProvince(city);
                                    setSearchCityQuery(city);
                                    setShowCityDropdown(false);
                                  }}
                                >
                                  {city}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Native HTML5 Date Picker untuk Tanggal Lahir */}
                      <div className="flex items-center gap-2">
                        <Input 
                          type="date" 
                          value={tempBirthDate} 
                          onChange={(e) => setTempBirthDate(e.target.value)} 
                          className="rounded-lg h-10 text-sm flex-1 cursor-pointer" 
                        />
                        <Button 
                          size="sm" 
                          disabled={!tempBirthProvince || !tempBirthDate}
                          onClick={() => handleSaveField('birth_info', `${tempBirthProvince} | ${tempBirthDate}`)} 
                          className="rounded-lg h-10 px-4 bg-primary"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditSection(null)} className="rounded-lg h-10 px-4"><X className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ) : <div className="text-sm font-medium">{renderBirthInfo()}</div>}
                </div>
              </div>
              {editSection !== 'birth_info' && (
                <button onClick={() => { 
                  setEditSection('birth_info'); 
                  if (profile.birth_info) {
                    const parts = profile.birth_info.split(' | ');
                    setTempBirthProvince(parts[0]);
                    setSearchCityQuery(parts[0]);
                    setTempBirthDate(parts[1] || '');
                  } else {
                    setTempBirthProvince('');
                    setSearchCityQuery('');
                    setTempBirthDate('');
                  }
                }} className="text-primary hover:underline text-sm flex items-center gap-1 mt-1">
                  <Edit3 className="w-3.5 h-3.5" /> {profile.birth_info ? 'Ubah' : 'Tambah'}
                </button>
              )}
            </div>

            <div className="p-5 border-b border-border flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Email</div>
                  <div className="text-sm font-medium">{profile.email}</div>
                </div>
              </div>
            </div>

            <div className="p-5 border-b border-border flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Nomor Telepon</div>
                  <div className="text-sm font-medium">{profile.phone || <span className="text-muted-foreground italic font-normal">Belum dikaitkan</span>}</div>
                </div>
              </div>
              <button onClick={() => { setShowPhoneDialog(true); setPhoneStep('input'); setPhoneInput(profile.phone); setOtpInput(''); }} className="text-primary hover:underline text-sm flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> {profile.phone ? 'Ganti No. HP' : 'Kaitkan No. HP'}
              </button>
            </div>

            <div className="p-5 flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Jenis Kelamin</div>
                  {editSection === 'gender' ? (
                    <div className="flex items-center gap-2">
                      <select value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="px-3 py-1.5 rounded-lg border text-sm" autoFocus>
                        <option value="">Pilih...</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      <Button size="sm" onClick={() => handleSaveField('gender', tempValue)} className="rounded-lg h-8 bg-primary"><Save className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditSection(null)} className="rounded-lg h-8"><X className="w-3.5 h-3.5" /></Button>
                    </div>
                  ) : <div className="text-sm font-medium">{profile.gender || <span className="text-muted-foreground italic font-normal">Belum diatur</span>}</div>}
                </div>
              </div>
              {editSection !== 'gender' && <button onClick={() => startEdit('gender', profile.gender)} className="text-primary hover:underline text-sm flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> {profile.gender ? 'Ubah' : 'Tambah'}</button>}
            </div>
          </div>

          {/* ===== VERIFIKASI IDENTITAS ===== */}
          <div className="bg-white rounded-3xl border border-border overflow-hidden mb-6 shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-medium flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Verifikasi Identitas (Pemilik Kos)
              </h3>
            </div>
            <div className="p-6">
              {profile.owner_status === 'approved' ? (
                <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <p className="font-bold">Identitas Terverifikasi</p>
                    <p className="text-sm">Akun Anda telah disetujui. Anda sudah dapat mendaftarkan properti kos.</p>
                  </div>
                </div>
              ) : profile.owner_status === 'pending' ? (
                <div className="flex items-center gap-3 bg-yellow-50 text-yellow-700 p-4 rounded-xl border border-yellow-100">
                  <Clock className="w-6 h-6 shrink-0" />
                  <div>
                    <p className="font-bold">Menunggu Verifikasi Admin</p>
                    <p className="text-sm">Dokumen KTP Anda sedang dalam proses peninjauan (Maks. 1x24 jam).</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifySubmit} className="space-y-4">
                  {profile.owner_status === 'rejected' && (
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-4">
                      <XCircle className="w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-bold">Verifikasi Ditolak</p>
                        <p className="text-sm">Dokumen tidak valid atau buram. Silakan unggah ulang foto yang lebih jelas.</p>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    Untuk mendaftarkan kos, Anda wajib mengunggah foto KTP asli dan foto Selfie memegang KTP.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block text-sm font-bold">Foto KTP Asli</Label>
                      <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors h-48">
                        {ktpPreview ? (
                          <div className="relative w-full h-full bg-black">
                            <img src={ktpPreview} alt="KTP" className="w-full h-full object-contain" />
                            <button type="button" onClick={() => {setKtpFile(null); setKtpPreview('')}} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center py-6 px-4 text-center h-full">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs font-semibold text-primary">Klik untuk pilih file</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleKtpChange} required />
                          </label>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-bold">Selfie dgn KTP</Label>
                      <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors h-48">
                        {selfiePreview ? (
                          <div className="relative w-full h-full bg-black">
                            <img src={selfiePreview} alt="Selfie" className="w-full h-full object-contain" />
                            <button type="button" onClick={() => {setSelfieFile(null); setSelfiePreview('')}} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center py-6 px-4 text-center h-full">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs font-semibold text-primary">Klik untuk pilih file</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleSelfieChange} required />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#002855] hover:bg-[#003570] rounded-xl mt-2 h-12">
                    Kirim Pengajuan Verifikasi
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* ===== DATA REKENING BANK & PENCAIRAN ===== */}
          {profile.owner_status === 'approved' && (
            <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm mb-6">
              <div className="p-6 border-b border-border">
                <h3 className="font-medium flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Data Rekening (Untuk Pencairan Dana)
                </h3>
              </div>
              
              <div className="p-5 border-b border-border flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Nama Bank</div>
                    {editSection === 'bank_name' ? (
                      <div className="flex items-center gap-2">
                        <select value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="px-3 py-1.5 rounded-lg border text-sm w-56" autoFocus>
                          <option value="">Pilih Bank...</option>
                          <option value="BCA">BCA</option>
                          <option value="Mandiri">Mandiri</option>
                          <option value="BNI">BNI</option>
                          <option value="BRI">BRI</option>
                          <option value="BSI">BSI</option>
                          <option value="CIMB Niaga">CIMB Niaga</option>
                        </select>
                        <Button size="sm" onClick={() => handleSaveField('bank_name', tempValue)} className="rounded-lg h-8 bg-primary"><Save className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditSection(null)} className="rounded-lg h-8"><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    ) : <div className="text-sm font-bold text-gray-900">{profile.bank_name || <span className="text-muted-foreground italic font-normal">Belum diatur</span>}</div>}
                  </div>
                </div>
                {editSection !== 'bank_name' && <button onClick={() => startEdit('bank_name', profile.bank_name)} className="text-primary hover:underline text-sm flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> {profile.bank_name ? 'Ubah' : 'Tambah'}</button>}
              </div>

              <div className="p-5 border-b border-border flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Nomor Rekening</div>
                    {editSection === 'bank_account' ? (
                      <div className="flex items-center gap-2">
                        <Input type="number" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="rounded-lg h-8 text-sm w-56" autoFocus />
                        <Button size="sm" onClick={() => handleSaveField('bank_account', tempValue)} className="rounded-lg h-8 bg-primary"><Save className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditSection(null)} className="rounded-lg h-8"><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    ) : <div className="text-sm font-mono text-gray-900">{profile.bank_account || <span className="text-muted-foreground italic font-sans">Belum diatur</span>}</div>}
                  </div>
                </div>
                {editSection !== 'bank_account' && <button onClick={() => startEdit('bank_account', profile.bank_account)} className="text-primary hover:underline text-sm flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> {profile.bank_account ? 'Ubah' : 'Tambah'}</button>}
              </div>

              <div className="p-5 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Atas Nama Rekening</div>
                    {editSection === 'bank_account_name' ? (
                      <div className="flex items-center gap-2">
                        <Input value={tempValue} onChange={(e) => setTempValue(e.target.value.toUpperCase())} className="rounded-lg h-8 text-sm w-56" autoFocus />
                        <Button size="sm" onClick={() => handleSaveField('bank_account_name', tempValue)} className="rounded-lg h-8 bg-primary"><Save className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditSection(null)} className="rounded-lg h-8"><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    ) : <div className="text-sm font-bold text-gray-900">{profile.bank_account_name || <span className="text-muted-foreground italic font-normal">Belum diatur</span>}</div>}
                  </div>
                </div>
                {editSection !== 'bank_account_name' && <button onClick={() => startEdit('bank_account_name', profile.bank_account_name)} className="text-primary hover:underline text-sm flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> {profile.bank_account_name ? 'Ubah' : 'Tambah'}</button>}
              </div>
            </div>
          )}

          {/* ===== PROPERTI KOS SAYA (DENGAN SALDO PENDAPATAN) ===== */}
          {profile.owner_status === 'approved' && (
            <div className="bg-white rounded-3xl border border-border overflow-hidden mb-6 shadow-sm">
              <div className="p-6 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h3 className="font-medium flex items-center gap-2 text-lg">
                  <Building className="w-5 h-5 text-[#FF6B35]" /> Properti Kos Saya
                </h3>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex-1 md:flex-none">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Saldo Pendapatan</span>
                    <span className="font-bold text-[#FF6B35] text-lg">Rp {(profile.balance || 0).toLocaleString('id-ID')}</span>
                  </div>
                  <Button 
                    onClick={() => {
                      if (!profile.bank_name || !profile.bank_account || !profile.bank_account_name) {
                        showToast("Harap lengkapi Data Rekening Bank terlebih dahulu.");
                      } else {
                        setShowWithdrawDialog(true);
                      }
                    }} 
                    disabled={!profile.balance || profile.balance <= 0} 
                    className="rounded-xl bg-green-600 hover:bg-green-700 text-white h-12 shadow-md w-full md:w-auto"
                  >
                    <Wallet className="w-4 h-4 mr-2" /> Tarik Saldo
                  </Button>
                  <Link to="/indekos-input" className="w-full md:w-auto">
                    <Button className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white w-full h-12 shadow-md">
                      <Plus className="w-4 h-4 mr-1" /> Tambah Kos
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6 bg-gray-50/50">
                {myKosts.length === 0 ? (
                  <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl">
                    <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">Anda belum memiliki properti kos yang didaftarkan.</p>
                    <Link to="/indekos-input"><Button variant="outline" className="rounded-xl border-[#FF6B35] text-[#FF6B35] hover:bg-orange-50">Mulai Daftarkan Kos</Button></Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myKosts.map((kos, i) => (
                      <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-2xl hover:border-[#FF6B35]/50 transition-colors bg-white shadow-sm hover:shadow-md">
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {kos.image ? (
                            <img src={`${import.meta.env.VITE_API_URL}/${kos.image}`} alt={kos.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><Building className="w-8 h-8" /></div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h4 className="font-bold text-gray-900 line-clamp-1">{kos.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 mb-2 truncate"><MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{kos.location}</span></div>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm font-bold text-[#FF6B35]">Rp {parseInt(kos.price).toLocaleString('id-ID')}</span>
                            <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${kos.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' : kos.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                              {kos.status === 'approved' ? 'Aktif' : kos.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== SECURITY ===== */}
          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-medium flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Keamanan
              </h3>
            </div>
            <button onClick={() => { setShowPasswordDialog(true); setPasswords({ current: '', new: '', confirm: '' }); }} className="w-full p-5 flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="text-sm font-bold">Ubah Password</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Perbarui password untuk keamanan akun</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* ========== DIALOG PENCAIRAN DANA ========== */}
      {showWithdrawDialog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowWithdrawDialog(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold flex items-center gap-2"><Wallet className="w-5 h-5 text-[#FF6B35]" /> Tarik Saldo Pendapatan</h2>
              <button onClick={() => setShowWithdrawDialog(false)} className="text-gray-400 hover:text-gray-900 bg-white rounded-full p-1 shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-600 mb-1">Nominal yang ditarik</p>
                <p className="text-3xl font-bold text-[#FF6B35]">Rp {(profile.balance || 0).toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">Dana akan ditransfer ke rekening:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/60">
                    <span className="text-xs text-gray-500 uppercase font-bold">Bank Tujuan</span>
                    <span className="text-sm font-bold text-gray-900">{profile.bank_name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/60">
                    <span className="text-xs text-gray-500 uppercase font-bold">No. Rekening</span>
                    <span className="text-sm font-mono font-bold text-gray-900">{profile.bank_account}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase font-bold">Atas Nama</span>
                    <span className="text-sm font-bold text-gray-900">{profile.bank_account_name}</span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-xs flex gap-2 border border-yellow-100">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Pencairan dana akan diproses oleh Tim Admin SpotKos dalam waktu <b>maksimal 3 hari kerja</b>. Pastikan data rekening Anda sudah benar.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setShowWithdrawDialog(false)}>Batal</Button>
                <Button onClick={submitWithdrawal} className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white h-12 shadow-md">Kirim Pengajuan</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== PHONE DIALOG ========== */}
      {showPhoneDialog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowPhoneDialog(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">{profile.phone ? 'Ganti Nomor Telepon' : 'Kaitkan Nomor Telepon'}</h2>
              <button onClick={() => setShowPhoneDialog(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {phoneStep === 'input' && (
                <>
                  <div>
                    <Label className="mb-2 block text-sm font-bold">Nomor Telepon</Label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-3 bg-secondary rounded-xl text-sm font-bold">+62</span>
                      <Input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9-]/g, ''))} className="rounded-xl flex-1 h-11" autoFocus />
                    </div>
                  </div>
                  <Button onClick={handlePhoneSubmit} disabled={!phoneInput || phoneInput.length < 10} className="w-full rounded-xl bg-primary h-12">Kirim Kode OTP</Button>
                </>
              )}
              {phoneStep === 'otp' && (
                <>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Kode OTP telah dikirim ke</p>
                    <p className="font-bold text-lg">+62 {phoneInput}</p>
                  </div>
                  <div>
                    <Input type="text" maxLength={6} value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))} className="rounded-xl text-center text-3xl tracking-[0.5em] h-14" autoFocus />
                  </div>
                  <Button onClick={handlePhoneSubmit} disabled={otpInput.length < 4} className="w-full rounded-xl bg-primary h-12">Verifikasi</Button>
                </>
              )}
              {phoneStep === 'done' && (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Berhasil Diperbarui!</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== PASSWORD DIALOG ========== */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowPasswordDialog(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Ubah Password</h2>
              <button onClick={() => setShowPasswordDialog(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="mb-2 block text-sm font-bold">Password Baru</Label>
                <div className="relative">
                  <Input type={showPass.new ? 'text' : 'password'} value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="rounded-xl pr-10 h-11" placeholder="Minimal 6 karakter" />
                  <button onClick={() => setShowPass({ ...showPass, new: !showPass.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input type={showPass.confirm ? 'text' : 'password'} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="rounded-xl pr-10 h-11" placeholder="Ulangi password baru" />
                  <button onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <Button onClick={handlePasswordChange} disabled={!passwords.new || passwords.new !== passwords.confirm || passwords.new.length < 6} className="w-full rounded-xl bg-primary mt-4 h-12">Simpan Password</Button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}