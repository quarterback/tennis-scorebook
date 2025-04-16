
// If this file doesn't exist yet, we'll create it

import { Team, Match, School, Player, District, Gender, Classification } from './index';

export interface TeamLadder {
  teamId: string;
  seasonId: string;
  lastUpdated: string;
  rankings: PlayerLadderPosition[];
}

export interface PlayerLadderPosition {
  playerId: string;
  rank: number;
  ladderPoints: number;
  previousRanks: number[];
}

export interface MatchGenerationConfig {
  startDate: string;
  endDate: string;
  doubleRoundRobin: boolean;
}

export interface RankingConfig {
  cutoffDate: string;
  includeAllMatches?: boolean;
  includeNonLeagueMatches?: boolean;
  minimumMatches?: number;
  weights?: {
    winPercentage: number;
    opponentStrength: number;
    leagueStrength: number;
    headToHead: number;
    singles1?: number;
    singles2?: number;
    doubles1?: number;
    doubles2?: number;
  };
}

// Team archetypes for simulation
export type TeamArchetype = 'dominant' | 'strong' | 'mid-tier' | 'weak';

// Team strategy types
export type TeamStrategy = 'balanced' | 'singles-focused' | 'doubles-focused';

// Updated TeamRanking interface with all required properties
export interface TeamRanking {
  teamId: string;
  teamName: string;
  schoolName: string;
  schoolId: string;
  classification: string;
  districtName: string;
  gender: string;
  winPercentage?: number;
  leagueWinPercentage?: number;
  compositeScore: number;
  apr: number;
  classificationRank: number;
  qualificationStatus?: 'automatic' | 'at-large' | 'none';
  qualificationSeed?: number;
  
  // Add missing properties referenced in components
  wins?: number;
  losses?: number;
  ties?: number;
  leagueWins?: number;
  leagueLosses?: number;
  leagueTies?: number;
  matchesPlayed?: number;
  leagueMatchesPlayed?: number;
  qualifiedForRanking?: boolean;
  flightWeightedScore?: number;
  leagueStrengthCoefficient?: number;
  opponentStrengthIndex?: number;
}

// Updated QualifiedTeam interface
export interface QualifiedTeam {
  team: TeamRanking;
  seed: number;
  qualificationType: 'automatic' | 'at-large';
  
  // For backward compatibility with code that directly accesses these properties
  teamId?: string;
  teamName?: string;
  schoolName?: string;
  districtName?: string;
  gender?: Gender;
  compositeScore?: number;
}

export interface ClassificationQualifications {
  classification: string;
  totalSpots: number;
  automaticBids: number;
  atLargeBids: number;
}

export interface HistoricalData {
  teams?: number;
  totalComposite?: number;
  avgLSC?: number;
  
  // Add missing properties referenced in the hooks
  leagues?: Array<{
    leagueId: string;
    firstPlaceFinishes: number;
    secondPlaceFinishes: number;
    yearRange: string;
    totalPoints: number;
  }>;
  topSchools?: string[];
}
