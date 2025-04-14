
import { Player, Team, Gender, Classification } from '@/types';
import { PlayerStatus, PlayerSkillTier } from '@/types';
import { generatePlayerName } from './playerNames';

/**
 * Determine school classification from team
 */
export const getSchoolClassification = (team: Team, schools: any[]): Classification => {
  const school = schools.find(s => s.id === team.schoolId);
  if (!school) return '6A'; // Default to 6A if not found
  return school.classification as Classification;
};

/**
 * Generate appropriate team size based on school classification
 */
export const determineTeamSize = (classification: Classification): number => {
  switch(classification) {
    case '6A':
      return Math.floor(Math.random() * 11) + 30; // 30-40 players
    case '5A':
      return Math.floor(Math.random() * 11) + 25; // 25-35 players
    case '4A/3A/2A/1A':
      return Math.floor(Math.random() * 9) + 12;  // 12-20 players
    default:
      return Math.floor(Math.random() * 11) + 25; // Default to 5A size
  }
};

/**
 * Determine team archetype for player distribution
 */
export const determineTeamArchetype = (teamId: string): 'dominant' | 'strong' | 'mid-tier' | 'rebuilding' => {
  // Use hash of team ID to consistently assign archetype
  const hash = teamId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const normalized = hash % 100;
  
  if (normalized < 15) return 'dominant';      // 15% chance - 1-2 per league
  if (normalized < 40) return 'strong';        // 25% chance - 2-3 per league
  if (normalized < 75) return 'mid-tier';      // 35% chance - 3-4 per league
  return 'rebuilding';                         // 25% chance - 2-3 per league
};

/**
 * Determine team strategic approach
 */
export const determineTeamStrategy = (teamId: string): 'singles-focused' | 'doubles-focused' | 'balanced' => {
  // Use team ID hash for consistent strategy assignment
  const hash = teamId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const normalized = hash % 3;
  
  if (normalized === 0) return 'singles-focused';
  if (normalized === 1) return 'doubles-focused';
  return 'balanced';
};

/**
 * Assign skill tier to a player based on team archetype, classification, and random chance
 */
export const assignPlayerSkillTier = (
  index: number, 
  teamArchetype: 'dominant' | 'strong' | 'mid-tier' | 'rebuilding',
  classification: Classification,
  isPrivateSchool: boolean = false
): PlayerSkillTier => {
  // Top 6-8 players get higher chances for better skill tiers
  const isTopPlayer = index < 8;
  
  // Private schools get a bonus for elite players
  const privateSchoolBonus = isPrivateSchool ? 0.1 : 0;
  
  // Base chances for elite tier by team archetype and classification
  let eliteChance = 0;
  
  if (isTopPlayer) {
    // Base chances for top players by archetype
    if (teamArchetype === 'dominant') {
      eliteChance = classification === '6A' ? 0.3 : 
                    classification === '5A' ? 0.2 : 0.15;
    } else if (teamArchetype === 'strong') {
      eliteChance = classification === '6A' ? 0.15 : 
                    classification === '5A' ? 0.1 : 0.05;
    } else if (teamArchetype === 'mid-tier') {
      eliteChance = classification === '6A' ? 0.05 : 
                    classification === '5A' ? 0.03 : 0.01;
    } else { // rebuilding
      eliteChance = classification === '6A' ? 0.02 : 0.01;
    }
  } else {
    // Non-top players have much lower chances
    eliteChance = teamArchetype === 'dominant' ? 0.05 : 
                  teamArchetype === 'strong' ? 0.02 : 0.01;
  }
  
  // Apply private school bonus for elite players
  eliteChance += privateSchoolBonus;
  
  // Base chances for competitive tier by team archetype
  let competitiveChance = 0;
  
  if (isTopPlayer) {
    if (teamArchetype === 'dominant') {
      competitiveChance = 0.6;
    } else if (teamArchetype === 'strong') {
      competitiveChance = 0.5;
    } else if (teamArchetype === 'mid-tier') {
      competitiveChance = 0.4;
    } else { // rebuilding
      competitiveChance = 0.3;
    }
  } else {
    // Non-top players
    competitiveChance = teamArchetype === 'dominant' ? 0.4 : 
                        teamArchetype === 'strong' ? 0.3 : 
                        teamArchetype === 'mid-tier' ? 0.2 : 0.1;
  }
  
  // Roll for skill tier
  const roll = Math.random();
  
  if (roll < eliteChance) {
    return 'elite';
  } else if (roll < eliteChance + competitiveChance) {
    return 'competitive';
  } else {
    return 'developmental';
  }
};

/**
 * Generate a random grade (9-12) with weighted distribution
 * More seniors and juniors on varsity teams
 */
export const generatePlayerGrade = (): number => {
  const weights = [0.2, 0.25, 0.3, 0.25]; // 9th, 10th, 11th, 12th
  const random = Math.random();
  
  let cumulativeWeight = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return i + 9; // grades 9-12
    }
  }
  
  return 9; // default to freshman if something goes wrong
};

/**
 * Generate a roster of players for a team
 * Team size based on school classification
 */
export const generateTeamRoster = (
  teamId: string, 
  schoolId: string,
  seasonId: string,
  schools: any[] = [],
  size?: number // Optional override for team size
): Player[] => {
  // Determine classification and private school status
  const school = schools.find(s => s.id === schoolId);
  const classification = school?.classification || '6A';
  const isPrivateSchool = school?.name?.includes('Catholic') || 
                          school?.name?.includes('Christian') || 
                          school?.name?.includes('Academy') || 
                          school?.name?.includes('Prep');
  
  // Determine team archetype and strategy
  const teamArchetype = determineTeamArchetype(teamId);
  const teamStrategy = determineTeamStrategy(teamId);
  
  // Determine roster size based on classification if not provided
  const rosterSize = size ?? determineTeamSize(classification as Classification);
  
  const players: Player[] = [];
  
  const gender = teamId.endsWith('-girls') ? 'Girls' : 'Boys';
  
  for (let i = 0; i < rosterSize; i++) {
    // Assign skill tier based on position in roster, archetype, and classification
    const skillTier = assignPlayerSkillTier(i, teamArchetype, classification as Classification, isPrivateSchool);
    
    const player: Player = {
      id: crypto.randomUUID(),
      name: generatePlayerName(gender),
      grade: generatePlayerGrade(),
      teamId,
      seasonId,
      status: 'active' as PlayerStatus,
      seasons: [seasonId],
      skillTier // Add the skill tier to the player object
    };
    
    players.push(player);
  }
  
  return players;
};

/**
 * Get player information by ID with ladder position
 */
export const getPlayerWithRank = (
  playerId: string,
  players: Player[],
  ladder: any
): { player: Player, rank: number } | null => {
  const player = players.find(p => p.id === playerId);
  if (!player) return null;
  
  const ladderPosition = ladder.rankings.find((r: any) => r.playerId === playerId);
  if (!ladderPosition) return null;
  
  return {
    player,
    rank: ladderPosition.rank
  };
};
