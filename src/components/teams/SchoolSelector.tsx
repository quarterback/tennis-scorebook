
import React from 'react';
import { School, District } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface SchoolSelectorProps {
  schools: School[];
  districts: District[];
  selectedSchoolId: string | null;
  onSchoolChange: (schoolId: string) => void;
}

const SchoolSelector = ({ 
  schools, 
  districts, 
  selectedSchoolId, 
  onSchoolChange 
}: SchoolSelectorProps) => {
  
  // Get the selected school
  const selectedSchool = schools.find(s => s.id === selectedSchoolId);
  
  // Get the district for the selected school
  const selectedDistrict = selectedSchool 
    ? districts.find(d => d.id === selectedSchool.districtId)
    : undefined;
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-tennis-blue" />
            Schools
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedSchoolId || ''}
          onValueChange={onSchoolChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a school" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedSchool && (
          <div className="mt-4 text-sm">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium">Classification:</span> {selectedSchool.classification}
              </div>
              <div>
                <span className="font-medium">District:</span> {selectedDistrict?.name || 'Unknown'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolSelector;
