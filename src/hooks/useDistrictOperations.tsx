
import { useState, useEffect } from 'react';
import { District, Classification } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useDistrictOperations = (initialDistricts: District[]) => {
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const { toast } = useToast();
  
  // Load districts from localStorage when the component mounts
  useEffect(() => {
    const savedDistricts = localStorage.getItem('districts');
    if (savedDistricts) {
      try {
        const parsedDistricts = JSON.parse(savedDistricts);
        // Only set from localStorage if we don't already have districts
        if (parsedDistricts.length > 0 && districts.length === 0) {
          setDistricts(parsedDistricts);
        }
      } catch (error) {
        console.error('Error parsing districts from localStorage:', error);
      }
    }
  }, []);
  
  // Save districts to localStorage whenever it changes
  useEffect(() => {
    if (districts.length > 0) {
      localStorage.setItem('districts', JSON.stringify(districts));
    }
  }, [districts]);
  
  const addDistrict = (district: Omit<District, 'id'>) => {
    const newDistrict: District = {
      ...district,
      id: crypto.randomUUID()
    };
    const updatedDistricts = [...districts, newDistrict];
    setDistricts(updatedDistricts);
    localStorage.setItem('districts', JSON.stringify(updatedDistricts));
    toast({
      title: 'District Added',
      description: `${newDistrict.name} has been added successfully.`
    });
  };
  
  const updateDistrict = (district: District) => {
    const updatedDistricts = districts.map(d => d.id === district.id ? district : d);
    setDistricts(updatedDistricts);
    localStorage.setItem('districts', JSON.stringify(updatedDistricts));
    toast({
      title: 'District Updated',
      description: `${district.name} has been updated successfully.`
    });
  };
  
  const deleteDistrict = (id: string) => {
    const district = districts.find(d => d.id === id);
    const updatedDistricts = districts.filter(d => d.id !== id);
    setDistricts(updatedDistricts);
    localStorage.setItem('districts', JSON.stringify(updatedDistricts));
    toast({
      title: 'District Deleted',
      description: `${district?.name || 'District'} has been deleted successfully.`
    });
  };
  
  const getDistrictsByClassification = (classification: Classification) => {
    return districts.filter(district => district.classification === classification);
  };

  return {
    districts,
    setDistricts,
    addDistrict,
    updateDistrict,
    deleteDistrict,
    getDistrictsByClassification
  };
};
