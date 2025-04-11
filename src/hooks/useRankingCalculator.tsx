
import { useData } from '@/context/DataContext';
import { Team, School, Match, Flight, District } from '@/types';
import { TeamRanking, LeagueStrengthData, RankingConfig } from '@/types/ranking';

export const useRankingCalculator = () => {
  const { teams, schools, matches, districts } = useData();
  
  // Default ranking configuration
  const defaultConfig: RankingConfig = {
    minimumMatches: 6,
    cutoffDate: '2025-05-07', // Example cutoff date, first week of May
    weights: {
      singles1: 1.0,
      singles2: 0.75,
      doubles1: 1.0,
      doubles2: 0.5
    }
  };
  
  // Sample historical league strength data (in a real app, this would come from a database)
  const leagueStrengthData: LeagueStrengthData[] = [
    { leagueId: 'district1', firstPlaceFinishes: 2, secondPlaceFinishes: 1, yearRange: '2020-2024' },
    { leagueId: 'district2', firstPlaceFinishes: 1, secondPlaceFinishes: 2, yearRange: '2020-2024' },
    // Add more historical data
  ];
  
  /**
   * Calculate Flight-Weighted Score for a team
   */
  const calculateFlightWeightedScore = (teamId: string, config: RankingConfig = defaultConfig): number => {
    let score = 0;
    
    // Get all completed matches for this team
    const teamMatches = matches.filter(
      m => (m.homeTeamId === teamId || m.awayTeamId === teamId) && m.isComplete
    );
    
    // Calculate the cutoff date
    const cutoffDate = new Date(config.cutoffDate);
    
    // Filter matches before cutoff date
    const validMatches = teamMatches.filter(
      m => new Date(m.date) <= cutoffDate
    );
    
    // For each match, calculate flight-weighted points
    validMatches.forEach(match => {
      const isHomeTeam = match.homeTeamId === teamId;
      
      // Process each flight in the match
      match.flights.forEach(flight => {
        // Determine if this team won the flight
        const teamWon = isHomeTeam ? flight.homePlayerWon : !flight.homePlayerWon;
        
        if (teamWon) {
          // Award points based on position and config weights
          if (flight.type === 'singles' && flight.position === 1) {
            score += config.weights.singles1;
          } else if (flight.type === 'singles' && flight.position === 2) {
            score += config.weights.singles2;
          } else if (flight.type === 'doubles' && flight.position === 1) {
            score += config.weights.doubles1;
          } else if (flight.type === 'doubles' && flight.position === 2) {
            score += config.weights.doubles2;
          }
          // Lower positions don't contribute to FWS
        }
      });
    });
    
    return score;
  };
  
  /**
   * Calculate League Strength Coefficient for a district
   */
  const calculateLeagueStrengthCoefficient = (districtId: string): number => {
    // Find the league strength data for this district
    const data = leagueStrengthData.find(d => d.leagueId === districtId);
    
    if (!data) {
      return 1.0; // Default minimum value
    }
    
    // LSC formula: 1.0 + (0.1 * first place) + (0.05 * second place)
    // This is an example formula - adjust as needed
    const coefficient = 1.0 + (0.1 * data.firstPlaceFinishes) + (0.05 * data.secondPlaceFinishes);
    
    return coefficient;
  };
  
  /**
   * Calculate Opponent Strength Index
   */
  const calculateOpponentStrengthIndex = (teamId: string, teamScores: Map<string, number>): number => {
    // Get all matches for this team
    const teamMatches = matches.filter(
      m => (m.homeTeamId === teamId || m.awayTeamId === teamId) && m.isComplete
    );
    
    if (teamMatches.length === 0) {
      return 1.0; // Default if no matches
    }
    
    // Get opponent IDs
    const opponentIds = teamMatches.map(m => 
      m.homeTeamId === teamId ? m.awayTeamId : m.homeTeamId
    );
    
    // Calculate average opponent score
    let totalOpponentScore = 0;
    let validOpponents = 0;
    
    opponentIds.forEach(id => {
      const opponentScore = teamScores.get(id);
      if (opponentScore) {
        totalOpponentScore += opponentScore;
        validOpponents++;
      }
    });
    
    // Return average, with minimum of 1.0
    return validOpponents > 0 ? 
      Math.max(1.0, totalOpponentScore / validOpponents) : 1.0;
  };
  
  /**
   * Calculate team rankings
   */
  const calculateRankings = (config: RankingConfig = defaultConfig): TeamRanking[] => {
    // Initial calculation of FWS for all teams
    const teamScores = new Map<string, number>();
    
    // First pass: Calculate FWS and LSC for all teams
    teams.forEach(team => {
      const fws = calculateFlightWeightedScore(team.id, config);
      teamScores.set(team.id, fws);
    });
    
    // Second pass: Calculate OSI using the initial scores
    const rankings: TeamRanking[] = teams.map(team => {
      const school = schools.find(s => s.id === team.schoolId)!;
      const district = districts.find(d => d.id === school.districtId)!;
      
      // Get team matches
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      // Calculate team stats
      const wins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || 
        (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const losses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || 
        (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      // Calculate components
      const fws = teamScores.get(team.id) || 0;
      const lsc = calculateLeagueStrengthCoefficient(school.districtId);
      const osi = calculateOpponentStrengthIndex(team.id, teamScores);
      
      // Calculate composite score
      const compositeScore = fws * lsc * osi;
      
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
        flightWeightedScore: fws,
        leagueStrengthCoefficient: lsc,
        opponentStrengthIndex: osi,
        compositeScore,
        qualifiedForRanking: teamMatches.length >= config.minimumMatches
      };
    });
    
    // Sort by composite score, highest first
    return rankings.sort((a, b) => b.compositeScore - a.compositeScore);
  };
  
  return {
    calculateRankings,
    defaultConfig
  };
};
