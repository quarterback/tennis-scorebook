
import { Match, Flight, Team, School, Player } from '@/types';
import type { Set } from '@/types'; // Type-only import to avoid conflict with global Set
import { TeamLadder } from '@/types/ranking';
import { getPlayerWithRank } from './playerSimulation';

/**
 * Generate tennis set score based on relative player strengths
 * @param homeStrength Relative strength of home player(s) (1-10)
 * @param awayStrength Relative strength of away player(s) (1-10)
 * @returns Object with home and away scores
 */
export const generateSetScore = (homeStrength: number, awayStrength: number): { homeScore: number, awayScore: number, tiebreak?: { homeScore: number, awayScore: number } } => {
  // Higher strength increases chance of winning
  const homeWinProbability = homeStrength / (homeStrength + awayStrength);
  
  // Determine winner
  const homeWins = Math.random() < homeWinProbability;
  
  let homeScore = 0;
  let awayScore = 0;
  
  if (homeWins) {
    // Home player/team wins
    homeScore = 6;
    
    // Determine opponent score (closer match if strengths are similar)
    const scoreDifference = homeStrength - awayStrength;
    if (scoreDifference > 4) {
      // Dominant win
      awayScore = Math.random() < 0.7 ? 0 : 1;
    } else if (scoreDifference > 2) {
      // Clear win
      awayScore = Math.random() < 0.6 ? 2 : 3;
    } else {
      // Close win
      const closeScores = Math.random() < 0.25 ? [6, 4] : [6, 3];
      homeScore = closeScores[0];
      awayScore = closeScores[1];
    }
  } else {
    // Away player/team wins
    awayScore = 6;
    
    // Determine opponent score (closer match if strengths are similar)
    const scoreDifference = awayStrength - homeStrength;
    if (scoreDifference > 4) {
      // Dominant win
      homeScore = Math.random() < 0.7 ? 0 : 1;
    } else if (scoreDifference > 2) {
      // Clear win
      homeScore = Math.random() < 0.6 ? 2 : 3;
    } else {
      // Close win
      const closeScores = Math.random() < 0.25 ? [4, 6] : [3, 6];
      homeScore = closeScores[0];
      awayScore = closeScores[1];
    }
  }
  
  // Small chance of 7-5 score in close matches
  if (Math.abs(homeStrength - awayStrength) < 2 && Math.random() < 0.2) {
    if (homeWins) {
      homeScore = 7;
      awayScore = 5;
    } else {
      homeScore = 5;
      awayScore = 7;
    }
  }
  
  // Small chance of tiebreak in close matches
  if (Math.abs(homeStrength - awayStrength) < 3 && Math.random() < 0.15) {
    homeScore = homeWins ? 7 : 6;
    awayScore = homeWins ? 6 : 7;
    
    // Generate tiebreak score
    const tiebreakWinnerScore = Math.floor(Math.random() * 4) + 7; // 7-10
    const tiebreakLoserScore = Math.max(0, tiebreakWinnerScore - Math.floor(Math.random() * 5) - 2); // 0-5 points below winner
    
    return {
      homeScore,
      awayScore,
      tiebreak: {
        homeScore: homeWins ? tiebreakWinnerScore : tiebreakLoserScore,
        awayScore: homeWins ? tiebreakLoserScore : tiebreakWinnerScore
      }
    };
  }
  
  return { homeScore, awayScore };
};

/**
 * Generate a flight result based on player strengths determined by ladder position
 */
export const generateFlightResult = (
  type: 'singles' | 'doubles',
  position: number,
  level: 'varsity' | 'jv',
  homePlayers: string[],
  awayPlayers: string[],
  homeLadder: TeamLadder,
  awayLadder: TeamLadder,
  allPlayers: Player[]
): { sets: Set[], homePlayerWon: boolean } => {
  // Get player rankings to determine relative strength
  const homePlayerRanks = homePlayers.map(id => {
    const player = getPlayerWithRank(id, allPlayers, homeLadder);
    return player ? player.rank : 999; // Use a high number if player not found
  });
  
  const awayPlayerRanks = awayPlayers.map(id => {
    const player = getPlayerWithRank(id, allPlayers, awayLadder);
    return player ? player.rank : 999;
  });
  
  // Calculate average rank (lower is better)
  const homeAvgRank = homePlayerRanks.reduce((sum, rank) => sum + rank, 0) / homePlayerRanks.length;
  const awayAvgRank = awayPlayerRanks.reduce((sum, rank) => sum + rank, 0) / awayPlayerRanks.length;
  
  // Convert to strength score (higher is better)
  const maxRank = 20; // Assuming max 20 players on a team
  const homeStrength = Math.max(1, 10 - (homeAvgRank / maxRank) * 10) + (Math.random() * 2 - 1);
  const awayStrength = Math.max(1, 10 - (awayAvgRank / maxRank) * 10) + (Math.random() * 2 - 1);
  
  // Generate 2-3 sets
  const sets: Set[] = [];
  let homeSetWins = 0;
  let awaySetWins = 0;
  
  // First set
  const set1 = generateSetScore(homeStrength, awayStrength);
  sets.push(set1);
  if (set1.homeScore > set1.awayScore) homeSetWins++; else awaySetWins++;
  
  // Second set - slight adjustment to strength based on first set result
  const homeStrength2 = homeStrength + (homeSetWins > 0 ? 0.5 : -0.5);
  const awayStrength2 = awayStrength + (awaySetWins > 0 ? 0.5 : -0.5);
  const set2 = generateSetScore(homeStrength2, awayStrength2);
  sets.push(set2);
  if (set2.homeScore > set2.awayScore) homeSetWins++; else awaySetWins++;
  
  // If tied, play a third set
  if (homeSetWins === awaySetWins) {
    // Third set - momentum factors more heavily
    const homeStrength3 = homeStrength + (set2.homeScore > set2.awayScore ? 1 : -1);
    const awayStrength3 = awayStrength + (set2.awayScore > set2.homeScore ? 1 : -1);
    const set3 = generateSetScore(homeStrength3, awayStrength3);
    sets.push(set3);
    if (set3.homeScore > set3.awayScore) homeSetWins++; else awaySetWins++;
  }
  
  return {
    sets,
    homePlayerWon: homeSetWins > awaySetWins
  };
};

/**
 * Simulate a complete tennis dual match between two teams
 */
export const simulateMatch = (
  date: string,
  homeTeamId: string,
  awayTeamId: string,
  homeLadder: TeamLadder,
  awayLadder: TeamLadder,
  isLeagueMatch: boolean,
  homeSchool: School,
  awaySchool: School,
  allPlayers: Player[]
): Match => {
  const flightTypes: Array<{ type: 'singles' | 'doubles', position: number, level: 'varsity' | 'jv' }> = [
    { type: 'singles', position: 1, level: 'varsity' },
    { type: 'singles', position: 2, level: 'varsity' },
    { type: 'singles', position: 3, level: 'varsity' },
    { type: 'singles', position: 4, level: 'varsity' },
    { type: 'doubles', position: 1, level: 'varsity' },
    { type: 'doubles', position: 2, level: 'varsity' },
    { type: 'doubles', position: 3, level: 'varsity' },
    { type: 'doubles', position: 4, level: 'varsity' }
  ];

  // Select players for each flight according to OSAA rules
  const selectedHomePlayers = new Set<string>();
  const selectedAwayPlayers = new Set<string>();
  
  // Get all home and away players with their ranks
  const homePlayers = homeLadder.rankings.map(r => ({
    id: r.playerId,
    rank: r.rank,
    selected: false
  })).sort((a, b) => a.rank - b.rank); // Sort by rank (1 is best)
  
  const awayPlayers = awayLadder.rankings.map(r => ({
    id: r.playerId,
    rank: r.rank,
    selected: false
  })).sort((a, b) => a.rank - b.rank);
  
  // Create flights from line-up
  const flights: Flight[] = [];
  
  // Decide lineup strategy - random but obeying rules
  // Top 4 players must be in top 3 flights (1s, 2s, 1d)
  // First, decide if #1 and #2 play singles or doubles
  const topPlaySingles = Math.random() < 0.75; // 75% chance that top players play singles (most common strategy)
  
  if (topPlaySingles) {
    // Home team assigns top players to singles
    let homeFirstSingles = homePlayers[0].id;
    let homeSecondSingles = homePlayers[1].id;
    homePlayers[0].selected = true;
    homePlayers[1].selected = true;
    selectedHomePlayers.add(homeFirstSingles);
    selectedHomePlayers.add(homeSecondSingles);
    
    // Away team assigns top players to singles
    let awayFirstSingles = awayPlayers[0].id;
    let awaySecondSingles = awayPlayers[1].id;
    awayPlayers[0].selected = true;
    awayPlayers[1].selected = true;
    selectedAwayPlayers.add(awayFirstSingles);
    selectedAwayPlayers.add(awaySecondSingles);
    
    // Assign top doubles teams (players 3 & 4 typically)
    let homeFirstDoubles = [homePlayers[2].id, homePlayers[3].id];
    let awayFirstDoubles = [awayPlayers[2].id, awayPlayers[3].id];
    
    homePlayers[2].selected = true;
    homePlayers[3].selected = true;
    awayPlayers[2].selected = true;
    awayPlayers[3].selected = true;
    
    selectedHomePlayers.add(homeFirstDoubles[0]);
    selectedHomePlayers.add(homeFirstDoubles[1]);
    selectedAwayPlayers.add(awayFirstDoubles[0]);
    selectedAwayPlayers.add(awayFirstDoubles[1]);
  } else {
    // Alternative strategy: top players play doubles together
    let homeFirstDoubles = [homePlayers[0].id, homePlayers[1].id];
    let awayFirstDoubles = [awayPlayers[0].id, awayPlayers[1].id];
    
    homePlayers[0].selected = true;
    homePlayers[1].selected = true;
    awayPlayers[0].selected = true;
    awayPlayers[1].selected = true;
    
    selectedHomePlayers.add(homeFirstDoubles[0]);
    selectedHomePlayers.add(homeFirstDoubles[1]);
    selectedAwayPlayers.add(awayFirstDoubles[0]);
    selectedAwayPlayers.add(awayFirstDoubles[1]);
    
    // 3rd and 4th ranked players play singles
    let homeFirstSingles = homePlayers[2].id;
    let homeSecondSingles = homePlayers[3].id;
    homePlayers[2].selected = true;
    homePlayers[3].selected = true;
    selectedHomePlayers.add(homeFirstSingles);
    selectedHomePlayers.add(homeSecondSingles);
    
    let awayFirstSingles = awayPlayers[2].id;
    let awaySecondSingles = awayPlayers[3].id;
    awayPlayers[2].selected = true;
    awayPlayers[3].selected = true;
    selectedAwayPlayers.add(awayFirstSingles);
    selectedAwayPlayers.add(awaySecondSingles);
  }
  
  // Fill in remaining positions
  for (const flight of flightTypes) {
    const flightId = crypto.randomUUID();
    
    let homeFlightPlayers: string[] = [];
    let awayFlightPlayers: string[] = [];
    
    // Singles positions
    if (flight.type === 'singles') {
      // Find next available home player
      for (const player of homePlayers) {
        if (!player.selected) {
          player.selected = true;
          homeFlightPlayers = [player.id];
          selectedHomePlayers.add(player.id);
          break;
        }
      }
      
      // Find next available away player
      for (const player of awayPlayers) {
        if (!player.selected) {
          player.selected = true;
          awayFlightPlayers = [player.id];
          selectedAwayPlayers.add(player.id);
          break;
        }
      }
    } 
    // Doubles positions
    else {
      // Find next two available home players
      const homeDoublesTeam: string[] = [];
      for (const player of homePlayers) {
        if (!player.selected && homeDoublesTeam.length < 2) {
          player.selected = true;
          homeDoublesTeam.push(player.id);
          selectedHomePlayers.add(player.id);
        }
      }
      homeFlightPlayers = homeDoublesTeam;
      
      // Find next two available away players
      const awayDoublesTeam: string[] = [];
      for (const player of awayPlayers) {
        if (!player.selected && awayDoublesTeam.length < 2) {
          player.selected = true;
          awayDoublesTeam.push(player.id);
          selectedAwayPlayers.add(player.id);
        }
      }
      awayFlightPlayers = awayDoublesTeam;
    }
    
    // Generate flight result
    const result = generateFlightResult(
      flight.type,
      flight.position,
      flight.level,
      homeFlightPlayers,
      awayFlightPlayers,
      homeLadder,
      awayLadder,
      allPlayers
    );
    
    flights.push({
      id: flightId,
      matchId: '', // Will be set later
      type: flight.type,
      position: flight.position,
      level: flight.level,
      homePlayers: homeFlightPlayers,
      awayPlayers: awayFlightPlayers,
      sets: result.sets,
      homePlayerWon: result.homePlayerWon
    });
  }
  
  // Calculate overall match result
  let homeWins = 0;
  let awayWins = 0;
  
  flights.forEach(flight => {
    if (flight.homePlayerWon) homeWins++;
    else awayWins++;
  });
  
  const matchId = crypto.randomUUID();
  
  // Update flight match IDs
  flights.forEach(flight => {
    flight.matchId = matchId;
  });
  
  const match: Match = {
    id: matchId,
    date,
    homeTeamId,
    awayTeamId,
    isLeagueMatch,
    isComplete: true,
    hasJvMatches: false, // For simplicity, we're not generating JV matches in this version
    homeTeamWon: homeWins > awayWins,
    homeCoachApproved: true,
    awayCoachApproved: true,
    flights,
    homeTeamScore: homeWins,
    awayTeamScore: awayWins
  };
  
  return match;
};

/**
 * Generate match dates within a season
 */
export const generateMatchDates = (
  startDate: string,
  endDate: string,
  count: number,
  doubleRoundRobin: boolean = true
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysBetween = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate max possible match days
  // For high school tennis, matches can be scheduled 3 times per week:
  // - Typically Monday, Wednesday, Friday for league matches
  // - Weekend tournaments on Friday-Saturday
  const matchesPerWeek = 3;
  const weeksInSeason = Math.ceil(daysBetween / 7);
  const potentialMatchDays = weeksInSeason * matchesPerWeek;
  
  // Check if we have enough days, accounting for a more realistic schedule
  if (potentialMatchDays < count) {
    console.warn(`Warning: Requested ${count} matches but only have capacity for approximately ${potentialMatchDays} based on season length.`);
    // Continue anyway, we'll fit as many as we can
  }
  
  const dates: string[] = [];
  const usedDates = new Set<string>();
  
  // Set days of week for matches (typically Mon/Wed/Fri for tennis)
  const matchDays = [1, 3, 5]; // Monday, Wednesday, Friday
  const tournamentDays = [5, 6]; // Friday, Saturday for tournaments
  
  // First round
  let currentDate = new Date(start);
  const firstRoundCount = doubleRoundRobin ? Math.ceil(count / 2) : count;
  
  // Skip spring break (last week of March)
  const springBreakStart = new Date(start.getFullYear(), 2, 24); // March 24th
  const springBreakEnd = new Date(start.getFullYear(), 2, 31); // March 31st
  
  while (dates.length < firstRoundCount && currentDate <= end) {
    // Skip spring break
    if (currentDate >= springBreakStart && currentDate <= springBreakEnd) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Check if current day is a match day
    if (matchDays.includes(currentDate.getDay())) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!usedDates.has(dateStr)) {
        dates.push(dateStr);
        usedDates.add(dateStr);
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // If double round robin, add second round with 2-3 week gap
  if (doubleRoundRobin && dates.length >= firstRoundCount) {
    const secondRoundDelay = 14 + Math.floor(Math.random() * 7); // 2-3 weeks
    const firstRoundDates = [...dates];
    
    for (const dateStr of firstRoundDates) {
      if (dates.length >= count) break;
      
      const originalDate = new Date(dateStr);
      const newDate = new Date(originalDate);
      newDate.setDate(newDate.getDate() + secondRoundDelay);
      
      // Skip spring break
      if (newDate >= springBreakStart && newDate <= springBreakEnd) {
        newDate.setDate(newDate.getDate() + 7); // Skip a week
      }
      
      // Ensure new date is still in season
      if (newDate <= end) {
        const newDateStr = newDate.toISOString().split('T')[0];
        if (!usedDates.has(newDateStr)) {
          dates.push(newDateStr);
          usedDates.add(newDateStr);
        }
      }
    }
  }
  
  // If we still don't have enough dates, add some weekend tournament dates
  currentDate = new Date(start);
  let weekendCount = 0;
  const maxTournamentWeekends = 4; // Limit to 4 tournament weekends in a season
  
  while (dates.length < count && currentDate <= end && weekendCount < maxTournamentWeekends) {
    // Focus on weekends for tournaments
    if (tournamentDays.includes(currentDate.getDay())) {
      // Skip spring break
      if (currentDate >= springBreakStart && currentDate <= springBreakEnd) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!usedDates.has(dateStr)) {
        dates.push(dateStr);
        usedDates.add(dateStr);
        
        // Count weekends (consider only Fridays to avoid double counting)
        if (currentDate.getDay() === 5) {
          weekendCount++;
        }
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // If we STILL don't have enough dates, add more weekday matches
  // This is less realistic but ensures we can satisfy the requested count
  currentDate = new Date(start);
  const additionalMatchDays = [2, 4]; // Add Tuesday and Thursday as potential match days
  
  while (dates.length < count && currentDate <= end) {
    // Skip spring break
    if (currentDate >= springBreakStart && currentDate <= springBreakEnd) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Try additional weekdays
    if (additionalMatchDays.includes(currentDate.getDay())) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!usedDates.has(dateStr)) {
        dates.push(dateStr);
        usedDates.add(dateStr);
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sort dates chronologically
  return dates.sort((a, b) => a.localeCompare(b));
};

/**
 * Generate all matches for a season/district
 */
export const generateDistrictMatches = (
  teams: Team[],
  schools: School[],
  players: Player[],
  teamLadders: TeamLadder[],
  config: {
    startDate: string,
    endDate: string,
    isLeagueMatch: boolean,
    matchesPerTeam: number
  }
): Match[] => {
  if (teams.length < 2) {
    throw new Error('Need at least 2 teams to generate matches');
  }
  
  const matches: Match[] = [];
  const doubleRoundRobin = teams.length < 8;
  
  // Create pairings for all teams
  const pairings: [string, string][] = []; // [homeTeamId, awayTeamId]
  
  // First round - each team plays every other team
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      // Add home and away games
      pairings.push([teams[i].id, teams[j].id]);
      pairings.push([teams[j].id, teams[i].id]);
    }
  }
  
  // Limit to requested number of matches per team
  const matchesNeeded = teams.length * config.matchesPerTeam;
  const totalMatchCount = Math.min(pairings.length, matchesNeeded);
  
  // Generate dates
  const dates = generateMatchDates(
    config.startDate,
    config.endDate,
    totalMatchCount,
    doubleRoundRobin
  );
  
  // Shuffle pairings to randomize schedule
  for (let i = pairings.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairings[i], pairings[j]] = [pairings[j], pairings[i]];
  }
  
  // Create matches
  for (let i = 0; i < totalMatchCount && i < dates.length && i < pairings.length; i++) {
    const [homeTeamId, awayTeamId] = pairings[i];
    const date = dates[i];
    
    const homeTeam = teams.find(t => t.id === homeTeamId);
    const awayTeam = teams.find(t => t.id === awayTeamId);
    
    if (!homeTeam || !awayTeam) continue;
    
    const homeSchool = schools.find(s => s.id === homeTeam.schoolId);
    const awaySchool = schools.find(s => s.id === awayTeam.schoolId);
    
    if (!homeSchool || !awaySchool) continue;
    
    const homeLadder = teamLadders.find(l => l.teamId === homeTeamId);
    const awayLadder = teamLadders.find(l => l.teamId === awayTeamId);
    
    if (!homeLadder || !awayLadder) continue;
    
    const match = simulateMatch(
      date,
      homeTeamId,
      awayTeamId,
      homeLadder,
      awayLadder,
      config.isLeagueMatch,
      homeSchool,
      awaySchool,
      players
    );
    
    matches.push(match);
  }
  
  return matches;
};

/**
 * Creates a tournament bracket based on team rankings
 */
export const generateTournamentBracket = (
  teamRankings: { teamId: string, rank: number }[],
  startDate: string
): {
  tournamentId: string,
  name: string,
  startDate: string,
  endDate: string,
  matches: Match[]
} => {
  const tournamentId = crypto.randomUUID();
  const name = "State Championship";
  
  // Sort teams by rank
  const sortedTeams = [...teamRankings].sort((a, b) => a.rank - b.rank);
  
  // Create bracket matchups (#1 vs #16, #2 vs #15, etc.)
  const firstRoundMatchups: [number, number][] = [
    [0, 15], [7, 8], [3, 12], [4, 11], [5, 10], [2, 13], [6, 9], [1, 14]
  ];
  
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(startDate);
  endDateObj.setDate(endDateObj.getDate() + 2); // Tournaments typically 2-3 days
  
  // For now we're just creating the structure, actual matches would be simulated later
  return {
    tournamentId,
    name,
    startDate,
    endDate: endDateObj.toISOString().split('T')[0],
    matches: [] // These would be filled in later
  };
};
