// Fix the school creation to include city and state
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/context/DataContext';
import { School, Classification } from '@/types';
import { useState } from 'react';

export const useSchoolOperations = () => {
  const { schools, setSchools, districts } = useData();
  const { toast } = useToast();
  const [isSchoolDialogOpen, setIsSchoolDialogOpen] = useState(false);
  const [schoolFormData, setSchoolFormData] = useState<Omit<School, 'id'>>({
    name: '',
    city: '',
    state: 'OR',
    classification: '6A',
    districtId: ''
  });
  
  // When creating a new school, ensure city and state are included
  const addSchool = () => {
    // Validate required fields
    if (!schoolFormData.name || !schoolFormData.classification || !schoolFormData.districtId || !schoolFormData.city || !schoolFormData.state) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newSchool: School = {
      id: uuidv4(),
      name: schoolFormData.name,
      classification: schoolFormData.classification,
      districtId: schoolFormData.districtId,
      city: schoolFormData.city,
      state: schoolFormData.state
    };
    
    setSchools([...schools, newSchool]);
    setIsSchoolDialogOpen(false);
    
    // Reset form data
    setSchoolFormData({
      name: '',
      city: '',
      state: 'OR',
      classification: '6A',
      districtId: ''
    });
    
    toast({
      title: "School Added",
      description: `${newSchool.name} has been added.`
    });
  };

  const deleteSchool = (schoolId: string) => {
    setSchools(schools.filter(school => school.id !== schoolId));
    toast({
      title: "School Deleted",
      description: "The school has been deleted.",
    });
  };

  const updateSchool = (updatedSchool: School) => {
    setSchools(schools.map(school => school.id === updatedSchool.id ? updatedSchool : school));
    toast({
      title: "School Updated",
      description: `${updatedSchool.name} has been updated.`,
    });
  };

  const getSchoolById = (schoolId: string) => {
    return schools.find(school => school.id === schoolId);
  };

  return {
    schools,
    getSchoolById,
    deleteSchool,
    updateSchool,
    isSchoolDialogOpen,
    setIsSchoolDialogOpen,
    schoolFormData,
    setSchoolFormData,
    addSchool,
  };
};
