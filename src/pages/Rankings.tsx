
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, SortAsc, SortDesc } from 'lucide-react';
import { Gender, Classification } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { calculateWs10, calculateOsi, calculateApr } from '@/utils/aprCalculations';

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
  const { schools, teams, matches, districts } = useData();
  
  const [selectedGender, setSelectedGender] = useState<Gender>('Boys');
  const [selectedClassification, setSelectedClassification] = useState<Classification>('6A');
  const [rankingData, setRankingData] = useState<TeamRankingData[]>([]);
  const [sortField, setSortField] = useState<keyof TeamRankingData>('apr');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Calculate rankings whenever dependencies change
  useEffect(() => {
    calculateRankings();
  }, [teams, matches, selectedGender, selectedClassification]);
  
  const calculateRankings = () => {
    // First pass: Calculate WS10 for all teams
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
    
    // Second pass: Calculate OSI and APR for all teams
    const rankings: TeamRankingData[] = teams
      .filter(team => {
        // Filter by gender
        if (team.gender !== selectedGender) return false;
        
        // Get school to check classification
        const school = schools.find(s => s.id === team.schoolId);
        if (!school) return false;
        
        // Filter by classification
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
        
        // Count wins, losses, ties
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
        
        // Get WS10
        const ws10Data = teamWs10Map.get(team.id) || { ws10: 0, matchesPlayed: 0 };
        const ws10 = ws10Data.ws10;
        
        // Calculate OSI
        const osi = calculateOsi(matches, team.id, teamWs10Map);
        
        // Calculate APR
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
  
  // Handle sorting
  const handleSort = (field: keyof TeamRankingData) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending for most fields
      setSortField(field);
      setSortDirection(field === 'teamName' || field === 'schoolName' ? 'asc' : 'desc');
    }
  };
  
  // Apply sorting
  const sortedRankings = [...rankingData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle string comparisons
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle number comparisons
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
  
  // Scale APR values to 0-100 for display
  const maxApr = Math.max(...rankingData.map(r => r.apr), 1);
  
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
            APR = WS10 × OSI — where WS10 is the team's weighted flight score and OSI is the opponent strength index.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                onValueChange={(value: Classification) => setSelectedClassification(value)}
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
          </div>
        </CardContent>
      </Card>
      
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
                  WS10 <SortIcon field="ws10" />
                </TableHead>
                <TableHead onClick={() => handleSort('osi')}>
                  OSI <SortIcon field="osi" />
                </TableHead>
                <TableHead onClick={() => handleSort('apr')}>
                  APR <SortIcon field="apr" />
                </TableHead>
                <TableHead className="text-right">APR Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRankings.length > 0 ? (
                sortedRankings.map((team, index) => (
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
