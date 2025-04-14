
import { Team, School } from '@/types';

export const useTeamVerification = () => {
  /**
   * Verify that we have enough teams to run a simulation
   */
  const verifyTeamsForSimulation = (teams: Team[], schools: School[]): boolean => {
    // Group teams by district and gender
    const districtTeams: Record<string, { boys: Team[], girls: Team[] }> = {};
    
    teams.forEach(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return;
      
      if (!districtTeams[school.districtId]) {
        districtTeams[school.districtId] = { boys: [], girls: [] };
      }
      
      if (team.gender === 'Boys') {
        districtTeams[school.districtId].boys.push(team);
      } else {
        districtTeams[school.districtId].girls.push(team);
      }
    });
    
    // Check if at least one district has both boys and girls teams
    return Object.values(districtTeams).some(district => 
      district.boys.length >= 2 || district.girls.length >= 2
    );
  };
  
  /**
   * Get a specific error message about why simulation can't run
   */
  const getSimulationErrorMessage = (teams: Team[], schools: School[]): string => {
    // Group teams by district and gender
    const districtTeams: Record<string, { boys: Team[], girls: Team[] }> = {};
    
    teams.forEach(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return;
      
      if (!districtTeams[school.districtId]) {
        districtTeams[school.districtId] = { boys: [], girls: [] };
      }
      
      if (team.gender === 'Boys') {
        districtTeams[school.districtId].boys.push(team);
      } else {
        districtTeams[school.districtId].girls.push(team);
      }
    });
    
    const boysDistrictsWithEnough = Object.entries(districtTeams)
      .filter(([_, teams]) => teams.boys.length >= 2)
      .map(([districtId, _]) => districtId);
      
    const girlsDistrictsWithEnough = Object.entries(districtTeams)
      .filter(([_, teams]) => teams.girls.length >= 2)
      .map(([districtId, _]) => districtId);
    
    if (boysDistrictsWithEnough.length === 0 && girlsDistrictsWithEnough.length === 0) {
      return "You need at least 2 teams of the same gender in the same district to generate matches.";
    }
    
    if (boysDistrictsWithEnough.length === 0) {
      return "You need at least 2 boys teams in the same district to generate matches for boys.";
    }
    
    if (girlsDistrictsWithEnough.length === 0) {
      return "You need at least 2 girls teams in the same district to generate matches for girls.";
    }
    
    return "";
  };
  
  return { verifyTeamsForSimulation, getSimulationErrorMessage };
};
