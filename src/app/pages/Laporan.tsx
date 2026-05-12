import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ArrowLeft, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router'; // <-- Pastikan useNavigate diimpor
import { Button } from '../components/ui/button';

export function Laporan() {
  const { user } = useAuth();
  const navigate = useNavigate(); // <-- Inisialisasi navigasi
  
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const fetchTickets = () => {
    if (user?.email) {
      fetch(`${import.meta.env.VITE_API_URL}/api/tickets/user?email=${user.email}`)
        .then(res => res.json())
        .then(data => setUserTickets(data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/'); // Tendang ke Home jika belum login
    } else {
      fetchTickets(); // Tarik data jika sudah login
    }
  }, [user, navigate]);

  const handleReply = async (ticketId: string) => {
  const text = replyTexts[ticketId];
  if (!text || !text.trim()) return;

  try {
    // Pastikan menggunakan backtick (`)
    await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: user?.name, message: text })
    });
    
    // Kosongkan hanya input pada tiket ini
    setReplyTexts({ ...replyTexts, [ticketId]: '' }); 
    // fetchTickets(); // (Opsional) Panggil ulang fungsi fetch Anda di sini jika ada
  } catch (err) {
    console.error("Gagal mengirim balasan", err);
  }
};

  const handleResolve = async (ticketId: string) => {
    if (!confirm('Apakah Anda yakin masalah ini sudah selesai?')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (response.ok) fetchTickets();
    } catch (error) {
      alert('Gagal menutup tiket.');
    }
  };
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#FF6B35] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-[#FF6B35] rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              Status Laporan Saya
            </h1>
            <p className="text-sm text-gray-500 mt-2 ml-12">Pantau perkembangan keluhan dan balas pesan dari tim kami di sini.</p>
          </div>

          <div className="p-6">
            {userTickets.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                Belum ada laporan yang diajukan.
              </div>
            ) : (
              <div className="space-y-4">
                {userTickets.map(ticket => (
                  <div key={ticket.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Header Tiket (Klik untuk buka/tutup) */}
                    <div 
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50"
                      onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                    >
                      <div>
                        <div className="font-semibold text-gray-900 mb-1.5">{ticket.subject}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">{ticket.id}</span>
                          <span>•</span><span>{ticket.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-start sm:self-auto">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
                          ticket.status === 'open' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          ticket.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {ticket.status === 'open' ? 'Diproses' : ticket.status === 'in-progress' ? 'Ditanggapi' : 'Selesai'}
                        </span>
                        {expandedId === ticket.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </div>

                    {/* Area Detail & Balasan (Muncul jika diklik) */}
                    {expandedId === ticket.id && (
                      <div className="p-5 border-t border-gray-100 bg-gray-50/30">
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">Pesan Awal Anda:</p>
                          <p className="text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-100">{ticket.message}</p>
                        </div>

                        {/* Riwayat Balasan */}
                        {ticket.replies?.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {ticket.replies.map((reply: any, i: number) => (
                              <div key={i} className={`p-4 rounded-xl text-sm ${
                                reply.sender === 'Admin SpotKos' ? 'bg-orange-50 border border-orange-100 ml-4' : 'bg-white border border-gray-100 mr-4'
                              }`}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className={`font-semibold text-xs ${reply.sender === 'Admin SpotKos' ? 'text-[#FF6B35]' : 'text-gray-900'}`}>{reply.sender}</span>
                                  <span className="text-xs text-gray-400">{reply.date}</span>
                                </div>
                                <p className="text-gray-700">{reply.message}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Form Balas & Tombol Selesai (Hanya aktif jika belum selesai) */}
                        {ticket.status !== 'resolved' ? (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={replyTexts[ticket.id] || ''}
                                onChange={(e) => setReplyTexts({ ...replyTexts, [ticket.id]: e.target.value })}
                                placeholder="Ketik balasan untuk Admin..." 
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#FF6B35]"
                                onKeyDown={(e) => e.key === 'Enter' && handleReply(ticket.id)}
                              />
                              <Button onClick={() => handleReply(ticket.id)} className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-xl px-5">
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button onClick={() => handleResolve(ticket.id)} variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 rounded-xl text-xs h-9">
                                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Tandai Masalah Selesai
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Tiket ini telah diselesaikan.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}