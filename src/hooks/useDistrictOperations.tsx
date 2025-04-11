
import { useState } from 'react';
import { District, Classification } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useDistrictOperations = (initialDistricts: District[]) => {
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const { toast } = useToast();
  
  const addDistrict = (district: Omit<District, 'id'>) => {
    const newDistrict: District = {
      ...district,
      id: crypto.randomUUID()
    };
    setDistricts([...districts, newDistrict]);
    toast({
      title: 'District Added',
      description: `${newDistrict.name} has been added successfully.`
    });
  };
  
  const updateDistrict = (district: District) => {
    setDistricts(districts.map(d => d.id === district.id ? district : d));
    toast({
      title: 'District Updated',
      description: `${district.name} has been updated successfully.`
    });
  };
  
  const deleteDistrict = (id: string) => {
    const district = districts.find(d => d.id === id);
    setDistricts(districts.filter(d => d.id !== id));
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
