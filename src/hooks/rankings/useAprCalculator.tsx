
import { TeamRanking } from '@/types/ranking';
import { APR_CONSTANTS } from '@/utils/aprConstants';

export const useAprCalculator = () => {
  // Calculate APR directly from composite score, normalized to 0-100 scale
  const calculateApr = (compositeScore: number): number => {
    // Normalize to 0-100 scale based on maximum possible score
    const normalizedApr = (compositeScore / APR_CONSTANTS.MAX_COMPOSITE_SCORE) * 100;
    
    // Round to specified decimal places and ensure non-negative
    return Math.max(0, Math.round(normalizedApr * Math.pow(10, APR_CONSTANTS.DECIMAL_PLACES)) / 
      Math.pow(10, APR_CONSTANTS.DECIMAL_PLACES));
  };

  // Calculate APR for a list of teams
  const calculateTeamAprs = (teams: TeamRanking[]): TeamRanking[] => {
    if (teams.length === 0) return [];
    
    // Calculate APR for each team using the normalization formula
    return teams.map(team => ({
      ...team,
      apr: calculateApr(team.compositeScore)
    }));
  };

  return { calculateApr, calculateTeamAprs };
};
