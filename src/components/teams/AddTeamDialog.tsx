
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { School, Gender } from '@/types';

interface AddTeamDialogProps {
  teamFormData: { schoolId: string; gender: Gender };
  setTeamFormData: React.Dispatch<React.SetStateAction<{ schoolId: string; gender: Gender }>>;
  handleAddTeam: (e: React.FormEvent) => void;
  schools: School[];
  isCoach: boolean;
}

const AddTeamDialog = ({
  teamFormData,
  setTeamFormData,
  handleAddTeam,
  schools,
  isCoach
}: AddTeamDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Team</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleAddTeam} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="team-school">School</Label>
          <Select
            value={teamFormData.schoolId}
            onValueChange={(value) => setTeamFormData({ ...teamFormData, schoolId: value })}
            disabled={isCoach}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team-gender">Gender</Label>
          <Select
            value={teamFormData.gender}
            onValueChange={(value) => setTeamFormData({ ...teamFormData, gender: value as Gender })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Boys">Boys</SelectItem>
              <SelectItem value="Girls">Girls</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-tennis-blue hover:bg-tennis-darkBlue">
            Add Team
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddTeamDialog;
