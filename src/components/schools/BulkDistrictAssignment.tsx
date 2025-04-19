
import React, { useState } from 'react';
import { School, District, Classification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface BulkDistrictAssignmentProps {
  schools: School[];
  districts: District[];
  onAssignDistrict: (schoolIds: string[], districtId: string) => void;
}

const BulkDistrictAssignment = ({ schools, districts, onAssignDistrict }: BulkDistrictAssignmentProps) => {
  const [selectedClassification, setSelectedClassification] = useState<Classification | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  const filteredSchools = schools.filter(school => 
    selectedClassification === 'all' || school.classification === selectedClassification
  );

  const availableDistricts = districts.filter(district => 
    selectedClassification === 'all' || district.classification === selectedClassification
  );

  const handleSelectAll = () => {
    if (selectedSchools.length === filteredSchools.length) {
      setSelectedSchools([]);
    } else {
      setSelectedSchools(filteredSchools.map(school => school.id));
    }
  };

  const handleSubmit = () => {
    if (selectedDistrict && selectedSchools.length > 0) {
      onAssignDistrict(selectedSchools, selectedDistrict);
      setSelectedSchools([]);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Bulk District Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            value={selectedClassification}
            onValueChange={(value: Classification | 'all') => {
              setSelectedClassification(value);
              setSelectedDistrict('');
              setSelectedSchools([]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="6A">6A</SelectItem>
              <SelectItem value="5A">5A</SelectItem>
              <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedDistrict}
            onValueChange={setSelectedDistrict}
            disabled={!selectedClassification || availableDistricts.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map(district => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md p-4 mb-4">
          <div className="flex items-center mb-2">
            <Checkbox 
              checked={selectedSchools.length === filteredSchools.length && filteredSchools.length > 0}
              onClick={handleSelectAll}
            />
            <span className="ml-2 font-medium">Select All Schools</span>
          </div>
          
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {filteredSchools.map(school => (
                <div key={school.id} className="flex items-center">
                  <Checkbox
                    checked={selectedSchools.includes(school.id)}
                    onClick={() => {
                      setSelectedSchools(prev => 
                        prev.includes(school.id) 
                          ? prev.filter(id => id !== school.id)
                          : [...prev, school.id]
                      );
                    }}
                  />
                  <span className="ml-2">{school.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!selectedDistrict || selectedSchools.length === 0}
          className="w-full"
        >
          Assign {selectedSchools.length} Schools to Selected District
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkDistrictAssignment;
