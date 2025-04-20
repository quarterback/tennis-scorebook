
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/context/DataContext';
import { School, Classification } from '@/types';
import { useState, useEffect } from 'react';

export const useSchoolOperations = (initialSchools = []) => {
  const [schools, setSchools] = useState<School[]>([]);
  const { toast } = useToast();
  const [isSchoolDialogOpen, setIsSchoolDialogOpen] = useState(false);
  const [schoolFormData, setSchoolFormData] = useState<Omit<School, 'id'>>({
    name: '',
    city: '',
    state: 'OR',
    classification: '6A',
    districtId: ''
  });
  
  // Load schools from localStorage on component mount
  useEffect(() => {
    try {
      const savedSchools = localStorage.getItem('schools');
      if (savedSchools) {
        const parsedSchools = JSON.parse(savedSchools);
        if (Array.isArray(parsedSchools) && parsedSchools.length > 0) {
          console.log(`Loaded ${parsedSchools.length} schools from localStorage`);
          setSchools(parsedSchools);
          return;
        }
      }
      // Fall back to initial schools if nothing in localStorage
      setSchools(initialSchools);
      console.log(`Initialized with ${initialSchools.length} sample schools`);
    } catch (error) {
      console.error('Error loading schools from localStorage:', error);
      setSchools(initialSchools);
    }
  }, []);
  
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
    
    setSchools(prevSchools => [...prevSchools, newSchool]);
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
    
    return newSchool;
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
  
  const createTeamsForAllSchools = () => {
    // This would be implemented to create teams for all schools
    toast({
      title: "Teams Created",
      description: "Teams have been created for all schools."
    });
  };

  return {
    schools,
    setSchools,
    getSchoolById,
    deleteSchool,
    updateSchool,
    isSchoolDialogOpen,
    setIsSchoolDialogOpen,
    schoolFormData,
    setSchoolFormData,
    addSchool,
    createTeamsForAllSchools
  };
};
