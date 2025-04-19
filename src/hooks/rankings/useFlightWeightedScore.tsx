
import { Match, Flight, Team } from '@/types';

export const useFlightWeightedScore = (
  teams: Team[],
  matches: Match[]
) => {
  const calculateTeamStrength = (teamId: string): number => {
    const team = teams.find(t => t.id === teamId);
    if (!team || !team.roster || team.roster.length === 0) {
      return 0;
    }
    
    // Average skill rating of top 6 players
    const topPlayers = team.roster
      .sort((a, b) => (b.skillRating || 0) - (a.skillRating || 0))
      .slice(0, 6);
    
    const totalSkill = topPlayers.reduce((sum, player) => sum + (player.skillRating || 0), 0);
    return totalSkill / topPlayers.length;
  };
  
  const calculateFlightWinRate = (flight: Flight, teamId: string): number => {
    const isHomeTeam = flight.homePlayers.length > 0 && teams.some(team => team.id === teamId && team.roster && team.roster.some(player => flight.homePlayers.includes(player.id)));
    const isAwayTeam = flight.awayPlayers.length > 0 && teams.some(team => team.id === teamId && team.roster && team.roster.some(player => flight.awayPlayers.includes(player.id)));
    
    if (!isHomeTeam && !isAwayTeam) {
      return 0;
    }
    
    let homeWins = 0;
    let awayWins = 0;
    
    // Access sets and count wins - ensure we check if sets property exists
    if (flight.sets && flight.sets.length > 0) {
      for (const set of flight.sets) {
        // Make sure homeScore and awayScore are accessible
        if (set.homeScore !== undefined && set.awayScore !== undefined) {
          if (set.homeScore > set.awayScore) {
            homeWins++;
          } else if (set.homeScore < set.awayScore) {
            awayWins++;
          }
        }
      }
    }
    
    const totalSets = flight.sets ? flight.sets.length : 0;
    if (totalSets === 0) return 0;
    
    if (isHomeTeam) {
      return homeWins / totalSets;
    } else {
      return awayWins / totalSets;
    }
  };
  
  const calculateFlightWeightedScore = (teamId: string, options: any = {}): {
    flightWeightedScore: number;
    matchesIncluded: number;
  } => {
    let weightedScore = 0;
    let matchesIncluded = 0;
    
    const teamMatches = matches.filter(match => 
      (match.homeTeamId === teamId || match.awayTeamId === teamId) && match.isComplete
    );
    
    teamMatches.forEach(match => {
      match.flights.forEach(flight => {
        const isHomeTeam = match.homeTeamId === teamId;
        const isAwayTeam = match.awayTeamId === teamId;
        
        if (!isHomeTeam && !isAwayTeam) {
          return;
        }
        
        let flightWinRate = 0;
        
        if (isHomeTeam) {
          flightWinRate = calculateFlightWinRate(flight, teamId);
        } else {
          flightWinRate = calculateFlightWinRate(flight, teamId);
        }
        
        // Use a default weight of 1 if the flight doesn't have a weight function
        const weight = typeof flight.weight === 'function' ? flight.weight() : 1;
        weightedScore += flightWinRate * weight;
      });
      matchesIncluded++;
    });
    
    // Calculate additional points for tiebreaker matches
    let tiebreakBonus = 0;
    teamMatches.forEach(match => {
      if (match.tiebreakRound && match.tiebreakRound > 0 && match.isComplete) {
        // Give bonus points for advancing in tiebreaker rounds
        const wonMatch = (match.homeTeamId === teamId && match.homeTeamWon === true) ||
                        (match.awayTeamId === teamId && match.homeTeamWon === false);
        
        if (wonMatch) {
          // More points for winning in later rounds
          tiebreakBonus += match.tiebreakRound * 0.2;
        }
      }
    });
    
    // Add tiebreak bonus to weighted score
    weightedScore += tiebreakBonus;
    
    return {
      flightWeightedScore: weightedScore,
      matchesIncluded: matchesIncluded
    };
  };

  const calculateOpponentStrengthIndex = (teamId: string, options: any = {}): number => {
    const team = teams.find(t => t.id === teamId);
    if (!team) {
      return 1.0;
    }
    
    const teamMatches = matches.filter(match => 
      (match.homeTeamId === teamId || match.awayTeamId === teamId) && match.isComplete
    );
    
    if (teamMatches.length === 0) {
      return 1.0;
    }
    
    let totalOpponentStrength = 0;
    
    teamMatches.forEach(match => {
      const opponentId = match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId;
      totalOpponentStrength += calculateTeamStrength(opponentId);
    });
    
    return totalOpponentStrength / teamMatches.length;
  };
  
  return {
    calculateFlightWeightedScore,
    calculateOpponentStrengthIndex
  };
};
