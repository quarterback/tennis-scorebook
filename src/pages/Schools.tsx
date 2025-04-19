
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { School, Classification } from '@/types';
import GroupedSchoolsList from '@/components/schools/GroupedSchoolsList';
import SchoolFormDialog from '@/components/schools/SchoolFormDialog';
import SchoolsHeader from '@/components/schools/SchoolsHeader';

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
      <SchoolsHeader 
        schoolCount={filteredSchools.length}
        isAdmin={user?.role === 'admin'}
        onAddClick={() => setIsAddDialogOpen(true)}
      />
      
      <GroupedSchoolsList 
        schools={filteredSchools}
        districts={districts}
        canEdit={user?.role === 'admin'}
        onEditSchool={openEditDialog}
      />
      
      <SchoolFormDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddSubmit}
        availableDistricts={availableDistricts}
        mode="add"
        handleClassificationChange={handleClassificationChange}
      />
      
      <SchoolFormDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
        availableDistricts={availableDistricts}
        mode="edit"
        handleClassificationChange={handleClassificationChange}
      />
    </div>
  );
};

export default Schools;
