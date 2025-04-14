
import { Player, Team, School } from '@/types';
import { TeamLadder } from '@/types/ranking';
import { generateTeamRoster, getSchoolClassification } from '@/utils/playerGeneration';
import { generateTeamLadder } from '@/utils/ladderManagement';

export const usePlayerGeneration = () => {
  /**
   * Generate team rosters and ladders for all teams based on classification
   */
  const generatePlayerData = (
    teams: Team[],
    schools: School[],
    seasonId: string
  ): { players: Player[], ladders: TeamLadder[] } => {
    const allPlayers: Player[] = [];
    const ladders: TeamLadder[] = [];
    
    // Process each team to generate players and ladders
    teams.forEach(team => {
      // Generate roster - size based on school classification
      const teamPlayers = generateTeamRoster(team.id, team.schoolId, seasonId, schools);
      allPlayers.push(...teamPlayers);
      
      // Generate ladder
      const ladder = generateTeamLadder(team.id, seasonId, teamPlayers);
      ladders.push(ladder);
      
      console.log(`Generated ${teamPlayers.length} players for team: ${team.id} (${team.gender})`);
    });
    
    return { players: allPlayers, ladders };
  };

  return {
    generatePlayerData
  };
};
