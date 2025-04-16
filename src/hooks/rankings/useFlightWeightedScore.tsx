
import { Match, Flight } from '@/types';
import { RankingConfig } from '@/types/ranking';

export const useFlightWeightedScore = (matches: Match[]) => {
  /**
   * Calculate Flight-Weighted Score for a team based on Oregon high school tennis rules
   * 1st Singles = 1.0 pt
   * 1st Doubles = 1.0 pt
   * 2nd Singles = 0.75 pt
   * 2nd Doubles = 0.5 pt
   * 3rd Singles = 0.45 pt
   * 3rd Doubles = 0.35 pt
   * Ties count as half a win (but are extremely rare now)
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
    
    let tieCount = 0;
    
    // For each match, calculate flight-weighted points with enhanced scoring
    validMatches.forEach(match => {
      const isHomeTeam = match.homeTeamId === teamId;
      
      // Check if the match is a tie
      if (match.isTie) {
        tieCount++;
      }
      
      // Process each flight in the match
      match.flights.forEach(flight => {
        // Only count varsity flights
        if (flight.level !== 'varsity') return;
        
        // Determine if this team won the flight
        const teamWon = isHomeTeam ? flight.homePlayerWon : !flight.homePlayerWon;
        const isTie = flight.homePlayerWon === undefined; // Flight ended in tie (extremely rare now)
        
        // Determine the weight for this flight
        let flightWeight = 0;
        if (flight.type === 'singles') {
          if (flight.position === 1) flightWeight = 1.0;
          else if (flight.position === 2) flightWeight = 0.75;
          else if (flight.position === 3) flightWeight = 0.45;
          // Positions beyond 3rd don't contribute as much
          else flightWeight = 0.25;
        } else if (flight.type === 'doubles') {
          if (flight.position === 1) flightWeight = 1.0;
          else if (flight.position === 2) flightWeight = 0.5;
          else if (flight.position === 3) flightWeight = 0.35;
          // Positions beyond 3rd don't contribute as much
          else flightWeight = 0.2;
        }
        
        if (teamWon) {
          // Full points for a win
          score += flightWeight;
        } else if (isTie) {
          // Half points for a tie
          score += flightWeight * 0.5;
        }
      });
      
      // If this match had a playoff tiebreaker, count those points (if relevant and completed)
      if (match.tiebreakRound && match.tiebreakRound.isComplete) {
        match.tiebreakRound.flights.forEach(tiebreakFlight => {
          const teamWon = isHomeTeam ? tiebreakFlight.homePlayerWon : !tiebreakFlight.homePlayerWon;
          if (teamWon) {
            // Playoff tiebreaker flights are worth extra
            if (tiebreakFlight.type === 'singles') {
              score += 0.5; // Points for winning a playoff tiebreaker singles
            } else if (tiebreakFlight.type === 'doubles') {
              score += 0.75; // Points for winning a playoff tiebreaker doubles
            }
          }
        });
      }
    });
    
    // Log the tie count for debugging
    if (tieCount > 0) {
      console.log(`Team ${teamId} has ${tieCount} ties`);
    }
    
    return score;
  };
  
  return { calculateFlightWeightedScore };
};
