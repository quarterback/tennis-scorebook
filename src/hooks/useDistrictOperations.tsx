import { useState, useEffect } from 'react';
import { District, Classification } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Define initial districts with their classifications
const initialDistricts = [
  // 6A Districts
  { id: "6a-1", name: "Portland Interscholastic League", classification: "6A" as Classification },
  { id: "6a-2", name: "Metro League", classification: "6A" as Classification },
  { id: "6a-3", name: "Pacific Conference", classification: "6A" as Classification },
  { id: "6a-4", name: "Mt. Hood Conference", classification: "6A" as Classification },
  { id: "6a-5", name: "Three Rivers League", classification: "6A" as Classification },
  { id: "6a-6", name: "Central Valley Conference", classification: "6A" as Classification },
  { id: "6a-7", name: "Southwest Conference", classification: "6A" as Classification },
  
  // 5A Districts
  { id: "5a-1", name: "Northwest Oregon Conference", classification: "5A" as Classification },
  { id: "5a-2", name: "Midwestern League", classification: "5A" as Classification },
  { id: "5a-3", name: "Mid-Willamette Conference", classification: "5A" as Classification },
  { id: "5a-4", name: "Intermountain Conference", classification: "5A" as Classification },
  
  // 4A/3A/2A/1A Special Districts
  { id: "sd-1", name: "Special District 1", classification: "4A/3A/2A/1A" as Classification },
  { id: "sd-2", name: "Special District 2", classification: "4A/3A/2A/1A" as Classification },
  { id: "sd-3", name: "Special District 3", classification: "4A/3A/2A/1A" as Classification },
  { id: "sd-4", name: "Special District 4", classification: "4A/3A/2A/1A" as Classification },
  { id: "sd-5", name: "Special District 5", classification: "4A/3A/2A/1A" as Classification }
];

export const useDistrictOperations = (customInitialDistricts: District[] = []) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const { toast } = useToast();
  
  // Load districts from localStorage when the component mounts
  useEffect(() => {
    const loadDistricts = () => {
      try {
        const savedDistricts = localStorage.getItem('districts');
        if (savedDistricts) {
          const parsedDistricts = JSON.parse(savedDistricts);
          if (Array.isArray(parsedDistricts) && parsedDistricts.length > 0) {
            console.log(`Loaded ${parsedDistricts.length} districts from localStorage`);
            setDistricts(parsedDistricts);
            return true;
          }
        }
      } catch (error) {
        console.error('Error parsing districts from localStorage:', error);
      }
      return false;
    };

    // If no districts in localStorage, initialize with the provided districts or default ones
    if (!loadDistricts()) {
      // Use custom initial districts if provided and not empty, otherwise use default
      const districtsToUse = customInitialDistricts.length > 0 
        ? customInitialDistricts 
        : initialDistricts.map(district => ({
            ...district,
            id: district.id
          }));
      
      console.log(`Initializing with ${districtsToUse.length} districts`);
      setDistricts(districtsToUse);
      // Save these initial districts to localStorage
      localStorage.setItem('districts', JSON.stringify(districtsToUse));
    }
  }, [customInitialDistricts]);
  
  // Save districts to localStorage whenever it changes
  useEffect(() => {
    if (districts.length > 0) {
      localStorage.setItem('districts', JSON.stringify(districts));
      console.log(`Saved ${districts.length} districts to localStorage`);
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
    const updatedDistricts = districts.map(d => 
      d.id === district.id 
        ? {
            ...d, 
            tournamentDates: district.tournamentDates,
            tournamentLocation: district.tournamentLocation,
            tournamentYear: district.tournamentYear
          } 
        : d
    );
    setDistricts(updatedDistricts);
    localStorage.setItem('districts', JSON.stringify(updatedDistricts));
    toast({
      title: 'District Updated',
      description: `${district.name} tournament details have been updated.`
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
