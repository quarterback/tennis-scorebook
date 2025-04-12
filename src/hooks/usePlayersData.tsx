import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Player, PlayerStatus, Season, PlayerTransfer } from '@/types';

// Initial sample data can be empty as it would be populated from the database
const initialPlayersData: Player[] = [];
const initialTransfersData: PlayerTransfer[] = [];
const initialSeasonsData: Season[] = [
  {
    id: 'current-season',
    year: 2025,
    name: 'Spring 2025',
    isCurrent: true
  },
  {
    id: 'previous-season',
    year: 2024,
    name: 'Fall 2024',
    isCurrent: false
  }
];

export const usePlayersData = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayersData);
  const [transfers, setTransfers] = useState<PlayerTransfer[]>(initialTransfersData);
  const [seasons, setSeasons] = useState<Season[]>(initialSeasonsData);
  const { toast } = useToast();

  const getCurrentSeason = (): Season => {
    const currentSeason = seasons.find(season => season.isCurrent);
    if (!currentSeason) {
      throw new Error('No current season found');
    }
    return currentSeason;
  };

  const addPlayer = (player: Omit<Player, 'id' | 'status' | 'seasonId'>) => {
    const currentSeason = getCurrentSeason();
    
    const newPlayer: Player = {
      ...player,
      id: crypto.randomUUID(),
      status: 'active',
      seasonId: currentSeason.id,
      seasons: [currentSeason.id]
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
    return players
      .filter(player => player.teamId === teamId && player.status === 'active')
      .sort((a, b) => b.grade - a.grade || a.name.localeCompare(b.name));
  };

  const getPlayerById = (id: string): Player | undefined => {
    return players.find(player => player.id === id);
  };

  const loadPlayersData = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
  };

  const transferPlayer = (playerId: string, toTeamId: string) => {
    const player = players.find(p => p.id === playerId);
    
    if (!player) {
      toast({
        title: 'Transfer Failed',
        description: 'Player not found',
        variant: 'destructive'
      });
      return;
    }
    
    const fromTeamId = player.teamId;
    const currentSeason = getCurrentSeason();
    
    // Create transfer record
    const transfer: PlayerTransfer = {
      id: crypto.randomUUID(),
      playerId,
      fromTeamId,
      toTeamId,
      date: new Date().toISOString(),
      seasonId: currentSeason.id
    };
    
    setTransfers([...transfers, transfer]);
    
    // Update player record
    const updatedPlayer: Player = {
      ...player,
      teamId: toTeamId,
      previousTeams: [...(player.previousTeams || []), fromTeamId],
      status: 'active'
    };
    
    updatePlayer(updatedPlayer);
    
    toast({
      title: 'Player Transferred',
      description: `${player.name} has been transferred to a new team.`
    });
  };

  const retirePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    
    if (!player) {
      toast({
        title: 'Retirement Failed',
        description: 'Player not found',
        variant: 'destructive'
      });
      return;
    }
    
    const updatedPlayer: Player = {
      ...player,
      status: 'retired'
    };
    
    updatePlayer(updatedPlayer);
    
    toast({
      title: 'Player Retired',
      description: `${player.name} has been retired from active play.`
    });
  };

  const progressSeasons = () => {
    const currentSeason = getCurrentSeason();
    
    // Create a new season
    const newYear = currentSeason.year + (currentSeason.name.includes('Fall') ? 0 : 1);
    const newSeasonName = currentSeason.name.includes('Fall') ? `Spring ${newYear}` : `Fall ${newYear}`;
    
    const newSeason: Season = {
      id: crypto.randomUUID(),
      year: newYear,
      name: newSeasonName,
      isCurrent: true
    };
    
    // Set all current seasons to not current
    const updatedSeasons = seasons.map(season => ({
      ...season,
      isCurrent: false
    }));
    
    // Add the new season
    setSeasons([...updatedSeasons, newSeason]);
    
    // Auto-retire seniors (grade 12)
    const updatedPlayers = players.map(player => {
      if (player.status === 'active') {
        // If grade 12, retire the player
        if (player.grade === 12) {
          return {
            ...player,
            status: 'retired',
            seasons: [...(player.seasons || []), newSeason.id]
          };
        }
        
        // Otherwise, increment the grade
        return {
          ...player,
          grade: player.grade + 1,
          seasons: [...(player.seasons || []), newSeason.id]
        };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    toast({
      title: 'Season Advanced',
      description: `Advanced to ${newSeason.name}. Seniors have been automatically retired.`
    });
    
    return newSeason;
  };

  const getArchivedSeasons = () => {
    return seasons.filter(season => !season.isCurrent);
  };

  const getPlayersByseason = (seasonId: string): Player[] => {
    return players.filter(player => player.seasons?.includes(seasonId));
  };

  return {
    players,
    transfers,
    seasons,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayersByTeam,
    getPlayerById,
    loadPlayersData,
    transferPlayer,
    retirePlayer,
    progressSeasons,
    getCurrentSeason,
    getArchivedSeasons,
    getPlayersByseason
  };
};
