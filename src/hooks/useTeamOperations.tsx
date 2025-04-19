
import { useState } from 'react';
import { Team } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useTeamOperations = (initialTeams: Team[]) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const { toast } = useToast();
  
  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: crypto.randomUUID(),
      players: []
    };
    setTeams(prevTeams => [...prevTeams, newTeam]);
    toast({
      title: 'Team Added',
      description: `New ${newTeam.gender} team has been added successfully.`
    });
    
    return newTeam; // Return the created team
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
    toast({
      title: 'Team Deleted',
      description: `${team?.gender || 'Team'} team has been deleted successfully.`
    });
  };

  return {
    teams,
    setTeams,
    addTeam,
    updateTeam,
    deleteTeam
  };
};
