
import { TeamLadder, PlayerLadderPosition } from "@/types/ranking";
import { Player } from "@/types";

/**
 * Create an initial ladder ranking for a team based on their roster
 */
export const generateTeamLadder = (
  teamId: string,
  seasonId: string,
  players: Player[]
): TeamLadder => {
  // Sort players by a random skill level (higher grade slightly increases chance of higher skill)
  const rankedPlayers = players.map(player => {
    // Base skill influenced slightly by grade
    const baseSkill = Math.random() * 0.7 + (player.grade - 9) * 0.1;
    return {
      player,
      skill: baseSkill
    };
  }).sort((a, b) => b.skill - a.skill);
  
  // Create ladder positions
  const rankings: PlayerLadderPosition[] = rankedPlayers.map((rankedPlayer, index) => {
    return {
      playerId: rankedPlayer.player.id,
      rank: index + 1, // 1-based ranking (1 is best)
      ladderPoints: 100 - (index * 10), // Add ladder points
      previousRanks: [index + 1] // Initially only one ranking in history
    };
  });
  
  return {
    teamId,
    seasonId,
    rankings,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Slightly shuffle a team ladder to simulate minor ranking changes over time
 */
export const updateTeamLadder = (ladder: TeamLadder): TeamLadder => {
  const newRankings = [...ladder.rankings];
  
  // Randomly select 0-3 pairs of adjacent players to swap
  const swapsCount = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < swapsCount; i++) {
    // Pick a random position (not the last one)
    const position = Math.floor(Math.random() * (newRankings.length - 1));
    
    // Only swap if players are adjacent in ranking
    const player1 = newRankings[position];
    const player2 = newRankings[position + 1];
    
    // 30% chance of swap if they're adjacent
    if (Math.random() < 0.3) {
      // Swap them
      newRankings[position] = player2;
      newRankings[position + 1] = player1;
      
      // Update rank and history
      newRankings[position].rank = position + 1;
      newRankings[position].previousRanks.push(position + 1);
      
      newRankings[position + 1].rank = position + 2;
      newRankings[position + 1].previousRanks.push(position + 2);
    }
  }
  
  return {
    ...ladder,
    rankings: newRankings,
    lastUpdated: new Date().toISOString()
  };
};

export function createLadderForTeam(teamId: string, players: Player[], seasonId: string): TeamLadder {
  // Sort players by skill rating (if available) or default to alphabetical
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.skillRating && b.skillRating) {
      return b.skillRating - a.skillRating;
    }
    return a.name.localeCompare(b.name);
  });
  
  // Create initial ladder positions
  const rankings: PlayerLadderPosition[] = sortedPlayers.map((player, index) => {
    return {
      playerId: player.id,
      rank: index + 1,
      ladderPoints: 100 - (index * 10), // Add ladderPoints property
      previousRanks: []
    };
  });
  
  return {
    teamId,
    seasonId,
    lastUpdated: new Date().toISOString(),
    rankings
  };
}
