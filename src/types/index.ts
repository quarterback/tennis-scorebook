
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
  teams?: Team[]; // Add teams property for sample data
}

export interface Team {
  id: string;
  schoolId: string;
  gender: Gender;
  seasonId?: string;
  players?: Player[];
  roster?: Player[];
  coaches?: string[]; // Add coaches property for sample data
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  grade: string | number; // Allow both string and number for grade
  skillRating?: number;
  singlesPreference?: number;
  doublesPreference?: number;
  isActive?: boolean;
  gender?: Gender;
  seasonId?: string;
  seasons?: string[];
  previousTeams?: string[];
  status?: string;
  skillTier?: PlayerSkillTier;
  singles_preference?: number; // For backward compatibility
}

export type PlayerSkillTier = 'developmental' | 'intermediate' | 'advanced' | 'elite' | 'competitive';

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
  isTie?: boolean; // Add isTie property for simulation
  tiebreakRound?: number; // Add tiebreakRound property
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
  scoreDisplay?: string; // Add scoreDisplay property for sample data
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

// Add Season interface
export interface Season {
  id: string;
  year: number;
  name: string;
  isCurrent: boolean;
}

// Add User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'player';
  schoolId?: string;
}

// Add TeamStanding interface
export interface TeamStanding {
  teamId: string;
  teamName: string;
  schoolName: string;
  wins: number;
  losses: number;
  ties?: number;
  winPercentage: number;
  leagueWins?: number;
  leagueLosses?: number;
  leagueTies?: number;
  leagueWinPercentage?: number;
  points?: number;
  gamesPlayed?: number;
}

// Add PlayerTransfer interface
export interface PlayerTransfer {
  id: string;
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  date: string;
  reason?: string;
  approved: boolean;
}
