
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TrendingUp, Trophy } from 'lucide-react';
import { Gender, Classification } from '@/types';

interface StandingsFilterProps {
  selectedGender: Gender;
  setSelectedGender: (gender: Gender) => void;
  selectedClassification: Classification;
  setSelectedClassification: (classification: Classification) => void;
  selectedDistrictId: string | undefined;
  setSelectedDistrictId: (districtId: string | undefined) => void;
  availableDistricts: Array<{ id: string; name: string }>;
  activeTab: string;
}

const StandingsFilter: React.FC<StandingsFilterProps> = ({
  selectedGender,
  setSelectedGender,
  selectedClassification,
  setSelectedClassification,
  selectedDistrictId,
  setSelectedDistrictId,
  availableDistricts,
  activeTab
}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {activeTab === 'standings' ? (
            <TrendingUp className="h-5 w-5 mr-2 text-tennis-blue" />
          ) : (
            <Trophy className="h-5 w-5 mr-2 text-tennis-blue" />
          )}
          Filter Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={selectedGender}
              onValueChange={(value) => setSelectedGender(value as Gender)}
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
              onValueChange={(value) => {
                setSelectedClassification(value as Classification);
                setSelectedDistrictId(undefined);
              }}
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
            <Label htmlFor="district">League/Conference</Label>
            <Select
              value={selectedDistrictId || 'all'}
              onValueChange={(value) => setSelectedDistrictId(value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Leagues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                {availableDistricts.map(district => (
                  <SelectItem key={district.id} value={district.id}>
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

export default StandingsFilter;
