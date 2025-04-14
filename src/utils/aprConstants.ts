
// Constants for Power Ranking calculation
export const APR_CONSTANTS = {
  // Maximum theoretical values
  MAX_FWS: 52, // Maximum FWS based on winning all top positions in 16 matches
  MAX_LSC: 1.85, // Highest league coefficient based on state performance
  MAX_OSI: 1.2, // Highest possible opponent strength index
  
  // Maximum possible composite score for normalization
  MAX_COMPOSITE_SCORE: 52 * 1.85 * 1.2, // ~115.44
  
  // Scale settings
  SCALE_TO_100: true, // Whether to scale to 0-100 range (true) or use raw composite (false)
  DECIMAL_PLACES: 1 // Number of decimal places to round to
};
