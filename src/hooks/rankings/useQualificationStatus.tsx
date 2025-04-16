
import { TeamRanking, ClassificationQualifications } from '@/types/ranking';

export const useQualificationStatus = () => {
  const calculateQualificationStatus = (
    rankings: TeamRanking[], 
    qualificationRules: ClassificationQualifications[]
  ): TeamRanking[] => {
    // First divide all teams by gender and classification
    const teamsByGenderAndClass: Record<string, TeamRanking[]> = {};
    
    rankings.forEach(team => {
      const key = `${team.gender}-${team.classification}`;
      if (!teamsByGenderAndClass[key]) {
        teamsByGenderAndClass[key] = [];
      }
      teamsByGenderAndClass[key].push(team);
    });
    
    // Process each gender-classification group separately
    Object.entries(teamsByGenderAndClass).forEach(([key, teamsInGroup]) => {
      const [gender, classification] = key.split('-');
      
      // Find qualification rules for this classification
      const rules = qualificationRules.find(r => r.classification === classification);
      
      if (!rules) return; // Skip if no rules found
      
      // Group teams by district
      const teamsByDistrict: Record<string, TeamRanking[]> = {};
      
      teamsInGroup.forEach(team => {
        if (!teamsByDistrict[team.districtName]) {
          teamsByDistrict[team.districtName] = [];
        }
        teamsByDistrict[team.districtName].push(team);
      });
      
      // Find the top team from each district for automatic bids
      const automaticQualifiers: TeamRanking[] = [];
      
      Object.entries(teamsByDistrict).forEach(([district, districtTeams]) => {
        // Sort by composite score to find district champion
        const sortedTeams = [...districtTeams].sort((a, b) => b.compositeScore - a.compositeScore);
        
        if (sortedTeams.length > 0) {
          // The top team gets an automatic bid
          automaticQualifiers.push(sortedTeams[0]);
        }
      });
      
      // Limit automatic qualifiers to the number of bids available
      const finalAutomaticQualifiers = automaticQualifiers.slice(0, rules.automaticBids);
      
      // Mark automatic qualifiers
      finalAutomaticQualifiers.forEach((team, index) => {
        const teamInRankings = teamsInGroup.find(t => t.teamId === team.teamId);
        if (teamInRankings) {
          teamInRankings.qualificationStatus = 'automatic';
          teamInRankings.qualificationSeed = index + 1;
        }
      });
      
      // Find teams that should get at-large bids (teams not already qualified)
      const eligibleForAtLarge = teamsInGroup.filter(team => 
        !finalAutomaticQualifiers.some(aq => aq.teamId === team.teamId)
      );
      
      // Sort by composite score for at-large bids
      const sortedForAtLarge = [...eligibleForAtLarge].sort((a, b) => 
        b.compositeScore - a.compositeScore
      );
      
      // Assign at-large bids
      const atLargeQualifiers = sortedForAtLarge.slice(0, rules.atLargeBids);
      
      atLargeQualifiers.forEach((team, index) => {
        const teamInRankings = teamsInGroup.find(t => t.teamId === team.teamId);
        if (teamInRankings) {
          teamInRankings.qualificationStatus = 'at-large';
          teamInRankings.qualificationSeed = finalAutomaticQualifiers.length + index + 1;
        }
      });
      
      // Mark all other teams as non-qualifiers
      teamsInGroup.forEach(team => {
        if (!team.qualificationStatus) {
          team.qualificationStatus = 'none';
        }
      });
    });
    
    return rankings;
  };

  return { calculateQualificationStatus };
};
