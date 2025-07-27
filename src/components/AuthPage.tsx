import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { getClientIP } from '@/utils/getClientIP';
import { Eye, EyeOff, Film } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
}

const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message || 'Login failed');
        } else {
          toast.success('Login berhasil!');
          onSuccess();
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Password tidak cocok');
          setLoading(false);
          return;
        }

        const ipAddress = await getClientIP();
        const { error } = await signUp(formData.email, formData.password, formData.fullName, ipAddress);
        
        if (error) {
          toast.error(error.message || 'Registrasi gagal');
        } else {
          toast.success('Registrasi berhasil! Silakan login.');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 shadow-glow">
            <Film className="w-8 h-8 text-cinema-dark" />
          </div>
          <h1 className="text-3xl font-bold text-cinema-light mb-2">
            ArvinDev Studio's
          </h1>
          <p className="text-cinema-gold">Bioskop Online</p>
        </div>

        <Card className="bg-card shadow-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">
              {isLogin ? 'Masuk' : 'Daftar Akun'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="bg-input border-border"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-input border-border pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="bg-input border-border"
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="premium"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Tunggu...' : (isLogin ? 'Masuk' : 'Daftar')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              </p>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80"
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;