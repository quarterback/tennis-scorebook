
import { TeamRanking } from '@/types/ranking';
import { APR_CONSTANTS } from '@/utils/aprConstants';

export const useAprCalculator = () => {
  /**
   * Calculates the Athletic Power Rating (APR) for each team
   * Normalizes scores to a 0-100 scale for easier interpretation
   */
  const calculateTeamAprs = (rankings: TeamRanking[]): TeamRanking[] => {
    return rankings.map(team => {
      // Calculate the APR on a 0-100 scale
      let apr = 0;
      
      if (APR_CONSTANTS.SCALE_TO_100) {
        // Scale the composite score to a 0-100 range
        apr = (team.compositeScore / APR_CONSTANTS.MAX_COMPOSITE_SCORE) * 100;
        
        // Ensure the APR doesn't exceed 100
        apr = Math.min(apr, 100);
      } else {
        // Use the raw composite score
        apr = team.compositeScore;
      }
      
      // Round to specified decimal places
      apr = Number(apr.toFixed(APR_CONSTANTS.DECIMAL_PLACES));
      
      return {
        ...team,
        apr
      };
    });
  };

  return { calculateTeamAprs };
};
