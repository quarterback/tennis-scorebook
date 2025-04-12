
import { useData } from '@/context/DataContext';
import { Team, School, Match, Flight, District } from '@/types';
import { TeamRanking, RankingConfig } from '@/types/ranking';
import { useFlightWeightedScore } from './useFlightWeightedScore';
import { useLeagueStrengthCoefficient } from './useLeagueStrengthCoefficient';
import { useOpponentStrengthIndex } from './useOpponentStrengthIndex';
import { useRankingInsights } from './useRankingInsights';
import { getDefaultConfig, getHistoricalData } from '@/utils/rankingConstants';

export const useRankingCalculator = () => {
  const { teams, schools, matches, districts } = useData();
  const defaultConfig = getDefaultConfig();
  const historicalData = getHistoricalData();
  
  const { calculateFlightWeightedScore } = useFlightWeightedScore(matches);
  const { calculateLeagueStrengthCoefficient } = useLeagueStrengthCoefficient(districts, historicalData);
  const { calculateOpponentStrengthIndex } = useOpponentStrengthIndex(teams, schools, matches, historicalData);
  const { generateInsights, findKeyMatchups } = useRankingInsights();
  
  /**
   * Calculate team rankings with enhanced algorithm and realistic data
   */
  const calculateRankings = (config: RankingConfig = defaultConfig): TeamRanking[] => {
    // Initial calculation of FWS for all teams
    const teamScores = new Map<string, number>();
    
    // First pass: Calculate FWS for all teams
    teams.forEach(team => {
      const fws = calculateFlightWeightedScore(team.id, config);
      teamScores.set(team.id, fws);
    });
    
    // Second pass: Calculate OSI using the initial scores and build rankings
    const rankings: TeamRanking[] = teams.map(team => {
      const school = schools.find(s => s.id === team.schoolId)!;
      const district = districts.find(d => d.id === school.districtId)!;
      
      // Get team matches
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      // Calculate overall team stats
      const wins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || 
        (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const losses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || 
        (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      // Calculate league-specific stats
      const leagueMatches = teamMatches.filter(m => {
        // Get opponent team's school
        const opponentTeamId = m.homeTeamId === team.id ? m.awayTeamId : m.homeTeamId;
        const opponentTeam = teams.find(t => t.id === opponentTeamId);
        if (!opponentTeam) return false;
        
        const opponentSchool = schools.find(s => s.id === opponentTeam.schoolId);
        if (!opponentSchool) return false;
        
        // Match is a league match if both teams are from the same district AND the isLeagueMatch flag is true
        return opponentSchool.districtId === school.districtId && m.isLeagueMatch;
      });
      
      const leagueWins = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || 
        (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const leagueLosses = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || 
        (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      // Calculate components
      const fws = teamScores.get(team.id) || 0;
      const lsc = calculateLeagueStrengthCoefficient(school.districtId);
      const osi = calculateOpponentStrengthIndex(team.id, teamScores);
      
      // Calculate composite score
      const compositeScore = fws * lsc * osi;
      
      // Calculate win percentages
      const totalMatches = wins + losses;
      const winPercentage = totalMatches > 0 ? wins / totalMatches : 0;
      
      const totalLeagueMatches = leagueWins + leagueLosses;
      const leagueWinPercentage = totalLeagueMatches > 0 ? leagueWins / totalLeagueMatches : 0;
      
      return {
        teamId: team.id,
        teamName: `${school.name} ${team.gender}`,
        schoolName: school.name,
        gender: team.gender,
        classification: school.classification,
        districtName: district.name,
        matchesPlayed: teamMatches.length,
        wins,
        losses,
        leagueWins,
        leagueLosses,
        leagueMatchesPlayed: leagueMatches.length,
        flightWeightedScore: fws,
        leagueStrengthCoefficient: lsc,
        opponentStrengthIndex: osi,
        compositeScore,
        qualifiedForRanking: teamMatches.length >= config.minimumMatches,
        winPercentage,
        leagueWinPercentage
      };
    });
    
    // Sort by composite score, highest first
    return rankings.sort((a, b) => b.compositeScore - a.compositeScore);
  };
  
  return {
    calculateRankings,
    defaultConfig,
    historicalData,
    generateInsights,
    findKeyMatchups
  };
};
