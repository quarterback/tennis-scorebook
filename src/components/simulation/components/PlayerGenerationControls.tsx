
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Eraser } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/DataContext';
import { Player, PlayerSkillTier, Season, Team } from '@/types';

interface PlayerGenerationControlsProps {
  isGeneratingPlayers: boolean;
  selectedSeasonId: string;
  seasons: Season[];
  disabled?: boolean;
  setIsGeneratingPlayers: (state: boolean) => void;
}

const PlayerGenerationControls: React.FC<PlayerGenerationControlsProps> = ({
  isGeneratingPlayers,
  selectedSeasonId,
  seasons,
  disabled = false,
  setIsGeneratingPlayers
}) => {
  const { toast } = useToast();
  const { teams, players, addPlayer, deleteAllPlayers, schools } = useData();
  const [generatingStatus, setGeneratingStatus] = useState<string>('');
  
  const handleGeneratePlayers = async () => {
    // Check if we have teams available
    if (teams.length === 0) {
      toast({
        title: "No Teams Available",
        description: "There are no teams available to generate players for. Please create teams first.",
        variant: "destructive"
      });
      return;
    }

    // Import needed hook dynamically to avoid circular dependencies
    setGeneratingStatus('Importing player generation utilities...');
    setIsGeneratingPlayers(true);
    
    // Log the team data to help debug
    console.log("Teams data before player generation:", teams);
    console.log("Schools data before player generation:", schools);
    
    try {
      // Clear existing players first
      await deleteAllPlayers();
      
      // Move the dynamic import and generation logic outside conditional blocks to avoid React Hook errors
      const { usePlayerGeneration } = await import('@/hooks/usePlayerGeneration');
      const { generatePlayerData } = usePlayerGeneration();
      
      setGeneratingStatus('Generating players...');
      const selectedSeason = seasons.find(s => s.id === selectedSeasonId) || {
        id: crypto.randomUUID(),
        year: new Date().getFullYear(),
        name: `Spring ${new Date().getFullYear()}`,
        isCurrent: true
      };
      
      // Generate players for all available teams
      const { players: generatedPlayers } = generatePlayerData(teams, schools, selectedSeason.id);
      
      // Add all generated players to the state
      generatedPlayers.forEach(player => {
        addPlayer(player);
      });
      
      setGeneratingStatus('');
      
      toast({
        title: "Player Generation Complete",
        description: `Generated ${generatedPlayers.length} players for ${teams.length} teams successfully`,
        variant: "default"
      });
      
      console.log(`Generated ${generatedPlayers.length} players for ${teams.length} teams successfully`);
    } catch (error) {
      console.error('Error generating players:', error);
      setGeneratingStatus('');
      toast({
        title: "Error Generating Players",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPlayers(false);
    }
  };

  const handleAddPlayersToAllTeams = () => {
    // Check if we have teams available
    if (teams.length === 0) {
      toast({
        title: "No Teams Available",
        description: "There are no teams available to add players to. Please create teams first.",
        variant: "destructive"
      });
      return;
    }
    
    const currentSeason = seasons.find(s => s.id === selectedSeasonId) || {
      id: crypto.randomUUID(),
      year: new Date().getFullYear(),
      name: `Spring ${new Date().getFullYear()}`,
      isCurrent: true
    };
    
    console.log(`Adding players to ${teams.length} teams:`, teams);
    
    let playersAdded = 0;
    
    teams.forEach(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      const playersNeeded = 12 - teamPlayers.length;
      
      if (playersNeeded > 0) {
        for (let i = 0; i < playersNeeded; i++) {
          const newPlayer: Omit<Player, "id"> = {
            name: `${team.gender === 'Boys' ? 'Player' : 'Player'} ${Math.floor(Math.random() * 100)}`,
            grade: Math.floor(Math.random() * 4) + 9,
            teamId: team.id,
            seasonId: currentSeason.id,
            seasons: [currentSeason.id],
            skillTier: 'developmental' as PlayerSkillTier,
            gender: team.gender
          };
          addPlayer(newPlayer);
          playersAdded++;
        }
      }
    });
    
    toast({
      title: "Players Added",
      description: `Added ${playersAdded} players to ${teams.length} teams that needed them`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={handleGeneratePlayers} 
          disabled={isGeneratingPlayers || disabled}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          {isGeneratingPlayers || generatingStatus ? 
            `${generatingStatus || 'Generating Players...'}` : 
            'Generate Players'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleAddPlayersToAllTeams}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Add Players to All Teams
        </Button>
      </div>
      
      {teams.length === 0 && (
        <div className="text-sm text-amber-600 font-medium bg-amber-50 p-3 rounded-md">
          Warning: No teams are available in the system. Players can't be generated without teams.
          Please go to the Teams page to create teams first.
        </div>
      )}
    </div>
  );
};

export default PlayerGenerationControls;
