
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Player } from '@/types';

// Initial sample data can be empty as it would be populated from the database
const initialPlayersData: Player[] = [];

export const usePlayersData = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayersData);
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
    return newPlayer;
  };

  const updatePlayer = (player: Player) => {
    setPlayers(players.map(p => p.id === player.id ? player : p));
    toast({
      title: 'Player Updated',
      description: `${player.name}'s information has been updated.`
    });
    return player;
  };

  const deletePlayer = (id: string) => {
    const player = players.find(p => p.id === id);
    setPlayers(players.filter(p => p.id !== id));
    toast({
      title: 'Player Removed',
      description: `${player?.name || 'Player'} has been removed from the roster.`
    });
  };

  const getPlayersByTeam = (teamId: string): Player[] => {
    return players.filter(player => player.teamId === teamId);
  };

  const getPlayerById = (id: string): Player | undefined => {
    return players.find(player => player.id === id);
  };

  const loadPlayersData = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
  };

  return {
    players,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayersByTeam,
    getPlayerById,
    loadPlayersData
  };
};
