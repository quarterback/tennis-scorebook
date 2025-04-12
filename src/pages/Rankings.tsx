
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { Gender, Classification } from '@/types';
import { useRankingCalculator } from '@/hooks/rankings/useRankingCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RankingsHeader } from '@/components/rankings/RankingsHeader';
import { RankingsFilter } from '@/components/rankings/RankingsFilter';
import { TeamRankingsTable } from '@/components/rankings/TeamRankingsTable';
import { UnqualifiedTeamsTable } from '@/components/rankings/UnqualifiedTeamsTable';
import { LeagueStandingsView } from '@/components/rankings/LeagueStandingsView';
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
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  
  // Get all available districts for the selected classification
  const availableDistricts = getDistrictsByClassification(selectedClassification);
  
  // Calculate rankings
  const rankings = calculateRankings(defaultConfig);
  
  // Filter rankings based on selected criteria
  const filteredRankings = rankings.filter(ranking => 
    ranking.gender === selectedGender && 
    ranking.classification === selectedClassification &&
    (selectedDistrict === 'all' || ranking.districtName === selectedDistrict)
  );
  
  // Get qualified and unqualified teams
  const qualifiedTeams = filteredRankings.filter(r => r.qualifiedForRanking);
  const unqualifiedTeams = filteredRankings.filter(r => !r.qualifiedForRanking);
  
  // Calculate league-specific insights
  const leagueInsights = {
    avgLeagueMatches: qualifiedTeams.reduce((sum, team) => sum + team.leagueMatchesPlayed, 0) / 
      (qualifiedTeams.length || 1),
    avgLeagueWinPct: qualifiedTeams.reduce((sum, team) => sum + (team.leagueWinPercentage || 0), 0) / 
      (qualifiedTeams.length || 1)
  };
  
  // Get analytics insights with league data
  const insights = {
    ...generateInsights(filteredRankings),
    leagueInsights
  };
  
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
  
  // For each district, sort teams by league wins within that district
  Object.keys(teamsByDistrict).forEach(district => {
    teamsByDistrict[district].sort((a, b) => {
      // Primary sort by league win percentage
      const aLeagueWinPct = a.leagueWinPercentage || 0;
      const bLeagueWinPct = b.leagueWinPercentage || 0;
      
      if (aLeagueWinPct !== bLeagueWinPct) {
        return bLeagueWinPct - aLeagueWinPct;
      }
      
      // Secondary sort by league wins
      if (a.leagueWins !== b.leagueWins) {
        return b.leagueWins - a.leagueWins;
      }
      
      // Tertiary sort by overall win percentage
      return (b.winPercentage || 0) - (a.winPercentage || 0);
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
  
  // Get current season info
  const today = new Date();
  const cutoffDate = new Date(defaultConfig.cutoffDate);
  const daysUntilCutoff = Math.ceil((cutoffDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

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
      <RankingsHeader daysUntilCutoff={daysUntilCutoff} cutoffDate={cutoffDate} />
      
      <RankingsFilter 
        selectedGender={selectedGender}
        selectedClassification={selectedClassification}
        selectedDistrict={selectedDistrict}
        availableDistricts={availableDistricts}
        onGenderChange={(value) => setSelectedGender(value as Gender)}
        onClassificationChange={(value) => {
          setSelectedClassification(value as Classification);
          setSelectedDistrict('all'); // Reset district when classification changes
        }}
        onDistrictChange={setSelectedDistrict}
      />
      
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
          <LeagueStandingsView 
            teamsByDistrict={teamsByDistrict} 
            qualifiedTeams={qualifiedTeams} 
          />
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
            selectedDistrict={selectedDistrict}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
