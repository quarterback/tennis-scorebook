
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
  ties?: number; // Optional field for ties
  leagueWins: number;
  leagueLosses: number;
  leagueTies?: number; // Optional field for league ties
  leagueMatchesPlayed: number;
  flightWeightedScore: number;
  leagueStrengthCoefficient: number;
  opponentStrengthIndex: number;
  compositeScore: number;
  qualifiedForRanking: boolean; // True if team has played minimum required matches
  winPercentage?: number; // Overall win percentage (includes ties as half-wins)
  leagueWinPercentage?: number; // League-only win percentage (includes ties as half-wins)
  qualificationStatus?: 'automatic' | 'at-large' | 'none'; // Tournament qualification status
  qualificationSeed?: number; // Seed in the tournament if qualified
  apr: number; // APR on 0-100 scale
  classificationRank?: number; // Rank within classification
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
  useNoAdScoring?: boolean; // Whether to use no-ad scoring
  useThirdSetTiebreak?: boolean; // Whether to use 10-point tiebreak for third set
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
  needsTiebreaker?: boolean; // Whether this match needs a tiebreaker (4-4 tie in playoffs)
  tiebreakResult?: {
    teamOneScore: number;
    teamTwoScore: number;
    flights: Array<{
      type: 'singles' | 'doubles';
      position: number;
      teamOneWon: boolean;
      score: string;
    }>;
  };
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

// Oregon High School Tennis-specific configuration
export interface OregonTennisConfig {
  noAdScoring: boolean; // Use no-ad scoring (first to 4 points wins game)
  setsToWin: number; // Typically 2 (best of 3)
  gamesToWinSet: number; // Typically 6 with 2-game lead
  tiebreakAt: number; // Typically 6-6
  thirdSetTiebreak: boolean; // Use 10-point tiebreak for third set
  maxSinglesFlights: number; // Typically 4
  maxDoublesFlights: number; // Typically 4
  countTiesAsHalfWin: boolean; // Count 4-4 ties as 0.5 win
  playoffTiebreaker: {
    flightCount: number; // Typically 3 (2 singles, 1 doubles)
    pointsToWin: number; // Typically 10 (with 2-point lead)
  };
}
