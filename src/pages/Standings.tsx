
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Award, Medal } from 'lucide-react';
import { Gender, Classification } from '@/types';

const Standings = () => {
  const { schools, getStandings } = useData();
  const [selectedGender, setSelectedGender] = useState<Gender>('Boys');
  const [selectedClassification, setSelectedClassification] = useState<Classification>('6A');
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
  
  // Get all unique districts for the selected classification
  const districts = Array.from(
    new Set(
      schools
        .filter(school => school.classification === selectedClassification)
        .map(school => school.district)
    )
  ).sort();
  
  // Get standings
  const standings = getStandings(selectedGender, selectedClassification, selectedDistrict);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Standings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              setSelectedDistrict(undefined);
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
          <Label htmlFor="district">District/Conference</Label>
          <Select
            value={selectedDistrict || ''}
            onValueChange={(value) => setSelectedDistrict(value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map(district => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-tennis-blue" />
            {selectedGender} {selectedClassification} {selectedDistrict ? `- ${selectedDistrict}` : ''} Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {standings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Team</th>
                    <th className="text-center py-3 px-4">League W-L</th>
                    <th className="text-center py-3 px-4">League %</th>
                    <th className="text-center py-3 px-4">Overall W-L</th>
                    <th className="text-center py-3 px-4">Overall %</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing, index) => {
                    const leagueTotal = standing.leagueWins + standing.leagueLosses;
                    const leagueWinPct = leagueTotal > 0 ? standing.leagueWins / leagueTotal : 0;
                    
                    const overallTotal = standing.overallWins + standing.overallLosses;
                    const overallWinPct = overallTotal > 0 ? standing.overallWins / overallTotal : 0;
                    
                    return (
                      <tr key={standing.teamId} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800">{index + 1}</span>
                            {index < 3 && (
                              <Medal className={`h-4 w-4 ml-1 ${
                                index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-700'
                              }`} />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{standing.teamName}</td>
                        <td className="py-3 px-4 text-center">{standing.leagueWins}-{standing.leagueLosses}</td>
                        <td className="py-3 px-4 text-center">
                          {leagueTotal > 0 ? leagueWinPct.toFixed(3) : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">{standing.overallWins}-{standing.overallLosses}</td>
                        <td className="py-3 px-4 text-center">
                          {overallTotal > 0 ? overallWinPct.toFixed(3) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No teams found for the selected criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Standings;
