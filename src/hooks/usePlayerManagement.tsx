
import { useState } from 'react';
import { Player } from '@/types';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';

export const usePlayerManagement = (selectedTeamId: string | null) => {
  const { addPlayer, teams, currentSeason } = useData();
  const { toast } = useToast();
  
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [playerFormData, setPlayerFormData] = useState<Omit<Player, 'id' | 'status' | 'seasonId'>>({
    name: '',
    grade: '9', // Changed to string to match type
    teamId: '',
    gender: 'Boys',
    previousTeams: [],
    seasons: []
  });

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeamId) {
      toast({
        title: "Error",
        description: "No team selected",
        variant: "destructive"
      });
      return;
    }
    
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) {
      toast({
        title: "Error",
        description: "Selected team not found",
        variant: "destructive"
      });
      return;
    }
    
    // Create new player with current team ID
    const newPlayer = addPlayer({
      name: playerFormData.name,
      grade: playerFormData.grade,
      teamId: selectedTeamId,
      gender: selectedTeam.gender,
      previousTeams: [],
      seasons: [currentSeason?.id || '']
    });
    
    // Reset form
    setPlayerFormData(prev => ({
      ...prev,
      name: '',
      grade: '9'
    }));
    
    setIsAddPlayerDialogOpen(false);
    
    toast({
      title: "Player Added",
      description: `${playerFormData.name} has been added to the team roster`,
    });
    
    console.log("Added new player:", newPlayer);
  };

  return {
    isAddPlayerDialogOpen,
    setIsAddPlayerDialogOpen,
    playerFormData,
    setPlayerFormData,
    handleAddPlayer
  };
};
