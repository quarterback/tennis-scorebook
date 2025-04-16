
// Match simulation utilities with improved team win distribution

import { Team, School, Match, Player, Flight, Set } from '@/types';
import { TeamLadder } from '@/types/ranking';

/**
 * Generate a match between two teams with realistic win probabilities
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
  const awaySchool = schools.find(s => s.id === awayTeam.schoolId);
  
  // Calculate team strength based on roster
  const getTeamStrength = (roster: Player[]): number => {
    if (roster.length === 0) return 5; // Default strength
    
    // Calculate average skill rating
    const avgSkill = roster.reduce((sum, player) => {
      const rating = player.skillRating || 5;
      return sum + rating;
    }, 0) / roster.length;
    
    return avgSkill;
  };
  
  const homeStrength = getTeamStrength(homeTeamRoster);
  const awayStrength = getTeamStrength(awayTeamRoster);
  
  // Add home court advantage (10% boost)
  const adjustedHomeStrength = homeStrength * 1.1;
  
  // Generate flights (singles and doubles)
  const flights: Flight[] = [];
  
  // Generate singles flights (1-4)
  for (let i = 0; i < 4; i++) {
    const flight = createFlight(
      crypto.randomUUID(), 
      'singles', 
      i + 1, 
      'varsity',
      adjustedHomeStrength,
      awayStrength
    );
    flights.push(flight);
  }
  
  // Generate doubles flights (1-4)
  for (let i = 0; i < 4; i++) {
    const flight = createFlight(
      crypto.randomUUID(), 
      'doubles', 
      i + 1, 
      'varsity',
      adjustedHomeStrength,
      awayStrength
    );
    flights.push(flight);
  }
  
  // Calculate match score based on flight results
  let homeWins = 0;
  let awayWins = 0;
  
  flights.forEach(flight => {
    if (flight.homePlayerWon === true) {
      homeWins++;
    } else if (flight.homePlayerWon === false) {
      awayWins++;
    }
  });
  
  // Super rare tie case (1% chance)
  // We avoid ties in most cases by ensuring a clear winner
  // If we end up with a 4-4 tie, we'll break it 99% of the time
  if (homeWins === awayWins && Math.random() > 0.01) {
    // Break the tie 99% of the time by randomly deciding a winner
    // for one of the flights
    const flightToChange = Math.floor(Math.random() * flights.length);
    if (Math.random() > 0.5) {
      // Home team gets one more win
      flights[flightToChange].homePlayerWon = true;
      homeWins++;
    } else {
      // Away team gets one more win
      flights[flightToChange].homePlayerWon = false;
      awayWins++;
    }
  }
  
  // Create match object with correct score
  const match: Match = {
    id: crypto.randomUUID(),
    date: new Date(config.startDate).toISOString().split('T')[0],
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    isLeagueMatch: config.isLeagueMatch,
    isComplete: true, // Set to true as we've simulated the match
    hasJvMatches: false,
    homeCoachApproved: true,
    awayCoachApproved: true,
    flights: flights,
    homeTeamScore: homeWins,
    awayTeamScore: awayWins,
    homeTeamWon: homeWins > awayWins ? true : homeWins < awayWins ? false : undefined,
    isTie: homeWins === awayWins
  };
  
  return match;
};

/**
 * Generate matches for all teams in a district with realistic results
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
  
  // Create map of school strengths to simulate strong/weak programs
  const schoolStrengths = new Map<string, number>();
  
  schools.forEach(school => {
    // Generate a strength coefficient that will affect all teams from this school
    // This creates more realistic distributions where some schools are consistently stronger
    const baseStrength = Math.random();
    const isPrivate = school.name.includes('Academy') || 
                       school.name.includes('Catholic') || 
                       school.name.includes('Prep');
                       
    // Private schools tend to be stronger in many states
    const strength = isPrivate ? 
      0.6 + (baseStrength * 0.4) : // Private schools: 0.6-1.0 range
      0.3 + (baseStrength * 0.7);  // Public schools: 0.3-1.0 range
    
    schoolStrengths.set(school.id, strength);
  });
  
  // Generate matches for each team against every other team
  for (let i = 0; i < teams.length; i++) {
    const homeTeam = teams[i];
    
    // Limit matches per team
    let matchCount = 0;
    
    for (let j = 0; j < teams.length; j++) {
      if (i === j) continue; // Skip self
      
      const awayTeam = teams[j];
      
      // Check if teams are in the same classification and gender
      const homeSchool = schools.find(s => s.id === homeTeam.schoolId);
      const awaySchool = schools.find(s => s.id === awayTeam.schoolId);
      
      if (!homeSchool || !awaySchool) continue;
      if (homeTeam.gender !== awayTeam.gender) continue;
      
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
      
      // Generate match date based on the date range
      const startDate = new Date(config.startDate);
      const endDate = new Date(config.endDate);
      const dayRange = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const matchDate = new Date(startDate);
      matchDate.setDate(matchDate.getDate() + Math.floor(Math.random() * dayRange));
      
      // Generate match
      const match = generateMatch(
        homeTeam, 
        awayTeam, 
        schools, 
        players, 
        ladders, 
        {
          ...config,
          startDate: matchDate.toISOString().split('T')[0]
        }
      );
      matches.push(match);
      
      matchCount++;
    }
  }
  
  return matches;
};

// Create a flight with proper scores and a winner
const createFlight = (
  matchId: string, 
  type: 'singles' | 'doubles', 
  position: number, 
  level: 'varsity' | 'jv',
  homeStrength: number,
  awayStrength: number
): Flight => {
  // Calculate win probability based on team strengths
  // The stronger team should win more often, but upsets should happen
  let homeProbability = homeStrength / (homeStrength + awayStrength);
  
  // Add some randomness (upsets happen!)
  homeProbability = Math.max(0.2, Math.min(0.8, homeProbability + (Math.random() * 0.3 - 0.15)));
  
  // Determine winner
  const homeWin = Math.random() < homeProbability;
  
  // Generate realistic scores for tennis sets
  const sets: Set[] = [];
  
  // Randomly determine number of sets (2-3)
  // Most matches are 2 sets, but some go to 3
  const numSets = Math.random() < 0.75 ? 2 : 3;
  
  if (homeWin) {
    // Home player wins
    for (let i = 0; i < numSets; i++) {
      if (i < 2) { // First two sets
        if (Math.random() > 0.3) {
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
        if (Math.random() > 0.3) {
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
