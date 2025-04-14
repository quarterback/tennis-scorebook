
import { Player, Team, Gender } from '@/types';
import { PlayerStatus } from '@/types';
import { generatePlayerName } from './playerNames';

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
 * Minimum 12 players for a full dual match (no player duplication)
 */
export const generateTeamRoster = (
  teamId: string, 
  schoolId: string,
  seasonId: string,
  size: number = Math.floor(Math.random() * 8) + 12 // 12-20 players (minimum 12)
): Player[] => {
  // Ensure minimum size of 12 players for a full team roster
  const rosterSize = Math.max(12, size);
  const players: Player[] = [];
  
  for (let i = 0; i < rosterSize; i++) {
    const team = {
      id: teamId,
      schoolId
    } as Team;
    
    const gender = teamId.endsWith('-girls') ? 'Girls' : 'Boys';
    
    const player: Player = {
      id: crypto.randomUUID(),
      name: generatePlayerName(gender),
      grade: generatePlayerGrade(),
      teamId,
      seasonId,
      status: 'active' as PlayerStatus,
      seasons: [seasonId]
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
