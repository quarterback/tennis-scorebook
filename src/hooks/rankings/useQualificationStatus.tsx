
import { TeamRanking, ClassificationQualifications } from '@/types/ranking';

export const useQualificationStatus = () => {
  const calculateQualificationStatus = (
    rankings: TeamRanking[], 
    qualificationRules: ClassificationQualifications[]
  ): TeamRanking[] => {
    const teamsByClassAndGender: Record<string, TeamRanking[]> = {};
    
    rankings.forEach(team => {
      const key = `${team.classification}-${team.gender}`;
      if (!teamsByClassAndGender[key]) {
        teamsByClassAndGender[key] = [];
      }
      teamsByClassAndGender[key].push(team);
    });
    
    Object.entries(teamsByClassAndGender).forEach(([key, teamsInClass]) => {
      const [classification] = key.split('-');
      
      const rules = qualificationRules.find(r => r.classification === classification) || {
        classification,
        totalSpots: 8,
        automaticBids: 4,
        atLargeBids: 4
      };
      
      const topTeamByDistrict: Map<string, TeamRanking> = new Map();
      const teamsByDistrict: Record<string, TeamRanking[]> = {};
      
      teamsInClass.forEach(team => {
        if (!teamsByDistrict[team.districtName]) {
          teamsByDistrict[team.districtName] = [];
        }
        teamsByDistrict[team.districtName].push(team);
      });
      
      Object.entries(teamsByDistrict).forEach(([district, districtTeams]) => {
        const sortedTeams = [...districtTeams].sort((a, b) => b.compositeScore - a.compositeScore);
        if (sortedTeams.length > 0) {
          topTeamByDistrict.set(district, sortedTeams[0]);
        }
      });
      
      let automaticQualifiers = Array.from(topTeamByDistrict.values());
      automaticQualifiers.sort((a, b) => b.compositeScore - a.compositeScore);
      automaticQualifiers = automaticQualifiers.slice(0, rules.automaticBids);
      
      automaticQualifiers.forEach((team, index) => {
        const teamInRankings = teamsInClass.find(t => t.teamId === team.teamId);
        if (teamInRankings) {
          teamInRankings.qualificationStatus = 'automatic';
          teamInRankings.qualificationSeed = index + 1;
        }
      });
      
      const eligibleForAtLarge = teamsInClass.filter(team => 
        !automaticQualifiers.some(aq => aq.teamId === team.teamId)
      );
      
      const sortedForAtLarge = [...eligibleForAtLarge].sort((a, b) => 
        b.compositeScore - a.compositeScore
      );
      
      const atLargeQualifiers = sortedForAtLarge.slice(0, rules.atLargeBids);
      
      atLargeQualifiers.forEach((team, index) => {
        const teamInRankings = teamsInClass.find(t => t.teamId === team.teamId);
        if (teamInRankings) {
          teamInRankings.qualificationStatus = 'at-large';
          teamInRankings.qualificationSeed = automaticQualifiers.length + index + 1;
        }
      });
    });
    
    return rankings;
  };

  return { calculateQualificationStatus };
};
