
import { TeamRanking } from '@/types/ranking';

export const useAprCalculator = () => {
  // Convert raw composite score to 0-100 APR scale
  const calculateApr = (compositeScore: number, highestScore: number): number => {
    // Use the highest score as reference point for 100
    // This ensures the top team always gets 100 and others scale relative to it
    const apr = (compositeScore / highestScore) * 100;
    return Math.round(apr * 100) / 100; // Round to 2 decimal places
  };

  // Calculate APR for a list of teams
  const calculateTeamAprs = (teams: TeamRanking[]): TeamRanking[] => {
    if (teams.length === 0) return [];
    
    // Find highest composite score
    const highestScore = Math.max(...teams.map(team => team.compositeScore));
    
    // Calculate APR for each team
    return teams.map(team => ({
      ...team,
      apr: calculateApr(team.compositeScore, highestScore)
    }));
  };

  return { calculateApr, calculateTeamAprs };
};
