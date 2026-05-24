import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'register';
  onAuthSuccess: (user: { name: string; email: string; role?: string; avatar?: string }) => void;
}

export function AuthDialog({ open, onOpenChange, defaultMode = 'login', onAuthSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setErrorMsg('');
    }
  }, [open, defaultMode]);

  // ✅ FIX BUG #1: Ganti petik biasa → backtick agar VITE_API_URL tersubstitusi
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        onAuthSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Login gagal.');
      }
    } catch (error) {
      setErrorMsg('Gagal terhubung ke server.');
    }
  };

  // ✅ FIX BUG #1: Ganti petik biasa → backtick
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMsg('Password tidak cocok!');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        })
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        onAuthSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Registrasi gagal.');
      }
    } catch (error) {
      setErrorMsg('Gagal terhubung ke server.');
    }
  };

  // ✅ FIX BUG #1: Ganti petik biasa → backtick
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrorMsg('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        onAuthSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Autentikasi Google gagal.');
      }
    } catch (error) {
      setErrorMsg('Gagal memverifikasi akun Google ke server.');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSuccess(false);
      setMode(defaultMode);
      setErrorMsg('');
      setLoginData({ email: '', password: '' });
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl mb-2">
              {mode === 'login' ? 'Login Berhasil!' : 'Registrasi Berhasil!'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {mode === 'login'
                ? 'Selamat datang kembali di SpotKos!'
                : 'Akun Anda telah berhasil dibuat. Selamat datang di SpotKos!'}
            </p>
            <Button onClick={handleClose} className="w-full rounded-xl bg-primary hover:bg-primary/90">
              Lanjutkan
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{mode === 'login' ? 'Masuk ke SpotKos' : 'Daftar Akun Baru'}</DialogTitle>
              <DialogDescription>
                {mode === 'login'
                  ? 'Masuk untuk menyimpan pencarian, kos favorit, dan riwayat booking.'
                  : 'Buat akun untuk pengalaman mencari kos yang lebih baik.'}
              </DialogDescription>
            </DialogHeader>

            {errorMsg && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{errorMsg}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="login-email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="nama@email.com"
                    className="rounded-xl"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" /> Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      className="rounded-xl pr-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-primary hover:underline">
                    Lupa Password?
                  </button>
                </div>
                <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90">
                  Masuk
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">Atau</span>
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrorMsg('Akses Google dibatalkan atau gagal.')}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    width="100%"
                  />
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Belum punya akun?{' '}
                  <button type="button" onClick={() => { setMode('register'); setErrorMsg(''); }} className="text-primary hover:underline font-medium">
                    Daftar sekarang
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="reg-name" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" /> Nama Lengkap
                  </Label>
                  <Input
                    id="reg-name"
                    placeholder="Masukkan nama lengkap"
                    className="rounded-xl"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="nama@email.com"
                    className="rounded-xl"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password" className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" /> Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimal 8 karakter"
                      className="rounded-xl pr-10"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="reg-confirm" className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" /> Konfirmasi Password
                  </Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Ulangi password"
                    className="rounded-xl"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90">
                  Daftar
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">Atau</span>
                  </div>
                </div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrorMsg('Akses Google dibatalkan atau gagal.')}
                    theme="outline"
                    size="large"
                    text="signup_with"
                    width="100%"
                  />
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Sudah punya akun?{' '}
                  <button type="button" onClick={() => { setMode('login'); setErrorMsg(''); }} className="text-primary hover:underline font-medium">
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
