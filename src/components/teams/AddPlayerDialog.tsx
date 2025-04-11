
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Player } from '@/types';

interface AddPlayerDialogProps {
  playerFormData: Omit<Player, 'id'>;
  setPlayerFormData: React.Dispatch<React.SetStateAction<Omit<Player, 'id'>>>;
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
          <input
            id="player-name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={playerFormData.name}
            onChange={(e) => setPlayerFormData({ ...playerFormData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="player-grade">Grade</Label>
          <Select
            value={playerFormData.grade.toString()}
            onValueChange={(value) => setPlayerFormData({ ...playerFormData, grade: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">9th Grade</SelectItem>
              <SelectItem value="10">10th Grade</SelectItem>
              <SelectItem value="11">11th Grade</SelectItem>
              <SelectItem value="12">12th Grade</SelectItem>
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
