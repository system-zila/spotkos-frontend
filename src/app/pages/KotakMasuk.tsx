import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { MessageSquare, Search, ArrowLeft, Send, Image as ImageIcon, X } from 'lucide-react';

export function KotakMasuk() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [inboxList, setInboxList] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchInbox();

    if (location.state && location.state.activeChat) {
      setActiveChat(location.state.activeChat);
    }

    // ✅ FIX BUG #1 & #5: Ganti petik biasa → backtick agar URL socket benar
    socketRef.current = io(`${import.meta.env.VITE_API_URL}`);
    socketRef.current.emit('join_room', user.email);

    socketRef.current.on('receive_message', () => {
      fetchInbox();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, navigate]);

  const fetchInbox = () => {
    if (!user?.email) return;
    // ✅ FIX BUG #1: Ganti petik biasa → backtick
    fetch(`${import.meta.env.VITE_API_URL}/api/chats/kotak-masuk?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setInboxList(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal menarik kotak masuk:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeChat, inboxList]);

  const handleOpenChat = async (otherId: string) => {
    // ✅ FIX BUG #9: Konsisten pakai id (yang nilainya = email) sebagai key
    setActiveChat(otherId);
    try {
      // ✅ FIX BUG #1: Ganti petik biasa → backtick
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myEmail: user?.email, otherEmail: otherId })
      });
      setInboxList(prev => prev.map(chat => chat.id === otherId ? { ...chat, unread: 0 } : chat));
    } catch (error) {
      console.error('Gagal update read status');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && !imageFile) || activeChat === null || !user) return;

    const formData = new FormData();
    formData.append('sender', user.email);
    formData.append('receiver', activeChat);
    formData.append('message', messageInput);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // ✅ FIX BUG #1: Ganti petik biasa → backtick
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/send`, {
        method: 'POST',
        body: formData
      });

      setMessageInput('');
      setImageFile(null);
      setImagePreview(null);

      fetchInbox();
    } catch (error) {
      alert('Gagal mengirim pesan.');
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen bg-[#faf9f6]"><Navigation /><div className="pt-32 text-center">Memuat kotak masuk...</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col relative">
      <Navigation />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[#FF6B35] transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Kotak Masuk</h1>
          <p className="text-gray-500">Pesan dari pemilik dan pencari kos Anda.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-[600px] flex overflow-hidden">

          {/* Panel Kiri */}
          <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col shrink-0 ${activeChat !== null ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pesan..."
                  className="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {inboxList.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400">Belum ada pesan masuk.</p>
                </div>
              ) : (
                inboxList.map(chat => (
                  <button
                    key={chat.id}
                    // ✅ FIX BUG #9: Pakai chat.id konsisten (nilainya = email dari backend)
                    onClick={() => handleOpenChat(chat.id)}
                    className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${activeChat === chat.id ? 'bg-orange-50/50 relative' : ''}`}
                  >
                    {activeChat === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B35]"></div>}
                    <div className="relative shrink-0 mt-1">
                      <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover border border-gray-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{chat.name}</h4>
                        <span className={`text-[10px] shrink-0 ${chat.unread > 0 ? 'text-[#FF6B35] font-bold' : 'text-gray-400'}`}>{chat.time}</span>
                      </div>
                      <p className={`text-xs truncate pr-4 ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-3 shadow-sm shadow-orange-500/30">
                        {chat.unread}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Panel Kanan */}
          <div className={`flex-1 flex flex-col bg-[#faf9f6] ${activeChat === null ? 'hidden md:flex' : 'flex'}`}>
            {activeChat === null ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/30">
                <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
                <p className="text-gray-500">Pilih pesan di sebelah kiri untuk mulai mengobrol.</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-4 shrink-0 shadow-sm z-10">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img src={inboxList.find(c => c.id === activeChat)?.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 leading-tight truncate">{inboxList.find(c => c.id === activeChat)?.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{activeChat}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatScrollRef}>
                  {inboxList.find(c => c.id === activeChat)?.messages.map((msg: any) => (
                    <div key={msg.id} className={`flex max-w-[80%] ${msg.sender === 'me' ? 'ml-auto justify-end' : 'mr-auto'}`}>
                      <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2.5 text-sm shadow-sm ${msg.sender === 'me' ? 'bg-[#FF6B35] text-white rounded-[20px] rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-[20px] rounded-tl-sm'}`}>
                          {msg.image && (
                            <div className="mb-2">
                              {/* ✅ FIX BUG #1: Ganti petik biasa → backtick */}
                              <img
                                src={`${import.meta.env.VITE_API_URL}/${msg.image}`}
                                alt="Attachment"
                                onClick={() => setFullscreenImage(`${import.meta.env.VITE_API_URL}/${msg.image}`)}
                                className="max-w-[200px] max-h-[250px] object-cover rounded-xl border border-white/20 cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                              />
                            </div>
                          )}
                          {msg.text && <span>{msg.text}</span>}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-4 border-t border-gray-100 shrink-0">
                  {imagePreview && (
                    <div className="relative inline-block mb-3">
                      <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                      <button
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <label className="cursor-pointer p-3 text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 rounded-full transition-colors shrink-0">
                      <ImageIcon className="w-6 h-6" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>

                    <input
                      type="text"
                      placeholder="Ketik pesan Anda..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim() && !imageFile}
                      className="w-12 h-12 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-all shadow-md hover:bg-[#FF6B35]/90 hover:scale-105 active:scale-95"
                    >
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#FF6B35] bg-black/50 hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen View"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
