
// Constants for APR (Athletic Power Rating) calculation
export const APR_CONSTANTS = {
  // Base value for normalizing composite scores to a readable scale
  // This is a reference point based on a strong team's typical score
  BASE_COMPOSITE_SCORE: 25,
  
  // Multiplier to bring scores to a 0-100+ scale
  // (can exceed 100 for exceptional performances)
  SCALE_MULTIPLIER: 4,
  
  // For reference: Maximum theoretical values
  MAX_FWS: 52, // Maximum FWS based on 16 matches, winning all top positions
  MAX_LSC: 1.85, // Highest league coefficient
  MAX_OSI: 1.2, // Highest possible opponent strength
  MAX_THEORETICAL_COMPOSITE: 52 * 1.85 * 1.2 // ~115.44
};
