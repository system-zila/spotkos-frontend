import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext'; // Import konteks akun
import { Link } from 'react-router';

export function CustomerService() {
  const { user } = useAuth(); // Ambil data user yang login
  const [form, setForm] = useState({ subject: 'Pembayaran & Transaksi', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.email, subject: form.subject, message: form.message })
      });

      if (response.ok) {
        setIsSuccess(true);
        setForm({ subject: 'Pembayaran & Transaksi', message: '' });
      } else {
        // TAMBAHAN BARU: Memunculkan alert jika database/server menolak
        alert('Gagal mengirim laporan! Penyebab: Tabel "tickets" di database MySQL Anda kemungkinan belum dibuat. Silakan cek MySQL Anda.');
      }
    } catch (error) {
      alert('Gagal terhubung ke server database. Pastikan Backend Node.js menyala.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 flex justify-center items-center py-16 px-4">
        <div className="bg-white max-w-xl w-full rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-[#FF6B35]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hubungi Tim SpotKos</h1>
          </div>
          <p className="text-gray-500 mb-8 text-sm">Sampaikan kendala Anda. Tiket akan langsung dihubungkan ke akun Anda.</p>

          {!user ? (
             <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 text-center">
               <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
               <p className="text-sm text-yellow-700 mb-4">Anda harus masuk (login) terlebih dahulu untuk membuat laporan.</p>
               <Link to="/"><Button className="bg-[#FF6B35]">Kembali ke Beranda</Button></Link>
             </div>
          ) : isSuccess ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-green-800 font-medium mb-1">Laporan Berhasil Terkirim!</h3>
              <p className="text-sm text-green-600 mb-4">Tim kami akan segera memprosesnya. Pantau status laporan Anda di menu Pengaturan Profil.</p>
              <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-xl border-green-200 text-green-700">Kirim Laporan Lain</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Info Pengirim (Otomatis) */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Label className="text-gray-500 text-xs mb-1 block">Pelapor:</Label>
                <div className="font-medium text-sm">{user.name} <span className="text-gray-400 font-normal">({user.email})</span></div>
              </div>

              <div>
                <Label className="text-gray-700 text-xs mb-1.5 block">Topik Kendala</Label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#FF6B35]" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option>Pembayaran & Transaksi</option>
                  <option>Akun & Keamanan</option>
                  <option>Informasi Kos</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <Label className="text-gray-700 text-xs mb-1.5 block">Detail Pesan / Kendala</Label>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Jelaskan detail kendala Anda..." className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#FF6B35] resize-none" />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-xl py-6 font-medium text-base">
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}