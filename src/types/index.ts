
export type Gender = 'Boys' | 'Girls';
export type PlayerSkillTier = 'elite' | 'competitive' | 'developmental';
export type Classification = '6A' | '5A' | '4A/3A/2A/1A';

export interface District {
  id: string;
  name: string;
  classification: Classification;
}

export type PlayerStatus = 'active' | 'retired' | 'transferred';

export interface Season {
  id: string;
  year: number;
  name: string; // e.g., "Fall 2024", "Spring 2025"
  isCurrent: boolean;
}

export interface School {
  id: string;
  name: string;
  classification: Classification;
  districtId: string; // Changed from district string to districtId reference
  teams: Team[];
}

export interface Team {
  id: string;
  schoolId: string;
  gender: Gender;
  players: Player[];
  coaches: string[]; // User IDs of coaches
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  gender: Gender;
  grade: number; // 9, 10, 11, 12
  seasonId: string; // The current season ID
  skillTier?: PlayerSkillTier; // Optional to maintain compatibility with existing data
  skillRating?: number; // Player's skill rating on a scale of 1-10
  singles_preference?: number; // Preference for singles (0-1, higher means prefers singles)
  previousTeams?: string[]; // Array of previous team IDs
  status?: PlayerStatus;
  seasons?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach';
  schoolId?: string; // Only for coaches
}

export interface Match {
  id: string;
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  isLeagueMatch: boolean;
  isComplete: boolean;
  hasJvMatches?: boolean;
  homeTeamWon?: boolean; // May be undefined for ties
  isTie?: boolean; // New field to explicitly mark 4-4 ties
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  flights: Flight[];
  homeTeamScore?: number; // Added for match score display
  awayTeamScore?: number; // Added for match score display
  tiebreakRound?: TiebreakRound; // New field for playoff tiebreaker
}

export interface TiebreakRound {
  flights: [
    { type: 'singles'; position: 1 | 2 | 3 | 4; homePlayerWon?: boolean; score?: string },
    { type: 'singles'; position: 1 | 2 | 3 | 4; homePlayerWon?: boolean; score?: string },
    { type: 'doubles'; position: 1 | 2 | 3 | 4; homePlayerWon?: boolean; score?: string }
  ];
  homeTeamWon?: boolean;
  isComplete?: boolean;
}

export interface Flight {
  id: string;
  matchId: string;
  type: 'singles' | 'doubles';
  position: number; // 1st singles, 2nd singles, etc.
  level: 'varsity' | 'jv';
  homePlayers: string[]; // Player IDs (1 for singles, 2 for doubles)
  awayPlayers: string[];
  sets: Set[];
  homePlayerWon?: boolean;
  retired?: boolean; // New field for player retired/quit early
  defaulted?: boolean; // New field for forfeit/default
  scoreDisplay?: string; // New field for formatted score display (e.g., "6-4, 7-5")
}

export interface Set {
  homeScore: number;
  awayScore: number;
  tiebreak?: {
    homeScore: number;
    awayScore: number;
  };
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  schoolName: string;
  gender: string;
  classification: string;
  districtName: string;
  overallWins: number;
  overallLosses: number;
  overallTies: number; // Added to support ties (counts as 0.5 win)
  leagueWins: number;
  leagueLosses: number;
  leagueTies: number; // Added to support ties (counts as 0.5 win)
  overallWinPct: number; // Calculate including ties as half-wins
  leagueWinPct: number; // Calculate including ties as half-wins
  qualificationStatus?: 'automatic' | 'at-large' | 'none';
  qualificationSeed?: number;
}

export interface MatchFormData {
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  isLeagueMatch: boolean;
  isComplete: boolean;
  hasJvMatches?: boolean;
  homeTeamWon?: boolean;
  isTie?: boolean; // Added to support ties
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  homeTeamScore?: number;
  awayTeamScore?: number;
  flights: Array<{
    type: 'singles' | 'doubles';
    position: number;
    level: 'varsity' | 'jv';
    homePlayers: string[];
    awayPlayers: string[];
    sets: Set[];
    homePlayerWon?: boolean;
    retired?: boolean;
    defaulted?: boolean;
    scoreDisplay?: string; // New field for formatted score display
  }>;
  tiebreakRound?: TiebreakRound; // For playoffs
}

export interface PlayerTransfer {
  id: string;
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  date: string;
  seasonId: string;
}
