
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { 
  calculateItaPoints, 
  calculateAllTeamPoints, 
  getWeekOfSeason 
} from '@/utils/itaRankingCalculations';
import { TeamRanking } from '@/types/ranking';
import { Gender, Classification, Team, School } from '@/types';

interface ItaRankingOptions {
  gender: Gender;
  classification: Classification;
  cutoffDate?: Date;
  includeNonLeagueMatches?: boolean;
}

export function useItaRankingCalculator() {
  const { teams, schools, matches, districts } = useData();
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRankings = (options: ItaRankingOptions) => {
    setIsCalculating(true);
    
    try {
      // Filter teams by gender and classification
      const filteredTeams = teams.filter(team => {
        const school = schools.find(s => s.id === team.schoolId);
        if (!school) return false;
        
        return team.gender === options.gender && 
               school.classification === options.classification;
      });
      
      // Filter matches based on options
      const filteredMatches = matches.filter(match => {
        // Check if this is a match involving one of our filtered teams
        const homeTeam = filteredTeams.find(t => t.id === match.homeTeamId);
        const awayTeam = filteredTeams.find(t => t.id === match.awayTeamId);
        
        if (!homeTeam && !awayTeam) return false;
        
        // Apply cutoff date if specified
        if (options.cutoffDate) {
          const matchDate = new Date(match.date);
          if (matchDate > options.cutoffDate) return false;
        }
        
        // Apply league/non-league filter
        if (!options.includeNonLeagueMatches && !match.isLeagueMatch) {
          return false;
        }
        
        return match.isComplete;
      });
      
      // Calculate points for each team
      const teamPointsMap = calculateAllTeamPoints(
        filteredTeams, 
        filteredMatches,
        options.cutoffDate
      );
      
      // Create ranking objects with all necessary data
      const rankingsList = filteredTeams.map(team => {
        const school = schools.find(s => s.id === team.schoolId)!;
        const district = districts.find(d => d.id === school.districtId);
        
        const teamMatches = filteredMatches.filter(m => 
          m.homeTeamId === team.id || m.awayTeamId === team.id
        );
        
        const wins = teamMatches.filter(m => 
          (m.homeTeamId === team.id && m.homeTeamWon === true) || 
          (m.awayTeamId === team.id && m.homeTeamWon === false)
        ).length;
        
        const losses = teamMatches.filter(m => 
          (m.homeTeamId === team.id && m.homeTeamWon === false) || 
          (m.awayTeamId === team.id && m.homeTeamWon === true)
        ).length;
        
        const ties = teamMatches.filter(m => m.isTie).length;
        
        const totalPoints = teamPointsMap.get(team.id) || 0;
        
        return {
          teamId: team.id,
          teamName: `${school.name} ${team.gender}`,
          schoolName: school.name,
          schoolId: school.id,
          classification: school.classification,
          districtName: district?.name || 'Unknown',
          gender: team.gender,
          wins,
          losses,
          ties,
          matchesPlayed: teamMatches.length,
          compositeScore: totalPoints,
          apr: 0, // Will be calculated after sorting
          classificationRank: 0, // Will be assigned after sorting
          qualificationStatus: undefined,
          qualificationSeed: undefined,
          winPercentage: wins / (wins + losses + ties) || 0,
        } as TeamRanking;
      });
      
      // Sort by total points (highest first)
      const sortedRankings = rankingsList.sort((a, b) => b.compositeScore - a.compositeScore);
      
      // Assign classification ranks and normalize APR score
      if (sortedRankings.length > 0) {
        const maxPoints = sortedRankings[0].compositeScore;
        
        sortedRankings.forEach((team, index) => {
          team.classificationRank = index + 1;
          // Normalize APR to 0-100 scale
          team.apr = maxPoints > 0 ? Math.round((team.compositeScore / maxPoints) * 100) : 0;
        });
      }
      
      setRankings(sortedRankings);
      
      return sortedRankings;
    } finally {
      setIsCalculating(false);
    }
  };
  
  return {
    rankings,
    isCalculating,
    calculateRankings
  };
}
