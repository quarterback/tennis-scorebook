
import { Team, School, District } from '@/types';

export const useTeamVerification = () => {
  /**
   * Verify that we have enough teams to generate matches
   */
  const verifyTeamsForSimulation = (teams: Team[], schools: School[]): boolean => {
    // Group teams by district to check if any districts have enough teams
    const districtTeams: Record<string, Team[]> = {};
    
    teams.forEach(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return;
      
      if (!districtTeams[school.districtId]) {
        districtTeams[school.districtId] = [];
      }
      
      districtTeams[school.districtId].push(team);
    });
    
    // Check if any district has at least 2 teams
    return Object.values(districtTeams).some(teamsInDistrict => teamsInDistrict.length >= 2);
  };

  /**
   * Get detailed error message for simulation validation
   */
  const getSimulationErrorMessage = (teams: Team[], schools: School[], districts: District[]): string | null => {
    // Group teams by district to check if any districts have enough teams
    const districtTeams: Record<string, Team[]> = {};
    
    teams.forEach(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return;
      
      if (!districtTeams[school.districtId]) {
        districtTeams[school.districtId] = [];
      }
      
      districtTeams[school.districtId].push(team);
    });
    
    // Check if any district has at least 2 teams
    const hasDistrictWithEnoughTeams = Object.entries(districtTeams).some(([districtId, teamsInDistrict]) => {
      if (teamsInDistrict.length >= 2) {
        return true;
      }
      return false;
    });
    
    if (!hasDistrictWithEnoughTeams) {
      return "You need at least 2 teams in the same district/league to generate matches. Please add more teams to the same district.";
    }
    
    return null;
  };
  
  return {
    verifyTeamsForSimulation,
    getSimulationErrorMessage
  };
};
