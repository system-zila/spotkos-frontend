import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client'; // <-- TAMBAHAN: Import Socket

const FAQ_TEMPLATES = [
  { q: "Bagaimana cara bayar?", a: "Pembayaran sangat mudah! Cukup klik 'Booking Sekarang' di halaman detail kos, lalu pilih metode pembayaran melalui sistem aman Midtrans." },
  { q: "Kapan invoice keluar?", a: "Invoice akan diterbitkan dan muncul di menu 'Riwayat Booking' secara instan setelah pembayaran Anda terverifikasi lunas oleh sistem." },
  { q: "Bagaimana cara batal sewa?", a: "Pembatalan sewa dan refund 100% dapat dilakukan maksimal H-3. Silakan ketik nomor pesanan Anda di chat ini, Admin kami akan segera memprosesnya." },
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  time: string;
}

export function CustomerSupport() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null); // <-- TAMBAHAN: Referensi Socket

  // MENGAMBIL RIWAYAT CHAT DARI MYSQL
  const fetchChats = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/support/chats?email=${user.email}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Gagal mengambil chat', err);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchChats();

      // <-- TAMBAHAN: KONEKSI SOCKET UNTUK REAL-TIME CHAT
      if (!socketRef.current) {
        socketRef.current = io('${import.meta.env.VITE_API_URL}');
        socketRef.current.on('new_support_chat', () => {
          fetchChats(); // Tarik pesan admin baru otomatis tanpa refresh
        });
      }
    }

    // <-- TAMBAHAN: PUTUSKAN KONEKSI SAAT CHAT DITUTUP
    return () => {
      if (!isOpen && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // MENGIRIM PESAN KE MYSQL (REAL DATA)
  const saveMessageToDB = async (sender: string, text: string) => {
    if (!user?.email) return;
    try {
      await fetch('${import.meta.env.VITE_API_URL}/api/support/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, sender, message: text })
      });
      fetchChats(); // Refresh data dari DB
    } catch (err) {
      console.error('Gagal menyimpan chat', err);
    }
  };

  const handleSend = async (text: string, isTemplate: boolean = false) => {
    if (!text.trim() || !user) return;

    // 1. Simpan pertanyaan User ke DB
    await saveMessageToDB('user', text);
    setMessage('');

    // 2. Jika Template, Simpan jawaban Bot ke DB
    if (isTemplate) {
      const template = FAQ_TEMPLATES.find(t => t.q === text);
      if (template) {
        setTimeout(async () => {
          await saveMessageToDB('bot', template.a);
        }, 500); // Simulasi delay mengetik bot
      }
    } 
    // CATATAN: Logika Bot "Menunggu Admin" (yang muncul setiap kali ngetik manual) SUDAH DIHAPUS agar tidak annoying.
  };

  // Jika belum login, tombol chat tidak perlu muncul atau bisa diarahkan login
  if (!user) return null; 

  // Menentukan apakah perlu menampilkan template (hanya jika belum pernah chat)
  const showTemplates = messages.length === 0 || (messages.length === 1 && messages[0].sender === 'bot');

  return (
    <>
      {/* Tombol Floating */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#FF6B35] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>

      {/* Jendela Chat */}
      <div className={`fixed bottom-6 right-6 w-[380px] bg-white rounded-[32px] shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 h-[600px] pointer-events-auto' : 'scale-50 opacity-0 h-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-[#002855] p-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#002855] rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-base">SpotKos Support</h3>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Terhubung
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Area Pesan */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#faf9f6] space-y-4">
          
          {/* Sapaan Default jika kosong */}
          {messages.length === 0 && (
             <div className="flex gap-2 max-w-[85%] items-start">
               <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-gray-200">
                 <Bot className="w-5 h-5 text-[#002855]" />
               </div>
               <div className="flex flex-col items-start">
                 <div className="p-3 text-sm shadow-sm bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm">
                   Halo {user.name}! Ada yang bisa SpotKos bantu hari ini? Pilih topik di bawah atau ketik langsung pertanyaan Anda.
                 </div>
               </div>
             </div>
          )}

          {/* Render Pesan dari Database */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-gray-200">
                {msg.sender === 'user' ? <UserIcon className="w-4 h-4 text-gray-600" /> : <Bot className="w-5 h-5 text-[#002855]" />}
              </div>
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#FF6B35] text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          
          {/* Render Template Pertanyaan jika riwayat masih kosong */}
          {showTemplates && (
            <div className="flex flex-col gap-2 pt-2">
              {FAQ_TEMPLATES.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(faq.q, true)}
                  className="bg-white border border-[#FF6B35]/30 text-[#FF6B35] hover:bg-orange-50 text-sm p-3 rounded-2xl text-left font-medium transition-colors shadow-sm"
                >
                  {faq.q}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Ketik */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(message); }}
            className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 p-1.5 focus-within:border-[#FF6B35]"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
            />
            <button 
              type="submit" 
              disabled={!message.trim()}
              className="w-10 h-10 bg-[#002855] text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-[#003570] transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </>
  );
}