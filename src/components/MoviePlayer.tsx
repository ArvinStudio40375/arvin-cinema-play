import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  drive_url: string;
}

interface MoviePlayerProps {
  movie: Movie;
  onClose: () => void;
  profile: any;
  onBalanceUpdate: () => void;
}

const MoviePlayer = ({ movie, onClose, profile, onBalanceUpdate }: MoviePlayerProps) => {
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWatchTime(prev => prev + 1);
      // Deduct balance every second (Rp 1 per second)
      if (profile && profile.balance > 0) {
        // In real app, update balance in database
        console.log(`Watching ${movie.title} - Time: ${watchTime}s`);
      } else {
        alert('Saldo habis! Video dihentikan.');
        onClose();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [watchTime, profile, movie.title, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-6 h-6 text-white" />
        </Button>
      </div>
      <iframe
        src={movie.drive_url}
        className="w-full h-full"
        allow="autoplay; fullscreen"
        title={movie.title}
      />
      <div className="absolute bottom-4 left-4 text-white bg-black/50 p-2 rounded">
        Durasi: {watchTime}s | Biaya: Rp {watchTime}
      </div>
    </div>
  );
};

export default MoviePlayer;