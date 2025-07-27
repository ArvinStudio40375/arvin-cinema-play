import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 5000); // 5 seconds as requested

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-dark">
      <div className="relative w-full h-full overflow-hidden">
        {/* Video Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <iframe
            src="https://drive.google.com/file/d/106NEE6TerYtb7jQ-FwcANGz_CbQ5ALUw/preview"
            className="w-full h-full object-cover"
            style={{ border: 'none' }}
            allow="autoplay"
            title="Splash Video"
          />
        </div>
        
        {/* Overlay for branding */}
        <div className="absolute inset-0 bg-gradient-overlay flex flex-col items-center justify-end pb-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-cinema-light mb-4">
              ArvinDev Studio's
            </h1>
            <p className="text-xl md:text-2xl text-cinema-gold font-medium">
              Bioskop Online
            </p>
            <div className="mt-8">
              <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full animate-glow-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;