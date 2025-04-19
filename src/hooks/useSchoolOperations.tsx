
import { useState, useEffect } from 'react';
import { School } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useSchoolOperations = (initialSchools: School[]) => {
  // Try to load from localStorage first, fall back to initialSchools
  const getInitialSchoolsData = (): School[] => {
    try {
      const savedSchools = localStorage.getItem('schools');
      if (savedSchools) {
        const parsedSchools = JSON.parse(savedSchools);
        if (Array.isArray(parsedSchools) && parsedSchools.length > 0) {
          console.log(`Loaded ${parsedSchools.length} schools from localStorage`);
          return parsedSchools;
        }
      }
    } catch (error) {
      console.error('Error loading schools from localStorage:', error);
    }
    console.log(`Using ${initialSchools.length} initial schools`);
    return initialSchools;
  };

  const [schools, setSchools] = useState<School[]>(getInitialSchoolsData());
  const { toast } = useToast();
  
  // Save to localStorage whenever schools change
  useEffect(() => {
    try {
      localStorage.setItem('schools', JSON.stringify(schools));
      console.log(`Saved ${schools.length} schools to localStorage`);
    } catch (error) {
      console.error('Error saving schools to localStorage:', error);
    }
  }, [schools]);
  
  const addSchool = (school: Omit<School, 'id'>) => {
    const newSchool: School = {
      ...school,
      id: crypto.randomUUID(),
      teams: []
    };
    setSchools([...schools, newSchool]);
    toast({
      title: 'School Added',
      description: `${newSchool.name} has been added successfully.`
    });
  };
  
  const updateSchool = (school: School) => {
    setSchools(schools.map(s => s.id === school.id ? school : s));
    toast({
      title: 'School Updated',
      description: `${school.name} has been updated successfully.`
    });
  };
  
  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    setSchools(schools.filter(s => s.id !== id));
    toast({
      title: 'School Deleted',
      description: `${school?.name || 'School'} has been deleted successfully.`
    });
  };

  return {
    schools,
    setSchools,
    addSchool,
    updateSchool,
    deleteSchool
  };
};
