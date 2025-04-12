
import { District } from '@/types';
import { HistoricalData } from '@/types/ranking';

export const useLeagueStrengthCoefficient = (districts: District[], historicalData: HistoricalData) => {
  /**
   * Calculate League Strength Coefficient for a district
   * Using formula: LSC = Total League Points / 10.0
   */
  const calculateLeagueStrengthCoefficient = (districtId: string): number => {
    // Map district ID to league ID in historical data
    const district = districts.find(d => d.id === districtId);
    if (!district) return 1.0;
    
    // Convert district.name to a key that matches our historicalData.leagues
    const leagueKey = district.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    
    // Find the league strength data
    const leagueData = historicalData.leagues.find(l => {
      // Try to match by district ID or constructed league key
      return l.leagueId === districtId || l.leagueId === leagueKey;
    });
    
    if (!leagueData) {
      return 1.0; // Default minimum value
    }
    
    // Calculate LSC using formula: Total Points / 10.0
    // First place = 5 points, Second place = 4 points
    const coefficient = Math.max(1.0, leagueData.totalPoints / 10.0);
    
    return coefficient;
  };
  
  return { calculateLeagueStrengthCoefficient };
};
