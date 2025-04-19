
import { useState } from 'react';
import { Player, Gender } from '@/types';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';

export const usePlayerManagement = (selectedTeamId: string | null) => {
  const { addPlayer, teams, currentSeason } = useData();
  const { toast } = useToast();
  
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [playerFormData, setPlayerFormData] = useState<Omit<Player, 'id' | 'status' | 'seasonId'>>({
    name: '',
    grade: 9,
    teamId: '',
    seasons: [],
    gender: 'Boys'
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
    
    addPlayer({
      name: playerFormData.name,
      grade: playerFormData.grade,
      teamId: selectedTeamId,
      seasons: [currentSeason?.id || ''],
      gender: selectedTeam.gender
    });
    
    setPlayerFormData(prev => ({
      ...prev,
      name: '',
      grade: 9
    }));
    
    setIsAddPlayerDialogOpen(false);
    
    toast({
      title: "Player Added",
      description: `${playerFormData.name} has been added to the team roster`,
    });
  };

  return {
    isAddPlayerDialogOpen,
    setIsAddPlayerDialogOpen,
    playerFormData,
    setPlayerFormData,
    handleAddPlayer
  };
};
