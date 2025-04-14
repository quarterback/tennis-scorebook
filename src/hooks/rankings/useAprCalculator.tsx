
import { TeamRanking } from '@/types/ranking';
import { APR_CONSTANTS } from '@/utils/aprConstants';

export const useAprCalculator = () => {
  // Calculate normalized APR on 0-100 scale
  const calculateApr = (compositeScore: number): number => {
    // Normalize to 0-100 scale and round to 1 decimal
    const normalizedApr = (compositeScore / APR_CONSTANTS.MAX_POSSIBLE_SCORE) * 100;
    return Math.min(100, Math.max(0, Math.round(normalizedApr * 10) / 10));
  };

  // Calculate APR for a list of teams
  const calculateTeamAprs = (teams: TeamRanking[]): TeamRanking[] => {
    if (teams.length === 0) return [];
    
    // Calculate APR for each team using the normalized formula
    return teams.map(team => ({
      ...team,
      apr: calculateApr(team.compositeScore)
    }));
  };

  return { calculateApr, calculateTeamAprs };
};
