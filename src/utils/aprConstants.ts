
// Constants for Power Ranking calculation
export const APR_CONSTANTS = {
  // Maximum theoretical values
  MAX_FWS: 40, // Maximum FWS based on winning all top positions in 16 matches
  MAX_LSC: 1.85, // Highest league coefficient based on state performance
  MAX_OSI: 1.2, // Highest possible opponent strength index
  
  // Maximum possible composite score for normalization
  MAX_COMPOSITE_SCORE: 40 * 1.85 * 1.2, // ~88.8
  
  // Scale settings
  SCALE_TO_100: true, // Whether to scale to 0-100 range (true) or use raw composite (false)
  DECIMAL_PLACES: 1, // Number of decimal places to round to
  
  // Oregon High School Tennis scoring
  WEIGHTS: {
    SINGLES_1: 1.0,
    SINGLES_2: 0.75,
    SINGLES_3: 0.45,
    SINGLES_4: 0.25,
    DOUBLES_1: 1.0,
    DOUBLES_2: 0.5,
    DOUBLES_3: 0.35,
    DOUBLES_4: 0.2
  },
  
  // Win-loss-tie values
  WIN_VALUE: 1.0,
  TIE_VALUE: 0.5,
  
  // Minimum matches required
  MIN_MATCHES: 8,
  
  // WS10 factor
  WS10_MAX: 1.0, // Cap at 1.0
  WS10_DENOMINATOR: 10 // Divide wins+ties by 10
};
