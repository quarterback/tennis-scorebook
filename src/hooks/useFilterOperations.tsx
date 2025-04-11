
import { Team, Player, Match } from '@/types';

export const useFilterOperations = (teams: Team[], players: Player[], matches: Match[]) => {
  
  const getTeamsBySchool = (schoolId: string) => {
    return teams.filter(team => team.schoolId === schoolId);
  };
  
  const getPlayersByTeam = (teamId: string) => {
    return players.filter(player => player.teamId === teamId);
  };
  
  const getMatchesByTeam = (teamId: string) => {
    return matches.filter(match => match.homeTeamId === teamId || match.awayTeamId === teamId);
  };

  return {
    getTeamsBySchool,
    getPlayersByTeam,
    getMatchesByTeam
  };
};
