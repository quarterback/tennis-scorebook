
import { Team, School, District, Match, Player } from '@/types';
import { TeamLadder, MatchGenerationConfig } from '@/types/ranking';
import { generateDistrictMatches } from '@/utils/matchSimulation';

export const useMatchGeneration = () => {
  /**
   * Generate matches for teams based on district assignments
   * with enhanced realism based on team archetypes and classifications
   */
  const generateMatchData = (
    teams: Team[],
    schools: School[],
    districts: District[],
    players: Player[],
    ladders: TeamLadder[],
    config: MatchGenerationConfig
  ): Match[] => {
    const allMatches: Match[] = [];
    
    // Separate teams by gender
    const boysTeams = teams.filter(team => team.gender === 'Boys');
    const girlsTeams = teams.filter(team => team.gender === 'Girls');
    
    const genderGroups = [
      { gender: 'Boys', teams: boysTeams },
      { gender: 'Girls', teams: girlsTeams }
    ];
    
    // Process each gender separately
    genderGroups.forEach(({ gender, teams: genderTeams }) => {
      // Group teams by district
      const districtTeams: Record<string, Team[]> = {};
      
      genderTeams.forEach(team => {
        const school = schools.find(s => s.id === team.schoolId);
        if (!school) return;
        
        if (!districtTeams[school.districtId]) {
          districtTeams[school.districtId] = [];
        }
        
        districtTeams[school.districtId].push(team);
      });
      
      // Generate matches for each district
      Object.entries(districtTeams).forEach(([districtId, teamsInDistrict]) => {
        // Skip districts with fewer than 2 teams
        if (teamsInDistrict.length < 2) {
          console.log(`Skipping district ${districtId} for ${gender}: Not enough teams (${teamsInDistrict.length})`);
          return;
        }
        
        // Get district details
        const district = districts.find(d => d.id === districtId);
        if (!district) {
          console.log(`District ${districtId} not found in districts data`);
          return;
        }
        
        // Calculate matches per team based on district size
        // Oregon high school leagues typically have 6-14 teams, so scale accordingly
        const teamCount = teamsInDistrict.length;
        const isLargeDistrict = teamCount >= 8;
        
        // Calculate matches per team 
        // Double round robin for smaller districts/leagues (each team plays every other team twice)
        // Single round robin for larger districts/leagues
        const matchesPerTeam = config.doubleRoundRobin && !isLargeDistrict
          ? Math.min(2 * (teamCount - 1), config.maxRegularSeasonMatches)
          : Math.min(teamCount - 1, config.maxRegularSeasonMatches);
        
        console.log(`Generating matches for ${district.name} (${gender}) (${teamCount} teams): ${matchesPerTeam} matches per team`);
        
        try {
          const districtMatches = generateDistrictMatches(
            teamsInDistrict,
            schools,
            players,
            ladders,
            {
              startDate: config.startDate,
              endDate: config.endDate,
              isLeagueMatch: true,
              matchesPerTeam
            }
          );
          
          allMatches.push(...districtMatches);
        } catch (error) {
          console.error(`Error generating matches for district ${districtId} (${district.name}):`, error);
        }
      });
    });
    
    return allMatches;
  };

  return {
    generateMatchData
  };
};
