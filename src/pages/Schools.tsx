import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { School, Classification } from '@/types';
import SchoolFormDialog from '@/components/schools/SchoolFormDialog';
import SchoolsHeader from '@/components/schools/SchoolsHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroupedSchoolsList from '@/components/schools/GroupedSchoolsList';
import BulkDistrictAssignment from '@/components/schools/BulkDistrictAssignment';

const Schools = () => {
  const { schools, addSchool, updateSchool, deleteSchool, districts, getDistrictsByClassification } = useData();
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
  
  // Filtering state
  const [classificationFilter, setClassificationFilter] = useState<Classification | 'all'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Log for debugging
  useEffect(() => {
    console.log(`Schools page loaded with ${schools.length} schools`);
    console.log('Districts available:', districts.length);
  }, [schools, districts]);
  
  // Get available districts based on selected classification
  const availableDistricts = getDistrictsByClassification(formData.classification);
  
  // Filter schools if coach
  const userFilteredSchools = user?.role === 'coach' && user.schoolId
    ? schools.filter(school => school.id === user.schoolId)
    : schools;
    
  // Apply filters
  const filteredSchools = userFilteredSchools.filter(school => {
    // Apply classification filter
    if (classificationFilter !== 'all' && school.classification !== classificationFilter) {
      return false;
    }
    
    // Apply district filter
    if (districtFilter !== 'all' && school.districtId !== districtFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      return school.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

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
  
  // Get the district name for a given district ID
  const getDistrictName = (districtId: string) => {
    const district = districts.find(d => d.id === districtId);
    return district ? district.name : 'Unknown District';
  };

  const handleBulkDistrictAssignment = (schoolIds: string[], districtId: string) => {
    schoolIds.forEach(schoolId => {
      const school = schools.find(s => s.id === schoolId);
      if (school) {
        updateSchool({
          ...school,
          districtId: districtId
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <SchoolsHeader 
        schoolCount={schools.length}
        filteredCount={schools.length}
        isAdmin={user?.role === 'admin'}
        onAddClick={() => setIsAddDialogOpen(true)}
      />
      
      {user?.role === 'admin' && (
        <BulkDistrictAssignment
          schools={schools}
          districts={districts}
          onAssignDistrict={handleBulkDistrictAssignment}
        />
      )}

      <GroupedSchoolsList
        schools={schools}
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
