import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import SplashScreen from '@/components/SplashScreen';
import AuthPage from '@/components/AuthPage';
import HomePage from '@/components/HomePage';

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading } = useAuth();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-cinema-light">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onSuccess={() => {}} />;
  }

  return <HomePage />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
