
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { District, Gender, Classification } from '@/types';

interface RankingsFilterProps {
  selectedGender: Gender;
  selectedClassification: Classification;
  selectedDistrict: string;
  availableDistricts: District[];
  onGenderChange: (value: string) => void;
  onClassificationChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
}

export const RankingsFilter: React.FC<RankingsFilterProps> = ({
  selectedGender,
  selectedClassification,
  selectedDistrict,
  availableDistricts,
  onGenderChange,
  onClassificationChange,
  onDistrictChange
}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Filter className="h-5 w-5 mr-2 text-tennis-blue" />
          Filter Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={selectedGender}
              onValueChange={onGenderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Boys">Boys</SelectItem>
                <SelectItem value="Girls">Girls</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="classification">Classification</Label>
            <Select
              value={selectedClassification}
              onValueChange={onClassificationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6A">6A</SelectItem>
                <SelectItem value="5A">5A</SelectItem>
                <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="league">Source League</Label>
            <Select
              value={selectedDistrict}
              onValueChange={onDistrictChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select league" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                {availableDistricts.map(district => (
                  <SelectItem key={district.id} value={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
