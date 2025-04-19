
// Adding the missing types for Flight

export type Gender = 'Boys' | 'Girls';
export type Classification = '6A' | '5A' | '4A/3A/2A/1A';
export type PlayerSkillTier = 'elite' | 'competitive' | 'developmental';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'user';
  schoolId?: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  gender: Gender;
  grade: string; // Changed from number to string
  previousTeams?: string[];
  status?: 'active' | 'retired' | 'transferred';
  skillTier?: PlayerSkillTier;
  skillRating?: number;
  singles_preference?: number;
  seasonId?: string;
  seasons?: string[];
}

export interface School {
  id: string;
  name: string;
  classification: Classification;
  districtId: string;
  city: string;
  state: string;
}

export interface District {
  id: string;
  name: string;
  classification: Classification;
  code?: string;
  tournamentDates?: {
    start: string;
    end: string;
  };
  tournamentLocation?: string;
  tournamentYear?: number;
}

export interface Team {
  id: string;
  schoolId: string;
  gender: Gender;
  players?: string[];
  coaches?: string[];
  roster?: Player[];
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  isComplete: boolean;
  isLeagueMatch: boolean;
  hasJvMatches?: boolean;
  homeTeamWon?: boolean;
  isTie?: boolean;
  homeTeamScore?: number;
  awayTeamScore?: number;
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  flights: Flight[];
  tiebreakRound?: number;
}

export interface Flight {
  id: string;
  matchId?: string;
  type: 'singles' | 'doubles';
  position: number;
  level?: 'varsity' | 'jv';
  homePlayers: string[];
  awayPlayers: string[];
  homePlayerWon?: boolean;
  sets?: Set[];
  homeScore?: number;
  awayScore?: number;
  retired?: boolean;
  defaulted?: boolean;
  scoreDisplay?: string;
  weight?: () => number;
}

export interface Set {
  homeScore: number;
  awayScore: number;
  tiebreak?: {
    homeScore: number;
    awayScore: number;
  };
}

export interface Season {
  id: string;
  name: string;
  year: number;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  schoolName: string;
  leagueStanding: number;
  wins: number;
  losses: number;
  ties: number;
  leagueWins: number;
  leagueLosses: number;
  leagueTies: number;
  winPercentage: number;
  leagueWinPercentage: number;
  classification: Classification;
  districtId?: string;
  districtName?: string;
  overallWins?: number;
  overallLosses?: number;
  qualificationStatus?: string;
  qualificationSeed?: number;
  matchesPlayed?: number;
}

export interface PlayerTransfer {
  id: string;
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  date: string;
  reason?: string;
  approved?: boolean;
}

// Add the missing MatchFormData type
export interface MatchFormData {
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  isLeagueMatch: boolean;
  isComplete: boolean;
  hasJvMatches?: boolean;
  homeTeamWon?: boolean;
  isTie?: boolean;
  homeTeamScore?: number;
  awayTeamScore?: number;
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  flights: Array<{
    type: 'singles' | 'doubles';
    position: number;
    level: 'varsity' | 'jv';
    homePlayers: string[];
    awayPlayers: string[];
    homePlayerWon?: boolean;
    sets: Set[];
    retired?: boolean;
    defaulted?: boolean;
  }>;
}
