
import { Match, Flight } from '@/types';
import { FLIGHT_WEIGHTS } from '@/utils/rankingConstants';

/**
 * Calculate Flight-Weighted Score (FWS) for a match
 * This gives higher weight to more important positions
 */
export const calculateFlightWeightedScore = (match: Match): number => {
  let score = 0;
  
  // Get the team that we're calculating for
  // This function assumes we're calculating from the perspective of
  // either the home or away team (determined by the match object)
  
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
        case 4: weight = FLIGHT_WEIGHTS.singles4; break;
        default: weight = 0;
      }
    } else if (flight.type === 'doubles') {
      switch (flight.position) {
        case 1: weight = FLIGHT_WEIGHTS.doubles1; break;
        case 2: weight = FLIGHT_WEIGHTS.doubles2; break;
        case 3: weight = FLIGHT_WEIGHTS.doubles3; break;
        case 4: weight = FLIGHT_WEIGHTS.doubles4; break;
        default: weight = 0;
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
 * This is the total Flight-Weighted Score across all matches
 */
export const calculateWs10 = (matches: Match[], teamId: string): number => {
  let totalScore = 0;
  let matchesCount = 0;
  
  matches.forEach(match => {
    if (!match.isComplete) return;
    
    // Check if this match involves our team
    const isHomeTeam = match.homeTeamId === teamId;
    const isAwayTeam = match.awayTeamId === teamId;
    
    if (!isHomeTeam && !isAwayTeam) return;
    
    // Calculate the FWS from the perspective of our team
    let matchScore = 0;
    
    match.flights.forEach(flight => {
      // Skip non-varsity matches
      if (flight.level !== 'varsity') return;
      
      // Determine if our team won this flight
      const ourTeamWon = (isHomeTeam && flight.homePlayerWon) || 
                        (isAwayTeam && !flight.homePlayerWon);
      
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
          default: weight = 0;
        }
      }
      
      // Add weighted score if we won
      if (ourTeamWon) {
        matchScore += weight;
      }
    });
    
    totalScore += matchScore;
    matchesCount++;
  });
  
  // Return average FWS per match played
  return matchesCount > 0 ? totalScore / matchesCount : 0;
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
  
  matches.forEach(match => {
    if (!match.isComplete) return;
    
    // Check if this match involves our team
    const isHomeTeam = match.homeTeamId === teamId;
    const isAwayTeam = match.awayTeamId === teamId;
    
    if (!isHomeTeam && !isAwayTeam) return;
    
    // Get opponent ID
    const opponentId = isHomeTeam ? match.awayTeamId : match.homeTeamId;
    
    // Get opponent WS10 if they have 6+ matches
    const opponentData = teamWs10Map.get(opponentId);
    
    if (opponentData && opponentData.matchesPlayed >= 6) {
      totalOpponentStrength += opponentData.ws10;
      opponentCount++;
    }
  });
  
  // Return average opponent WS10, defaulting to 1.0 if no qualified opponents
  return opponentCount > 0 ? totalOpponentStrength / opponentCount : 1.0;
};

/**
 * Calculate the APR for a team
 * APR = WS10 × OSI
 */
export const calculateApr = (ws10: number, osi: number): number => {
  return ws10 * osi;
};
