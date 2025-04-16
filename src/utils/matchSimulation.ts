// Let's update the utility to reduce ties and to handle the correct types

import { Team, School, Match, Player, Flight, Set } from '@/types';
import { TeamLadder, PlayerLadderPosition } from '@/types/ranking';

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
  
  // Create match object
  const match: Match = {
    id: crypto.randomUUID(),
    date: config.startDate,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    isLeagueMatch: config.isLeagueMatch,
    isComplete: false,
    hasJvMatches: false,
    homeCoachApproved: false,
    awayCoachApproved: false,
    flights: flights
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

// Fix for the classification comparison error:
// When comparing to values like "4A", we need to check if the combined classification string contains it
const isInClassification = (combinedClass: string, singleClass: string): boolean => {
  return combinedClass === singleClass || 
         (combinedClass === '4A/3A/2A/1A' && ['4A', '3A', '2A', '1A'].includes(singleClass));
};

// Fix for the homeFlightWins/awayFlightWins constant reassignment:
// We'll change these to use let instead of const when they need to be reassigned
const updateMatchScores = (match: any, flights: any[]) => {
  let homeFlightWins = flights.filter(f => f.homePlayerWon).length;
  let awayFlightWins = flights.filter(f => !f.homePlayerWon).length;
  
  // Add the tie handling logic here
  if (homeFlightWins === awayFlightWins) {
    // If the match is tied, set isTie to true
    match.isTie = true;
    match.homeTeamWon = undefined; // Clear any previous winner
  } else {
    match.isTie = false;
    match.homeTeamWon = homeFlightWins > awayFlightWins;
  }
  
  match.homeTeamScore = homeFlightWins;
  match.awayTeamScore = awayFlightWins;
};

// Make sure that matchId is included in all flight objects
const createFlight = (matchId: string, type: 'singles' | 'doubles', position: number, level: 'varsity' | 'jv') => {
  return {
    id: crypto.randomUUID(),
    matchId: matchId, // Ensure matchId is included
    type,
    position,
    level,
    homePlayers: [],
    awayPlayers: [],
    homePlayerWon: false,
    sets: []
  };
};
