
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { School, Classification } from '@/types';
import GroupedSchoolsList from '@/components/schools/GroupedSchoolsList';

const Schools = () => {
  const { schools, addSchool, updateSchool, districts, getDistrictsByClassification } = useData();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    classification: Classification;
    districtId: string;
  }>({
    name: '',
    classification: '6A',
    districtId: ''
  });
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  
  // Log for debugging
  useEffect(() => {
    console.log(`Schools page loaded with ${schools.length} schools`);
    console.log('Districts available:', districts.length);
  }, [schools, districts]);
  
  // Get available districts based on selected classification
  const availableDistricts = getDistrictsByClassification(formData.classification);
  
  // Filter schools if coach
  const filteredSchools = user?.role === 'coach' && user.schoolId
    ? schools.filter(school => school.id === user.schoolId)
    : schools;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSchool({ ...formData, teams: [] });
    setFormData({ name: '', classification: '6A', districtId: '' });
    setIsAddDialogOpen(false);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchool) {
      updateSchool({
        ...editingSchool,
        name: formData.name,
        classification: formData.classification,
        districtId: formData.districtId
      });
    }
    setIsEditDialogOpen(false);
  };
  
  const handleClassificationChange = (value: Classification) => {
    setFormData({ 
      ...formData, 
      classification: value,
      districtId: '' // Reset district when classification changes
    });
  };
  
  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      classification: school.classification,
      districtId: school.districtId
    });
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schools</h1>
        
        {user?.role === 'admin' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-tennis-blue hover:bg-tennis-darkBlue">
                <Plus className="h-4 w-4 mr-2" />
                Add School
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
                <DialogDescription>
                  Enter the details for the new school. The available districts will be filtered based on the selected classification.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
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
                      <SelectValue placeholder={availableDistricts.length === 0 ? "No districts available" : "Select district"} />
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
                    Add School
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="p-2 bg-blue-50 rounded-md mb-4">
        <p className="text-sm text-blue-700">Total Schools: {filteredSchools.length}</p>
      </div>
      
      <GroupedSchoolsList 
        schools={filteredSchools}
        districts={districts}
        canEdit={user?.role === 'admin'}
        onEditSchool={openEditDialog}
      />
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>
              Update the school details. The available districts will be filtered based on the selected classification.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">School Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-classification">Classification</Label>
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
              <Label htmlFor="edit-district">District/Conference</Label>
              <Select
                value={formData.districtId}
                onValueChange={(value) => setFormData({ ...formData, districtId: value })}
                disabled={availableDistricts.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={availableDistricts.length === 0 ? "No districts available" : "Select district"} />
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
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schools;
