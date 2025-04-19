
import { useState, useEffect } from 'react';
import { School, Classification } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Define initial districts with their schools
const oregonDistricts = {
  // 6A Districts
  "6a-1": {
    name: "Portland Interscholastic League",
    classification: "6A" as Classification,
    schools: ["Benson", "Cleveland", "Franklin", "Grant", "Ida B. Wells", "Lincoln", "McDaniel", "Roosevelt"]
  },
  "6a-2": {
    name: "Metro League",
    classification: "6A" as Classification,
    schools: ["Aloha", "Beaverton", "Jesuit", "Mountainside", "Southridge", "Sunset", "Westview"]
  },
  "6a-3": {
    name: "Pacific Conference",
    classification: "6A" as Classification,
    schools: ["Century", "Forest Grove", "Glencoe", "Liberty", "McMinnville", "Newberg", "Sherwood"]
  },
  "6a-4": {
    name: "Mt. Hood Conference",
    classification: "6A" as Classification,
    schools: ["Barlow", "Central Catholic", "Clackamas", "David Douglas", "Gresham", "Nelson", "Reynolds", "Sandy"]
  },
  "6a-5": {
    name: "Three Rivers League",
    classification: "6A" as Classification,
    schools: ["Lake Oswego", "Lakeridge", "St. Mary's Academy", "Tigard", "Tualatin", "West Linn"]
  },
  "6a-6": {
    name: "Central Valley Conference",
    classification: "6A" as Classification,
    schools: ["McNary", "North Salem", "South Salem", "Sprague", "West Salem"]
  },
  "6a-7": {
    name: "Southwest Conference",
    classification: "6A" as Classification,
    schools: ["Grants Pass", "North Medford", "Roseburg", "Sheldon", "South Eugene", "South Medford", "Willamette"]
  },
  
  // 5A Districts
  "5a-1": {
    name: "Northwest Oregon Conference",
    classification: "5A" as Classification,
    schools: ["Canby", "Centennial", "Hillsboro", "Hood River Valley", "La Salle Prep", 
             "Milwaukie / Milwaukie Acad. of the Arts", "Parkrose", "Putnam", "Wilsonville"]
  },
  "5a-2": {
    name: "Midwestern League",
    classification: "5A" as Classification,
    schools: ["Ashland", "Churchill", "North Eugene", "Springfield", "Thurston"]
  },
  "5a-3": {
    name: "Mid-Willamette Conference",
    classification: "5A" as Classification,
    schools: ["Central / Kings Valley Char.", "Corvallis", "Crescent Valley", "Dallas", "Lebanon", 
             "McKay", "Silverton", "South Albany", "West Albany", "Woodburn"]
  },
  "5a-4": {
    name: "Intermountain Conference",
    classification: "5A" as Classification,
    schools: ["Bend", "Caldera", "Mountain View", "Redmond", "Ridgeview", "Summit"]
  },
  
  // 4A/3A/2A/1A Special Districts
  "sd-1": {
    name: "Special District 1",
    classification: "4A/3A/2A/1A" as Classification,
    schools: ["Blanchet Catholic", "Catlin Gabel", "Oregon Episcopal", "Riverdale", "Riverside, WLWV",
             "Scappoose", "St. Helens", "Tillamook", "Trinity Academy", "Valley Catholic", "Westside Christian"]
  },
  "sd-2": {
    name: "Special District 2",
    classification: "4A/3A/2A/1A" as Classification,
    schools: ["Cascade", "Estacada", "Junction City", "Marist Catholic", "Molalla", "North Marion",
             "Philomath", "Stayton"]
  },
  "sd-3": {
    name: "Special District 3",
    classification: "4A/3A/2A/1A" as Classification,
    schools: ["Cascade Christian", "Creswell", "Henley", "Hidden Valley", "Klamath Union", "Marshfield",
             "Mazama", "North Bend", "North Valley", "Phoenix", "St. Mary's, Medford"]
  },
  "sd-4": {
    name: "Special District 4",
    classification: "4A/3A/2A/1A" as Classification,
    schools: ["Arlington", "Condon", "Crook County", "Ione / Heppner", "Irrigon", "Madras", "Riverside",
             "Sherman", "Sisters", "Stanfield / Echo", "The Dalles", "Umatilla", "Weston-McEwen / Griswold"]
  },
  "sd-5": {
    name: "Special District 5",
    classification: "4A/3A/2A/1A" as Classification,
    schools: ["Baker / Powder Valley", "Four Rivers", "La Grande", "McLoughlin", "Nyssa", "Ontario",
             "Pendleton", "Vale"]
  }
};

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

    // If no schools in localStorage, create initial schools from oregonDistricts
    const newSchools: School[] = [];
    Object.entries(oregonDistricts).forEach(([districtId, district]) => {
      district.schools.forEach(schoolName => {
        newSchools.push({
          id: crypto.randomUUID(),
          name: schoolName,
          classification: district.classification,
          districtId: districtId,
          teams: []
        });
      });
    });
    
    console.log(`Created ${newSchools.length} initial schools`);
    return newSchools;
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
    setSchools(prevSchools => [...prevSchools, newSchool]);
    toast({
      title: 'School Added',
      description: `${newSchool.name} has been added successfully.`
    });
  };
  
  const updateSchool = (school: School) => {
    setSchools(prevSchools => prevSchools.map(s => s.id === school.id ? school : s));
    toast({
      title: 'School Updated',
      description: `${school.name} has been updated successfully.`
    });
  };
  
  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    setSchools(prevSchools => prevSchools.filter(s => s.id !== id));
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
