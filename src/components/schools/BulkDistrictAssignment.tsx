
import React, { useState } from 'react';
import { School, District, Classification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { ChevronDown } from 'lucide-react';

interface BulkDistrictAssignmentProps {
  schools: School[];
  districts: District[];
  onAssignDistrict: (schoolIds: string[], districtId: string) => void;
}

const BulkDistrictAssignment = ({ schools, districts, onAssignDistrict }: BulkDistrictAssignmentProps) => {
  const [selectedClassification, setSelectedClassification] = useState<Classification | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

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
      toast({
        title: "Schools Updated",
        description: `${selectedSchools.length} schools have been assigned to the selected district.`,
      });
      setSelectedSchools([]);
    }
  };

  // Get district name helper
  const getDistrictName = (districtId: string): string => {
    const district = districts.find(d => d.id === districtId);
    return district ? district.name : 'Unknown District';
  };

  return (
    <Card className="mb-6">
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-xl">Bulk District Assignment</CardTitle>
        <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-muted-foreground">Filter by Classification</label>
              <Select
                value={selectedClassification}
                onValueChange={(value: Classification | 'all') => {
                  setSelectedClassification(value);
                  setSelectedDistrict('');
                  setSelectedSchools([]);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  <SelectItem value="6A">6A</SelectItem>
                  <SelectItem value="5A">5A</SelectItem>
                  <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block text-muted-foreground">Assign to District</label>
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
                disabled={!selectedClassification || availableDistricts.length === 0}
              >
                <SelectTrigger className="w-full">
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
          </div>

          <div className="border rounded-md p-4 mb-4">
            <div className="flex items-center mb-2">
              <Checkbox 
                id="select-all"
                checked={selectedSchools.length === filteredSchools.length && filteredSchools.length > 0}
                onCheckedChange={() => handleSelectAll()}
              />
              <label htmlFor="select-all" className="ml-2 font-medium cursor-pointer">
                Select All Schools ({filteredSchools.length})
              </label>
            </div>
            
            {filteredSchools.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {filteredSchools.map(school => (
                    <div key={school.id} className="flex items-center justify-between py-1 px-1 hover:bg-muted/50 rounded">
                      <div className="flex items-center flex-1">
                        <Checkbox
                          id={`school-${school.id}`}
                          checked={selectedSchools.includes(school.id)}
                          onCheckedChange={(checked) => {
                            setSelectedSchools(prev => 
                              checked 
                                ? [...prev, school.id]
                                : prev.filter(id => id !== school.id)
                            );
                          }}
                        />
                        <label htmlFor={`school-${school.id}`} className="ml-2 cursor-pointer">{school.name}</label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {school.districtId ? getDistrictName(school.districtId) : 'No District'}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No schools found for the selected classification
              </div>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!selectedDistrict || selectedSchools.length === 0}
            className="w-full"
          >
            Assign {selectedSchools.length} {selectedSchools.length === 1 ? 'School' : 'Schools'} to Selected District
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default BulkDistrictAssignment;
