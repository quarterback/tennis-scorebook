
import { TeamRanking } from '@/types/ranking';
import { APR_CONSTANTS } from '@/utils/aprConstants';

export const useAprCalculator = () => {
  // Calculate APR directly from composite score, with a more presentable scale
  // that allows exceeding 100 for exceptional performances
  const calculateApr = (compositeScore: number): number => {
    // Scale based on typical composite scores, allowing to exceed 100
    // for exceptional teams
    const scaledApr = (compositeScore / APR_CONSTANTS.BASE_COMPOSITE_SCORE) * APR_CONSTANTS.SCALE_MULTIPLIER * 100;
    
    // Round to 1 decimal and ensure non-negative
    return Math.max(0, Math.round(scaledApr * 10) / 10);
  };

  // Calculate APR for a list of teams
  const calculateTeamAprs = (teams: TeamRanking[]): TeamRanking[] => {
    if (teams.length === 0) return [];
    
    // Calculate APR for each team using the direct scaling formula
    return teams.map(team => ({
      ...team,
      apr: calculateApr(team.compositeScore)
    }));
  };

  return { calculateApr, calculateTeamAprs };
};
