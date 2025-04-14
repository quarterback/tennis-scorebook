
import { Player, Team, School } from '@/types';
import { TeamLadder } from '@/types/ranking';
import { generateTeamRoster, generateTeamLadder } from '@/utils/playerSimulation';

export const usePlayerGeneration = () => {
  /**
   * Generate team rosters and ladders for all teams
   */
  const generatePlayerData = (
    teams: Team[],
    schools: School[],
    seasonId: string
  ): { players: Player[], ladders: TeamLadder[] } => {
    const allPlayers: Player[] = [];
    const ladders: TeamLadder[] = [];
    
    teams.forEach(team => {
      // Generate roster - ensure at least 12 players for a complete dual match
      const teamPlayers = generateTeamRoster(team.id, team.schoolId, seasonId);
      allPlayers.push(...teamPlayers);
      
      // Generate ladder
      const ladder = generateTeamLadder(team.id, seasonId, teamPlayers);
      ladders.push(ladder);
    });
    
    return { players: allPlayers, ladders };
  };

  return {
    generatePlayerData
  };
};
