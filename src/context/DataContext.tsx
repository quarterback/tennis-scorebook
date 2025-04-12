
import React, { createContext, useContext, useEffect } from 'react';
import { School, Team, Player, Match, TeamStanding, Gender, Classification, District } from '@/types';

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
  
  // School operations
  addSchool: (school: Omit<School, 'id'>) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (id: string) => void;
  
  // Team operations
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  
  // Player operations
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  getPlayerById: (id: string) => Player | undefined;
  getPlayersByTeam: (teamId: string) => Player[];
  
  // Match operations
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (match: Match) => void;
  deleteMatch: (id: string) => void;

  // District operations
  addDistrict: (district: Omit<District, 'id'>) => void;
  updateDistrict: (district: District) => void;
  deleteDistrict: (id: string) => void;
  getDistrictsByClassification: (classification: Classification) => District[];
  
  // Filtering operations
  getTeamsBySchool: (schoolId: string) => Team[];
  getMatchesByTeam: (teamId: string) => Match[];
  
  // Standings
  getStandings: (gender: Gender, classification: Classification, districtId?: string) => TeamStanding[];
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
  // Initialize all the hook operations
  const { 
    schools, setSchools, addSchool, updateSchool, deleteSchool 
  } = useSchoolOperations(sampleSchools);
  
  const { 
    teams, setTeams, addTeam, updateTeam, deleteTeam 
  } = useTeamOperations(sampleTeams);
  
  const { 
    players, addPlayer, updatePlayer, deletePlayer, getPlayerById, getPlayersByTeam, loadPlayersData
  } = usePlayersData();
  
  const { 
    matches, setMatches, addMatch, updateMatch, deleteMatch 
  } = useMatchOperations(sampleMatches);
  
  const { 
    districts, setDistricts, addDistrict, updateDistrict, deleteDistrict, getDistrictsByClassification 
  } = useDistrictOperations(sampleDistricts);
  
  // Load initial sample data
  useEffect(() => {
    loadPlayersData(samplePlayers);
  }, []);
  
  // Set up filter operations that depend on the current state
  const { 
    getTeamsBySchool, getMatchesByTeam 
  } = useFilterOperations(teams, players, matches);
  
  // Set up standings calculator
  const { getStandings } = useStandingsCalculator(teams, schools, matches, districts);
  
  // Create the context value with all operations
  const value: DataContextType = {
    schools,
    teams,
    players,
    matches,
    districts,
    
    // Export all operations
    addSchool,
    updateSchool,
    deleteSchool,
    
    addTeam,
    updateTeam,
    deleteTeam,
    
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerById,
    getPlayersByTeam,
    
    addMatch,
    updateMatch,
    deleteMatch,
    
    addDistrict,
    updateDistrict,
    deleteDistrict,
    getDistrictsByClassification,
    
    getTeamsBySchool,
    getMatchesByTeam,
    
    getStandings
  };
  
  // Handle cascade deletes for schools
  const handleSchoolDelete = (id: string) => {
    const school = schools.find(s => s.id === id);
    if (school) {
      // Delete the school
      deleteSchool(id);
      
      // Find all teams associated with this school
      const schoolTeams = teams.filter(t => t.schoolId === id);
      
      // Delete all teams
      schoolTeams.forEach(team => {
        // Delete all players associated with this team
        players.filter(p => p.teamId === team.id).forEach(player => {
          deletePlayer(player.id);
        });
        
        // Delete the team
        deleteTeam(team.id);
      });
    }
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
