
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Medal, TrendingUp, BarChart3, AlertTriangle, Zap, PieChart, ActivitySquare } from 'lucide-react';
import { Gender, Classification } from '@/types';
import { useRankingCalculator } from '@/hooks/useRankingCalculator';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { TeamRankingsTable } from '@/components/rankings/TeamRankingsTable';
import { UnqualifiedTeamsTable } from '@/components/rankings/UnqualifiedTeamsTable';
import { LeagueStandingsCard } from '@/components/rankings/LeagueStandingsCard';
import { RankingCalculationDetails } from '@/components/rankings/RankingCalculationDetails';
import { RankingSystemExplanation } from '@/components/rankings/RankingSystemExplanation';
import { EdgeCasesCard } from '@/components/rankings/EdgeCasesCard';
import { RankingInsights } from '@/components/rankings/RankingInsights';

const Rankings = () => {
  const { schools, getDistrictsByClassification } = useData();
  const { calculateRankings, defaultConfig, historicalData, generateInsights, findKeyMatchups } = useRankingCalculator();
  
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
  
  // Get analytics insights
  const insights = generateInsights(filteredRankings);
  
  // Find close matchups
  const keyMatchups = findKeyMatchups(qualifiedTeams);
  
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
    },
    {
      case: "Close Rankings",
      description: "Teams with nearly identical composite scores",
      examples: keyMatchups.slice(0, 3).flatMap(m => [m.teamA, m.teamB])
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rankings">Overall Rankings</TabsTrigger>
          <TabsTrigger value="leagues">League Standings</TabsTrigger>
          <TabsTrigger value="calculation">Calculation Details</TabsTrigger>
          <TabsTrigger value="insights">Insights & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rankings">
          <TeamRankingsTable 
            qualifiedTeams={qualifiedTeams} 
            defaultConfig={defaultConfig} 
          />
          
          <UnqualifiedTeamsTable 
            unqualifiedTeams={unqualifiedTeams} 
            defaultConfig={defaultConfig} 
          />
        </TabsContent>
        
        <TabsContent value="leagues">
          <div className="space-y-6">
            {Object.keys(teamsByDistrict).map(district => (
              <LeagueStandingsCard 
                key={district} 
                district={district} 
                teams={teamsByDistrict[district]} 
                qualifiedTeams={qualifiedTeams} 
              />
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
          <RankingCalculationDetails qualifiedTeams={qualifiedTeams} />
          <RankingSystemExplanation defaultConfig={defaultConfig} />
          <EdgeCasesCard edgeCases={edgeCases} />
        </TabsContent>
        
        <TabsContent value="insights">
          <RankingInsights 
            insights={insights} 
            keyMatchups={keyMatchups} 
            selectedGender={selectedGender} 
            selectedClassification={selectedClassification} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
