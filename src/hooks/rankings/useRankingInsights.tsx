
import { TeamRanking } from '@/types/ranking';

export const useRankingInsights = () => {
  /**
   * Generate insight statistics for rankings
   */
  const generateInsights = (rankings: TeamRanking[]) => {
    // Get summary statistics for qualified teams
    const qualifiedTeams = rankings.filter(r => r.qualifiedForRanking);
    
    // Average matches played across all teams
    const avgMatches = qualifiedTeams.reduce((sum, team) => sum + team.matchesPlayed, 0) / 
      (qualifiedTeams.length || 1);
    
    // Average win percentage
    const avgWinPct = qualifiedTeams.reduce((sum, team) => sum + (team.winPercentage || 0), 0) / 
      (qualifiedTeams.length || 1);
    
    // Classification distribution
    const classificationCounts = qualifiedTeams.reduce((acc, team) => {
      acc[team.classification] = (acc[team.classification] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // District strength analysis
    const districtStrength = Object.entries(
      qualifiedTeams.reduce((acc, team) => {
        if (!acc[team.districtName]) {
          acc[team.districtName] = {
            teams: 0,
            totalComposite: 0,
            avgLSC: 0
          };
        }
        acc[team.districtName].teams++;
        acc[team.districtName].totalComposite += team.compositeScore;
        acc[team.districtName].avgLSC = team.leagueStrengthCoefficient;
        return acc;
      }, {} as Record<string, { teams: number; totalComposite: number; avgLSC: number }>)
    ).map(([district, stats]) => ({
      district,
      teams: stats.teams,
      avgComposite: stats.totalComposite / stats.teams,
      lsc: stats.avgLSC
    })).sort((a, b) => b.avgComposite - a.avgComposite);
    
    return {
      avgMatches,
      avgWinPct,
      classificationCounts,
      districtStrength,
      totalQualifiedTeams: qualifiedTeams.length,
      totalTeams: rankings.length
    };
  };
  
  /**
   * Find matchups between teams that could impact rankings
   */
  const findKeyMatchups = (rankings: TeamRanking[], limit = 5): { teamA: TeamRanking; teamB: TeamRanking; scoreDiff: number }[] => {
    const matchups: { teamA: TeamRanking; teamB: TeamRanking; scoreDiff: number }[] = [];
    
    // Find closely ranked teams
    for (let i = 0; i < rankings.length - 1; i++) {
      const teamA = rankings[i];
      const teamB = rankings[i + 1];
      
      // Only consider qualified teams
      if (!teamA.qualifiedForRanking || !teamB.qualifiedForRanking) continue;
      
      // Calculate score difference
      const scoreDiff = teamA.compositeScore - teamB.compositeScore;
      
      // Add to matchups
      matchups.push({ teamA, teamB, scoreDiff });
    }
    
    // Sort by closest scores and return top matches
    return matchups.sort((a, b) => a.scoreDiff - b.scoreDiff).slice(0, limit);
  };
  
  return {
    generateInsights,
    findKeyMatchups
  };
};
