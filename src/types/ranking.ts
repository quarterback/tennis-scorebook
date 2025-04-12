
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
  totalPoints: number; // Combined points for calculating LSC
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
  qualifiedForRanking: boolean; // True if team has played minimum required matches
  winPercentage?: number; // Overall win percentage
  leagueWinPercentage?: number; // League-only win percentage
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

// Power ranking info for pre-season predictions
export interface PowerRanking {
  teamId: string;
  preseasonRank: number;
  expectedFinish: string;
  strengthRating: number;
}

// Key matchup information
export interface KeyMatchup {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  significance: string;
}

// Ranking insights type
export interface RankingInsight {
  avgMatches: number;
  avgWinPct: number;
  classificationCounts: Record<string, number>;
  districtStrength: Array<{
    district: string;
    teams: number;
    avgComposite: number;
    lsc: number;
  }>;
  totalQualifiedTeams: number;
  totalTeams: number;
  leagueInsights?: {
    avgLeagueMatches: number;
    avgLeagueWinPct: number;
  };
}
