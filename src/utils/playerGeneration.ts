import { Player } from '@/types';

/**
 * Determine a team's archetype more deterministically
 * This affects roster composition and overall strength
 */
export const determineTeamArchetype = (teamId: string): 'dominant' | 'strong' | 'mid-tier' | 'weak' => {
  // Extract school and gender from team ID (format: "school-gender")
  const parts = teamId.split('-');
  const schoolKey = parts[0];
  const gender = parts[parts.length - 1];
  
  // List of historically dominant programs
  const dominantGirlsPrograms = [
    'jesuit', 'summit', 'lincoln', 'oregon-episcopal', 'catlin-gabel', 
    'marist', 'st-marys-medford', 'central-catholic'
  ];
  
  const dominantBoysPrograms = [
    'jesuit', 'lincoln', 'summit', 'oregon-episcopal', 'catlin-gabel', 
    'sunset', 'central-catholic'
  ];
  
  // List of historically strong programs
  const strongGirlsPrograms = [
    'sunset', 'lake-oswego', 'wilsonville', 'west-linn', 'crescent-valley',
    'west-albany', 'st-marys-academy'
  ];
  
  const strongBoysPrograms = [
    'west-linn', 'lake-oswego', 'crescent-valley', 'wilson', 'lakeridge',
    'south-eugene', 'west-albany', 'mountain-view'
  ];
  
  // Check if team is from a dominant program
  if (gender === 'girls' && dominantGirlsPrograms.includes(schoolKey)) {
    return 'dominant';
  }
  
  if (gender === 'boys' && dominantBoysPrograms.includes(schoolKey)) {
    return 'dominant';
  }
  
  // Check if team is from a strong program
  if (gender === 'girls' && strongGirlsPrograms.includes(schoolKey)) {
    return 'strong';
  }
  
  if (gender === 'boys' && strongBoysPrograms.includes(schoolKey)) {
    return 'strong';
  }
  
  // For other schools, use a weighted random distribution
  // with more mid-tier teams than weak/strong
  const rand = Math.random();
  
  if (rand < 0.1) { // 10% chance for non-listed schools to be strong
    return 'strong';
  } else if (rand < 0.7) { // 60% chance to be mid-tier
    return 'mid-tier';
  } else { // 30% chance to be weak
    return 'weak';
  }
};

/**
 * Determine a team's size based on archetype and classification
 */
export const determineTeamSize = (
  archetype: 'dominant' | 'strong' | 'mid-tier' | 'weak',
  classification: string
): number => {
  // Base size by classification
  let baseSize = 
    classification === '6A' ? 14 :
    classification === '5A' ? 12 :
    classification === '4A' ? 10 :
    classification === '3A' ? 9 :
    classification === '2A' ? 8 : 7;
  
  // Adjust based on archetype
  const sizeModifier =
    archetype === 'dominant' ? 2 :
    archetype === 'strong' ? 1 :
    archetype === 'mid-tier' ? 0 : -1;
  
  // Add some randomness for variation
  const randomVariance = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  
  return Math.max(7, baseSize + sizeModifier + randomVariance);
};

/**
 * Get the school classification
 */
export const getSchoolClassification = (
  schoolId: string, 
  schools: any[]
): string => {
  const school = schools.find(s => s.id === schoolId);
  return school?.classification || '6A';
};

/**
 * Determine a team's preferred strategy
 */
export const determineTeamStrategy = (
  teamId: string
): 'singles-focused' | 'doubles-focused' | 'balanced' => {
  // Extract school from team ID
  const schoolKey = teamId.split('-')[0];
  
  // Some schools traditionally focus on singles or doubles
  const singlesSchools = ['jesuit', 'summit', 'lincoln', 'west-linn'];
  const doublesSchools = ['central-catholic', 'lake-oswego', 'sunset'];
  
  if (singlesSchools.includes(schoolKey)) {
    return 'singles-focused';
  }
  
  if (doublesSchools.includes(schoolKey)) {
    return 'doubles-focused';
  }
  
  // Most teams are balanced
  return 'balanced';
};

/**
 * Assign a player's skill tier
 * Used when updating players
 */
export const assignPlayerSkillTier = (
  skillRating: number
): 'elite' | 'competitive' | 'developmental' => {
  if (skillRating >= 7.5) {
    return 'elite';
  } else if (skillRating >= 5.0) {
    return 'competitive';
  } else {
    return 'developmental';
  }
};

/**
 * Generate a player's grade (9-12)
 */
export const generatePlayerGrade = (): number => {
  const rand = Math.random();
  
  if (rand < 0.1) {
    return 9; // Freshman
  } else if (rand < 0.35) {
    return 10; // Sophomore
  } else if (rand < 0.65) {
    return 11; // Junior
  } else {
    return 12; // Senior
  }
};

/**
 * Generate a team roster
 */
export const generateTeamRoster = (
  teamId: string,
  teamSize: number
): string[] => {
  const roster: string[] = [];
  
  for (let i = 0; i < teamSize; i++) {
    roster.push(crypto.randomUUID());
  }
  
  return roster;
};

/**
 * Get a player with their rank on the team ladder
 */
export const getPlayerWithRank = (
  playerId: string,
  allPlayers: Player[],
  ladder: any
): { player: Player, rank: number } | undefined => {
  const player = allPlayers.find(p => p.id === playerId);
  if (!player) return undefined;
  
  const ranking = ladder.rankings.find((r: any) => r.playerId === playerId);
  if (!ranking) return undefined;
  
  return {
    player,
    rank: ranking.rank
  };
};
