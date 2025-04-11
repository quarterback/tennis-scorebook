
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Medal, TrendingUp, BarChart3 } from 'lucide-react';
import { Gender, Classification } from '@/types';
import { useRankingCalculator } from '@/hooks/useRankingCalculator';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const Rankings = () => {
  const { schools, getDistrictsByClassification } = useData();
  const { calculateRankings, defaultConfig } = useRankingCalculator();
  
  const [selectedGender, setSelectedGender] = useState<Gender>('Boys');
  const [selectedClassification, setSelectedClassification] = useState<Classification>('6A');
  const [selectedTab, setSelectedTab] = useState<string>('rankings');
  
  // Get all available districts for the selected classification
  const availableDistricts = getDistrictsByClassification(selectedClassification);
  
  // Calculate rankings
  const rankings = calculateRankings(defaultConfig);
  
  // Filter rankings based on selected criteria
  const filteredRankings = rankings.filter(ranking => 
    ranking.gender === selectedGender && 
    ranking.classification === selectedClassification
  );
  
  // Get qualified and unqualified teams
  const qualifiedTeams = filteredRankings.filter(r => r.qualifiedForRanking);
  const unqualifiedTeams = filteredRankings.filter(r => !r.qualifiedForRanking);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart3 className="h-7 w-7 mr-2 text-tennis-blue" />
          Tennis Rankings
        </h1>
      </div>
      
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-tennis-blue" />
            Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="calculation">Calculation Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rankings">
          <Card>
            <CardHeader className="bg-tennis-gray pb-2">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-tennis-blue" />
                {selectedGender} {selectedClassification} Rankings
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Minimum {defaultConfig.minimumMatches} matches required)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {qualifiedTeams.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">District</TableHead>
                        <TableHead className="text-center">Record</TableHead>
                        <TableHead className="text-center">Matches</TableHead>
                        <TableHead className="text-center">Composite Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qualifiedTeams.map((team, index) => (
                        <TableRow key={team.teamId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <span className={`min-w-8 h-8 flex items-center justify-center rounded-full 
                                ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                  index === 1 ? 'bg-gray-100 text-gray-800' : 
                                  index === 2 ? 'bg-amber-100 text-amber-800' : ''}`}>
                                {index + 1}
                              </span>
                              {index < 3 && (
                                <Medal className={`h-4 w-4 ml-1 ${
                                  index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-500' : 'text-amber-700'
                                }`} />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{team.teamName}</TableCell>
                          <TableCell className="text-center">{team.districtName}</TableCell>
                          <TableCell className="text-center">{team.wins}-{team.losses}</TableCell>
                          <TableCell className="text-center">{team.matchesPlayed}</TableCell>
                          <TableCell className="text-center font-medium">{team.compositeScore.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <Award className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No qualified teams found</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    There are no {selectedGender} {selectedClassification} teams that have played the minimum required {defaultConfig.minimumMatches} matches.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {unqualifiedTeams.length > 0 && (
            <Card className="mt-6">
              <CardHeader className="bg-tennis-gray pb-2">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-gray-400" />
                  Unqualified Teams (Less than {defaultConfig.minimumMatches} matches)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">District</TableHead>
                        <TableHead className="text-center">Record</TableHead>
                        <TableHead className="text-center">Matches</TableHead>
                        <TableHead className="text-center">Composite Score</TableHead>
                        <TableHead className="text-center">Matches Needed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unqualifiedTeams.map((team) => (
                        <TableRow key={team.teamId}>
                          <TableCell>{team.teamName}</TableCell>
                          <TableCell className="text-center">{team.districtName}</TableCell>
                          <TableCell className="text-center">{team.wins}-{team.losses}</TableCell>
                          <TableCell className="text-center">{team.matchesPlayed}</TableCell>
                          <TableCell className="text-center font-medium">{team.compositeScore.toFixed(2)}</TableCell>
                          <TableCell className="text-center text-red-500 font-medium">
                            {defaultConfig.minimumMatches - team.matchesPlayed}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="calculation">
          <Card>
            <CardHeader className="bg-tennis-gray pb-2">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-tennis-blue" />
                Calculation Details for {selectedGender} {selectedClassification}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {qualifiedTeams.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Rank</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">FWS</TableHead>
                        <TableHead className="text-center">LSC</TableHead>
                        <TableHead className="text-center">OSI</TableHead>
                        <TableHead className="text-center">Composite Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qualifiedTeams.map((team, index) => (
                        <TableRow key={team.teamId}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{team.teamName}</TableCell>
                          <TableCell className="text-center" title="Flight-Weighted Score">
                            {team.flightWeightedScore.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center" title="League Strength Coefficient">
                            {team.leagueStrengthCoefficient.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center" title="Opponent Strength Index">
                            {team.opponentStrengthIndex.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {team.compositeScore.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No calculation data available</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    There are no qualified teams to display calculation details for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="bg-tennis-gray pb-2">
              <CardTitle className="text-sm flex items-center">
                <Award className="h-5 w-5 mr-2 text-tennis-blue" />
                Ranking System Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <h3 className="font-medium mb-2">How Rankings Are Calculated:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Flight-Weighted Score (FWS):</strong> Points assigned for wins at specific positions:
                  <ul className="list-disc pl-5 mt-1">
                    <li>1st Singles: {defaultConfig.weights.singles1} points</li>
                    <li>1st Doubles: {defaultConfig.weights.doubles1} points</li>
                    <li>2nd Singles: {defaultConfig.weights.singles2} points</li>
                    <li>2nd Doubles: {defaultConfig.weights.doubles2} points</li>
                  </ul>
                </li>
                <li>
                  <strong>League Strength Coefficient (LSC):</strong> Calculated using historical state tournament 
                  performance (1st and 2nd place finishes) from the previous four years. Minimum value is 1.0.
                </li>
                <li>
                  <strong>Opponent Strength Index (OSI):</strong> A metric assessing the quality of opponents based 
                  on their performance. This encourages teams to schedule tougher matches.
                </li>
                <li>
                  <strong>Composite Score:</strong> FWS × LSC × OSI
                </li>
                <li>
                  <strong>Minimum Matches:</strong> {defaultConfig.minimumMatches} matches required to qualify for rankings.
                </li>
                <li>
                  <strong>Cutoff Date:</strong> Rankings freeze on {new Date(defaultConfig.cutoffDate).toLocaleDateString()}.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
