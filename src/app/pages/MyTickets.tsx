import { useState, useEffect, useRef } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';

export function MyTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) navigate('/');
    else fetchTickets();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeTicket]);

  const fetchTickets = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/tickets/user?email=${user?.email}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTickets(data);
      }).catch(console.error);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${activeTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: user?.name || 'User', message: replyText })
      });
      if (res.ok) {
        setReplyText('');
        fetchTickets(); // Refresh data
        // Update local state temporarily for snappy UI
        setActiveTicket({
          ...activeTicket,
          replies: [...activeTicket.replies, { sender: user?.name || 'User', message: replyText, date: 'Baru saja' }]
        });
      }
    } catch (err) { alert('Gagal mengirim balasan.'); }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 pt-28 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B35] transition-colors mb-6 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Profil
        </Link>
        <h1 className="text-3xl font-black text-gray-900 mb-8">Status Laporan & Bantuan</h1>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm h-[600px] flex overflow-hidden">
          {/* Sidebar Kiri: Daftar Tiket */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">Belum ada laporan dibuat.</div>
            ) : (
              tickets.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`w-full text-left p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeTicket?.id === t.id ? 'bg-orange-50/50' : ''}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 line-clamp-1">{t.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${t.status === 'open' ? 'text-red-600 border-red-200 bg-red-50' : t.status === 'resolved' ? 'text-green-600 border-green-200 bg-green-50' : 'text-yellow-600 border-yellow-200 bg-yellow-50'}`}>
                      {t.status === 'open' ? 'Menunggu' : t.status === 'resolved' ? 'Selesai' : 'Diproses'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5"><Clock className="w-3 h-3"/> {t.date}</div>
                </button>
              ))
            )}
          </div>

          {/* Sidebar Kanan: Ruang Percakapan */}
          <div className="flex-1 flex flex-col bg-gray-50/30">
            {!activeTicket ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
                <p>Pilih laporan untuk melihat balasan Admin.</p>
              </div>
            ) : (
              <>
                <div className="p-5 bg-white border-b border-gray-200 shadow-sm">
                  <h3 className="font-black text-lg text-gray-900">{activeTicket.subject}</h3>
                  <p className="text-xs text-gray-500 mt-1">ID Tiket: {activeTicket.id}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                  {/* Pesan Utama (Pesan Pertama dari User) */}
                  <div className="flex max-w-[80%] ml-auto justify-end">
                    <div className="p-4 bg-[#FF6B35] text-white rounded-[20px] rounded-tr-sm shadow-sm text-sm">
                      <p className="leading-relaxed">{activeTicket.message}</p>
                      <div className="text-[10px] text-orange-200 text-right mt-2">{activeTicket.date}</div>
                    </div>
                  </div>

                  {/* Daftar Balasan */}
                  {activeTicket.replies?.map((reply: any, i: number) => {
                    const isAdmin = reply.sender === 'Admin SpotKos';
                    return (
                      <div key={i} className={`flex max-w-[80%] ${isAdmin ? 'mr-auto' : 'ml-auto justify-end'}`}>
                        <div className={`p-4 rounded-[20px] shadow-sm text-sm ${isAdmin ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm' : 'bg-[#FF6B35] text-white rounded-tr-sm'}`}>
                          {isAdmin && <div className="text-xs font-black text-[#FF6B35] mb-1">{reply.sender}</div>}
                          <p className="leading-relaxed">{reply.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeTicket.status !== 'resolved' ? (
                  <form onSubmit={handleReply} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                    <Input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Ketik balasan Anda..." className="flex-1 rounded-full bg-gray-50 focus:bg-white" />
                    <Button type="submit" disabled={!replyText.trim()} className="w-10 h-10 rounded-full bg-[#FF6B35] hover:bg-orange-600 shrink-0"><Send className="w-4 h-4 ml-1" /></Button>
                  </form>
                ) : (
                  <div className="p-4 bg-green-50 border-t border-green-200 text-center flex items-center justify-center gap-2 text-green-700 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Masalah ini telah diselesaikan dan ditutup.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}