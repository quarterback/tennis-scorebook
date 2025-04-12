import { District } from '@/types';
import { HistoricalData } from '@/types/ranking';

export const useLeagueStrengthCoefficient = (districts: District[], historicalData: HistoricalData) => {
  /**
   * Calculate League Strength Coefficient for a district
   * Enhanced formula: LSC = Base + (Historical Success Factor)
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
    
    // Calculate LSC using enhanced formula
    // Base (1.0) + Historical Success Factor (scaled by state championships)
    // First place finishes are worth 5 points, second place are worth 4 points
    const firstPlacePoints = leagueData.firstPlaceFinishes * 5;
    const secondPlacePoints = leagueData.secondPlaceFinishes * 4;
    const totalPoints = firstPlacePoints + secondPlacePoints;
    
    // Scale factor to keep LSC in reasonable range (1.0 - 3.0)
    const coefficient = Math.max(1.0, Math.min(3.0, totalPoints / 10.0));
    
    return coefficient;
  };
  
  return { calculateLeagueStrengthCoefficient };
};
