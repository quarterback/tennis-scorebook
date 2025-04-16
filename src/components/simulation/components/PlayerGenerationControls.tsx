
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/DataContext';
import { Player, PlayerSkillTier, Season } from '@/types';

interface PlayerGenerationControlsProps {
  isGeneratingPlayers: boolean;
  selectedSeasonId: string;
  seasons: Season[];
  disabled?: boolean;
}

const PlayerGenerationControls: React.FC<PlayerGenerationControlsProps> = ({
  isGeneratingPlayers,
  selectedSeasonId,
  seasons,
  disabled = false
}) => {
  const { toast } = useToast();
  const { teams, players, addPlayer, deleteAllPlayers, schools } = useData();
  
  const handleGeneratePlayers = () => {
    // Import needed hook dynamically
    import('@/hooks/usePlayerGeneration').then(({ usePlayerGeneration }) => {
      const { generatePlayerData } = usePlayerGeneration();
      
      try {
        const selectedSeason = seasons.find(s => s.id === selectedSeasonId) || {
          id: crypto.randomUUID(),
          year: new Date().getFullYear(),
          name: `Spring ${new Date().getFullYear()}`,
          isCurrent: true
        };
        
        const { players: generatedPlayers } = generatePlayerData(teams, schools, selectedSeason.id);
        
        // Add all generated players to the state
        generatedPlayers.forEach(player => {
          addPlayer(player);
        });
        
        toast({
          title: "Player Generation Complete",
          description: `Generated ${generatedPlayers.length} players successfully`,
          variant: "default"
        });
        
        console.log(`Generated ${generatedPlayers.length} players successfully`);
      } catch (error) {
        console.error('Error generating players:', error);
        toast({
          title: "Error Generating Players",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      }
    });
  };

  const handleAddPlayersToAllTeams = () => {
    const currentSeason = seasons.find(s => s.id === selectedSeasonId) || {
      id: crypto.randomUUID(),
      year: new Date().getFullYear(),
      name: `Spring ${new Date().getFullYear()}`,
      isCurrent: true
    };
    
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
        }
      }
    });
    
    toast({
      title: "Players Added",
      description: "Added players to all teams that needed them",
      variant: "default"
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={handleGeneratePlayers} 
        disabled={isGeneratingPlayers || disabled}
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        {isGeneratingPlayers ? 'Generating Players...' : 'Generate Players'}
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
  );
};

export default PlayerGenerationControls;
