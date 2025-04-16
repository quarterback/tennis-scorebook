
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
        
        // Set the minimum number of matches per team to ensure at least 12 total matches
        // and set the target for league matches to be 80% of the total
        const minTotalMatches = 12;
        const maxTotalMatches = 18;
        const leagueMatchPercentage = 0.8; // 80% of matches should be league matches
        
        // Calculate optimal matches per team within the league
        // Double round robin for smaller districts/leagues (each team plays every other team twice)
        // Single round robin for larger districts/leagues
        let districtMatchesPerTeam = config.doubleRoundRobin && !isLargeDistrict
          ? Math.min(2 * (teamCount - 1), Math.floor(maxTotalMatches * leagueMatchPercentage))
          : Math.min(teamCount - 1, Math.floor(maxTotalMatches * leagueMatchPercentage));
        
        // Ensure we have enough league matches to meet the minimum total matches
        // If we need more matches to reach the minimum, we'll add non-league matches later
        districtMatchesPerTeam = Math.max(
          districtMatchesPerTeam, 
          Math.floor(minTotalMatches * leagueMatchPercentage)
        );
        
        console.log(`Generating matches for ${district.name} (${gender}) (${teamCount} teams): ${districtMatchesPerTeam} league matches per team`);
        
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
              matchesPerTeam: districtMatchesPerTeam
            }
          );
          
          allMatches.push(...districtMatches);
        } catch (error) {
          console.error(`Error generating matches for district ${districtId} (${district.name}):`, error);
        }
      });
    });
    
    // Analyze the current match counts per team to determine if we need to add non-league matches
    const teamMatchCounts: Record<string, { total: number, league: number }> = {};
    
    // Initialize counts
    teams.forEach(team => {
      teamMatchCounts[team.id] = { total: 0, league: 0 };
    });
    
    // Count the matches generated so far
    allMatches.forEach(match => {
      // Home team
      if (teamMatchCounts[match.homeTeamId]) {
        teamMatchCounts[match.homeTeamId].total++;
        if (match.isLeagueMatch) {
          teamMatchCounts[match.homeTeamId].league++;
        }
      }
      
      // Away team
      if (teamMatchCounts[match.awayTeamId]) {
        teamMatchCounts[match.awayTeamId].total++;
        if (match.isLeagueMatch) {
          teamMatchCounts[match.awayTeamId].league++;
        }
      }
    });
    
    // Generate additional non-league matches to reach the minimum match count
    // and ensure proper balance between league and non-league matches
    const additionalMatches: Match[] = [];
    
    teams.forEach(team => {
      const matchCount = teamMatchCounts[team.id]?.total || 0;
      
      // If team doesn't have enough matches, add more
      if (matchCount < 12) {
        const matchesNeeded = 12 - matchCount;
        
        // Find potential opponents (preferring same classification)
        const potentialOpponents = teams.filter(opponent => {
          // Don't match against self
          if (opponent.id === team.id) return false;
          
          // Ensure opponent is same gender
          if (opponent.gender !== team.gender) return false;
          
          // Don't exceed max matches for opponent
          const opponentMatchCount = teamMatchCounts[opponent.id]?.total || 0;
          if (opponentMatchCount >= 18) return false;
          
          // Check if teams are already scheduled to play too many times
          const existingMatchCount = allMatches.filter(match => 
            (match.homeTeamId === team.id && match.awayTeamId === opponent.id) || 
            (match.homeTeamId === opponent.id && match.awayTeamId === team.id)
          ).length;
          
          // Limit teams to play each other at most 2 times
          if (existingMatchCount >= 2) return false;
          
          return true;
        });
        
        // Sort by closest to the min match count and same classification
        const sortedOpponents = [...potentialOpponents].sort((a, b) => {
          const aCount = teamMatchCounts[a.id]?.total || 0;
          const bCount = teamMatchCounts[b.id]?.total || 0;
          
          // Prioritize opponents needing matches
          if (aCount < 12 && bCount >= 12) return -1;
          if (bCount < 12 && aCount >= 12) return 1;
          
          // Then prioritize same classification
          const teamSchool = schools.find(s => s.id === team.schoolId);
          const aSchool = schools.find(s => s.id === a.schoolId);
          const bSchool = schools.find(s => s.id === b.schoolId);
          
          if (teamSchool && aSchool && bSchool) {
            if (teamSchool.classification === aSchool.classification && 
                teamSchool.classification !== bSchool.classification) return -1;
            if (teamSchool.classification === bSchool.classification && 
                teamSchool.classification !== aSchool.classification) return 1;
          }
          
          // Finally, prioritize opponents needing more matches
          return aCount - bCount;
        });
        
        // Generate matches until we reach the minimum
        for (let i = 0; i < Math.min(matchesNeeded, sortedOpponents.length); i++) {
          const opponent = sortedOpponents[i];
          if (!opponent) continue;
          
          // Generate a non-league match
          try {
            const homeTeam = Math.random() > 0.5 ? team : opponent;
            const awayTeam = homeTeam.id === team.id ? opponent : team;
            
            const matchDate = new Date(config.startDate);
            const endDate = new Date(config.endDate);
            const dayRange = (endDate.getTime() - matchDate.getTime()) / (1000 * 60 * 60 * 24);
            matchDate.setDate(matchDate.getDate() + Math.floor(Math.random() * dayRange));
            
            const nonLeagueMatch = generateDistrictMatches(
              [homeTeam, awayTeam],
              schools,
              players,
              ladders,
              {
                startDate: matchDate.toISOString().slice(0, 10),
                endDate: matchDate.toISOString().slice(0, 10),
                isLeagueMatch: false,
                matchesPerTeam: 1
              }
            );
            
            additionalMatches.push(...nonLeagueMatch);
            
            // Update match counts
            teamMatchCounts[team.id].total++;
            teamMatchCounts[opponent.id].total++;
          } catch (error) {
            console.error(`Error generating non-league match for ${team.id} vs ${opponent.id}:`, error);
          }
        }
      }
    });
    
    allMatches.push(...additionalMatches);
    
    return allMatches;
  };

  return {
    generateMatchData
  };
};
