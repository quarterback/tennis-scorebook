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
 * with adjustments for historically dominant programs
 */
const assessTeamStrength = (
  team: Team,
  schools: School[],
  players: Player[]
): StrengthAssessment => {
  const school = schools.find(s => s.id === team.schoolId);
  const classification = school?.classification || '6A';
  const archetype = determineTeamArchetype(team.id);
  
  // Base strength by archetype with increased differentiation
  let baseStrength = 
    archetype === 'dominant' ? 10 :   // Increased from 8
    archetype === 'strong' ? 7.5 :    // Increased from 6
    archetype === 'mid-tier' ? 5 :    // Increased from 4
    archetype === 'weak' ? 3 : 1.5;   // Increased differentiation for weak teams
  
  // Classification modifier with greater differentiation
  const classModifier = 
    classification === '6A' ? 1.2 :
    classification === '5A' ? 1.0 : 
    classification === '4A' ? 0.9 :
    classification === '3A' ? 0.8 :
    classification === '2A' ? 0.7 : 0.6;
  
  // Historical program bonus
  let historicalBonus = 1.0;
  
  // Apply special bonuses for historically dominant programs
  if (school) {
    // Girls tennis powerhouses
    if (team.gender === 'Girls') {
      if (school.name === 'Jesuit') {
        historicalBonus = 1.4; // Jesuit girls dominate
      } else if (
        school.name === 'Oregon Episcopal' || 
        school.name === 'Catlin Gabel' || 
        school.name === 'Marist Catholic' || 
        school.name === "St. Mary's (Medford)"
      ) {
        historicalBonus = 1.3; // Other historically strong programs
      } else if (
        school.name === 'Summit' || 
        school.name === 'Lincoln' ||
        school.name === 'Central Catholic' ||
        school.name === 'Sunset'
      ) {
        historicalBonus = 1.2; // Other strong 6A programs
      }
    } 
    // Boys tennis powerhouses
    else if (team.gender === 'Boys') {
      if (school.name === 'Jesuit' || school.name === 'Lincoln') {
        historicalBonus = 1.3; // Top boys programs
      } else if (
        school.name === 'Summit' || 
        school.name === 'Central Catholic' ||
        school.name === 'Oregon Episcopal' ||
        school.name === 'Catlin Gabel'
      ) {
        historicalBonus = 1.2; // Other strong programs
      }
    }
  }
  
  // Count elite and competitive players
  const teamPlayers = players.filter(p => p.teamId === team.id);
  const elitePlayers = teamPlayers.filter(p => p.skillTier === 'elite').length;
  const competitivePlayers = teamPlayers.filter(p => p.skillTier === 'competitive').length;
  
  // Calculate skill tier bonus
  const skillTierBonus = (elitePlayers * 0.5) + (competitivePlayers * 0.2);
  
  return {
    baseStrength: baseStrength * classModifier * historicalBonus,
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
  // Calculate win probability based on relative strengths with more weight on skill difference
  const totalStrength = homeStrength + awayStrength;
  // Increase skill impact on win probability
  const skillImpact = 1.2; // Increased from default
  const rawHomeWinProbability = (homeStrength / totalStrength) * skillImpact;
  
  // Clamp probability between 0.05-0.95
  const homeWinProbability = Math.max(0.05, Math.min(0.95, rawHomeWinProbability));
  
  // Add slight home court advantage
  const adjustedHomeWinProb = Math.min(0.95, homeWinProbability * 1.08); // Increased home advantage
  
  // Determine winner
  const homeWins = Math.random() < adjustedHomeWinProb;
  
  let homeScore = 0;
  let awayScore = 0;
  
  // Calculate strength difference for score determination
  const strengthDiff = Math.abs(homeStrength - awayStrength);
  // More pronounced score differentials based on team strength differences
  const isDominant = strengthDiff > 3.5; // Reduced from 4
  const isStrong = strengthDiff > 1.8 && strengthDiff <= 3.5; // Adjusted ranges 
  const isClose = strengthDiff <= 1.8;
  
  if (homeWins) {
    // Home player/team wins
    if (isDominant) {
      // Dominant win (6-0, 6-1)
      homeScore = 6;
      awayScore = Math.random() < 0.8 ? 0 : 1; // Increased chance of 6-0 score
    } else if (isStrong) {
      // Clear win (6-2, 6-3)
      homeScore = 6;
      awayScore = Math.random() < 0.6 ? 2 : 3;
    } else if (isClose) {
      // Close win (6-4, 7-5, 7-6)
      const closeType = Math.random();
      if (closeType < 0.7) { // More likely 6-4 than 7-5 or 7-6
        homeScore = 6;
        awayScore = 4;
      } else if (closeType < 0.9) {
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
      homeScore = Math.random() < 0.8 ? 0 : 1; // Increased chance of 0-6 score
      awayScore = 6;
    } else if (isStrong) {
      // Clear win (2-6, 3-6)
      homeScore = Math.random() < 0.6 ? 2 : 3;
      awayScore = 6;
    } else if (isClose) {
      // Close win (4-6, 5-7, 6-7)
      const closeType = Math.random();
      if (closeType < 0.7) { // More likely 4-6 than 5-7 or 6-7
        homeScore = 4;
        awayScore = 6;
      } else if (closeType < 0.9) {
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
  
  // Generate a match ID first
  const matchId = crypto.randomUUID();
  
  // Create flights from line-up
  const flights: Flight[] = [];
  
  // Generate flights for each position
  flightTypes.forEach(({ type, position, level }) => {
    // Do we have enough players to fill this flight?
    const homeFreePlayersCount = homePlayers.filter(p => !p.selected).length;
    const awayFreePlayersCount = awayPlayers.filter(p => !p.selected).length;
    
    // For singles we need 1 player from each team, for doubles we need 2
    const needPerTeam = type === 'singles' ? 1 : 2;
    
    if (homeFreePlayersCount >= needPerTeam && awayFreePlayersCount >= needPerTeam) {
      let homeFlight: string[] = [];
      let awayFlight: string[] = [];
      
      // Select home players for this flight
      if (type === 'singles') {
        // Find best available player
        const homePlayer = homePlayers.find(p => !p.selected);
        if (homePlayer) {
          homePlayer.selected = true;
          homeFlight = [homePlayer.id];
        }
      } else {
        // For doubles, take best available pair where possible
        // Get best available player
        const homePlayer1 = homePlayers.find(p => !p.selected);
        if (homePlayer1) {
          homePlayer1.selected = true;
          
          // Then get a good partner for them (not necessarily next best)
          const homePlayer2Options = homePlayers.filter(p => !p.selected);
          if (homePlayer2Options.length > 0) {
            // Pick a player - for variety sometimes pick 2nd or 3rd best
            const randomIndex = homePlayer2Options.length > 2 ? 
              Math.floor(Math.random() * Math.min(3, homePlayer2Options.length)) : 0;
            const homePlayer2 = homePlayer2Options[randomIndex];
            homePlayer2.selected = true;
            homeFlight = [homePlayer1.id, homePlayer2.id];
          }
        }
      }
      
      // Select away players for this flight
      if (type === 'singles') {
        // Find best available player
        const awayPlayer = awayPlayers.find(p => !p.selected);
        if (awayPlayer) {
          awayPlayer.selected = true;
          awayFlight = [awayPlayer.id];
        }
      } else {
        // For doubles, take best available pair where possible
        // Get best available player
        const awayPlayer1 = awayPlayers.find(p => !p.selected);
        if (awayPlayer1) {
          awayPlayer1.selected = true;
          
          // Then get a good partner for them (not necessarily next best)
          const awayPlayer2Options = awayPlayers.filter(p => !p.selected);
          if (awayPlayer2Options.length > 0) {
            // Pick a player - for variety sometimes pick 2nd or 3rd best
            const randomIndex = awayPlayer2Options.length > 2 ? 
              Math.floor(Math.random() * Math.min(3, awayPlayer2Options.length)) : 0;
            const awayPlayer2 = awayPlayer2Options[randomIndex];
            awayPlayer2.selected = true;
            awayFlight = [awayPlayer1.id, awayPlayer2.id];
          }
        }
      }
      
      // If we have valid players for both sides, create the flight
      if (homeFlight.length === needPerTeam && awayFlight.length === needPerTeam) {
        // Simulate the flight
        const { sets, homePlayerWon } = generateFlightResult(
          type, position, level, 
          homeFlight, awayFlight,
          homeLadder, awayLadder,
          homeTeam, awayTeam,
          allPlayers, schools
        );
        
        // Add the flight to the match with the matchId
        flights.push({
          id: crypto.randomUUID(),
          matchId: matchId, // Add the matchId here
          type,
          position,
          level,
          homePlayers: homeFlight,
          awayPlayers: awayFlight,
          sets,
          homePlayerWon
        });
      }
    }
  });
  
  // Count flight wins for each team
  const homeFlightWins = flights.filter(f => f.homePlayerWon).length;
  const awayFlightWins = flights.filter(f => !f.homePlayerWon).length;
  
  // Significantly reduce chance of ties
  // In high school tennis, ties (4-4) should be rare
  const shouldForceTiebreaker = Math.random() > 0.88; // Only about 12% chance to allow a tie
  const isTie = homeFlightWins === awayFlightWins && !shouldForceTiebreaker;
  
  // If it would be a tie but we want to force a tiebreaker, adjust one flight result
  if (homeFlightWins === awayFlightWins && shouldForceTiebreaker && flights.length > 0) {
    // Select a random flight to flip
    const flightToFlip = flights[Math.floor(Math.random() * flights.length)];
    
    // Determine which team should win (weighted by team strength assessment)
    const homeTeamAssessment = assessTeamStrength(homeTeam, schools, allPlayers);
    const awayTeamAssessment = assessTeamStrength(awayTeam, schools, allPlayers);
    
    const totalStrength = homeTeamAssessment.baseStrength + awayTeamAssessment.baseStrength;
    const homeWinProb = homeTeamAssessment.baseStrength / totalStrength;
    
    // Flip the result
    flightToFlip.homePlayerWon = Math.random() < homeWinProb;
    
    // Update flight counts
    if (flightToFlip.homePlayerWon) {
      homeFlightWins++;
      awayFlightWins--;
    } else {
      homeFlightWins--;
      awayFlightWins++;
    }
  }
  
  // For playoff matches, simulate tiebreaker rounds if needed
  let tiebreakRound = null;
  
  if (isTie && !isLeagueMatch) {
    // Playoff match with 4-4 tie needs tiebreaker
    tiebreakRound = {
      isComplete: true,
      flights: [
        // 1st singles tiebreaker (10-point)
        {
          type: 'singles' as const,
          position: 1,
          level: 'varsity' as const,
          homePlayers: [homePlayers[0]?.id].filter(Boolean),
          awayPlayers: [awayPlayers[0]?.id].filter(Boolean),
          homePlayerWon: Math.random() < 0.55 // Slight home advantage
        },
        // 2nd singles tiebreaker
        {
          type: 'singles' as const,
          position: 2,
          level: 'varsity' as const,
          homePlayers: [homePlayers[1]?.id].filter(Boolean), 
          awayPlayers: [awayPlayers[1]?.id].filter(Boolean),
          homePlayerWon: Math.random() < 0.52 // Slight home advantage
        },
        // 1st doubles tiebreaker
        {
          type: 'doubles' as const,
          position: 1,
          level: 'varsity' as const,
          homePlayers: [homePlayers[2]?.id, homePlayers[3]?.id].filter(Boolean),
          awayPlayers: [awayPlayers[2]?.id, awayPlayers[3]?.id].filter(Boolean),
          homePlayerWon: Math.random() < 0.53 // Slight home advantage
        }
      ]
    };
    
    // Count tiebreaker wins
    const homeTiebreakerWins = tiebreakRound.flights.filter(f => f.homePlayerWon).length;
    const awayTiebreakerWins = tiebreakRound.flights.filter(f => !f.homePlayerWon).length;
    
    // Set match winner based on tiebreaker results
    const homeTeamWon = homeTiebreakerWins > awayTiebreakerWins;
    
    // Create the match object with tiebreaker
    return {
      id: matchId, // Use the same matchId we created earlier
      date,
      homeTeamId,
      awayTeamId,
      flights,
      isComplete: true,
      isLeagueMatch,
      isTie: false, // Not a tie since tiebreaker resolved it
      homeTeamWon,
      homeTeamScore: homeFlightWins,
      awayTeamScore: awayFlightWins,
      tiebreakRound
    };
  }
  
  // Regular match or league match with tie
  return {
    id: matchId, // Use the same matchId we created earlier
    date,
    homeTeamId,
    awayTeamId,
    flights,
    isComplete: true,
    isLeagueMatch,
    isTie,
    homeTeamWon: homeFlightWins > awayFlightWins ? true : 
                 awayFlightWins > homeFlightWins ? false : undefined,
    homeTeamScore: homeFlightWins,
    awayTeamScore: awayFlightWins
  };
};

/**
 * Generate district matches for a group of teams
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
  
  // Only generate if we have at least 2 teams
  if (teams.length < 2) return matches;
  
  // Calculate date range
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const dayRange = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Loop through each team
  for (let i = 0; i < teams.length; i++) {
    const homeTeam = teams[i];
    const homeLadder = ladders.find(l => l.teamId === homeTeam.id);
    const homeSchool = schools.find(s => s.id === homeTeam.schoolId);
    
    if (!homeLadder || !homeSchool) continue;
    
    // Match home team against each other team
    for (let j = 0; j < teams.length; j++) {
      if (i === j) continue; // Skip matching against self
      
      const awayTeam = teams[j];
      const awayLadder = ladders.find(l => l.teamId === awayTeam.id);
      const awaySchool = schools.find(s => s.id === awayTeam.schoolId);
      
      if (!awayLadder || !awaySchool) continue;
      
      // For round-robin format, each team plays every other team once
      // For double round-robin, we check if matches per team is high enough
      const shouldPlayMatch = config.matchesPerTeam >= teams.length - 1;
      
      if (shouldPlayMatch) {
        // Generate a random date within the range
        const randomDay = Math.floor(Math.random() * dayRange);
        const matchDate = new Date(startDate);
        matchDate.setDate(startDate.getDate() + randomDay);
        
        // Generate the match
        const match = simulateMatch(
          matchDate.toISOString().split('T')[0],
          homeTeam.id,
          awayTeam.id,
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
    }
  }
  
  return matches;
};
