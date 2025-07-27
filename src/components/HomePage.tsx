import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Play, Clock, Wallet, History, Plus, LogOut, Film } from 'lucide-react';
import AdminLogin from './AdminLogin';
import TopUpModal from './TopUpModal';
import MoviePlayer from './MoviePlayer';

interface Movie {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  drive_url: string;
  created_at: string;
}

const HomePage = () => {
  const { user, signOut } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching movies:', error);
        toast.error('Gagal memuat daftar film');
      } else {
        setMovies(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchMovie = (movie: Movie) => {
    if (!profile) {
      toast.error('Profile tidak ditemukan');
      return;
    }

    if (profile.balance < 1) {
      toast.error('Saldo tidak mencukupi. Silakan top up terlebih dahulu.');
      setShowTopUp(true);
      return;
    }

    setPlayingMovie(movie);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout berhasil');
  };

  if (playingMovie) {
    return (
      <MoviePlayer
        movie={playingMovie}
        onClose={() => setPlayingMovie(null)}
        profile={profile}
        onBalanceUpdate={refetchProfile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="bg-card shadow-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-cinema-gold">
                ArvinDev Studio's
              </h1>
              <Badge variant="secondary" className="text-cinema-red">
                Bioskop Online
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-cinema-light">
                <Wallet className="w-5 h-5" />
                <span className="font-semibold">
                  Rp {profile?.balance?.toLocaleString('id-ID') || '0'}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowTopUp(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Top Up
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card/50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'home', label: 'Beranda Film', icon: Play },
              { id: 'history', label: 'Riwayat Tontonan', icon: History },
              { id: 'balance', label: 'Saldo Saya', icon: Wallet }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-cinema-gold text-cinema-gold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div>
            <h2 className="text-3xl font-bold text-cinema-light mb-8">
              Daftar Film Tersedia
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse bg-card">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : movies.length === 0 ? (
              <Card className="bg-card text-center py-12">
                <CardContent>
                  <div className="text-muted-foreground">
                    <Film className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada film yang tersedia</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map(movie => (
                  <Card key={movie.id} className="bg-card shadow-card hover:shadow-premium transition-all duration-300 group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {movie.thumbnail_url ? (
                        <img
                          src={movie.thumbnail_url}
                          alt={movie.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-dark flex items-center justify-center">
                          <Play className="w-12 h-12 text-cinema-gold" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          variant="premium"
                          size="lg"
                          onClick={() => handleWatchMovie(movie)}
                          className="transform scale-90 group-hover:scale-100 transition-transform duration-300"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Tonton Sekarang
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground line-clamp-2">
                        {movie.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {movie.description && (
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {movie.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-cinema-gold border-cinema-gold">
                          <Clock className="w-3 h-3 mr-1" />
                          Rp 1/detik
                        </Badge>
                        <Button
                          variant="watch"
                          size="sm"
                          onClick={() => handleWatchMovie(movie)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Tonton
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-3xl font-bold text-cinema-light mb-8">
              Riwayat Tontonan
            </h2>
            <Card className="bg-card">
              <CardContent className="p-8 text-center">
                <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Fitur riwayat akan segera hadir</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'balance' && (
          <div>
            <h2 className="text-3xl font-bold text-cinema-light mb-8">
              Saldo Saya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-primary text-cinema-dark shadow-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span>Saldo Saat Ini</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    Rp {profile?.balance?.toLocaleString('id-ID') || '0'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Top Up Saldo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Tambah saldo untuk menonton film favorit Anda
                  </p>
                  <Button
                    variant="premium"
                    onClick={() => setShowTopUp(true)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Top Up Sekarang
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="text-muted-foreground">
            <p className="mb-2">ARVINDEV STUDIO'S</p>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-cinema-gold hover:text-cinema-gold/80 transition-colors font-medium"
            >
              Arvin Erlangga.M.Sc.IT
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
      
      {showTopUp && (
        <TopUpModal
          onClose={() => setShowTopUp(false)}
          onSuccess={() => {
            setShowTopUp(false);
            refetchProfile();
          }}
        />
      )}
    </div>
  );
};

export default HomePage;