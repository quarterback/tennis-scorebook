
import { Match, Flight } from '@/types';
import { RankingConfig } from '@/types/ranking';

export const useFlightWeightedScore = (matches: Match[]) => {
  /**
   * Calculate Flight-Weighted Score for a team
   */
  const calculateFlightWeightedScore = (teamId: string, config: RankingConfig): number => {
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
  
  return { calculateFlightWeightedScore };
};
