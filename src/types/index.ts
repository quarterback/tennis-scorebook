
export type Gender = 'Boys' | 'Girls';
export type Classification = '6A' | '5A' | '4A/3A/2A/1A';

export interface District {
  id: string;
  name: string;
  classification: Classification;
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
  grade: number; // 9, 10, 11, 12
  teamId: string;
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
  homeTeamWon?: boolean;
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  flights: Flight[];
  homeTeamScore?: number; // Added for match score display
  awayTeamScore?: number; // Added for match score display
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
  gender: Gender;
  classification: Classification;
  districtName: string; // Changed from district to districtName
  overallWins: number;
  overallLosses: number;
  leagueWins: number;
  leagueLosses: number;
}

export interface MatchFormData {
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  isLeagueMatch: boolean;
  isComplete: boolean;
  hasJvMatches?: boolean;
  homeTeamWon?: boolean;
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
  }>;
}
