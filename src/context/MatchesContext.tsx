import React, { createContext, useContext, useState } from 'react';
import { Match, Team, School, Player, MatchFormData } from '@/types';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import useMatchFunctions from '@/hooks/useMatchFunctions';

interface MatchesContextType {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMatch: Match | null;
  setSelectedMatch: React.Dispatch<React.SetStateAction<Match | null>>;
  expandedMatchId: string | null;
  setExpandedMatchId: React.Dispatch<React.SetStateAction<string | null>>;
  matchFormData: MatchFormData;
  setMatchFormData: React.Dispatch<React.SetStateAction<MatchFormData>>;
  filteredMatches: Match[];
  filteredTeams: Team[];
  schools: School[];
  teams: Team[];
  players: Player[];
  getTeamName: (teamId: string) => string;
  getTeamPlayersForSelect: (teamId: string) => { id: string; name: string }[];
  handleAddMatchSubmit: (e: React.FormEvent) => void;
  handleEditMatchSubmit: (e: React.FormEvent) => void;
  openEditDialog: (match: Match) => void;
  canEditMatch: (match: Match) => boolean;
  canApproveMatch: (match: Match, team: 'home' | 'away') => boolean;
  approveMatch: (matchId: string, team: 'home' | 'away') => void;
  isCoachOfTeam: (teamId: string) => boolean;
  resetMatchForm: () => void;
  handleFlightPlayerChange: (flightIndex: number, team: 'home' | 'away', playerIndex: number, playerId: string) => void;
  handleSetScoreChange: (flightIndex: number, setIndex: number, team: 'home' | 'away', score: number) => void;
  handleTiebreakScoreChange: (flightIndex: number, setIndex: number, team: 'home' | 'away', score: number) => void;
  toggleTiebreak: (flightIndex: number, setIndex: number) => void;
  addSet: (flightIndex: number) => void;
  removeSet: (flightIndex: number, setIndex: number) => void;
  calculateTeamWinner: () => void;
  addNewFlight: (type: 'singles' | 'doubles', level: 'varsity' | 'jv') => void;
  toggleJvMatches: () => void;
  toggleApproval: (team: 'home' | 'away') => void;
  toggleFlightRetired: (flightIndex: number) => void;
  toggleFlightDefaulted: (flightIndex: number) => void;
  updateTeamScores: (homeScore: number, awayScore: number) => void;
}

const MatchesContext = createContext<MatchesContextType | null>(null);

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
};

