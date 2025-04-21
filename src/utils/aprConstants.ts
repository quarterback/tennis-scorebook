
// Constants for Power Ranking calculation
export const APR_CONSTANTS = {
  // Flight weights
  WEIGHTS: {
    SINGLES_1: 1.00,
    SINGLES_2: 0.75,
    SINGLES_3: 0.40,
    SINGLES_4: 0.00, // Not counted in APR
    DOUBLES_1: 1.00,
    DOUBLES_2: 0.50,
    DOUBLES_3: 0.30,
    DOUBLES_4: 0.00  // Not counted in APR
  },
  
  // Win-loss-tie values
  WIN_VALUE: 1.0,
  TIE_VALUE: 0.5,
  
  // Minimum matches required to be ranked
  MIN_MATCHES: 6,
  
  // WS10 parameters
  TOP_MATCHES_COUNT: 10,
  
  // OSI scaling parameters
  OSI_TARGET_MEDIAN: 1.0,
  
  // Decimal places for display
  DECIMAL_PLACES: 2
};
