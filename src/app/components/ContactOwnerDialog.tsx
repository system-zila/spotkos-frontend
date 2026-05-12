import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Send, Phone, MessageSquare, User } from 'lucide-react';

interface ContactOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerName: string;
  ownerPhone: string;
  kostName: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'owner';
  time: string;
}

function getTime() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

const ownerAutoReplies = [
  'Terima kasih atas minatnya! Kamar masih tersedia saat ini.',
  'Boleh, silakan datang untuk survey kapan saja hari Senin-Sabtu jam 09.00-17.00.',
  'Untuk pembayaran bisa transfer atau tunai. DP minimal 1 bulan.',
  'Kamar bisa diisi mulai awal bulan depan.',
  'Fasilitas lengkap sesuai yang tertera. WiFi 24 jam.',
];

export function ContactOwnerDialog({ open, onOpenChange, ownerName, ownerPhone, kostName }: ContactOwnerDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: `Halo! Saya ${ownerName}, pemilik ${kostName}. Ada yang bisa saya bantu?`,
      sender: 'owner',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = ownerAutoReplies[replyIndex % ownerAutoReplies.length];
      setReplyIndex((prev) => prev + 1);
      const ownerMsg: ChatMessage = {
        id: Date.now() + 1,
        text: reply,
        sender: 'owner',
        time: getTime(),
      };
      setMessages((prev) => [...prev, ownerMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const quickMessages = [
    'Apakah kamar masih tersedia?',
    'Bisa survey kapan?',
    'Bagaimana sistem pembayaran?',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden" style={{ height: '550px' }}>
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">{ownerName}</div>
              <div className="text-sm text-white/80 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Online
              </div>
            </div>
          </div>
          <a
            href={`tel:${ownerPhone}`}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/20" style={{ height: '340px' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white border border-border rounded-bl-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Messages */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-border bg-white">
            <div className="flex flex-wrap gap-1.5">
              {quickMessages.map((msg) => (
                <button
                  key={msg}
                  onClick={() => {
                    setInput(msg);
                  }}
                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-border bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-2 bg-secondary/50 rounded-full text-sm outline-none focus:bg-secondary"
          />
          <Button type="submit" size="sm" className="rounded-full w-9 h-9 p-0 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
