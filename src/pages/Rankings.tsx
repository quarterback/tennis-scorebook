
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
  const [filterClassification, setFilterClassification] = useState<string>('all');
  
  const availableDistricts = getDistrictsByClassification(selectedClassification);
  
  const rankings = calculateRankings(defaultConfig);
  
  const filteredRankings = rankings.filter(ranking => 
    ranking.gender === selectedGender && 
    ranking.classification === selectedClassification &&
    (selectedDistrict === 'all' || ranking.districtName === selectedDistrict) &&
    (filterClassification === 'all' || ranking.classification === filterClassification)
  );
  
  filteredRankings.sort((a, b) => b.apr - a.apr);
  
  const qualifiedTeams = filteredRankings.filter(r => r.qualifiedForRanking);
  const unqualifiedTeams = filteredRankings.filter(r => !r.qualifiedForRanking);
  
  const leagueInsights = {
    avgLeagueMatches: qualifiedTeams.reduce((sum, team) => sum + team.leagueMatchesPlayed, 0) / 
      (qualifiedTeams.length || 1),
    avgLeagueWinPct: qualifiedTeams.reduce((sum, team) => sum + (team.leagueWinPercentage || 0), 0) / 
      (qualifiedTeams.length || 1)
  };
  
  const insights = {
    ...generateInsights(filteredRankings),
    leagueInsights
  };
  
  const keyMatchups = findKeyMatchups(qualifiedTeams);
  
  const teamsByDistrict = qualifiedTeams.reduce((acc, team) => {
    const district = team.districtName;
    if (!acc[district]) {
      acc[district] = [];
    }
    acc[district].push(team);
    return acc;
  }, {} as Record<string, typeof qualifiedTeams>);
  
  Object.keys(teamsByDistrict).forEach(district => {
    teamsByDistrict[district].sort((a, b) => {
      const aLeagueWinPct = a.leagueWinPercentage || 0;
      const bLeagueWinPct = b.leagueWinPercentage || 0;
      
      if (aLeagueWinPct !== bLeagueWinPct) {
        return bLeagueWinPct - aLeagueWinPct;
      }
      
      if (a.leagueWins !== b.leagueWins) {
        return b.leagueWins - a.leagueWins;
      }
      
      return (b.winPercentage || 0) - (a.winPercentage || 0);
    });
  });
  
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
  
  const today = new Date();
  const cutoffDate = new Date(defaultConfig.cutoffDate);
  const daysUntilCutoff = Math.ceil((cutoffDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  function findTeamsWithIdenticalRecords(teams: typeof qualifiedTeams) {
    const recordGroups: Record<string, typeof qualifiedTeams> = {};
    
    teams.forEach(team => {
      const key = `${team.wins}-${team.losses}`;
      if (!recordGroups[key]) {
        recordGroups[key] = [];
      }
      recordGroups[key].push(team);
    });
    
    return Object.values(recordGroups)
      .filter(group => group.length > 1)
      .flat();
  }
  
  return (
    <div className="space-y-6">
      <RankingsHeader 
        daysUntilCutoff={daysUntilCutoff} 
        cutoffDate={cutoffDate} 
        selectedClassification={selectedClassification}
      />
      
      <RankingsFilter 
        selectedGender={selectedGender}
        selectedClassification={selectedClassification}
        selectedDistrict={selectedDistrict}
        availableDistricts={availableDistricts}
        onGenderChange={(value) => setSelectedGender(value as Gender)}
        onClassificationChange={(value) => {
          setSelectedClassification(value as Classification);
          setSelectedDistrict('all'); // Reset district when classification changes
          setFilterClassification('all'); // Reset classification filter when main classification changes
        }}
        onDistrictChange={setSelectedDistrict}
      />
      
      <Card className="bg-white mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-tennis-blue" />
            {selectedClassification} {selectedGender} APR Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            APR rankings are calculated separately for each classification. 
            The highest ranked team in each classification receives a score of 100, with all other teams 
            scored relative to that team.
          </p>
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
            selectedClassification={filterClassification}
            onClassificationChange={setFilterClassification}
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
