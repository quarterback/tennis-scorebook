
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, Edit, Plus, Users } from 'lucide-react';
import { School as SchoolType, Classification } from '@/types';
import { Link } from 'react-router-dom';

const Schools = () => {
  const { schools, addSchool, updateSchool } = useData();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<SchoolType, 'id' | 'teams'>>({
    name: '',
    classification: '6A',
    district: ''
  });
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);
  
  // Filter schools if coach
  const filteredSchools = user?.role === 'coach' && user.schoolId
    ? schools.filter(school => school.id === user.schoolId)
    : schools;
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSchool({ ...formData, teams: [] });
    setFormData({ name: '', classification: '6A', district: '' });
    setIsAddDialogOpen(false);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchool) {
      updateSchool({
        ...editingSchool,
        name: formData.name,
        classification: formData.classification as Classification,
        district: formData.district
      });
    }
    setIsEditDialogOpen(false);
  };
  
  const openEditDialog = (school: SchoolType) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      classification: school.classification,
      district: school.district
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
                    onValueChange={(value) => setFormData({ ...formData, classification: value as Classification })}
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
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-tennis-blue hover:bg-tennis-darkBlue">
                    Add School
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="overflow-hidden">
            <CardHeader className="bg-tennis-gray pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <School className="h-5 w-5 mr-2 text-tennis-blue" />
                {school.name}
              </CardTitle>
              
              {(user?.role === 'admin' || (user?.role === 'coach' && user.schoolId === school.id)) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => openEditDialog(school)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Classification</div>
                <div>{school.classification}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">District/Conference</div>
                <div>{school.district}</div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-500">Teams</div>
                <Link to={`/teams?school=${school.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Manage Teams
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
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
                onValueChange={(value) => setFormData({ ...formData, classification: value as Classification })}
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
              <Input
                id="edit-district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-tennis-blue hover:bg-tennis-darkBlue">
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
