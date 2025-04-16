
// If this file doesn't exist yet, we'll create it

import { Team, Match, School, Player, District } from './index';

export interface TeamLadder {
  teamId: string;
  seasonId: string;
  lastUpdated: string;
  rankings: PlayerLadderPosition[];
}

export interface PlayerLadderPosition {
  playerId: string;
  rank: number;
  ladderPoints: number; // Adding this property that was missing
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
  minimumMatches?: number; // Adding this property
  weights?: {
    winPercentage: number;
    opponentStrength: number;
    leagueStrength: number;
    headToHead: number;
  };
}

// Team archetypes for simulation
export type TeamArchetype = 'dominant' | 'strong' | 'mid-tier' | 'weak';

// Team strategy types
export type TeamStrategy = 'balanced' | 'singles-focused' | 'doubles-focused';

// Add TeamRanking interface
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
}

// Add the QualifiedTeam interface
export interface QualifiedTeam {
  team: TeamRanking;
  seed: number;
  qualificationType: 'automatic' | 'at-large';
}

// Add the ClassificationQualifications interface
export interface ClassificationQualifications {
  classification: string;
  totalSpots: number;
  automaticBids: number;
  atLargeBids: number;
}

// Add the HistoricalData interface
export interface HistoricalData {
  teams?: number;
  totalComposite?: number;
  avgLSC?: number;
}
