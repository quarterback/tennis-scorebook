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
  qualificationStatus?: 'automatic' | 'at-large' | 'none'; // Tournament qualification status
  qualificationSeed?: number; // Seed in the tournament if qualified
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

// Player ladder position type
export interface PlayerLadderPosition {
  playerId: string;
  rank: number; // 1 = top player, 2 = second best, etc.
  previousRanks: number[]; // History of rankings for tracking movement
}

// Team ladder (ordered list of players by skill)
export interface TeamLadder {
  teamId: string;
  seasonId: string;
  rankings: PlayerLadderPosition[];
  lastUpdated: string; // ISO date
}

// Match generation configuration
export interface MatchGenerationConfig {
  startDate: string; // ISO date for season start
  endDate: string; // ISO date for season end
  maxRegularSeasonMatches: number; // Default 16
  maxTotalMatches: number; // Default 20 (including tournaments)
  doubleRoundRobin: boolean; // Whether to schedule double round-robin for districts
}

// Tournament structure
export interface TournamentStructure {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'regular' | 'championship'; // Regular or championship tournament
  teams: string[]; // Array of team IDs
  bracket: TournamentBracket;
}

// Tournament bracket
export interface TournamentBracket {
  rounds: TournamentRound[];
}

// Tournament round
export interface TournamentRound {
  name: string; // e.g., "Quarterfinals", "Semifinals", "Championship"
  matchups: TournamentMatchup[];
}

// Tournament matchup
export interface TournamentMatchup {
  id: string;
  teamOne: string; // Team ID
  teamTwo: string; // Team ID
  winner?: string; // Team ID of winner
  score?: [number, number]; // Team scores [teamOne, teamTwo]
  roundIndex?: number; // Round index for tracking progression
  matchIndex?: number; // Match index within the round
}

// Qualification rules for state tournaments
export interface ClassificationQualifications {
  classification: string;
  totalSpots: number;
  automaticBids: number; // Number of automatic bids (1 per district usually)
  atLargeBids: number; // Number of at-large bids based on rankings
}

// Team qualification status
export interface QualifiedTeam {
  teamId: string;
  teamName: string;
  schoolName: string;
  gender: string;
  districtName: string;
  qualificationType: 'automatic' | 'at-large';
  seed: number;
  compositeScore: number;
}
