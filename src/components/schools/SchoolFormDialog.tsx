
import React from 'react';
import { School, Classification } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SchoolFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    classification: Classification;
    districtId: string;
  };
  setFormData: (data: { name: string; classification: Classification; districtId: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  availableDistricts: { id: string; name: string }[];
  mode: 'add' | 'edit';
  handleClassificationChange: (value: Classification) => void;
}

const SchoolFormDialog = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  availableDistricts,
  mode,
  handleClassificationChange
}: SchoolFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New School' : 'Edit School'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Enter the details for the new school.'
              : 'Update the school details.'} The available districts will be filtered based on the selected classification.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="classification">Classification</Label>
            <Select
              value={formData.classification}
              onValueChange={(value) => handleClassificationChange(value as Classification)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6A">6A</SelectItem>
                <SelectItem value="5A">5A</SelectItem>
                <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="district">District/Conference</Label>
            <Select
              value={formData.districtId}
              onValueChange={(value) => setFormData({ ...formData, districtId: value })}
              disabled={availableDistricts.length === 0}
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={availableDistricts.length === 0 ? "No districts available" : "Select district"} 
                />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map(district => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableDistricts.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">
                No districts available for this classification. Please add districts first.
              </p>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-tennis-blue hover:bg-tennis-darkBlue"
              disabled={!formData.districtId || !formData.name}
            >
              {mode === 'add' ? 'Add School' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolFormDialog;
