
import React, { createContext, useContext, useEffect } from 'react';
import { School, Team, Player, Match, TeamStanding, Gender, Classification, District, Season, PlayerTransfer } from '@/types';

// Sample data for demonstration
import { sampleSchools, sampleTeams, samplePlayers, sampleMatches, sampleDistricts } from '@/data/sampleData';

// Import the operation hooks
import { useSchoolOperations } from '@/hooks/useSchoolOperations';
import { useTeamOperations } from '@/hooks/useTeamOperations';
import { usePlayersData } from '@/hooks/usePlayersData';
import { useMatchOperations } from '@/hooks/useMatchOperations';
import { useDistrictOperations } from '@/hooks/useDistrictOperations';
import { useFilterOperations } from '@/hooks/useFilterOperations';
import { useStandingsCalculator } from '@/hooks/useStandingsCalculator';

interface DataContextType {
  schools: School[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  districts: District[];
  
  seasons: Season[];
  transfers: PlayerTransfer[];
  currentSeason: Season;
  
  addSchool: (school: Omit<School, 'id'>) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (id: string) => void;
  
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  
  addPlayer: (player: Omit<Player, 'id' | 'status' | 'seasonId'>) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  deleteAllPlayers: () => void;
  getPlayerById: (id: string) => Player | undefined;
  getPlayersByTeam: (teamId: string) => Player[];
  transferPlayer: (playerId: string, toTeamId: string) => void;
  retirePlayer: (playerId: string) => void;
  progressSeasons: () => Season;
  getArchivedSeasons: () => Season[];
  getPlayersByseason: (seasonId: string) => Player[];
  
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (match: Match) => void;
  deleteMatch: (id: string) => void;
  deleteAllMatches: () => void;

  addDistrict: (district: Omit<District, 'id'>) => void;
  updateDistrict: (district: District) => void;
  deleteDistrict: (id: string) => void;
  getDistrictsByClassification: (classification: Classification) => District[];
  
  getTeamsBySchool: (schoolId: string) => Team[];
  getMatchesByTeam: (teamId: string) => Match[];
  
  getStandings: (gender: Gender, classification: Classification, districtId?: string) => TeamStanding[];
  getStateQualifiers: (gender: Gender, classification: Classification) => TeamStanding[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const { 
    schools, setSchools, addSchool, updateSchool, deleteSchool 
  } = useSchoolOperations(sampleSchools);
  
  const { 
    teams, setTeams, addTeam, updateTeam, deleteTeam 
  } = useTeamOperations(sampleTeams);
  
  const { 
    players, addPlayer, updatePlayer, deletePlayer, getPlayerById, getPlayersByTeam, loadPlayersData,
    transfers, seasons, transferPlayer, retirePlayer, progressSeasons, getCurrentSeason, getArchivedSeasons,
    getPlayersByseason, setPlayers
  } = usePlayersData();
  
  const { 
    matches, setMatches, addMatch, updateMatch, deleteMatch 
  } = useMatchOperations(sampleMatches);
  
  const { 
    districts, setDistricts, addDistrict, updateDistrict, deleteDistrict, getDistrictsByClassification 
  } = useDistrictOperations(sampleDistricts);
  
  useEffect(() => {
    loadPlayersData(samplePlayers);
  }, []);
  
  const { 
    getTeamsBySchool, getMatchesByTeam 
  } = useFilterOperations(teams, players, matches);
  
  const { getStandings, getStateQualifiers } = useStandingsCalculator(teams, schools, matches, districts);
  
  // Add methods to clear all players and matches
  const deleteAllPlayers = () => {
    setPlayers([]);
  };
  
  const deleteAllMatches = () => {
    setMatches([]);
  };
  
  const value: DataContextType = {
    schools,
    teams,
    players,
    matches,
    districts,
    seasons,
    transfers,
    currentSeason: getCurrentSeason(),
    
    addSchool,
    updateSchool,
    deleteSchool,
    
    addTeam,
    updateTeam,
    deleteTeam,
    
    addPlayer,
    updatePlayer,
    deletePlayer,
    deleteAllPlayers,
    getPlayerById,
    getPlayersByTeam,
    transferPlayer,
    retirePlayer,
    progressSeasons,
    getArchivedSeasons,
    getPlayersByseason,
    
    addMatch,
    updateMatch,
    deleteMatch,
    deleteAllMatches,
    
    addDistrict,
    updateDistrict,
    deleteDistrict,
    getDistrictsByClassification,
    
    getTeamsBySchool,
    getMatchesByTeam,
    
    getStandings,
    getStateQualifiers
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
