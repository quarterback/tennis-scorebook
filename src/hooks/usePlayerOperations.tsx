
import { useState } from 'react';
import { Player } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const usePlayerOperations = (initialPlayers: Player[]) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const { toast } = useToast();
  
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

  return {
    players,
    setPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer
  };
};
