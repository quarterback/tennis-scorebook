
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Medal, TrendingUp, BarChart3, AlertTriangle, Zap } from 'lucide-react';
import { Gender, Classification } from '@/types';
import { useRankingCalculator } from '@/hooks/useRankingCalculator';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const Rankings = () => {
  const { schools, getDistrictsByClassification } = useData();
  const { calculateRankings, defaultConfig, historicalData } = useRankingCalculator();
  
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
  
  // Group teams by district/league for standings view
  const teamsByDistrict = qualifiedTeams.reduce((acc, team) => {
    const district = team.districtName;
    if (!acc[district]) {
      acc[district] = [];
    }
    acc[district].push(team);
    return acc;
  }, {} as Record<string, typeof qualifiedTeams>);
  
  // For each district, sort teams by wins within that district
  Object.keys(teamsByDistrict).forEach(district => {
    teamsByDistrict[district].sort((a, b) => {
      // Primary sort by win percentage
      if (b.winPercentage !== a.winPercentage) {
        return (b.winPercentage || 0) - (a.winPercentage || 0);
      }
      // Secondary sort by wins
      return b.wins - a.wins;
    });
  });
  
  // Edge cases examples
  const edgeCases = [
    {
      case: "Weather Impact",
      description: "Teams with fewer matches due to rainouts but still qualifying",
      examples: qualifiedTeams.filter(t => t.matchesPlayed <= 7).slice(0, 3)
    },
    {
      case: "Cross-Classification Competition",
      description: "Teams playing opponents from different classifications",
      examples: qualifiedTeams.filter(t => t.opponentStrengthIndex > 1.2).slice(0, 3)
    },
    {
      case: "League Parity",
      description: "Teams with identical records within the same league",
      examples: findTeamsWithIdenticalRecords(qualifiedTeams).slice(0, 3)
    }
  ];
  
  // Helper function to find teams with identical records
  function findTeamsWithIdenticalRecords(teams: typeof qualifiedTeams) {
    const recordGroups: Record<string, typeof qualifiedTeams> = {};
    
    teams.forEach(team => {
      const key = `${team.wins}-${team.losses}`;
      if (!recordGroups[key]) {
        recordGroups[key] = [];
      }
      recordGroups[key].push(team);
    });
    
    // Return teams that have the same record as another team
    return Object.values(recordGroups)
      .filter(group => group.length > 1)
      .flat();
  }
  
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rankings">Overall Rankings</TabsTrigger>
          <TabsTrigger value="leagues">League Standings</TabsTrigger>
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
                        <TableHead className="text-center">League</TableHead>
                        <TableHead className="text-center">Record</TableHead>
                        <TableHead className="text-center">Win %</TableHead>
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
                          <TableCell className="text-center">
                            {(team.winPercentage || 0).toFixed(3)}
                          </TableCell>
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
                        <TableHead className="text-center">League</TableHead>
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
        
        <TabsContent value="leagues">
          <div className="space-y-6">
            {Object.keys(teamsByDistrict).map(district => (
              <Card key={district}>
                <CardHeader className="bg-tennis-gray pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Award className="h-5 w-5 mr-2 text-tennis-blue" />
                    {district} Standings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">Record</TableHead>
                        <TableHead className="text-center">Win %</TableHead>
                        <TableHead className="text-center">FWS</TableHead>
                        <TableHead className="text-center">Overall Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamsByDistrict[district].map((team, index) => {
                        // Find overall ranking
                        const overallRank = qualifiedTeams.findIndex(t => t.teamId === team.teamId) + 1;
                        
                        return (
                          <TableRow key={team.teamId}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {index === 0 ? (
                                  <span className="min-w-8 h-8 flex items-center justify-center rounded-full 
                                  bg-yellow-100 text-yellow-800">1</span>
                                ) : (
                                  <span>{index + 1}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{team.teamName}</TableCell>
                            <TableCell className="text-center">{team.wins}-{team.losses}</TableCell>
                            <TableCell className="text-center">
                              {(team.winPercentage || 0).toFixed(3)}
                            </TableCell>
                            <TableCell className="text-center">{team.flightWeightedScore.toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                              <span className="px-2 py-1 bg-tennis-blue text-white rounded-full text-xs">
                                #{overallRank}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
            
            {Object.keys(teamsByDistrict).length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-lg">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No league standings available</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  There are no qualified teams in any leagues for this selection.
                </p>
              </div>
            )}
          </div>
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
                  <strong>League Strength Coefficient (LSC):</strong> Calculated using historical state championship 
                  performance (1st and 2nd place finishes) from the previous years.
                  <ul className="list-disc pl-5 mt-1">
                    <li>Formula: LSC = Total League Points / 10.0</li>
                    <li>1st Place Finish = 5 points</li>
                    <li>2nd Place Finish = 4 points</li>
                    <li>Minimum LSC = 1.0</li>
                  </ul>
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
          
          <Card className="mt-6">
            <CardHeader className="bg-tennis-gray pb-2">
              <CardTitle className="text-sm flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-500" />
                Edge Cases & System Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-4">
                {edgeCases.map((edgeCase, index) => (
                  <div key={index} className="border p-3 rounded-md">
                    <h4 className="font-medium text-base">{edgeCase.case}</h4>
                    <p className="text-gray-600 mb-2">{edgeCase.description}</p>
                    
                    {edgeCase.examples.length > 0 ? (
                      <div className="bg-gray-50 p-2 rounded-md">
                        <h5 className="font-medium mb-1 text-sm">Examples:</h5>
                        <ul className="pl-5 list-disc">
                          {edgeCase.examples.map((team, i) => (
                            <li key={i}>
                              {team.teamName} ({team.wins}-{team.losses}), 
                              Composite: {team.compositeScore.toFixed(2)}, 
                              OSI: {team.opponentStrengthIndex.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No examples found for this scenario.</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
