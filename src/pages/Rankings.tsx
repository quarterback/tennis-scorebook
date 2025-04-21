
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, SortAsc, SortDesc, Info } from 'lucide-react';
import { Gender, Classification } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  calculateWs10, 
  calculateOsi, 
  calculateApr, 
  FLIGHT_WEIGHTS 
} from '@/utils/aprCalculations';
import { APR_CONSTANTS } from '@/utils/aprConstants';
import { useDistrictOperations } from '@/hooks/useDistrictOperations';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RankingSystemExplanation } from '@/components/rankings/RankingSystemExplanation';

interface TeamRankingData {
  teamId: string;
  teamName: string;
  schoolName: string;
  schoolId: string;
  classification: string;
  districtName: string;
  gender: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
  ws10: number;
  osi: number;
  apr: number;
}

const Rankings = () => {
  const { schools, teams, matches, districts: contextDistricts } = useData();
  const { districts } = useDistrictOperations();
  
  const [selectedGender, setSelectedGender] = useState<Gender>('Boys');
  const [selectedClassification, setSelectedClassification] = useState<Classification>('6A');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [rankingData, setRankingData] = useState<TeamRankingData[]>([]);
  const [sortField, setSortField] = useState<keyof TeamRankingData>('apr');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    calculateRankings();
  }, [teams, matches, selectedGender, selectedClassification]);
  
  const calculateRankings = () => {
    // Step 1: Calculate WS10 for all teams
    const teamWs10Map = new Map<string, { ws10: number, matchesPlayed: number }>();
    
    teams.forEach(team => {
      const teamMatches = matches.filter(m => 
        m.isComplete && (m.homeTeamId === team.id || m.awayTeamId === team.id)
      );
      
      const ws10 = calculateWs10(matches, team.id);
      
      teamWs10Map.set(team.id, {
        ws10,
        matchesPlayed: teamMatches.length
      });
    });
    
    // Step 2: Calculate rankings with OSI
    const rankings: TeamRankingData[] = teams
      .filter(team => {
        if (team.gender !== selectedGender) return false;
        
        const school = schools.find(s => s.id === team.schoolId);
        if (!school) return false;
        
        return school.classification === selectedClassification;
      })
      .map(team => {
        const school = schools.find(s => s.id === team.schoolId) || { 
          name: 'Unknown', 
          classification: 'Unknown',
          id: '',
          districtId: ''
        };
        
        const district = districts.find(d => d.id === school.districtId) || { name: 'Unknown', id: '' };
        
        const teamMatches = matches.filter(m => 
          m.isComplete && (m.homeTeamId === team.id || m.awayTeamId === team.id)
        );
        
        const wins = teamMatches.filter(m => 
          (m.homeTeamId === team.id && m.homeTeamWon === true) || 
          (m.awayTeamId === team.id && m.homeTeamWon === false)
        ).length;
        
        const ties = teamMatches.filter(m => 
          m.isTie === true
        ).length;
        
        const losses = teamMatches.filter(m => 
          (m.homeTeamId === team.id && m.homeTeamWon === false) || 
          (m.awayTeamId === team.id && m.homeTeamWon === true)
        ).length;
        
        const matchesPlayed = teamMatches.length;
        const winPercentage = matchesPlayed > 0 ? 
          (wins + (ties * 0.5)) / matchesPlayed : 0;
        
        const ws10Data = teamWs10Map.get(team.id) || { ws10: 0, matchesPlayed: 0 };
        const ws10 = ws10Data.ws10;
        
        const osi = calculateOsi(matches, team.id, teamWs10Map);
        
        const apr = calculateApr(ws10, osi);
        
        return {
          teamId: team.id,
          teamName: `${school.name} ${team.gender}`,
          schoolName: school.name,
          schoolId: school.id,
          classification: school.classification,
          districtName: district.name,
          gender: team.gender,
          matchesPlayed,
          wins,
          losses,
          ties,
          winPercentage,
          ws10,
          osi,
          apr
        };
      });
    
    setRankingData(rankings);
  };
  
  const handleSort = (field: keyof TeamRankingData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'teamName' || field === 'schoolName' ? 'asc' : 'desc');
    }
  };
  
  const sortedRankings = [...rankingData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });
  
  const SortIcon = ({ field }: { field: keyof TeamRankingData }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <SortAsc className="inline h-4 w-4 ml-1" />
      : <SortDesc className="inline h-4 w-4 ml-1" />;
  };
  
  const maxApr = Math.max(...rankingData.map(r => r.apr), 1);
  
  const filteredDistricts = districts.filter(
    (d) => d.classification === selectedClassification
  );
  
  const filteredRankings = selectedDistrict === 'all'
    ? sortedRankings
    : sortedRankings.filter((team) => {
        return (
          team.districtName &&
          team.districtName.toLowerCase() ===
            filteredDistricts.find((d) => d.name === team.districtName)?.name?.toLowerCase()
        );
      });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">APR Rankings</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/match-entry'}>
            Record Matches
          </Button>
        </div>
      </div>
      
      <Card className="bg-white mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-tennis-blue" />
            Athletic Power Rating (APR) Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            APR = WS10 × OSI — where WS10 is the sum of your 10 best match scores and OSI is the opponent strength index.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select
                value={selectedGender}
                onValueChange={(value: Gender) => setSelectedGender(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boys">Boys</SelectItem>
                  <SelectItem value="Girls">Girls</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={selectedClassification}
                onValueChange={(value: Classification) => {
                  setSelectedClassification(value);
                  setSelectedDistrict('all');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6A">6A</SelectItem>
                  <SelectItem value="5A">5A</SelectItem>
                  <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={selectedDistrict}
                onValueChange={(value: string) => setSelectedDistrict(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {filteredDistricts.map((district) => (
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
      
      <RankingSystemExplanation defaultConfig={{
        weights: {
          singles1: FLIGHT_WEIGHTS.singles1,
          singles2: FLIGHT_WEIGHTS.singles2,
          singles3: FLIGHT_WEIGHTS.singles3,
          doubles1: FLIGHT_WEIGHTS.doubles1,
          doubles2: FLIGHT_WEIGHTS.doubles2,
          doubles3: FLIGHT_WEIGHTS.doubles3
        },
        minimumMatches: APR_CONSTANTS.MIN_MATCHES,
        cutoffDate: new Date().toISOString()
      }} />
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" onClick={() => handleSort('apr')}>
                  Rank <SortIcon field="apr" />
                </TableHead>
                <TableHead onClick={() => handleSort('teamName')}>
                  Team <SortIcon field="teamName" />
                </TableHead>
                <TableHead onClick={() => handleSort('matchesPlayed')}>
                  MP <SortIcon field="matchesPlayed" />
                </TableHead>
                <TableHead onClick={() => handleSort('winPercentage')}>
                  Record <SortIcon field="winPercentage" />
                </TableHead>
                <TableHead onClick={() => handleSort('ws10')}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        WS10 <Info className="h-3 w-3 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Win Score 10: Sum of your 10 best match scores using weighted flight values</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <SortIcon field="ws10" />
                </TableHead>
                <TableHead onClick={() => handleSort('osi')}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        OSI <Info className="h-3 w-3 ml-1" /> 
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Opponent Strength Index: Average of opponents' WS10 scores</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <SortIcon field="osi" />
                </TableHead>
                <TableHead onClick={() => handleSort('apr')}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        APR <Info className="h-3 w-3 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Athletic Power Rating: WS10 × OSI</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <SortIcon field="apr" />
                </TableHead>
                <TableHead className="text-right">APR Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRankings.length > 0 ? (
                filteredRankings.map((team, index) => (
                  <TableRow key={team.teamId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell>{team.matchesPlayed}</TableCell>
                    <TableCell>{team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''}</TableCell>
                    <TableCell>{team.ws10.toFixed(2)}</TableCell>
                    <TableCell>{team.osi.toFixed(2)}</TableCell>
                    <TableCell>{team.apr.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (team.apr / maxApr) * 100)}%` }}
                        ></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No teams found or no match data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rankings;
