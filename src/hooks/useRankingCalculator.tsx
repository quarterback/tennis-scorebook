
import { useData } from '@/context/DataContext';
import { Team, School, Match, Flight, District } from '@/types';
import { TeamRanking, LeagueStrengthData, RankingConfig, HistoricalData } from '@/types/ranking';

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
  
  // Historical data for realistic league strength calculations
  // Based on historical state championship performances
  const historicalData: HistoricalData = {
    leagues: [
      // 6A Leagues
      { leagueId: 'pil', firstPlaceFinishes: 1, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 9 },
      { leagueId: 'metro', firstPlaceFinishes: 3, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 23 },
      { leagueId: 'pacific', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
      { leagueId: 'mt-hood', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 },
      { leagueId: 'three-rivers', firstPlaceFinishes: 2, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 14 },
      { leagueId: 'central-valley', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
      { leagueId: 'southwest', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 },
      
      // 5A Leagues
      { leagueId: 'northwest-oregon', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
      { leagueId: 'midwestern', firstPlaceFinishes: 1, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 9 },
      { leagueId: 'mid-willamette', firstPlaceFinishes: 2, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 10 },
      { leagueId: 'intermountain', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
      
      // 4A/3A/2A/1A Special Districts
      { leagueId: 'sd1', firstPlaceFinishes: 3, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 19 },
      { leagueId: 'sd2', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
      { leagueId: 'sd3', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 },
      { leagueId: 'sd4', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
      { leagueId: 'sd5', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 }
    ],
    topSchools: [
      'jesuit', 'sunset', 'lincoln', 'lake-oswego', 'south-eugene', 'crescent-valley', 'catlin-gabel'
    ]
  };
  
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
        // Only count varsity flights
        if (flight.level !== 'varsity') return;
        
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
   * Using new formula: LSC = Total League Points / 10.0
   */
  const calculateLeagueStrengthCoefficient = (districtId: string): number => {
    // Map district ID to league ID in historical data
    const district = districts.find(d => d.id === districtId);
    if (!district) return 1.0;
    
    // Convert district.name to a key that matches our historicalData.leagues
    const leagueKey = district.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    
    // Find the league strength data
    const leagueData = historicalData.leagues.find(l => {
      // Try to match by district ID or constructed league key
      return l.leagueId === districtId || l.leagueId === leagueKey;
    });
    
    if (!leagueData) {
      return 1.0; // Default minimum value
    }
    
    // Calculate LSC using formula: Total Points / 10.0
    // First place = 5 points, Second place = 4 points
    const coefficient = Math.max(1.0, leagueData.totalPoints / 10.0);
    
    return coefficient;
  };
  
  /**
   * Calculate Opponent Strength Index with improved algorithm
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
    
    // Get the team's school
    const team = teams.find(t => t.id === teamId);
    const school = team ? schools.find(s => s.id === team.schoolId) : null;
    
    // Apply a strength modifier for historically strong schools
    let strengthModifier = 1.0;
    if (school && historicalData.topSchools.includes(school.id.toLowerCase())) {
      strengthModifier = 1.1; // 10% boost for historically strong programs
    }
    
    // Return adjusted OSI with minimum of 1.0
    return validOpponents > 0 ? 
      Math.max(1.0, (totalOpponentScore / validOpponents) * strengthModifier) : 1.0;
  };
  
  /**
   * Calculate team rankings with enhanced algorithm and realistic data
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
      
      // Calculate win percentage
      const totalMatches = wins + losses;
      const winPercentage = totalMatches > 0 ? wins / totalMatches : 0;
      
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
        qualifiedForRanking: teamMatches.length >= config.minimumMatches,
        winPercentage
      };
    });
    
    // Sort by composite score, highest first
    return rankings.sort((a, b) => b.compositeScore - a.compositeScore);
  };
  
  return {
    calculateRankings,
    defaultConfig,
    historicalData
  };
};
