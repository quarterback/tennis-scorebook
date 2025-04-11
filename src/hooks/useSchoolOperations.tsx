
import { useState } from 'react';
import { School } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useSchoolOperations = (initialSchools: School[]) => {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const { toast } = useToast();
  
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
