
// Constants for the APR ranking system

import { RankingConfig, HistoricalData } from '@/types/ranking';

// Fixed weights for flights based on Oregon high school tennis
export const FLIGHT_WEIGHTS = {
  singles1: 1.0,
  singles2: 0.75,
  singles3: 0.4,
  singles4: 0.2,
  doubles1: 1.0,
  doubles2: 0.5,
  doubles3: 0.2,
  doubles4: 0.1
};

export const APR_CONSTANTS = {
  MAX_COMPOSITE_SCORE: 30, // Maximum possible composite score
  DECIMAL_PLACES: 1, // Round APR to 1 decimal place
  SCALE_TO_100: true, // Scale APR to 0-100
  MIN_MATCHES: 8, // Minimum matches required for ranking
  TIE_VALUE: 0.5 // Value of a tie (half a win)
};

// Tennis scoring constants
export const TENNIS_SCORING = {
  NO_AD: true, // Using no-ad scoring (first to 4 points wins game)
  SETS_TO_WIN: 2, // Best-of-3 sets
  GAMES_TO_WIN_SET: 6, // First to 6 games with 2-game lead
  TIEBREAK_AT: 6, // Play tiebreak at 6-6
  THIRD_SET_TIEBREAK: true, // Use 10-point tiebreak for third set
  PLAYOFF_TIEBREAKER: {
    FLIGHTS: 3, // 3 flights for playoff tiebreaker
    POINTS_TO_WIN: 10, // First to 10 points with 2-point lead
    WIN_BY: 2 // Must win by 2 points
  }
};

export const getDefaultConfig = (): RankingConfig => {
  const today = new Date();
  const cutoffDate = new Date(today);
  
  // Set default cutoff as today
  const defaultConfig: RankingConfig = {
    minimumMatches: APR_CONSTANTS.MIN_MATCHES,
    cutoffDate: cutoffDate.toISOString().split('T')[0],
    weights: {
      winPercentage: 0.5,
      opponentStrength: 0.3,
      leagueStrength: 0.1,
      headToHead: 0.1,
      singles1: FLIGHT_WEIGHTS.singles1,
      singles2: FLIGHT_WEIGHTS.singles2,
      doubles1: FLIGHT_WEIGHTS.doubles1,
      doubles2: FLIGHT_WEIGHTS.doubles2
    }
  };
  
  return defaultConfig;
};

// Historical data for league strength and school performance
export const getHistoricalData = (): HistoricalData => {
  return {
    leagues: [
      {
        leagueId: "metro",
        firstPlaceFinishes: 8,
        secondPlaceFinishes: 5,
        yearRange: "2015-2024",
        totalPoints: 21
      },
      {
        leagueId: "threerivers",
        firstPlaceFinishes: 5,
        secondPlaceFinishes: 7,
        yearRange: "2015-2024",
        totalPoints: 17
      },
      {
        leagueId: "mthood",
        firstPlaceFinishes: 3,
        secondPlaceFinishes: 3,
        yearRange: "2015-2024",
        totalPoints: 9
      },
      {
        leagueId: "pacificnw",
        firstPlaceFinishes: 2,
        secondPlaceFinishes: 2,
        yearRange: "2015-2024",
        totalPoints: 6
      },
      {
        leagueId: "southwest",
        firstPlaceFinishes: 2,
        secondPlaceFinishes: 1,
        yearRange: "2015-2024",
        totalPoints: 5
      }
    ],
    topSchools: [
      "jesuit",
      "lincoln",
      "sunset",
      "lakeridge",
      "summit",
      "westview",
      "lake-oswego",
      "central-catholic",
      "south-eugene",
      "sprague"
    ]
  };
};

// Format tennis score properly (e.g., "6-4, 7-5" or "4-6, 6-4, 10-8")
export const formatTennisScore = (sets: { homeScore: number; awayScore: number; tiebreak?: { homeScore: number; awayScore: number } }[]): string => {
  if (!sets || sets.length === 0) return "";
  
  return sets.map(set => {
    let score = `${set.homeScore}-${set.awayScore}`;
    if (set.tiebreak) {
      score += ` (${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`;
    }
    return score;
  }).join(", ");
};