export const MatchesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { schools, teams, players, matches, addMatch, updateMatch } = useData();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  
  const initialFlights = [
    { type: 'singles' as const, position: 1, level: 'varsity' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles' as const, position: 2, level: 'varsity' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles' as const, position: 3, level: 'varsity' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'doubles' as const, position: 1, level: 'varsity' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'doubles' as const, position: 2, level: 'varsity' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles' as const, position: 1, level: 'jv' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles' as const, position: 2, level: 'jv' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'doubles' as const, position: 1, level: 'jv' as const, homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] }
  ];
  
  const {
    matchFormData,
    setMatchFormData,
    handleFlightPlayerChange,
    handleSetScoreChange,
    handleTiebreakScoreChange,
    toggleTiebreak,
    addSet,
    removeSet,
    calculateTeamWinner,
    resetMatchForm: resetForm,
    addNewFlight,
    toggleJvMatches,
    toggleApproval,
    toggleFlightRetired,
    toggleFlightDefaulted,
    updateTeamScores
  } = useMatchFunctions(initialFlights);

  const resetMatchForm = () => resetForm(today);

  const filteredMatches = user?.role === 'coach' && user.schoolId
    ? matches.filter(match => {
        const homeTeam = teams.find(t => t.id === match.homeTeamId);
        const awayTeam = teams.find(t => t.id === match.awayTeamId);
        return homeTeam?.schoolId === user.schoolId || awayTeam?.schoolId === user.schoolId;
      })
    : matches;
  
  const filteredTeams = user?.role === 'coach' && user.schoolId
    ? teams.filter(team => team.schoolId === user.schoolId)
    : teams;
  
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'Unknown Team';
    
    const school = schools.find(s => s.id === team.schoolId);
    return `${school?.name || 'Unknown'} ${team.gender}`;
  };
  
  const getTeamPlayersForSelect = (teamId: string) => {
    if (!teamId) return [];
    
    return players
      .filter(p => p.teamId === teamId)
      .map(p => ({ id: p.id, name: p.name }));
  };
  
  const isCoachOfTeam = (teamId: string) => {
    if (user?.role !== 'coach' || !user.schoolId) return false;
    return teams.some(t => t.id === teamId && t.schoolId === user.schoolId);
  };
  
  const canApproveMatch = (match: Match, team: 'home' | 'away') => {
    if (!match.isComplete) return false;
    if (user?.role === 'admin') return true;
    
    const teamId = team === 'home' ? match.homeTeamId : match.awayTeamId;
    return isCoachOfTeam(teamId);
  };
  
  const approveMatch = (matchId: string, team: 'home' | 'away') => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    const updatedMatch = {
      ...match,
      [team === 'home' ? 'homeCoachApproved' : 'awayCoachApproved']: 
        !match[team === 'home' ? 'homeCoachApproved' : 'awayCoachApproved']
    };
    
    updateMatch(updatedMatch);
  };
  
  const handleAddMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMatchId = crypto.randomUUID();
    
    const newFlights = matchFormData.flights.map(flight => ({
      ...flight,
      id: crypto.randomUUID(),
      matchId: newMatchId
    }));
    
    addMatch({
      date: matchFormData.date,
      homeTeamId: matchFormData.homeTeamId,
      awayTeamId: matchFormData.awayTeamId,
      isLeagueMatch: matchFormData.isLeagueMatch,
      isComplete: matchFormData.isComplete,
      hasJvMatches: matchFormData.hasJvMatches,
      homeTeamWon: matchFormData.homeTeamWon,
      homeCoachApproved: false,
      awayCoachApproved: false,
      homeTeamScore: matchFormData.homeTeamScore,
      awayTeamScore: matchFormData.awayTeamScore,
      flights: newFlights
    });
    
    resetMatchForm();
    setIsAddDialogOpen(false);
  };
  
  const handleEditMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMatch) {
      const updatedFlights = matchFormData.flights.map((formFlight) => {
        const existingFlight = selectedMatch.flights.find(
          f => f.type === formFlight.type && 
              f.position === formFlight.position && 
              f.level === formFlight.level
        );
        
        return {
          ...formFlight,
          id: existingFlight?.id || crypto.randomUUID(),
          matchId: selectedMatch.id
        };
      });
      
      updateMatch({
        ...selectedMatch,
        date: matchFormData.date,
        homeTeamId: matchFormData.homeTeamId,
        awayTeamId: matchFormData.awayTeamId,
        isLeagueMatch: matchFormData.isLeagueMatch,
        isComplete: matchFormData.isComplete,
        hasJvMatches: matchFormData.hasJvMatches,
        homeTeamWon: matchFormData.homeTeamWon,
        homeCoachApproved: matchFormData.homeCoachApproved,
        awayCoachApproved: matchFormData.awayCoachApproved,
        homeTeamScore: matchFormData.homeTeamScore,
        awayTeamScore: matchFormData.awayTeamScore,
        flights: updatedFlights
      });
      
      setIsEditDialogOpen(false);
      setSelectedMatch(null);
    }
  };
  
  const openEditDialog = (match: Match) => {
    setSelectedMatch(match);
    
    setMatchFormData({
      date: match.date,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      isLeagueMatch: match.isLeagueMatch,
      isComplete: match.isComplete,
      hasJvMatches: match.hasJvMatches || false,
      homeTeamWon: match.homeTeamWon,
      homeCoachApproved: match.homeCoachApproved,
      awayCoachApproved: match.awayCoachApproved,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      flights: match.flights.map(flight => ({
        type: flight.type,
        position: flight.position,
        level: flight.level,
        homePlayers: flight.homePlayers,
        awayPlayers: flight.awayPlayers,
        sets: flight.sets,
        homePlayerWon: flight.homePlayerWon,
        retired: flight.retired,
        defaulted: flight.defaulted
      }))
    });
    
    setIsEditDialogOpen(true);
  };
  
  const canEditMatch = (match: Match) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'coach' && user.schoolId) {
      const homeTeam = teams.find(t => t.id === match.homeTeamId);
      const awayTeam = teams.find(t => t.id === match.awayTeamId);
      return homeTeam?.schoolId === user.schoolId || awayTeam?.schoolId === user.schoolId;
    }
    return false;
  };

  const value: MatchesContextType = {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedMatch,
    setSelectedMatch,
    expandedMatchId,
    setExpandedMatchId,
    matchFormData,
    setMatchFormData,
    filteredMatches,
    filteredTeams,
    schools,
    teams,
    players,
    getTeamName,
    getTeamPlayersForSelect,
    handleAddMatchSubmit,
    handleEditMatchSubmit,
    openEditDialog,
    canEditMatch,
    canApproveMatch,
    approveMatch,
    isCoachOfTeam,
    resetMatchForm,
    handleFlightPlayerChange,
    handleSetScoreChange,
    handleTiebreakScoreChange,
    toggleTiebreak,
    addSet,
    removeSet,
    calculateTeamWinner,
    addNewFlight,
    toggleJvMatches,
    toggleApproval,
    toggleFlightRetired,
    toggleFlightDefaulted,
    updateTeamScores
  };

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
};
