import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TopUpModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const TopUpModal = ({ onClose, onSuccess }: TopUpModalProps) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Permintaan top up berhasil dikirim. Tunggu konfirmasi admin.');
    onSuccess();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Saldo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nominal</Label>
            <Input
              type="number"
              placeholder="Masukkan nominal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Metode Transfer</Label>
            <Select value={method} onValueChange={setMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bca">BCA</SelectItem>
                <SelectItem value="mandiri">Mandiri</SelectItem>
                <SelectItem value="bri">BRI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Saya Sudah Transfer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpModal;