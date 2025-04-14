import { Match, Flight, Team, School, Player } from '@/types';
import type { Set } from '@/types'; // Type-only import to avoid conflict with global Set
import { TeamLadder } from '@/types/ranking';
import { getPlayerWithRank } from './playerSimulation';
import { getSchoolClassification, determineTeamArchetype } from './playerGeneration';

interface StrengthAssessment {
  baseStrength: number;
  archetype: string;
  classification: string;
  skillTierBonus: number;
}

/**
 * Assess team strength based on archetype, classification and player skill tiers
 */
const assessTeamStrength = (
  team: Team,
  schools: School[],
  players: Player[]
): StrengthAssessment => {
  const school = schools.find(s => s.id === team.schoolId);
  const classification = school?.classification || '6A';
  const archetype = determineTeamArchetype(team.id);
  
  // Base strength by archetype
  let baseStrength = 
    archetype === 'dominant' ? 8 :
    archetype === 'strong' ? 6 :
    archetype === 'mid-tier' ? 4 : 2;
  
  // Classification modifier
  const classModifier = 
    classification === '6A' ? 1.2 :
    classification === '5A' ? 1.0 : 0.8;
  
  // Count elite and competitive players
  const teamPlayers = players.filter(p => p.teamId === team.id);
  const elitePlayers = teamPlayers.filter(p => p.skillTier === 'elite').length;
  const competitivePlayers = teamPlayers.filter(p => p.skillTier === 'competitive').length;
  
  // Calculate skill tier bonus
  const skillTierBonus = (elitePlayers * 0.5) + (competitivePlayers * 0.2);
  
  return {
    baseStrength: baseStrength * classModifier,
    archetype,
    classification,
    skillTierBonus
  };
};

/**
 * Calculate relative strength for position-specific matchup
 * Factoring in player skill tiers, position importance and team archetypes
 */
const calculatePositionStrength = (
  playerIds: string[],
  position: number,
  type: 'singles' | 'doubles',
  ladder: TeamLadder,
  allPlayers: Player[],
  teamAssessment: StrengthAssessment
): number => {
  // Get player strength from ladder position and skill tier
  let positionStrength = 0;
  
  for (const playerId of playerIds) {
    const playerWithRank = getPlayerWithRank(playerId, allPlayers, ladder);
    if (!playerWithRank) continue;
    
    const { player, rank } = playerWithRank;
    
    // Base individual strength from ladder rank (1 is best, lower is better)
    const rankValue = Math.max(1, 11 - rank); // Convert rank to 1-10 scale
    
    // Skill tier multiplier
    const skillMultiplier = 
      player.skillTier === 'elite' ? 1.5 :
      player.skillTier === 'competitive' ? 1.2 : 1.0;
    
    // Position importance (1S and 1D are more important)
    const positionMultiplier = 
      (type === 'singles' && position === 1) ? 1.3 :
      (type === 'doubles' && position === 1) ? 1.2 :
      (position <= 2) ? 1.1 : 1.0;
    
    // Calculate individual strength
    const individualStrength = rankValue * skillMultiplier * positionMultiplier;
    positionStrength += individualStrength;
  }
  
  // For doubles, average the two players' strength
  if (type === 'doubles') {
    positionStrength = positionStrength / 2;
  }
  
  // Team archetype bonuses
  // Dominant teams perform better at top positions
  if (teamAssessment.archetype === 'dominant' && position === 1) {
    positionStrength *= 1.2;
  }
  
  // Add randomness factor (slight performance variation)
  const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9-1.1
  
  return positionStrength * randomFactor;
};

/**
 * Generate tennis set score based on relative player strengths
 * @param homeStrength Relative strength of home player(s) (1-10)
 * @param awayStrength Relative strength of away player(s) (1-10)
 * @returns Object with home and away scores
 */
export const generateSetScore = (homeStrength: number, awayStrength: number): { homeScore: number, awayScore: number, tiebreak?: { homeScore: number, awayScore: number } } => {
  // Calculate win probability based on relative strengths
  const totalStrength = homeStrength + awayStrength;
  const homeWinProbability = homeStrength / totalStrength;
  
  // Add slight home court advantage
  const adjustedHomeWinProb = Math.min(0.95, homeWinProbability * 1.05);
  
  // Determine winner
  const homeWins = Math.random() < adjustedHomeWinProb;
  
  let homeScore = 0;
  let awayScore = 0;
  
  // Calculate strength difference for score determination
  const strengthDiff = Math.abs(homeStrength - awayStrength);
  const isDominant = strengthDiff > 4;
  const isStrong = strengthDiff > 2 && strengthDiff <= 4;
  const isClose = strengthDiff <= 2;
  
  if (homeWins) {
    // Home player/team wins
    if (isDominant) {
      // Dominant win (6-0, 6-1)
      homeScore = 6;
      awayScore = Math.random() < 0.7 ? 0 : 1;
    } else if (isStrong) {
      // Clear win (6-2, 6-3)
      homeScore = 6;
      awayScore = Math.random() < 0.5 ? 2 : 3;
    } else if (isClose) {
      // Close win (6-4, 7-5, 7-6)
      const closeType = Math.random();
      if (closeType < 0.6) {
        homeScore = 6;
        awayScore = 4;
      } else if (closeType < 0.8) {
        homeScore = 7;
        awayScore = 5;
      } else {
        homeScore = 7;
        awayScore = 6;
      }
    }
  } else {
    // Away player/team wins
    if (isDominant) {
      // Dominant win (0-6, 1-6)
      homeScore = Math.random() < 0.7 ? 0 : 1;
      awayScore = 6;
    } else if (isStrong) {
      // Clear win (2-6, 3-6)
      homeScore = Math.random() < 0.5 ? 2 : 3;
      awayScore = 6;
    } else if (isClose) {
      // Close win (4-6, 5-7, 6-7)
      const closeType = Math.random();
      if (closeType < 0.6) {
        homeScore = 4;
        awayScore = 6;
      } else if (closeType < 0.8) {
        homeScore = 5;
        awayScore = 7;
      } else {
        homeScore = 6;
        awayScore = 7;
      }
    }
  }
  
  // Add tiebreak for 7-6 or a 6-7 set
  if ((homeScore === 7 && awayScore === 6) || (homeScore === 6 && awayScore === 7)) {
    const tiebreakWinner = homeScore > awayScore;
    const baseScore = 7 + Math.floor(Math.random() * 4); // 7-10
    const loserScore = Math.max(0, baseScore - 2 - Math.floor(Math.random() * 4)); // 0-5 points below
    
    return {
      homeScore,
      awayScore,
      tiebreak: {
        homeScore: tiebreakWinner ? baseScore : loserScore,
        awayScore: tiebreakWinner ? loserScore : baseScore
      }
    };
  }
  
  return { homeScore, awayScore };
};

/**
 * Generate a flight result based on player skill tiers and team archetypes
 */
export const generateFlightResult = (
  type: 'singles' | 'doubles',
  position: number,
  level: 'varsity' | 'jv',
  homePlayers: string[],
  awayPlayers: string[],
  homeLadder: TeamLadder,
  awayLadder: TeamLadder,
  homeTeam: Team,
  awayTeam: Team,
  allPlayers: Player[],
  schools: School[]
): { sets: Set[], homePlayerWon: boolean } => {
  // Assess team strengths
  const homeTeamAssessment = assessTeamStrength(homeTeam, schools, allPlayers);
  const awayTeamAssessment = assessTeamStrength(awayTeam, schools, allPlayers);
  
  // Calculate position-specific strengths
  const homePositionStrength = calculatePositionStrength(
    homePlayers, position, type, homeLadder, allPlayers, homeTeamAssessment
  );
  
  const awayPositionStrength = calculatePositionStrength(
    awayPlayers, position, type, awayLadder, allPlayers, awayTeamAssessment
  );
  
  // Generate 2-3 sets
  const sets: Set[] = [];
  let homeSetWins = 0;
  let awaySetWins = 0;
  
  // First set
  const set1 = generateSetScore(homePositionStrength, awayPositionStrength);
  sets.push(set1);
  if (set1.homeScore > set1.awayScore) homeSetWins++; else awaySetWins++;
  
  // Second set - adjust strength based on first set (momentum factor)
  const momentumFactor = 0.5; // How much first set affects second set
  const homeStrength2 = homePositionStrength * (1 + (homeSetWins > 0 ? momentumFactor : -momentumFactor) * 0.1);
  const awayStrength2 = awayPositionStrength * (1 + (awaySetWins > 0 ? momentumFactor : -momentumFactor) * 0.1);
  
  const set2 = generateSetScore(homeStrength2, awayStrength2);
  sets.push(set2);
  if (set2.homeScore > set2.awayScore) homeSetWins++; else awaySetWins++;
  
  // If tied, play a third set
  if (homeSetWins === awaySetWins) {
    // Third set - stronger momentum factor
    const finalMomentumFactor = 0.7;
    const set2Winner = set2.homeScore > set2.awayScore;
    
    const homeStrength3 = homePositionStrength * 
      (1 + (set2Winner ? finalMomentumFactor : -finalMomentumFactor) * 0.1);
    const awayStrength3 = awayPositionStrength * 
      (1 + (!set2Winner ? finalMomentumFactor : -finalMomentumFactor) * 0.1);
    
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
 * Simulate a complete tennis dual match between two teams with enhanced realism
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
  homeTeam: Team,
  awayTeam: Team,
  allPlayers: Player[],
  schools: School[]
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

  // Assess team archetypes and strategies
  const homeArchetype = determineTeamArchetype(homeTeamId);
  const awayArchetype = determineTeamArchetype(awayTeamId);
  
  // Create flights from line-up
  const flights: Flight[] = [];
  
  // Decide lineup strategy based on team archetypes
  // Dominant teams are more likely to use best players in singles
  // Rebuilding teams may try different approaches
  
  // Probability for top players to play singles based on team archetype
  const homeTopPlaySinglesProb = 
    homeArchetype === 'dominant' ? 0.85 :
    homeArchetype === 'strong' ? 0.75 :
    homeArchetype === 'mid-tier' ? 0.65 : 0.55;
    
  const awayTopPlaySinglesProb = 
    awayArchetype === 'dominant' ? 0.85 :
    awayArchetype === 'strong' ? 0.75 :
    awayArchetype === 'mid-tier' ? 0.65 : 0.55;
  
  const homeTopPlaySingles = Math.random() < homeTopPlaySinglesProb;
  const awayTopPlaySingles = Math.random() < awayTopPlaySinglesProb;
  
  // Assign players to positions based on strategy
  if (homeTopPlaySingles) {
    // Home team assigns top players to singles
    let homeFirstSingles = homePlayers[0].id;
    let homeSecondSingles = homePlayers[1].id;
    homePlayers[0].selected = true;
    homePlayers[1].selected = true;
    selectedHomePlayers.add(homeFirstSingles);
    selectedHomePlayers.add(homeSecondSingles);
  } else {
    // Alternative strategy: top players play doubles together
    let homeFirstDoubles = [homePlayers[0].id, homePlayers[1].id];
    homePlayers[0].selected = true;
    homePlayers[1].selected = true;
    selectedHomePlayers.add(homeFirstDoubles[0]);
    selectedHomePlayers.add(homeFirstDoubles[1]);
  }
  
  if (awayTopPlaySingles) {
    // Away team assigns top players to singles
    let awayFirstSingles = awayPlayers[0].id;
    let awaySecondSingles = awayPlayers[1].id;
    awayPlayers[0].selected = true;
    awayPlayers[1].selected = true;
    selectedAwayPlayers.add(awayFirstSingles);
    selectedAwayPlayers.add(awaySecondSingles);
  } else {
    // Alternative strategy: top players play doubles together
    let awayFirstDoubles = [awayPlayers[0].id, awayPlayers[1].id];
    awayPlayers[0].selected = true;
    awayPlayers[1].selected = true;
    selectedAwayPlayers.add(awayFirstDoubles[0]);
    selectedAwayPlayers.add(awayFirstDoubles[1]);
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
    
    // Generate flight result with enhanced realism
    const result = generateFlightResult(
      flight.type,
      flight.position,
      flight.level,
      homeFlightPlayers,
      awayFlightPlayers,
      homeLadder,
      awayLadder,
      homeTeam,
      awayTeam,
      allPlayers,
      schools
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
 * Generate all matches for a season/district with enhanced realism
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
    
    // Simulate the match with enhanced team dynamics
    const match = simulateMatch(
      date,
      homeTeamId,
      awayTeamId,
      homeLadder,
      awayLadder,
      config.isLeagueMatch,
      homeSchool,
      awaySchool,
      homeTeam,
      awayTeam,
      players,
      schools
    );
    
    matches.push(match);
  }
  
  return matches;
};

/**
 * Generate all matches for a season/district
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
