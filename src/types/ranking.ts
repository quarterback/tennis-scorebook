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
}

// Team archetypes for simulation
export type TeamArchetype = 'dominant' | 'strong' | 'mid-tier' | 'weak';

// Team strategy types
export type TeamStrategy = 'balanced' | 'singles-focused' | 'doubles-focused';
