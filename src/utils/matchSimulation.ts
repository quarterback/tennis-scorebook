
// Let's update the utility to reduce ties and to handle the correct types

import { Team, School, Match, Player, Flight, Set } from '@/types';
import { TeamLadder } from '@/types/ranking';

/**
 * Generate a match between two teams
 */
export const generateMatch = (
  homeTeam: Team,
  awayTeam: Team,
  schools: School[],
  players: Player[],
  ladders: TeamLadder[],
  config: {
    startDate: string;
    endDate: string;
    isLeagueMatch: boolean;
    matchesPerTeam: number;
  }
): Match => {
  // Get team rosters
  const homeTeamRoster = players.filter(p => p.teamId === homeTeam.id);
  const awayTeamRoster = players.filter(p => p.teamId === awayTeam.id);
  
  // Get school details for location
  const homeSchool = schools.find(s => s.id === homeTeam.schoolId);
  
  // Generate flights (singles and doubles)
  const flights: Flight[] = [];
  
  // Generate singles flights (1-4)
  for (let i = 0; i < 4; i++) {
    const flight = createFlight(crypto.randomUUID(), 'singles', i + 1, 'varsity');
    flights.push(flight);
  }
  
  // Generate doubles flights (1-4)
  for (let i = 0; i < 4; i++) {
    const flight = createFlight(crypto.randomUUID(), 'doubles', i + 1, 'varsity');
    flights.push(flight);
  }
  
  // Simulate match results
  let homeWins = 0;
  let awayWins = 0;
  
  flights.forEach(flight => {
    const homeWin = flight.homePlayerWon;
    if (homeWin) {
      homeWins++;
    } else {
      awayWins++;
    }
  });
  
  // Now apply the rare tie rule - only 1% chance to have an actual tie
  // This is to ensure we have some ties for testing but they're very rare
  if (homeWins === awayWins && Math.random() > 0.01) {
    // Break the tie 99% of the time
    if (Math.random() > 0.5) {
      // Home team gets one more win
      flights[Math.floor(Math.random() * flights.length)].homePlayerWon = true;
      homeWins++;
    } else {
      // Away team gets one more win
      flights[Math.floor(Math.random() * flights.length)].homePlayerWon = false;
      awayWins++;
    }
  }
  
  // Create match object with correct score
  const match: Match = {
    id: crypto.randomUUID(),
    date: config.startDate,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    isLeagueMatch: config.isLeagueMatch,
    isComplete: true, // Set to true as we've simulated the match
    hasJvMatches: false,
    homeCoachApproved: false,
    awayCoachApproved: false,
    flights: flights,
    homeTeamScore: homeWins,
    awayTeamScore: awayWins,
    homeTeamWon: homeWins > awayWins ? true : homeWins < awayWins ? false : undefined,
    isTie: homeWins === awayWins
  };
  
  return match;
};

/**
 * Generate matches for all teams in a district
 */
export const generateDistrictMatches = (
  teams: Team[],
  schools: School[],
  players: Player[],
  ladders: TeamLadder[],
  config: {
    startDate: string;
    endDate: string;
    isLeagueMatch: boolean;
    matchesPerTeam: number;
  }
): Match[] => {
  const matches: Match[] = [];
  
  // Generate matches for each team against every other team
  for (let i = 0; i < teams.length; i++) {
    const homeTeam = teams[i];
    
    // Limit matches per team
    let matchCount = 0;
    
    for (let j = 0; j < teams.length; j++) {
      if (i === j) continue; // Skip self
      
      const awayTeam = teams[j];
      
      // Check if teams are in the same classification
      const homeSchool = schools.find(s => s.id === homeTeam.schoolId);
      const awaySchool = schools.find(s => s.id === awayTeam.schoolId);
      
      if (!homeSchool || !awaySchool) continue;
      
      // When comparing to values like "4A", we need to check if the combined classification string contains it
      const isInClassification = (combinedClass: string, singleClass: string): boolean => {
        return combinedClass === singleClass || 
               (combinedClass === '4A/3A/2A/1A' && ['4A', '3A', '2A', '1A'].includes(singleClass));
      };
      
      if (!isInClassification(homeSchool.classification, awaySchool.classification)) {
        continue;
      }
      
      // Limit matches per team
      if (matchCount >= config.matchesPerTeam) continue;
      
      // Generate match
      const match = generateMatch(homeTeam, awayTeam, schools, players, ladders, config);
      matches.push(match);
      
      matchCount++;
    }
  }
  
  return matches;
};

// Create a flight with proper scores and a winner
const createFlight = (matchId: string, type: 'singles' | 'doubles', position: number, level: 'varsity' | 'jv'): Flight => {
  // Determine a winner randomly
  const homeWin = Math.random() > 0.5;
  
  // Generate realistic scores for tennis sets
  const sets: Set[] = [];
  
  // Randomly determine number of sets (2-3)
  const numSets = Math.floor(Math.random() * 2) + 2;
  
  if (homeWin) {
    // Home player wins
    for (let i = 0; i < numSets; i++) {
      if (i < 2) { // First two sets
        if (Math.random() > 0.2) {
          // Home player wins set decisively
          sets.push({
            homeScore: 6,
            awayScore: Math.floor(Math.random() * 4)
          });
        } else {
          // Home player wins close set
          sets.push({
            homeScore: 7,
            awayScore: 5 + Math.floor(Math.random() * 2),
            tiebreak: Math.random() > 0.5 ? {
              homeScore: 7,
              awayScore: 5
            } : undefined
          });
        }
      } else {
        // Third set (if played)
        sets.push({
          homeScore: 6,
          awayScore: Math.floor(Math.random() * 4)
        });
      }
    }
  } else {
    // Away player wins
    for (let i = 0; i < numSets; i++) {
      if (i < 2) { // First two sets
        if (Math.random() > 0.2) {
          // Away player wins set decisively
          sets.push({
            homeScore: Math.floor(Math.random() * 4),
            awayScore: 6
          });
        } else {
          // Away player wins close set
          sets.push({
            homeScore: 5 + Math.floor(Math.random() * 2),
            awayScore: 7,
            tiebreak: Math.random() > 0.5 ? {
              homeScore: 5,
              awayScore: 7
            } : undefined
          });
        }
      } else {
        // Third set (if played)
        sets.push({
          homeScore: Math.floor(Math.random() * 4),
          awayScore: 6
        });
      }
    }
  }
  
  // Create score display string
  const scoreDisplay = sets.map(set => {
    let display = `${set.homeScore}-${set.awayScore}`;
    if (set.tiebreak) {
      display += ` (${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`;
    }
    return display;
  }).join(', ');
  
  return {
    id: crypto.randomUUID(),
    matchId,
    type,
    position,
    level,
    homePlayers: [],
    awayPlayers: [],
    homePlayerWon: homeWin,
    sets,
    scoreDisplay
  };
};
