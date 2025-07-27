import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdminLoginProps {
  onClose: () => void;
}

const AdminLogin = ({ onClose }: AdminLoginProps) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '011090') {
      // Redirect to admin dashboard (placeholder)
      alert('Admin login berhasil! Dashboard admin akan segera hadir.');
      onClose();
    } else {
      alert('Kode akses salah!');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Masukkan kode akses"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;