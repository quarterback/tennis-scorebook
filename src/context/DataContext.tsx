
import React, { createContext, useContext, useEffect, useState } from 'react';
import { School, Team, Player, Match, TeamStanding, Gender, Classification, District, Season, PlayerTransfer } from '@/types';

// Sample data for demonstration
import { sampleSchools, sampleTeams, samplePlayers, sampleMatches, sampleDistricts, sampleSeasons } from '@/data/sampleData';

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
  playerTransfers?: PlayerTransfer[];
  setPlayerTransfers?: React.Dispatch<React.SetStateAction<PlayerTransfer[]>>;
  setPlayers?: React.Dispatch<React.SetStateAction<Player[]>>;
  setSchools?: React.Dispatch<React.SetStateAction<School[]>>;
  setTeams?: React.Dispatch<React.SetStateAction<Team[]>>;
  setMatches?: React.Dispatch<React.SetStateAction<Match[]>>;
  setDistricts?: React.Dispatch<React.SetStateAction<District[]>>;
  
  addSchool: (school: Omit<School, 'id'> | School) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (id: string) => void;
  createTeamsForAllSchools: () => void;
  
  addTeam: (team: Omit<Team, 'id'>) => Team;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  
  addPlayer: (player: Omit<Player, 'id' | 'status' | 'seasonId'>) => Player;
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
  
  // Load initial districts from localStorage or fallback to sample data
  const getInitialDistricts = (): District[] => {
    try {
      const savedDistricts = localStorage.getItem('districts');
      if (savedDistricts) {
        const parsedDistricts = JSON.parse(savedDistricts);
        if (Array.isArray(parsedDistricts) && parsedDistricts.length > 0) {
          return parsedDistricts;
        }
      }
    } catch (error) {
      console.error('Error loading districts from localStorage:', error);
    }
    return sampleDistricts;
  };
  
  const { 
    schools, setSchools, addSchool: addNewSchool, updateSchool, deleteSchool, createTeamsForAllSchools 
  } = useSchoolOperations(sampleSchools);
  
  const { 
    teams, setTeams, addTeam: addNewTeam, updateTeam, deleteTeam 
  } = useTeamOperations(sampleTeams);
  
  const { 
    players, transfers, seasons, addPlayer: addNewPlayer, updatePlayer, deletePlayer, getPlayerById, 
    getPlayersByTeam, transferPlayer, retirePlayer, progressSeasons, getCurrentSeason, 
    getArchivedSeasons, getPlayersByseason, setPlayers, setPlayerTransfers
  } = usePlayersData(samplePlayers);
  
  const { 
    matches, setMatches, addMatch: addNewMatch, updateMatch, deleteMatch 
  } = useMatchOperations(sampleMatches);
  
  const { 
    districts, setDistricts, addDistrict: addNewDistrict, updateDistrict, deleteDistrict, getDistrictsByClassification 
  } = useDistrictOperations(getInitialDistricts());
  
  const { 
    getTeamsBySchool, getMatchesByTeam 
  } = useFilterOperations(teams, players, matches);
  
  const { getStandings, getStateQualifiers } = useStandingsCalculator(teams, schools, matches, districts);
  
  // Add method to create school with teams automatically
  const addSchool = (schoolData: Omit<School, 'id'> | School) => {
    // Check if this is a complete school object or just school data
    if ('id' in schoolData) {
      // This is a complete school object, we're just adding teams for it
      console.log(`Creating teams for existing school ${schoolData.name}`);
      
      const boysTeam = addNewTeam({
        schoolId: schoolData.id,
        gender: 'Boys',
        players: []
      });
      
      const girlsTeam = addNewTeam({
        schoolId: schoolData.id,
        gender: 'Girls',
        players: []
      });
      
      console.log(`Created teams for ${schoolData.name}:`, boysTeam.id, girlsTeam.id);
      return schoolData;
    } else {
      // Create new school and teams
      const newSchool = addNewSchool();
      
      if (newSchool) {
        // Automatically create boys and girls teams for this school
        const boysTeam = addNewTeam({
          schoolId: newSchool.id,
          gender: 'Boys',
          players: []
        });
        
        const girlsTeam = addNewTeam({
          schoolId: newSchool.id,
          gender: 'Girls',
          players: []
        });
        
        console.log(`Created teams for ${newSchool.name}:`, boysTeam.id, girlsTeam.id);
      }
      
      return newSchool;
    }
  };
  
  // Add methods to clear all players and matches
  const deleteAllPlayers = async () => {
    setPlayers([]);
    // Clear players from localStorage
    localStorage.removeItem('players');
    return Promise.resolve();
  };
  
  const deleteAllMatches = async () => {
    setMatches([]);
    // Clear matches from localStorage
    localStorage.removeItem('matches');
    return Promise.resolve();
  };
  
  // Fix the add player method to handle both string and number grades
  const addPlayer = (playerData: Omit<Player, 'id' | 'status' | 'seasonId'>) => {
    return addNewPlayer(playerData);
  };

  // Store schools and teams in localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('schools', JSON.stringify(schools));
      console.log(`Saved ${schools.length} schools to localStorage`);
    } catch (error) {
      console.error('Error saving schools to localStorage:', error);
    }
  }, [schools]);

  useEffect(() => {
    try {
      localStorage.setItem('teams', JSON.stringify(teams));
      console.log(`Saved ${teams.length} teams to localStorage`);
    } catch (error) {
      console.error('Error saving teams to localStorage:', error);
    }
  }, [teams]);
  
  const value: DataContextType = {
    schools,
    teams,
    players,
    matches,
    districts,
    seasons,
    transfers,
    currentSeason: getCurrentSeason(),
    playerTransfers: transfers,
    setPlayerTransfers,
    setPlayers,
    setSchools,
    setTeams,
    setMatches,
    setDistricts,
    
    addSchool,
    updateSchool,
    deleteSchool,
    createTeamsForAllSchools,
    
    addTeam: addNewTeam,
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
    
    addMatch: addNewMatch,
    updateMatch,
    deleteMatch,
    deleteAllMatches,
    
    addDistrict: addNewDistrict,
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
