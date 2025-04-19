
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Player } from '@/types';

interface AddPlayerDialogProps {
  playerFormData: Omit<Player, 'id' | 'status' | 'seasonId'>;
  setPlayerFormData: React.Dispatch<React.SetStateAction<Omit<Player, 'id' | 'status' | 'seasonId'>>>;
  handleAddPlayer: (e: React.FormEvent) => void;
}

const AddPlayerDialog = ({
  playerFormData,
  setPlayerFormData,
  handleAddPlayer
}: AddPlayerDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Player</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleAddPlayer} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="player-name">Player Name</Label>
          <Input
            id="player-name"
            value={playerFormData.name}
            onChange={(e) => setPlayerFormData({ ...playerFormData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="player-grade">Grade</Label>
          <Select
            value={String(playerFormData.grade)}
            onValueChange={(value) => setPlayerFormData({ ...playerFormData, grade: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">9th Grade (Freshman)</SelectItem>
              <SelectItem value="10">10th Grade (Sophomore)</SelectItem>
              <SelectItem value="11">11th Grade (Junior)</SelectItem>
              <SelectItem value="12">12th Grade (Senior)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-tennis-green hover:bg-green-600">
            Add Player
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddPlayerDialog;
