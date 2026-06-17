import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { io, Socket } from 'socket.io-client'; // Import Socket.IO
import {
  ShieldCheck, MessageSquare, Users, FileText,
  Search, CheckCircle2, XCircle, Clock, Eye, Edit3, Trash2,
  Plus, X, Save, Mail, Phone, User, ChevronDown, ChevronUp, Send,
  LogOut, Lock, Menu as MenuIcon, Receipt, Download,
  AlertTriangle, Tag, Type, AlignLeft, Image as ImageIcon,
  Wallet, Home // Icon untuk Penarikan Saldo
} from 'lucide-react';

// ===================== TYPES =====================

type AdminSection = 'verification' | 'withdrawals' | 'customer-service' | 'articles' | 'users' | 'live-chat' | 'transactions' | 'kost-approval' | 'promos';

interface OwnerVerification {
  id: string;
  name: string;
  phone: string;
  email: string;
  kostName: string;
  location: string;
  ktpNumber: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

interface CSTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  replies: { sender: string; message: string; date: string }[];
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'pencari' | 'pemilik';
  joinDate: string;
  status: 'active' | 'suspended';
  totalBookings: number;
  totalKosts?: number;
}

// ===================== COMPONENT =====================

export function AdminPanel() {
  // ===================== HOOKS AREA (HARUS DI ATAS) =====================
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('adminToken') === 'true');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [promosData, setPromosData] = useState<any[]>([]);
  const [promoForm, setPromoForm] = useState({ code: '', discount: '', sector: 'kos', min_purchase: '', valid_until: '' });

  const [section, setSection] = useState<AdminSection>('verification');
  const [verifications, setVerifications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // STATE PENARIKAN SALDO (WITHDRAWALS)
  const [withdrawalsData, setWithdrawalsData] = useState<any[]>([]);
  const [wdFilter, setWdFilter] = useState<string>('all');

  // STATE TRANSAKSI
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [trxFilter, setTrxFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');

  const [kostApprovals, setKostApprovals] = useState<any[]>([]);
  const [kostFilter, setKostFilter] = useState<string>('pending');

  const [inspectKost, setInspectKost] = useState<any | null>(null);
  const [editKostForm, setEditKostForm] = useState({ name: '', price: '', status: '' });
  const [isEditingKost, setIsEditingKost] = useState(false);

  const [verFilterStatus, setVerFilterStatus] = useState<string>('all');
  const [expandedVer, setExpandedVer] = useState<string | null>(null);

  const [csFilterStatus, setCsFilterStatus] = useState<string>('all');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [articlesData, setArticlesData] = useState<any[]>([]);
  const [articleMode, setArticleMode] = useState<'list' | 'create'>('list');
  const [articleForm, setArticleForm] = useState({ title: '', excerpt: '', image: '', category: 'Tips & Trik', readTime: '5 menit', author: 'Tim SpotKos', intro: '', sections: [{ heading: '', content: '' }], conclusion: '' });
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const [userFilter, setUserFilter] = useState<string>('all');
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [supportChats, setSupportChats] = useState<any[]>([]);
  const [activeChatEmail, setActiveChatEmail] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // ===================== FETCHING =====================
  const fetchVerifications = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications`)
      .then(res => res.json())
      .then(data => setVerifications(data))
      .catch(err => console.error(err));
  };

  const fetchWithdrawals = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/withdrawals`)
      .then(res => res.json())
      .then(data => setWithdrawalsData(data))
      .catch(err => console.error(err));
  };

  const fetchKostApprovals = () => {
    // ✅ URL disesuaikan dengan backend
    fetch(`${import.meta.env.VITE_API_URL}/api/rooms/admin/all`, {
      headers: { 'ngrok-skip-browser-warning': 'true' } 
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setKostApprovals(data);
        } else {
          console.error('API Error (Bukan Array):', data);
          setKostApprovals([]); 
        }
      })
      .catch(err => {
        console.error('Fetch kost error:', err);
        setKostApprovals([]);
      });
  };

  const fetchSupportChats = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/support/chats`, {
      headers: { 'ngrok-skip-browser-warning': 'true' } // ✅ Bypass proteksi Ngrok
    })
      .then(res => res.json())
      .then(data => {
        // ✅ Proteksi: Pastikan hanya data Array yang boleh masuk ke State
        if (Array.isArray(data)) {
          setSupportChats(data);
        } else {
          console.error('Support Chats API Error:', data);
          setSupportChats([]); 
        }
      })
      .catch(err => {
        console.error(err);
        setSupportChats([]);
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchVerifications();
      fetchWithdrawals();
      fetchSupportChats();
      fetchKostApprovals();
      fetch(`${import.meta.env.VITE_API_URL}/api/rooms`).then(res => res.json()).then(data => setRoomsData(data)).catch(err => console.error(err));
      fetch(`${import.meta.env.VITE_API_URL}/api/users`).then(res => res.json()).then(data => setUsersData(data)).catch(err => console.error(err));
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/transactions`)
        .then(res => res.json())
        .then(data => {
            setTransactionsData(Array.isArray(data) ? data : []);
        })
        .catch(err => { console.error(err); setTransactionsData([]); });
      fetch(`${import.meta.env.VITE_API_URL}/api/articles`).then(res => res.json()).then(data => setArticlesData(data)).catch(err => console.error(err));
      fetch(`${import.meta.env.VITE_API_URL}/api/tickets`).then(res => res.json()).then(data => setTickets(data)).catch(err => console.error(err));
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/promos`)
        .then(res => res.json())
        .then(data => {
            setPromosData(Array.isArray(data) ? data : []);
        })
        .catch(err => { console.error(err); setPromosData([]); });
      

      // Koneksi WebSocket khusus untuk Notifikasi Real-time
      socketRef.current = io(import.meta.env.VITE_API_URL);
      
      // Mendengarkan sinyal dari request penarikan baru
      socketRef.current.on('admin_withdrawal_update', () => {
        fetchWithdrawals(); // Otomatis refresh data jika ada pengajuan baru / update
      });

      socketRef.current.on('new_support_chat', () => {
        fetchSupportChats(); // Tarik ulang data chat tanpa refresh halaman
      });
      
      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeChatEmail, supportChats, section]);

  // ===================== LOGIKA PDF TRANSAKSI =====================
  const filteredTransactions = transactionsData.filter((trx) => {
    if (trxFilter === 'all') return true;
    const trxDate = new Date(trx.raw_date || trx.datetime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - trxDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (trxFilter === 'week') return diffDays <= 7;
    if (trxFilter === 'month') return diffDays <= 30;
    if (trxFilter === 'year') return diffDays <= 365;
    return true;
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const filterLabel = trxFilter === 'all' ? 'Semua Waktu' : trxFilter === 'week' ? '7 Hari Terakhir' : trxFilter === 'month' ? '30 Hari Terakhir' : '1 Tahun Terakhir';
    
    doc.setFontSize(16);
    doc.text(`Laporan Pendapatan SpotKos (${filterLabel})`, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Diunduh pada: ${new Date().toLocaleDateString('id-ID')} | Total: ${filteredTransactions.length} Transaksi`, 14, 28);

    let totalRevenue = 0;
    let totalProfit = 0;

    const tableData = filteredTransactions.map((trx, index) => {
      const revenue = parseInt(trx.total_price);
      const profit = trx.status === 'paid' ? revenue * 0.10 : 0; 
      
      if (trx.status === 'paid') {
        totalRevenue += revenue;
        totalProfit += profit;
      }

      return [
        index + 1,
        trx.invoice_id,
        trx.datetime,
        trx.kost_name,
        `Rp ${revenue.toLocaleString('id-ID')}`,
        trx.status === 'paid' ? `Rp ${profit.toLocaleString('id-ID')}` : 'Rp 0',
        trx.status === 'paid' ? 'Berhasil' : trx.status === 'failed' ? 'Batal' : 'Menunggu'
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['No', 'Invoice', 'Waktu', 'Kos', 'Nominal (Rp)', 'Untung 10% (Rp)', 'Status']],
      body: tableData,
      foot: [['', '', '', 'TOTAL BERHASIL', `Rp ${totalRevenue.toLocaleString('id-ID')}`, `Rp ${totalProfit.toLocaleString('id-ID')}`, '']],
      theme: 'grid',
      headStyles: { fillColor: [255, 107, 53] }, 
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    doc.save(`Laporan_SpotKos_${trxFilter}.pdf`);
  };

  // ===================== HANDLERS =====================
  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogin = async () => {
    setLoginError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem('adminToken', 'true'); 
        setLoginError('');
      } else {
        setLoginError(data.error || 'Gagal masuk. Periksa kembali kredensial Anda.');
      }
    } catch (error) {
      console.error('Koneksi Error:', error);
      setLoginError('Gagal terhubung ke server. Pastikan backend menyala.');
    }
  };

  const handleVerifyAction = async (email: string, action: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications/action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action })
      });
      if (res.ok) {
        showToast(action === 'approved' ? 'Pemilik kost disetujui!' : 'Verifikasi ditolak.');
        fetchVerifications(); 
        setExpandedVer(null);
      } else {
        showToast('Gagal memproses verifikasi.');
      }
    } catch (error) {
      showToast('Kesalahan server.');
    }
  };

  const handleWithdrawalAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/withdrawals/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      if (res.ok) {
        showToast(`Penarikan saldo berhasil ${action === 'approved' ? 'disetujui' : 'ditolak'}!`);
        fetchWithdrawals(); // Refresh data
      } else {
        showToast('Gagal memproses penarikan saldo.');
      }
    } catch (error) {
      showToast('Kesalahan server.');
    }
  };

  const handleKostApprovalAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });
      if (res.ok) {
        showToast(`Properti kos berhasil ${action === 'approved' ? 'disetujui' : 'ditolak'}!`);
        fetchKostApprovals(); // Refresh data otomatis
      } else {
        showToast('Gagal memproses status kos.');
      }
    } catch (error) {
      showToast('Kesalahan server.');
    }
  };

  const handleDeleteKostAdmin = async (id: string) => {
    if (!window.confirm("Hapus properti kos ini secara permanen? Data tidak dapat dikembalikan.")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`, {
        method: 'DELETE', headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) {
        setKostApprovals(prev => prev.filter(k => k.id !== id));
        showToast('Kos berhasil dihapus permanen.');
        setInspectKost(null);
      } else showToast('Gagal menghapus kos.');
    } catch (error) { showToast('Kesalahan server.'); }
  };

  const handleSaveEditKost = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/admin/${inspectKost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editKostForm)
      });
      if (res.ok) {
        showToast('Data kos berhasil diperbarui!');
        fetchKostApprovals();
        setInspectKost(null);
        setIsEditingKost(false);
      } else showToast('Gagal memperbarui data.');
    } catch (error) { showToast('Kesalahan server.'); }
  };

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'Admin SpotKos', message: replyText })
      });

      if (response.ok) {
        const today = new Date();
        const dateStr = `${today.getDate()} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'][today.getMonth()]} ${today.getFullYear()}`;
        
        setTickets((prev) => prev.map((t) => t.id === ticketId ? {
          ...t, status: 'in-progress' as const,
          replies: [...t.replies, { sender: 'Admin SpotKos', message: replyText, date: dateStr }],
        } : t));
        
        setReplyText('');
        showToast('Balasan tersimpan ke database!');
      } else {
        showToast('Gagal! Server menolak balasan.');
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal terhubung ke database.');
    }
  };

  const handleResolve = async (ticketId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });

      if (response.ok) {
        setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: 'resolved' as const } : t));
        showToast('Status tiket diselesaikan!');
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal mengubah status di database.');
    }
  };
  
  const handleToggleUserStatus = async (id: string) => {
    const userToUpdate = usersData.find(u => u.id === id);
    if (!userToUpdate) return;

    const newStatus = userToUpdate.status === 'active' ? 'suspended' : 'active';

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setUsersData((prev: any[]) => prev.map((u: any) => 
          u.id === id ? { ...u, status: newStatus } : u
        ));
        
        showToast(`Pengguna berhasil ${newStatus === 'active' ? 'diaktifkan' : 'disuspend'}!`);
      } else {
        showToast('Gagal! Server menolak perubahan status.');
      }
    } catch (error) {
      console.error(error);
      showToast('Terjadi kesalahan koneksi ke database.');
    }
  };

  // Stats
  const stats = {
    totalUsers: usersData.length,
    totalKosts: roomsData.length, 
    pendingVerifications: verifications.filter((v) => v.status === 'pending').length,
    pendingWithdrawals: withdrawalsData.filter((w) => w.status === 'pending').length, // Data Penarikan
    openTickets: tickets.filter((t) => t.status !== 'resolved').length,
    totalArticles: articlesData.length,
    pendingKosts: (Array.isArray(kostApprovals) ? kostApprovals : []).filter((k) => k.status === 'pending').length,
  };

  const filteredVerifications = verFilterStatus === 'all' ? verifications : verifications.filter((v) => v.status === verFilterStatus);
  const filteredWithdrawals = wdFilter === 'all' ? withdrawalsData : withdrawalsData.filter((w) => w.status === wdFilter);
  const safeKostApprovals = Array.isArray(kostApprovals) ? kostApprovals : [];
  const filteredKosts = kostFilter === 'all' ? safeKostApprovals : safeKostApprovals.filter(k => k.status === kostFilter);
  const filteredTickets = csFilterStatus === 'all' ? tickets : tickets.filter((t) => t.status === csFilterStatus);
  const filteredUsers = usersData.filter((u) => {
    const matchRole = userFilter === 'all' || u?.role === userFilter;
    const matchSearch = u?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const sidebarItems: { key: AdminSection; icon: React.ElementType; label: string; badge?: number }[] = [
    { key: 'verification', icon: ShieldCheck, label: 'Verifikasi Pemilik', badge: stats.pendingVerifications },
    { key: 'kost-approval', icon: Home, label: 'Panel Kos', badge: stats.pendingKosts },
    { key: 'withdrawals', icon: Wallet, label: 'Penarikan Saldo', badge: stats.pendingWithdrawals }, // Menu Baru
    { key: 'transactions', icon: Receipt, label: 'Data Transaksi' },
    { key: 'promos', icon: Tag, label: 'Kelola Promo' },
    { key: 'live-chat', icon: MessageSquare, label: 'Live Chat (Support)' },
    { key: 'customer-service', icon: Mail, label: 'Tiket Bantuan', badge: stats.openTickets },
    { key: 'articles', icon: FileText, label: 'Kelola Artikel', badge: articlesData.length },
    { key: 'users', icon: Users, label: 'Data Pengguna' },
  ];

  // ===================== LOGIN SCREEN =====================
  // DITARUH SETELAH SEMUA HOOKS REACT DIPANGGIL
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#ff8c5a] rounded-2xl mb-4 shadow-lg shadow-[#FF6B35]/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-1">SpotKos Admin</h1>
            <p className="text-gray-400 text-sm">Panel manajemen platform SpotKos</p>
          </div>

          {/* Login Card */}
          <div className="bg-[#16213e] rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
            <h2 className="text-xl text-white mb-6 text-center">Masuk ke Admin Panel</h2>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 mb-2 block text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@spotkos.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-[#FF6B35] transition-colors placeholder:text-gray-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400 mb-2 block text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-[#FF6B35] transition-colors placeholder:text-gray-600"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] text-white rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                Masuk
              </button>
            </div>
          </div> 

          <p className="text-center text-gray-600 text-xs mt-6">
            &copy; 2026 SpotKos. Admin Panel v2.0
          </p>
        </div>
      </div>
    );
  }

  // ===================== ADMIN DASHBOARD =====================
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-[#1a1a2e] text-white flex flex-col transition-all duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Header */}
        <div className="p-5 border-b border-gray-700/50 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-[#ff8c5a] rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h2 className="text-sm text-white">SpotKos</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setSection(item.key); setSearchQuery(''); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                section === item.key
                  ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              {sidebarOpen && item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  section === item.key ? 'bg-white/20' : 'bg-[#FF6B35]/20 text-[#FF6B35]'
                }`}>
                  {item.badge}
                </span>
              )}
              {!sidebarOpen && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute right-2 top-1 w-2 h-2 bg-[#FF6B35] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700/50">
          <Link to="/">
            <button
            onClick={() => { setIsLoggedIn(false); localStorage.removeItem('adminToken'); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            </button>
          </Link>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Lock className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
              <MenuIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block text-gray-400 hover:text-gray-600">
              <MenuIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg text-gray-900 font-bold">
                {section === 'verification' && 'Verifikasi Pemilik Kos'}
                {section === 'withdrawals' && 'Penarikan Saldo Pemilik'}
                {section === 'customer-service' && 'Customer Service'}
                {section === 'articles' && 'Kelola Artikel'}
                {section === 'users' && 'Data Pengguna'}
                {section === 'transactions' && 'Data Transaksi'}
                {section === 'live-chat' && 'Live Chat (Support)'}
              </h1>
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#ff8c5a] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="px-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Verifikasi Pending', value: stats.pendingVerifications, icon: ShieldCheck, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
              { label: 'Tiket Terbuka', value: stats.openTickets, icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
              { label: 'Total Artikel', value: stats.totalArticles, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
              { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <span className={`text-2xl ${s.color} font-bold`}>{s.value}</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-6 right-6 z-[60] bg-white border border-green-200 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 px-6 pb-8">

          {/* =================== VERIFICATION =================== */}
          {section === 'verification' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'pending', 'approved', 'rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setVerFilterStatus(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      verFilterStatus === s ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-white border border-gray-200 hover:border-[#FF6B35]/50 text-gray-700'
                    }`}
                  >
                    {s === 'all' ? 'Semua' : s === 'pending' ? 'Menunggu' : s === 'approved' ? 'Disetujui' : 'Ditolak'}
                    {s === 'pending' && ` (${verifications.filter((v) => v.status === 'pending').length})`}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredVerifications.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-200">Tidak ada data verifikasi pada kategori ini.</div>
                ) : filteredVerifications.map((ver) => {
                  const isExpanded = expandedVer === ver.id;
                  const statusColors = {
                    pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', label: 'Menunggu', Icon: Clock },
                    approved: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', label: 'Disetujui', Icon: CheckCircle2 },
                    rejected: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', label: 'Ditolak', Icon: XCircle },
                  }[ver.status as 'pending' | 'approved' | 'rejected'];

                  return (
                    <div key={ver.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setExpandedVer(isExpanded ? null : ver.id)}
                        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-[#FF6B35]" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{ver.name}</div>
                            <div className="text-sm text-gray-500 mt-0.5">{ver.kostName} - {ver.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors.bg} ${statusColors.border} border ${statusColors.text}`}>
                            <statusColors.Icon className="w-3.5 h-3.5" /> {statusColors.label}
                          </span>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div><span className="text-gray-500 block mb-1">Nama Lengkap</span><span className="font-bold text-gray-900">{ver.name}</span></div>
                            <div><span className="text-gray-500 block mb-1">Email</span><span className="font-medium text-gray-900">{ver.email}</span></div>
                            <div><span className="text-gray-500 block mb-1">Nomor Telepon</span><span className="font-medium text-gray-900">{ver.phone}</span></div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <span className="text-gray-600 text-sm font-bold block mb-2">Foto KTP Asli</span>
                              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 h-48 flex items-center justify-center relative shadow-sm">
                                {ver.ktp_image ? (<img src={`${import.meta.env.VITE_API_URL}/${ver.ktp_image}`} alt="KTP" className="w-full h-full object-contain" />
                                ) : <span className="text-gray-400">Tidak ada gambar</span>}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600 text-sm font-bold block mb-2">Foto Selfie dgn KTP</span>
                              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 h-48 flex items-center justify-center relative shadow-sm">
                                {ver.selfie_image ? (
                                  <img src={`${import.meta.env.VITE_API_URL}/${ver.selfie_image}`} alt="Selfie" className="w-full h-full object-contain" />
                                ) : <span className="text-gray-400">Tidak ada gambar</span>}
                              </div>
                            </div>
                          </div>

                          {ver.status === 'pending' && (
                            <div className="flex gap-2 border-t border-gray-200 pt-4">
                              <Button onClick={() => handleVerifyAction(ver.email, 'approved')} className="rounded-xl bg-green-600 hover:bg-green-700 font-bold" size="sm">
                                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Setujui Dokumen
                              </Button>
                              <Button onClick={() => handleVerifyAction(ver.email, 'rejected')} variant="outline" className="rounded-xl font-bold text-red-600 border-red-200 hover:bg-red-50" size="sm">
                                <XCircle className="w-4 h-4 mr-1.5" /> Tolak Dokumen
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================== KOST APPROVAL =================== */}
          {section === 'kost-approval' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'pending', 'approved', 'rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setKostFilter(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      kostFilter === s ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-white border border-gray-200 hover:border-[#FF6B35]/50 text-gray-700'
                    }`}
                  >
                    {s === 'all' ? 'Semua' : s === 'pending' ? 'Menunggu' : s === 'approved' ? 'Disetujui' : 'Ditolak'}
                    {s === 'pending' && ` (${kostApprovals.filter(k => k.status === 'pending').length})`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredKosts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-200">
                    Tidak ada data properti pada kategori ini.
                  </div>
                ) : filteredKosts.map((kost) => (
                  <div key={kost.id} className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="h-48 bg-gray-100 relative shrink-0">
                      <img src={`${import.meta.env.VITE_API_URL}/${kost.image}`} alt={kost.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400')} />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${
                          kost.status === 'approved' ? 'bg-green-100 text-green-700' :
                          kost.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {kost.status === 'approved' ? 'Disetujui' : kost.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{kost.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-1">{kost.location}</p>
                      
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="text-xs overflow-hidden">
                          <p className="font-bold text-gray-700 truncate">{kost.owner_name}</p>
                          <p className="text-gray-500 truncate">{kost.owner_email}</p>
                        </div>
                      </div>

                      {/* AREA TOMBOL AKSI */}
                      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-auto">
                        {kost.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button onClick={() => handleKostApprovalAction(kost.id, 'approved')} className="flex-1 bg-green-600 hover:bg-green-700 font-bold rounded-xl" size="sm">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Setujui
                            </Button>
                            <Button onClick={() => handleKostApprovalAction(kost.id, 'rejected')} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl" size="sm">
                              <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                            </Button>
                          </div>
                        )}
                        <Button 
                          onClick={() => {
                            setInspectKost(kost);
                            setEditKostForm({ name: kost.name, price: kost.price, status: kost.status });
                            setIsEditingKost(false);
                          }} 
                          variant="outline" 
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 font-bold rounded-xl" size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1.5" /> Inspect / Edit
                        </Button>
                        <Button 
                          onClick={() => handleDeleteKostAdmin(kost.id)} 
                          variant="outline" 
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl" size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Hapus Permanen
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================== WITHDRAWALS (PENARIKAN SALDO) =================== */}
          {section === 'withdrawals' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'pending', 'approved', 'rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setWdFilter(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      wdFilter === s ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-white border border-gray-200 hover:border-[#FF6B35]/50 text-gray-700'
                    }`}
                  >
                    {s === 'all' ? 'Semua' : s === 'pending' ? 'Menunggu' : s === 'approved' ? 'Disetujui' : 'Ditolak'}
                    {s === 'pending' && ` (${withdrawalsData.filter(w => w.status === 'pending').length})`}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredWithdrawals.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-200">Tidak ada data penarikan saldo pada kategori ini.</div>
                ) : filteredWithdrawals.map((wd) => (
                   <div key={wd.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-5 hover:border-orange-200 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         
                         {/* Info User & Jumlah Uang */}
                         <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0 border border-green-100">
                               <Wallet className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                               <h3 className="font-black text-gray-900 text-xl tracking-tight">Rp {parseInt(wd.amount).toLocaleString('id-ID')}</h3>
                               <p className="text-sm font-medium text-gray-700 mt-1">{wd.full_name}</p>
                               <p className="text-xs text-gray-500">{wd.email}</p>
                               <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5"><Clock className="w-3 h-3"/> {new Date(wd.created_at).toLocaleString('id-ID')}</div>
                            </div>
                         </div>

                         {/* Informasi Rekening */}
                         <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 text-sm md:text-right min-w-[220px]">
                            <div className="text-orange-600/70 text-xs font-bold uppercase tracking-wider mb-2">Tujuan Transfer</div>
                            <div className="font-bold text-gray-900">{wd.bank_name}</div>
                            <div className="text-gray-700 font-mono mt-0.5">{wd.bank_account}</div>
                            <div className="text-gray-600 text-xs uppercase font-bold mt-1.5">{wd.bank_account_name}</div>
                         </div>

                         {/* Action / Status */}
                         <div className="flex flex-col items-end gap-3 shrink-0 justify-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                               wd.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                               wd.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                               'bg-yellow-50 text-yellow-600 border-yellow-200'
                            }`}>
                               {wd.status === 'approved' ? 'Disetujui' : wd.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                            </span>
                            
                            {wd.status === 'pending' && (
                               <div className="flex gap-2">
                                  <Button onClick={() => handleWithdrawalAction(wd.id, 'approved')} size="sm" className="rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-sm h-9">
                                     <CheckCircle2 className="w-4 h-4 mr-1.5" /> Transfer Selesai
                                  </Button>
                                  <Button onClick={() => handleWithdrawalAction(wd.id, 'rejected')} size="sm" variant="outline" className="rounded-xl font-bold text-red-600 border-red-200 hover:bg-red-50 h-9">
                                     <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                                  </Button>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          )}

          {/* =================== TRANSACTIONS =================== */}
          {section === 'transactions' && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Data Transaksi & Keuntungan</h2>
                    <div className="text-sm text-gray-500 font-medium mt-1">Total: {filteredTransactions.length} Transaksi ditampilkan</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="bg-white border border-gray-200 rounded-full flex overflow-hidden w-full md:w-auto shadow-sm">
                      {['all', 'week', 'month', 'year'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setTrxFilter(f as any)}
                          className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold transition-colors ${trxFilter === f ? 'bg-[#FF6B35] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {f === 'all' ? 'Semua' : f === 'week' ? '7 Hari' : f === 'month' ? '30 Hari' : '1 Tahun'}
                        </button>
                      ))}
                    </div>
                    <Button onClick={handleDownloadPDF} className="rounded-full font-bold bg-green-600 hover:bg-green-700 shadow-md w-full md:w-auto">
                      <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] text-sm text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <th className="p-4 font-bold uppercase tracking-wider text-xs">No. Invoice & Waktu</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Detail Kos</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Pengguna (Pembayar)</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-xs">Nominal Transaksi</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-xs text-green-600">Untung (10% / Admin)</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-xs text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!Array.isArray(filteredTransactions) || filteredTransactions.length === 0) ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-medium">Belum ada transaksi pada periode ini.</td></tr>
                      ) : (
                        filteredTransactions.map((trx: any) => {
                          const isDigital = trx.category === 'pulsa' || trx.category === 'listrik';
                          const revenue = parseInt(trx.total_price || trx.amount || 0);
                          const isSuccess = trx.status === 'paid' || trx.status === 'success';
                          
                          // MATEMATIKA KEUNTUNGAN YANG BENAR
                          let profit = 0;
                          if (isSuccess) {
                            if (isDigital) {
                              profit = 2000; // Flat Rp 2.000 untuk digital
                            } else {
                              // Rumus Balik: (Total - Biaya Layanan 25rb) / 1.11 PPN = Harga Dasar Kos
                              const basePrice = Math.round((revenue - 25000) / 1.11);
                              // Untung SpotKos = Biaya Layanan + (Komisi 10% dari Pemilik Kos)
                              profit = 25000 + (basePrice * 0.10);
                            }
                          }
                          
                          const titleDesc = isDigital ? trx.title : trx.kost_name;
                          const subDesc = isDigital ? `Kategori: ${trx.category?.toUpperCase() || '-'}` : trx.kost_location;

                          return (
                            <tr key={trx.invoice_id || trx.transaction_id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-gray-900">{trx.invoice_id || trx.transaction_id}</div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><Clock className="w-3 h-3"/>{trx.datetime || trx.created_at || '-'}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-gray-900 line-clamp-1">{titleDesc}</div>
                                <div className="text-xs text-gray-500 mt-1">{subDesc}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-gray-900">{trx.user_name || '-'}</div>
                                <div className="text-xs text-gray-500 mt-1">{trx.user_email}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-gray-900 text-base">Rp {revenue.toLocaleString('id-ID')}</div>
                              </td>
                              <td className="p-4">
                                <div className={`font-bold text-base ${isSuccess ? 'text-green-600' : 'text-gray-400'}`}>
                                  {isSuccess ? `+ Rp ${profit.toLocaleString('id-ID')}` : 'Rp 0'}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                  isSuccess ? 'bg-green-50 text-green-600 border-green-200' :
                                  trx.status === 'failed' ? 'bg-red-50 text-red-600 border-red-200' :
                                  'bg-yellow-50 text-yellow-600 border-yellow-200'
                                }`}>
                                  {isSuccess ? 'Berhasil' : trx.status === 'failed' ? 'Batal' : 'Menunggu'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================== KELOLA PROMO =================== */}
          {section === 'promos' && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Tambah Promo */}
              <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm h-fit">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Kode Promo</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-bold text-gray-700">Kode Promo (Tanpa Spasi)</Label>
                    <Input placeholder="Contoh: HEMATKOS50" className="mt-1 uppercase" value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value.toUpperCase().replace(/\s/g, '')})} />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-gray-700">Sektor Penggunaan</Label>
                    <select value={promoForm.sector} onChange={e => setPromoForm({...promoForm, sector: e.target.value})} className="w-full mt-1 h-10 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35]">
                      <option value="kos">Sewa Kos</option>
                      <option value="pulsa">Pulsa & Data</option>
                      <option value="listrik">Token Listrik</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-gray-700">Nominal Diskon (Rp)</Label>
                    <Input type="number" placeholder="50000" className="mt-1" value={promoForm.discount} onChange={e => setPromoForm({...promoForm, discount: e.target.value})} />
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-3">
                    <div>
                      <Label className="text-sm font-bold text-[#FF6B35]">Minimal Pembelian (Opsional)</Label>
                      <Input type="number" placeholder="Contoh: 100000" className="mt-1 border-orange-200 focus:border-[#FF6B35]" value={promoForm.min_purchase} onChange={e => setPromoForm({...promoForm, min_purchase: e.target.value})} />
                      <p className="text-[10px] text-orange-600/70 mt-1">Cegah kerugian! Wajibkan user belanja minimal Rp X untuk pakai kode ini.</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-gray-700">Berlaku Sampai Tanggal</Label>
                    <Input type="date" className="mt-1" value={promoForm.valid_until} onChange={e => setPromoForm({...promoForm, valid_until: e.target.value})} />
                  </div>
                  <Button 
                    className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 font-bold mt-2"
                    disabled={!promoForm.code || !promoForm.discount || !promoForm.valid_until}
                    onClick={async () => {
                      try {
                        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/promos`, {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({...promoForm, min_purchase: promoForm.min_purchase || 0})
                        });
                        if (res.ok) {
                          showToast('Promo berhasil dibuat!');
                          setPromoForm({ code: '', discount: '', sector: 'kos', min_purchase: '', valid_until: '' });
                          fetch(`${import.meta.env.VITE_API_URL}/api/admin/promos`).then(r => r.json()).then(setPromosData);
                        }
                      } catch (err) { showToast('Gagal terhubung ke server'); }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Terbitkan Promo
                  </Button>
                </div>
              </div>

              {/* Tabel Daftar Promo */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">Promo Aktif & Berjalan</h2>
                </div>
                <div className="overflow-x-auto p-4">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-200">
                        <th className="pb-3 font-bold">Kode Promo</th>
                        <th className="pb-3 font-bold">Sektor</th>
                        <th className="pb-3 font-bold">Diskon / Syarat</th>
                        <th className="pb-3 font-bold">Berakhir Pada</th>
                        <th className="pb-3 font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(!Array.isArray(promosData) || promosData.length === 0) ? (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-400">Belum ada promo aktif.</td></tr>
                      ) : (
                        promosData.map((promo: any) => {
                          const isExpired = new Date(promo.valid_until) < new Date();
                          return (
                            <tr key={promo.id}>
                              <td className="py-4 font-bold text-[#FF6B35]">{promo.code}</td>
                              <td className="py-4 uppercase text-xs font-bold text-gray-600">{promo.sector}</td>
                              <td className="py-4">
                                <div className="font-bold text-gray-900">Rp {parseInt(promo.discount_amount).toLocaleString('id-ID')}</div>
                                {promo.min_purchase > 0 && <div className="text-[10px] text-red-500 font-bold">Min. Trx: Rp {parseInt(promo.min_purchase).toLocaleString('id-ID')}</div>}
                              </td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                  {new Date(promo.valid_until).toLocaleDateString('id-ID')} {isExpired && '(Kedaluwarsa)'}
                                </span>
                              </td>
                              <td className="py-4 text-center">
                                <button 
                                  onClick={async () => {
                                    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/promos/${promo.id}`, { method: 'DELETE' });
                                    setPromosData(prev => prev.filter(p => p.id !== promo.id));
                                    showToast('Promo dihapus');
                                  }}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                ><Trash2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================== LIVE CHAT SUPPORT =================== */}
          {section === 'live-chat' && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm h-[600px] flex overflow-hidden animate-in fade-in duration-300">
              
              {/* Sidebar Kiri: Daftar User yang menge-chat */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-5 border-b border-gray-200 bg-gray-50/80">
                  <h2 className="font-bold text-gray-800 text-lg">Daftar Obrolan</h2>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {supportChats.length === 0 ? (
                    <div className="p-8 text-sm text-gray-500 text-center flex flex-col items-center">
                      <MessageSquare className="w-10 h-10 mb-3 text-gray-300" />
                      Belum ada obrolan masuk.
                    </div>
                  ) : (
                    supportChats.map((chatGroup: any) => {
                      // Logic render Avatar fallback
                      const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatGroup.name || chatGroup.email)}&background=random`;
                      const userAvatar = chatGroup.avatar ? (chatGroup.avatar.startsWith('http') ? chatGroup.avatar : `${import.meta.env.VITE_API_URL}/${chatGroup.avatar}`) : fallbackAvatar;

                      return (
                        <button
                          key={chatGroup.email}
                          onClick={() => { setActiveChatEmail(chatGroup.email); chatGroup.unread = 0; }}
                          className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${activeChatEmail === chatGroup.email ? 'bg-orange-50/50 relative' : ''}`}
                        >
                          {activeChatEmail === chatGroup.email && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B35]"></div>}
                          
                          {/* FOTO PROFIL (AVATAR) */}
                          <div className="relative shrink-0 mt-1">
                            <img 
                              src={userAvatar} 
                              alt={chatGroup.name} 
                              className="w-11 h-11 rounded-full object-cover border border-gray-200" 
                              onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 truncate">{chatGroup.name || chatGroup.email}</h4>
                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{chatGroup.email}</p>
                            <p className="text-xs text-gray-600 truncate mt-1.5">{chatGroup.lastMessage}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Sidebar Kanan: Ruang Chat */}
              <div className="flex-1 flex flex-col bg-[#faf9f6]">
                {!activeChatEmail ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                    <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
                    <p className="text-sm font-medium">Pilih obrolan untuk membalas pesan.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-5 border-b border-gray-200 shadow-sm z-10 flex items-center gap-3">
                      {/* HEADER FOTO PROFIL */}
                      {(() => {
                        const activeUser = supportChats.find(c => c.email === activeChatEmail);
                        const fallbackHeaderAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser?.name || activeChatEmail)}&background=random`;
                        const headerAvatar = activeUser?.avatar ? (activeUser.avatar.startsWith('http') ? activeUser.avatar : `${import.meta.env.VITE_API_URL}/${activeUser.avatar}`) : fallbackHeaderAvatar;

                        return (
                          <>
                            <img 
                              src={headerAvatar} 
                              alt="Avatar" 
                              className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" 
                              onError={(e) => { e.currentTarget.src = fallbackHeaderAvatar; }}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{activeUser?.name || activeChatEmail}</h3>
                              <p className="text-xs text-gray-500 truncate">{activeChatEmail}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatScrollRef}>
                      {supportChats.find(c => c.email === activeChatEmail)?.messages.map((msg: any) => (
                        <div key={msg.id} className={`flex max-w-[75%] ${msg.sender === 'user' ? 'mr-auto' : 'ml-auto justify-end'}`}>
                          <div className={`p-4 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-white border border-gray-200 text-gray-800 rounded-[20px] rounded-tl-sm' : 'bg-[#FF6B35] text-white rounded-[20px] rounded-tr-sm'}`}>
                            <p className="leading-relaxed">{msg.text}</p>
                            <div className={`text-[10px] mt-1.5 font-medium ${msg.sender === 'user' ? 'text-gray-400 text-left' : 'text-orange-200 text-right'}`}>{msg.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200">
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!chatReply.trim()) return;
                          try {
                            await fetch(`${import.meta.env.VITE_API_URL}/api/support/chats`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ email: activeChatEmail, sender: 'admin', message: chatReply })
                            });
                            setChatReply('');
                            fetchSupportChats(); // Segarkan chat
                          } catch (err) { showToast('Gagal mengirim balasan'); }
                        }}
                        className="flex gap-2 items-center"
                      >
                        <Input value={chatReply} onChange={e => setChatReply(e.target.value)} placeholder="Ketik balasan sebagai admin..." className="flex-1 rounded-full h-12 px-5 bg-gray-50 focus:bg-white transition-colors" />
                        <Button type="submit" disabled={!chatReply.trim()} className="w-12 h-12 rounded-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95"><Send className="w-5 h-5 ml-1" /></Button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* =================== CUSTOMER SERVICE =================== */}
          {section === 'customer-service' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'open', 'in-progress', 'resolved'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCsFilterStatus(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      csFilterStatus === s ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-white border border-gray-200 hover:border-[#FF6B35]/50 text-gray-700'
                    }`}
                  >
                    {s === 'all' ? 'Semua' : s === 'open' ? 'Terbuka' : s === 'in-progress' ? 'Diproses' : 'Selesai'}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-200">Tidak ada tiket bantuan yang masuk.</div>
                ) : filteredTickets.map((ticket) => {
                  const isExpanded = expandedTicket === ticket.id;
                  const priorityColor = ticket.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' : ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-green-100 text-green-700 border-green-200';
                  const statusColor = ticket.status === 'open' ? 'text-red-600 bg-red-50' : ticket.status === 'in-progress' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50';

                  return (
                    <div key={ticket.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-orange-200 transition-colors">
                      <button
                        onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                        className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-900 text-lg truncate">{ticket.subject}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider border ${priorityColor}`}>{ticket.priority}</span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-700">{ticket.userName}</span> 
                            <span className="text-gray-300">•</span> 
                            <span>{ticket.date}</span>
                            <span className="text-gray-300">•</span> 
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold border border-transparent ${statusColor}`}>
                              {ticket.status === 'open' ? 'TERBUKA' : ticket.status === 'in-progress' ? 'DIPROSES' : 'SELESAI'}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 p-2 bg-gray-50 rounded-full border border-gray-200">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-gray-100 pt-5 bg-gray-50/50">
                          <div className="text-sm mb-3 text-gray-500 font-medium">Dari: <span className="text-gray-900">{ticket.userName}</span> ({ticket.userEmail})</div>
                          <div className="bg-white rounded-xl p-5 mb-5 text-sm text-gray-700 leading-relaxed border border-gray-200 shadow-inner">
                            {ticket.message}
                          </div>

                          {ticket.replies?.length > 0 && (
                            <div className="space-y-3 mb-5">
                              {ticket.replies.map((reply: any, i: number) => (
                                <div key={i} className={`rounded-2xl p-4 text-sm ${
                                  reply.sender === 'Admin SpotKos' ? 'bg-orange-50 ml-6 border border-orange-100 shadow-sm' : 'bg-white mr-6 border border-gray-200 shadow-sm'
                                }`}>
                                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/50">
                                    <span className={`font-bold text-xs ${reply.sender === 'Admin SpotKos' ? 'text-[#FF6B35]' : 'text-gray-800'}`}>{reply.sender}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">{reply.date}</span>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed">{reply.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {ticket.status !== 'resolved' && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200/60">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Ketik balasan untuk tiket ini..."
                                className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm outline-none focus:bg-white border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleReply(ticket.id)}
                              />
                              <Button size="sm" onClick={() => handleReply(ticket.id)} className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 font-bold h-11 px-5 shadow-sm">
                                <Send className="w-4 h-4 mr-2" /> Balas
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleResolve(ticket.id)} className="rounded-xl font-bold text-green-600 border-green-300 hover:bg-green-50 h-11 px-5 shadow-sm">
                                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Tandai Selesai
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================== ARTICLES =================== */}
          {section === 'articles' && (
            <div className="animate-in fade-in duration-300">
              {articleMode === 'list' ? (
                <>
                  <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-bold text-gray-700 ml-2">{articlesData.length} Artikel Terpublikasi</p>
                    <Button onClick={() => { setArticleForm({ title: '', excerpt: '', image: '', category: 'Tips & Trik', readTime: '5 menit', author: 'Tim SpotKos', intro: '', sections: [{ heading: '', content: '' }], conclusion: '' }); setEditingArticleId(null); setArticleMode('create'); }} className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 font-bold shadow-sm h-11">
                      <Plus className="w-5 h-5 mr-1" /> Buat Artikel Baru
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {articlesData.map((article) => (
                      <div key={article.id} className="bg-white rounded-[24px] border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-56 h-40 sm:h-auto flex-shrink-0 relative overflow-hidden">
                            <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-[10px] font-bold uppercase tracking-wider">{article.category}</span>
                                <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> {article.date}</span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">{article.title}</h3>
                              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                              <Link to={`/artikel/${article.id}`}>
                                <Button size="sm" variant="outline" className="rounded-xl text-xs h-9 font-bold hover:bg-gray-50"><Eye className="w-4 h-4 mr-1.5" /> Lihat</Button>
                              </Link>
                              <Button size="sm" variant="outline" className="rounded-xl text-xs h-9 font-bold text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => {
                                setArticleForm({ title: article.title, excerpt: article.excerpt, image: article.image, category: article.category, readTime: article.readTime, author: article.author, intro: article.content.intro, sections: article.content.sections.length > 0 ? article.content.sections : [{ heading: '', content: '' }], conclusion: article.content.conclusion });
                                setEditingArticleId(article.id);
                                setArticleMode('create');
                              }}>
                                <Edit3 className="w-4 h-4 mr-1.5" /> Edit
                              </Button>
                              <Button size="sm" variant="outline" className="rounded-xl text-xs h-9 font-bold text-red-600 border-red-200 hover:bg-red-50" onClick={() => { setArticlesData((prev) => prev.filter((a) => a.id !== article.id)); showToast('Artikel berhasil dihapus.'); }}>
                                <Trash2 className="w-4 h-4 mr-1.5" /> Hapus
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 ml-2">{editingArticleId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
                    <Button variant="outline" className="rounded-xl h-10 font-bold" onClick={() => { setArticleMode('list'); setEditingArticleId(null); }}>
                      <X className="w-4 h-4 mr-2" /> Batal & Kembali
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* === LEFT: Form Input === */}
                    <div className="space-y-6">
                      {/* Step 1: Gambar Utama */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100"><span className="text-sm text-[#FF6B35] font-black">1</span></div>
                          <h3 className="font-bold text-gray-900 text-lg">Gambar Utama</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 ml-11">Gambar header artikel (rasio 16:9). Gunakan URL gambar yang valid.</p>
                        <div className="ml-11">
                          <Input placeholder="https://images.unsplash.com/..." className="rounded-xl h-11 bg-gray-50 focus:bg-white transition-colors" value={articleForm.image} onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })} />
                          {articleForm.image && (
                            <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 mt-3 shadow-inner">
                              <ImageWithFallback src={articleForm.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 2: Info Artikel */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100"><span className="text-sm text-[#FF6B35] font-black">2</span></div>
                          <h3 className="font-bold text-gray-900 text-lg">Informasi Artikel</h3>
                        </div>
                        <div className="space-y-4 ml-11 mt-4">
                          <div>
                            <Label className="mb-2 block text-gray-700 font-bold text-sm">Judul Artikel <span className="text-red-500">*</span></Label>
                            <Input placeholder="Contoh: 7 Tips Mencari Kos yang Aman dan Nyaman" className="rounded-xl h-11 bg-gray-50 focus:bg-white" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} />
                          </div>
                          <div>
                            <Label className="mb-2 block text-gray-700 font-bold text-sm">Ringkasan Singkat <span className="text-red-500">*</span></Label>
                            <textarea placeholder="Deskripsi singkat yang muncul di kartu artikel..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 transition-all min-h-[80px] resize-none" value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="mb-2 block text-gray-700 font-bold text-sm">Kategori</Label>
                              <select value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })} className="w-full px-4 py-2.5 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-[#FF6B35]">
                                {['Tips & Trik', 'Keuangan', 'Kuliner', 'Panduan', 'Lifestyle', 'Teknologi'].map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <Label className="mb-2 block text-gray-700 font-bold text-sm">Waktu Baca</Label>
                              <Input placeholder="5 menit" className="rounded-xl h-11 bg-gray-50 focus:bg-white" value={articleForm.readTime} onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })} />
                            </div>
                            <div>
                              <Label className="mb-2 block text-gray-700 font-bold text-sm">Penulis</Label>
                              <Input placeholder="Tim SpotKos" className="rounded-xl h-11 bg-gray-50 focus:bg-white" value={articleForm.author} onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Isi Topik */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100"><span className="text-sm text-[#FF6B35] font-black">3</span></div>
                          <h3 className="font-bold text-gray-900 text-lg">Isi Konten Utama</h3>
                        </div>
                        <div className="ml-11 mt-4 space-y-5">
                          <div>
                            <Label className="mb-2 block text-gray-700 font-bold text-sm">Paragraf Pendahuluan <span className="text-red-500">*</span></Label>
                            <textarea placeholder="Tuliskan pembukaan yang menarik perhatian pembaca..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-[#FF6B35] min-h-[120px] resize-none leading-relaxed" value={articleForm.intro} onChange={(e) => setArticleForm({ ...articleForm, intro: e.target.value })} />
                          </div>

                          <div className="border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between mb-4">
                              <Label className="text-gray-700 font-bold text-sm">Sub-Topik / Section Konten</Label>
                              <Button size="sm" variant="outline" onClick={() => setArticleForm({ ...articleForm, sections: [...articleForm.sections, { heading: '', content: '' }] })} className="h-8 rounded-lg text-xs font-bold text-[#FF6B35] border-orange-200 hover:bg-orange-50">
                                <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Section
                              </Button>
                            </div>
                            
                            <div className="space-y-4">
                              {articleForm.sections.map((sec, i) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">Bagian {i + 1}</span>
                                    {articleForm.sections.length > 1 && (
                                      <button onClick={() => setArticleForm({ ...articleForm, sections: articleForm.sections.filter((_, idx) => idx !== i) })} className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-md shadow-sm border border-gray-200 hover:border-red-200"><X className="w-3.5 h-3.5" /></button>
                                    )}
                                  </div>
                                  <Input placeholder="Judul Sub-Topik (Opsional)" className="rounded-xl mb-3 font-bold bg-white" value={sec.heading} onChange={(e) => { const s = [...articleForm.sections]; s[i] = { ...s[i], heading: e.target.value }; setArticleForm({ ...articleForm, sections: s }); }} />
                                  <textarea placeholder="Isi paragraf konten..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#FF6B35] min-h-[100px] resize-none leading-relaxed" value={sec.content} onChange={(e) => { const s = [...articleForm.sections]; s[i] = { ...s[i], content: e.target.value }; setArticleForm({ ...articleForm, sections: s }); }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 4: Kesimpulan */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100"><span className="text-sm text-[#FF6B35] font-black">4</span></div>
                          <h3 className="font-bold text-gray-900 text-lg">Kesimpulan</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 ml-11">Ringkasan penutup artikel. Akan tampil dalam kotak highlight khusus di akhir bacaan.</p>
                        <div className="ml-11">
                          <textarea placeholder="Tulis kesimpulan atau pesan penutup yang kuat..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm outline-none focus:border-[#FF6B35] min-h-[100px] resize-none leading-relaxed" value={articleForm.conclusion} onChange={(e) => setArticleForm({ ...articleForm, conclusion: e.target.value })} />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 justify-end sticky bottom-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-lg">
                        <Button variant="outline" className="rounded-xl h-12 font-bold px-6 border-gray-300 text-gray-700" onClick={() => { setArticleMode('list'); setEditingArticleId(null); }}>Batal</Button>
                        <Button 
                          onClick={async () => {
                            if (!articleForm.title || !articleForm.excerpt || !articleForm.intro) return;

                            const articleData = {
                            title: articleForm.title,
                            excerpt: articleForm.excerpt,
                            image: articleForm.image || 'https://images.unsplash.com/19/desktop.JPG?w=1080',
                            category: articleForm.category,
                            readTime: articleForm.readTime,
                            author: articleForm.author,
                            content: { 
                              intro: articleForm.intro, 
                              // ✅ FIX: Hapus syarat 's.heading' agar section tanpa judul tetap tersimpan di database
                              sections: articleForm.sections.filter((s) => s.content.trim() !== ''), 
                              conclusion: articleForm.conclusion 
                            },
                          };

                            try {
                              if (editingArticleId) {
                                await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${editingArticleId}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(articleData)
                                });
                                setArticlesData((prev) => prev.map((a) => a.id === editingArticleId ? { ...articleData, id: editingArticleId, date: a.date } : a));
                                showToast('Perubahan artikel berhasil disimpan!');
                              } else {
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(articleData)
                                });
                                const dbRes = await response.json();
                                const today = new Date();
                                const dateStr = `${today.getDate()} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'][today.getMonth()]} ${today.getFullYear()}`;
                                setArticlesData((prev) => [{ ...articleData, id: dbRes.id, date: dateStr }, ...prev]);
                                showToast('Artikel baru berhasil dipublikasi ke server!');
                              }

                              setArticleForm({ title: '', excerpt: '', image: '', category: 'Tips & Trik', readTime: '5 menit', author: 'Tim SpotKos', intro: '', sections: [{ heading: '', content: '' }], conclusion: '' });
                              setEditingArticleId(null);
                              setArticleMode('list');
                            } catch (error) {
                              console.error(error);
                              showToast('Terjadi kesalahan koneksi saat menyimpan artikel.');
                            }
                          }} 
                          className="rounded-xl bg-[#FF6B35] hover:bg-[#FF6B35]/90 font-bold h-12 px-8 shadow-md" 
                          disabled={!articleForm.title || !articleForm.excerpt || !articleForm.intro}
                        >
                          <Save className="w-5 h-5 mr-2" /> {editingArticleId ? 'Simpan Perubahan' : 'Publikasikan Artikel'}
                        </Button>
                      </div>
                    </div>

                    {/* === RIGHT: Live Preview === */}
                    <div className="hidden xl:block">
                      <div className="sticky top-24">
                        <div className="flex items-center justify-between mb-4 bg-[#1a1a2e] text-white p-4 rounded-2xl shadow-md">
                          <div className="flex items-center gap-2">
                             <Eye className="w-5 h-5 text-[#FF6B35]" />
                             <span className="font-bold tracking-wide">Live Preview</span>
                          </div>
                          <div className="flex gap-1.5">
                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                        </div>

                        <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-xl max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
                          <div className="p-8">
                            {/* Preview: Category Badge */}
                            <div className="inline-block px-4 py-1.5 bg-[#FF6B35] text-white font-bold rounded-full text-xs uppercase tracking-widest mb-6 shadow-sm">
                              {articleForm.category || 'Kategori'}
                            </div>

                            {/* Preview: Title */}
                            <h1 className="text-3xl font-black mb-5 leading-tight text-gray-900 tracking-tight">
                              {articleForm.title || <span className="text-gray-300 font-normal italic">Ketik judul artikel Anda di sini...</span>}
                            </h1>

                            {/* Preview: Meta */}
                            <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm font-medium mb-8 pb-6 border-b border-gray-100">
                              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{articleForm.author || 'Penulis'}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{articleForm.readTime || '- menit'} baca</span>
                              </div>
                            </div>

                            {/* Preview: Featured Image */}
                            {articleForm.image ? (
                              <div className="aspect-video rounded-3xl overflow-hidden mb-8 shadow-sm border border-gray-100">
                                <ImageWithFallback src={articleForm.image} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="aspect-video rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-8">
                                <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                                <span className="text-sm font-medium text-gray-400">Area Gambar Utama</span>
                              </div>
                            )}

                            {/* Preview: Intro */}
                            <p className="text-base leading-loose mb-8 text-gray-700 first-letter:text-5xl first-letter:font-black first-letter:text-[#FF6B35] first-letter:mr-1 first-letter:float-left">
                              {articleForm.intro || <span className="text-gray-300 italic text-base">Paragraf pendahuluan artikel akan otomatis tampil rapi di sini...</span>}
                            </p>

                            {/* Preview: Sections */}
                            <div className="space-y-8">
                              {articleForm.sections.filter((s) => s.heading || s.content).map((sec, i) => (
                                <div key={i}>
                                  {sec.heading && <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2"><div className="w-2 h-6 bg-[#FF6B35] rounded-full"></div> {sec.heading}</h2>}
                                  <p className="text-base leading-loose text-gray-600">{sec.content || <span className="text-gray-300 italic">Isi teks sub-topik...</span>}</p>
                                </div>
                              ))}
                            </div>
                            
                            {articleForm.sections.every((s) => !s.heading && !s.content) && (
                              <div className="my-8 p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center">
                                <span className="text-sm font-medium text-gray-400">Blok Sub-Topik Kosong</span>
                              </div>
                            )}

                            {/* Preview: Conclusion */}
                            {articleForm.conclusion && (
                              <div className="mt-10 p-6 bg-gradient-to-r from-orange-50 to-white rounded-2xl border-l-4 border-[#FF6B35] shadow-sm">
                                <h3 className="text-lg font-bold mb-3 text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#FF6B35]"/> Kesimpulan</h3>
                                <p className="text-base leading-loose text-gray-700 font-medium">
                                  {articleForm.conclusion}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================== USERS =================== */}
          {section === 'users' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau alamat email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-200 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 shadow-sm text-sm transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'pencari', 'pemilik'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setUserFilter(f)}
                      className={`px-5 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm ${
                        userFilter === f ? 'bg-[#FF6B35] text-white border border-[#FF6B35]' : 'bg-white border border-gray-200 hover:border-[#FF6B35]/50 text-gray-700'
                      }`}
                    >
                      {f === 'all' ? 'Semua Tipe' : f === 'pencari' ? 'Pencari Kos' : 'Pemilik Kos'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Identitas Pengguna</th>
                        <th className="text-left p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak Utama</th>
                        <th className="text-center p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe Akun (Role)</th>
                        <th className="text-center p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu Bergabung</th>
                        <th className="text-center p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status Akses</th>
                        <th className="text-center p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi Kontrol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-400 font-medium">Tidak ada data pengguna yang cocok.</td></tr>
                      ) : filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border border-gray-300 shrink-0">
                                <User className="w-5 h-5 text-gray-500" />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-gray-900 mb-0.5">{user.name}</div>
                                <div className="text-[11px] text-gray-400 font-mono tracking-tight">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="text-sm text-gray-800 font-medium mb-1">{user.email}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5"><Phone className="w-3 h-3"/> {user.phone || '-'}</div>
                          </td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm ${
                              user.role === 'pemilik' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {user.role === 'pemilik' ? 'Pemilik Kos' : 'Pencari Kos'}
                            </span>
                          </td>
                          <td className="p-5 text-center text-sm text-gray-600 font-medium flex items-center justify-center gap-1.5 pt-7">
                             <Clock className="w-3.5 h-3.5 text-gray-400"/> {user.joinDate}
                          </td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                              user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {user.status === 'active' ? 'Aktif' : 'Disuspend'}
                            </span>
                          </td>
                          <td className="p-5 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className={`rounded-xl font-bold text-xs h-9 px-4 shadow-sm transition-all ${
                                user.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300' : 'text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400'
                              }`}
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? 'Suspend Akun' : 'Pulihkan Akun'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        {/* MODAL INSPECT & EDIT KOS */}
      {inspectKost && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Inspect Properti Kos</h3>
              <button onClick={() => setInspectKost(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="aspect-video rounded-xl overflow-hidden mb-6 border border-gray-200">
              <ImageWithFallback src={`${import.meta.env.VITE_API_URL}/${inspectKost.image}`} alt={inspectKost.name} className="w-full h-full object-cover" />
            </div>

            {isEditingKost ? (
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm font-bold text-gray-700">Nama Kos</Label>
                  <Input value={editKostForm.name} onChange={e => setEditKostForm({...editKostForm, name: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-bold text-gray-700">Harga (Rp)</Label>
                  <Input type="number" value={editKostForm.price} onChange={e => setEditKostForm({...editKostForm, price: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-bold text-gray-700">Status</Label>
                  <select value={editKostForm.status} onChange={e => setEditKostForm({...editKostForm, status: e.target.value})} className="w-full mt-1 h-10 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35]">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved (Aktif)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsEditingKost(false)}>Batal</Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleSaveEditKost}><Save className="w-4 h-4 mr-2" /> Simpan</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">ID Kos</span><span className="font-bold text-gray-900">{inspectKost.id}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Nama</span><span className="font-bold text-gray-900">{inspectKost.name}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Lokasi</span><span className="font-bold text-gray-900 truncate max-w-[200px] text-right">{inspectKost.location}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Harga</span><span className="font-bold text-green-600">Rp {parseInt(inspectKost.price).toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Pemilik</span><span className="font-bold text-gray-900">{inspectKost.owner_name}</span></div>
                <div className="flex justify-between pb-2"><span className="text-gray-500">Email Pemilik</span><span className="font-bold text-gray-900">{inspectKost.owner_email}</span></div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 font-bold rounded-xl" onClick={() => setIsEditingKost(true)}>
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Info Dasar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-200 bg-white text-center flex items-center justify-center gap-2 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-10 mt-auto">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-medium text-gray-400 tracking-wide uppercase">&copy; 2026 SpotKos Admin Panel v2.0 — Lingkungan Penggunaan Internal</p>
        </div>
      </div>
    </div>
  );
}