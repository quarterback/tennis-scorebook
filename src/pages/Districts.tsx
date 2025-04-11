
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Folder, Edit, Plus, Tag } from 'lucide-react';
import { Classification, District } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Districts = () => {
  const { districts, addDistrict, updateDistrict, deleteDistrict } = useData();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<Classification | 'all'>('all');
  const [formData, setFormData] = useState<{
    name: string;
    classification: Classification;
  }>({
    name: '',
    classification: '6A'
  });
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  
  // Filter districts based on selected classification
  const filteredDistricts = currentFilter === 'all' 
    ? districts 
    : districts.filter(district => district.classification === currentFilter);
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDistrict(formData);
    setFormData({ name: '', classification: '6A' });
    setIsAddDialogOpen(false);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDistrict) {
      updateDistrict({
        ...editingDistrict,
        name: formData.name,
        classification: formData.classification
      });
    }
    setIsEditDialogOpen(false);
  };
  
  const openEditDialog = (district: District) => {
    setEditingDistrict(district);
    setFormData({
      name: district.name,
      classification: district.classification
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (district: District) => {
    if (window.confirm(`Are you sure you want to delete ${district.name}?`)) {
      deleteDistrict(district.id);
    }
  };
  
  // Group districts by classification for better display
  const groupedDistricts: Record<Classification, District[]> = {
    '6A': [],
    '5A': [],
    '4A/3A/2A/1A': []
  };
  
  filteredDistricts.forEach(district => {
    groupedDistricts[district.classification].push(district);
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Districts</h1>
        
        <div className="flex items-center gap-4">
          <Select
            value={currentFilter}
            onValueChange={(value) => setCurrentFilter(value as Classification | 'all')}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="6A">6A</SelectItem>
              <SelectItem value="5A">5A</SelectItem>
              <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
            </SelectContent>
          </Select>
          
          {user?.role === 'admin' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-tennis-blue hover:bg-tennis-darkBlue">
                  <Plus className="h-4 w-4 mr-2" />
                  Add District
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New District</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new district.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">District Name</Label>
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
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      className="bg-tennis-blue hover:bg-tennis-darkBlue"
                      disabled={!formData.name}
                    >
                      Add District
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(groupedDistricts).map(([classification, districts]) => (
          districts.length > 0 && (
            <Card key={classification}>
              <CardHeader className="bg-tennis-gray pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-tennis-blue" />
                  {classification} Districts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {districts.map((district) => (
                      <TableRow key={district.id}>
                        <TableCell className="font-medium flex items-center">
                          <Folder className="h-4 w-4 mr-2 text-tennis-blue" />
                          {district.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {user?.role === 'admin' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditDialog(district)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => handleDelete(district)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        ))}
        
        {filteredDistricts.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No districts found</h3>
            <p className="text-gray-500 mt-2">
              {currentFilter !== 'all' 
                ? `There are no districts for the ${currentFilter} classification.` 
                : 'There are no districts available.'}
            </p>
            {user?.role === 'admin' && (
              <Button 
                className="mt-4 bg-tennis-blue hover:bg-tennis-darkBlue"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add District
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit District</DialogTitle>
            <DialogDescription>
              Update the district details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">District Name</Label>
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
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-tennis-blue hover:bg-tennis-darkBlue"
                disabled={!formData.name}
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

export default Districts;
