
export interface District {
  id: string;
  name: string;
  classification: Classification;
  // New fields for tournament scheduling
  tournamentDates?: {
    start: string;  // ISO date string
    end: string;    // ISO date string
  };
  tournamentLocation?: string;
  tournamentYear?: number;
}

export type Classification = "6A" | "5A" | "4A/3A/2A/1A";
export type Gender = "Boys" | "Girls";

export interface School {
  id: string;
  name: string;
  districtId: string;
  city: string;
  state: string;
  classification: Classification;
}

export interface Team {
  id: string;
  schoolId: string;
  gender: Gender;
  seasonId?: string;
  players?: Player[];
  roster?: Player[];
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  grade: string;
  skillRating?: number;
  singlesPreference?: number;
  doublesPreference?: number;
  isActive?: boolean;
}

export interface Match {
  id: string;
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName?: string;
  awayTeamName?: string;
  isLeagueMatch: boolean;
  isComplete: boolean;
  hasJvMatches?: boolean;
  homeTeamWon?: boolean;
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  homeTeamScore?: number;
  awayTeamScore?: number;
  flights: Flight[];
}

export interface EnhancedMatch extends Match {
  homeTeamName?: string;
  awayTeamName?: string;
}

export interface Flight {
  id?: string;
  matchId?: string;
  type: 'singles' | 'doubles';
  position: number;
  level: 'varsity' | 'jv';
  homePlayers: string[];
  awayPlayers: string[];
  sets: Set[];
  homePlayerWon?: boolean;
  retired?: boolean;
  defaulted?: boolean;
}

export interface Set {
  homeScore: number;
  awayScore: number;
  tiebreak?: {
    homeScore: number;
    awayScore: number;
  };
}

export interface MatchFormData {
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  isLeagueMatch: boolean;
  isComplete: boolean;
  hasJvMatches: boolean;
  homeTeamWon?: boolean;
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  homeTeamScore?: number;
  awayTeamScore?: number;
  flights: {
    type: 'singles' | 'doubles';
    position: number;
    level: 'varsity' | 'jv';
    homePlayers: string[];
    awayPlayers: string[];
    sets: {
      homeScore: number;
      awayScore: number;
      tiebreak?: {
        homeScore: number;
        awayScore: number;
      };
    }[];
    homePlayerWon?: boolean;
    retired?: boolean;
    defaulted?: boolean;
  }[];
}
