
// Types for the ranking system

export interface FlightWeight {
  singles1: number;
  singles2: number;
  doubles1: number;
  doubles2: number;
}

export interface LeagueStrengthData {
  leagueId: string;
  firstPlaceFinishes: number;
  secondPlaceFinishes: number;
  yearRange: string; // e.g., "2020-2024"
  totalPoints: number; // New field for calculating LSC
}

export interface TeamRanking {
  teamId: string;
  teamName: string;
  schoolName: string;
  gender: string;
  classification: string;
  districtName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  leagueWins: number;
  leagueLosses: number;
  leagueMatchesPlayed: number;
  flightWeightedScore: number;
  leagueStrengthCoefficient: number;
  opponentStrengthIndex: number;
  compositeScore: number;
  qualifiedForRanking: boolean; // True if team has played minimum 6 matches
  winPercentage?: number; // Added for display
  leagueWinPercentage?: number; // Added for display
}

export interface RankingConfig {
  minimumMatches: number;
  cutoffDate: string; // ISO date string
  weights: FlightWeight;
}

// Historical data for leagues and schools
export interface HistoricalData {
  leagues: LeagueStrengthData[];
  topSchools: string[]; // IDs of historically strong schools
}
