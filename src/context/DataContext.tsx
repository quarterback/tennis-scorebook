import React, { createContext, useContext, useState, useEffect } from 'react';
import { School, Team, Player, Match, TeamStanding, Gender, Classification, District } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Sample data for demonstration
import { sampleSchools, sampleTeams, samplePlayers, sampleMatches, sampleDistricts } from '@/data/sampleData';

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
  getPlayersByTeam: (teamId: string) => Player[];
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
  const [schools, setSchools] = useState<School[]>(sampleSchools);
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [players, setPlayers] = useState<Player[]>(samplePlayers);
  const [matches, setMatches] = useState<Match[]>(sampleMatches);
  const [districts, setDistricts] = useState<District[]>(sampleDistricts);
  const { toast } = useToast();
  
  // In a real app, this would fetch from an API
  useEffect(() => {
    // Mock loading data
    console.log('Data loaded');
  }, []);
  
  // School operations
  const addSchool = (school: Omit<School, 'id'>) => {
    const newSchool: School = {
      ...school,
      id: crypto.randomUUID(),
      teams: []
    };
    setSchools([...schools, newSchool]);
    toast({
      title: 'School Added',
      description: `${newSchool.name} has been added successfully.`
    });
  };
  
  const updateSchool = (school: School) => {
    setSchools(schools.map(s => s.id === school.id ? school : s));
    toast({
      title: 'School Updated',
      description: `${school.name} has been updated successfully.`
    });
  };
  
  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    setSchools(schools.filter(s => s.id !== id));
    // Cascade delete teams and players
    setTeams(teams.filter(t => t.schoolId !== id));
    setPlayers(players.filter(p => !teams.some(t => t.schoolId === id && t.id === p.teamId)));
    toast({
      title: 'School Deleted',
      description: `${school?.name || 'School'} has been deleted successfully.`
    });
  };
  
  // District operations
  const addDistrict = (district: Omit<District, 'id'>) => {
    const newDistrict: District = {
      ...district,
      id: crypto.randomUUID()
    };
    setDistricts([...districts, newDistrict]);
    toast({
      title: 'District Added',
      description: `${newDistrict.name} has been added successfully.`
    });
  };
  
  const updateDistrict = (district: District) => {
    setDistricts(districts.map(d => d.id === district.id ? district : d));
    toast({
      title: 'District Updated',
      description: `${district.name} has been updated successfully.`
    });
  };
  
  const deleteDistrict = (id: string) => {
    const district = districts.find(d => d.id === id);
    setDistricts(districts.filter(d => d.id !== id));
    toast({
      title: 'District Deleted',
      description: `${district?.name || 'District'} has been deleted successfully.`
    });
  };
  
  const getDistrictsByClassification = (classification: Classification) => {
    return districts.filter(district => district.classification === classification);
  };
  
  // Team operations
  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: crypto.randomUUID(),
      players: []
    };
    setTeams([...teams, newTeam]);
    toast({
      title: 'Team Added',
      description: `New ${newTeam.gender} team has been added successfully.`
    });
  };
  
  const updateTeam = (team: Team) => {
    setTeams(teams.map(t => t.id === team.id ? team : t));
    toast({
      title: 'Team Updated',
      description: `Team has been updated successfully.`
    });
  };
  
  const deleteTeam = (id: string) => {
    const team = teams.find(t => t.id === id);
    setTeams(teams.filter(t => t.id !== id));
    // Cascade delete players
    setPlayers(players.filter(p => p.teamId !== id));
    toast({
      title: 'Team Deleted',
      description: `${team?.gender || 'Team'} team has been deleted successfully.`
    });
  };
  
  // Player operations
  const addPlayer = (player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: crypto.randomUUID()
    };
    setPlayers([...players, newPlayer]);
    toast({
      title: 'Player Added',
      description: `${newPlayer.name} has been added to the roster.`
    });
  };
  
  const updatePlayer = (player: Player) => {
    setPlayers(players.map(p => p.id === player.id ? player : p));
    toast({
      title: 'Player Updated',
      description: `${player.name}'s information has been updated.`
    });
  };
  
  const deletePlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    setPlayers(players.filter(p => p.id !== id));
    toast({
      title: 'Player Removed',
      description: `${player?.name || 'Player'} has been removed from the roster.`
    });
  };
  
  // Match operations
  const addMatch = (match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...match,
      id: crypto.randomUUID()
    };
    setMatches([...matches, newMatch]);
    toast({
      title: 'Match Added',
      description: `New match has been scheduled successfully.`
    });
  };
  
  const updateMatch = (match: Match) => {
    setMatches(matches.map(m => m.id === match.id ? match : m));
    toast({
      title: 'Match Updated',
      description: `Match details have been updated successfully.`
    });
  };
  
  const deleteMatch = (id: string) => {
    setMatches(matches.filter(m => m.id !== id));
    toast({
      title: 'Match Deleted',
      description: `Match has been deleted successfully.`
    });
  };
  
  // Filtering operations
  const getTeamsBySchool = (schoolId: string) => {
    return teams.filter(team => team.schoolId === schoolId);
  };
  
  const getPlayersByTeam = (teamId: string) => {
    return players.filter(player => player.teamId === teamId);
  };
  
  const getMatchesByTeam = (teamId: string) => {
    return matches.filter(match => match.homeTeamId === teamId || match.awayTeamId === teamId);
  };
  
  // Calculate standings based on match results
  const getStandings = (gender: Gender, classification: Classification, districtId?: string): TeamStanding[] => {
    const relevantTeams = teams.filter(team => {
      const school = schools.find(s => s.id === team.schoolId);
      return team.gender === gender 
        && school?.classification === classification
        && (!districtId || school?.districtId === districtId);
    });
    
    const standings: TeamStanding[] = relevantTeams.map(team => {
      const school = schools.find(s => s.id === team.schoolId)!;
      const district = districts.find(d => d.id === school.districtId)!;
      
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      const overallWins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const overallLosses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      const leagueMatches = teamMatches.filter(m => m.isLeagueMatch);
      
      const leagueWins = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const leagueLosses = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      return {
        teamId: team.id,
        teamName: `${school.name} ${team.gender}`,
        schoolName: school.name,
        gender: team.gender,
        classification: school.classification,
        districtName: district?.name || 'Unknown District',
        overallWins,
        overallLosses,
        leagueWins,
        leagueLosses
      };
    });
    
    // Sort by league record first (wins), then overall record
    return standings.sort((a, b) => {
      if (a.leagueWins !== b.leagueWins) {
        return b.leagueWins - a.leagueWins;
      }
      if (a.leagueLosses !== b.leagueLosses) {
        return a.leagueLosses - b.leagueLosses;
      }
      if (a.overallWins !== b.overallWins) {
        return b.overallWins - a.overallWins;
      }
      return a.overallLosses - b.overallLosses;
    });
  };
  
  return (
    <DataContext.Provider value={{
      schools,
      teams,
      players,
      matches,
      districts,
      addSchool,
      updateSchool,
      deleteSchool,
      addTeam,
      updateTeam,
      deleteTeam,
      addPlayer,
      updatePlayer,
      deletePlayer,
      addMatch,
      updateMatch,
      deleteMatch,
      addDistrict,
      updateDistrict,
      deleteDistrict,
      getDistrictsByClassification,
      getTeamsBySchool,
      getPlayersByTeam,
      getMatchesByTeam,
      getStandings
    }}>
      {children}
    </DataContext.Provider>
  );
};
