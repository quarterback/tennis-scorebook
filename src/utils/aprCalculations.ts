
import { Match, Flight } from '@/types';

/**
 * Flight weights for APR calculation
 */
export const FLIGHT_WEIGHTS = {
  singles1: 1.00,
  singles2: 0.75,
  singles3: 0.40,
  doubles1: 1.00,
  doubles2: 0.50,
  doubles3: 0.30
};

/**
 * Calculate Flight-Weighted Score (FWS) for a match
 * This gives higher weight to more important positions
 */
export const calculateFlightWeightedScore = (match: Match): number => {
  let score = 0;
  
  match.flights.forEach(flight => {
    // Skip non-varsity matches for APR calculation
    if (flight.level !== 'varsity') return;
    
    // Determine if this flight was won by the home team
    const homeWon = flight.homePlayerWon === true;
    
    // Assign weight based on flight type and position
    let weight = 0;
    
    if (flight.type === 'singles') {
      switch (flight.position) {
        case 1: weight = FLIGHT_WEIGHTS.singles1; break;
        case 2: weight = FLIGHT_WEIGHTS.singles2; break;
        case 3: weight = FLIGHT_WEIGHTS.singles3; break;
        default: weight = 0; // Lower flights not counted in APR
      }
    } else if (flight.type === 'doubles') {
      switch (flight.position) {
        case 1: weight = FLIGHT_WEIGHTS.doubles1; break;
        case 2: weight = FLIGHT_WEIGHTS.doubles2; break;
        case 3: weight = FLIGHT_WEIGHTS.doubles3; break;
        default: weight = 0; // Lower flights not counted in APR
      }
    }
    
    // Add weighted score for home team
    if (homeWon) {
      score += weight;
    }
  });
  
  return score;
};

/**
 * Calculate the WS10 score for a team
 * This is the sum of the 10 best Flight-Weighted Scores across all matches
 */
export const calculateWs10 = (matches: Match[], teamId: string): number => {
  // Calculate FWS for each match
  const matchScores = matches
    .filter(match => match.isComplete && (match.homeTeamId === teamId || match.awayTeamId === teamId))
    .map(match => {
      let matchScore = 0;
      const isHomeTeam = match.homeTeamId === teamId;
      
      match.flights.forEach(flight => {
        // Skip non-varsity matches
        if (flight.level !== 'varsity') return;
        
        // Determine if our team won this flight
        const ourTeamWon = (isHomeTeam && flight.homePlayerWon) || 
                          (!isHomeTeam && !flight.homePlayerWon);
        
        // Assign weight based on flight type and position
        let weight = 0;
        
        if (flight.type === 'singles') {
          switch (flight.position) {
            case 1: weight = FLIGHT_WEIGHTS.singles1; break;
            case 2: weight = FLIGHT_WEIGHTS.singles2; break;
            case 3: weight = FLIGHT_WEIGHTS.singles3; break;
            default: weight = 0;
          }
        } else if (flight.type === 'doubles') {
          switch (flight.position) {
            case 1: weight = FLIGHT_WEIGHTS.doubles1; break;
            case 2: weight = FLIGHT_WEIGHTS.doubles2; break;
            case 3: weight = FLIGHT_WEIGHTS.doubles3; break;
            default: weight = 0;
          }
        }
        
        // Add weighted score if we won
        if (ourTeamWon) {
          matchScore += weight;
        }
      });
      
      // Handle ties (counting as half a win for APR purposes)
      if (match.isTie) {
        // For ties, count half the potential points from flights
        // This is simplified; in a real implementation you might want to 
        // calculate the actual half of the won flights
        matchScore = matchScore / 2;
      }
      
      return matchScore;
    });
  
  // Sort match scores in descending order and take the top 10
  const topTenScores = matchScores.sort((a, b) => b - a).slice(0, 10);
  
  // Sum the top 10 scores for WS10
  const ws10 = topTenScores.reduce((sum, score) => sum + score, 0);
  
  return ws10;
};

/**
 * Calculate Opponent Strength Index (OSI) for a team
 * This averages the WS10 scores of all opponents with 6+ matches
 */
export const calculateOsi = (
  matches: Match[], 
  teamId: string, 
  teamWs10Map: Map<string, { ws10: number, matchesPlayed: number }>
): number => {
  let totalOpponentStrength = 0;
  let opponentCount = 0;
  
  // Get unique opponent IDs
  const opponentIds = new Set<string>();
  
  matches.forEach(match => {
    if (!match.isComplete) return;
    
    // Check if this match involves our team
    const isHomeTeam = match.homeTeamId === teamId;
    const isAwayTeam = match.awayTeamId === teamId;
    
    if (!isHomeTeam && !isAwayTeam) return;
    
    // Get opponent ID
    const opponentId = isHomeTeam ? match.awayTeamId : match.homeTeamId;
    opponentIds.add(opponentId);
  });
  
  // Calculate average opponent WS10
  opponentIds.forEach(opponentId => {
    // Get opponent WS10 if they have 6+ matches
    const opponentData = teamWs10Map.get(opponentId);
    
    if (opponentData && opponentData.matchesPlayed >= 6) {
      totalOpponentStrength += opponentData.ws10;
      opponentCount++;
    }
  });
  
  // Return average opponent WS10, defaulting to 1.0 if no qualified opponents
  // In a real implementation, you would scale this so the median is around 1.0
  return opponentCount > 0 ? totalOpponentStrength / opponentCount : 1.0;
};

/**
 * Calculate the APR for a team
 * APR = WS10 × OSI
 */
export const calculateApr = (ws10: number, osi: number): number => {
  return ws10 * osi;
};
