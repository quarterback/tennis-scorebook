
import { useState } from 'react';
import { Player, PlayerTransfer, Season } from '@/types';

export const usePlayersData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [transfers, setTransfers] = useState<PlayerTransfer[]>([]);
  
  // Hardcoded seasons for demonstration - added isCurrent property to fix TypeScript errors
  const [seasons, setSeasons] = useState<Season[]>([
    { id: 'spring-2023', name: 'Spring 2023', year: 2023, isCurrent: false },
    { id: 'spring-2024', name: 'Spring 2024', year: 2024, isCurrent: false },
    { id: 'spring-2025', name: 'Spring 2025', year: 2025, isCurrent: true }
  ]);
  
  const loadPlayersData = (initialPlayers: Player[]) => {
    setPlayers(initialPlayers);
  };
  
  const getCurrentSeason = (): Season => {
    const current = seasons.find(s => s.isCurrent);
    if (!current) {
      return seasons[seasons.length - 1]; // Default to last season if no current specified
    }
    return current;
  };
  
  const getArchivedSeasons = (): Season[] => {
    return seasons.filter(s => !s.isCurrent);
  };
  
  const addPlayer = (player: Omit<Player, 'id' | 'status' | 'seasonId'>) => {
    const currentSeason = getCurrentSeason();
    
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      ...player,
      status: 'active',
      seasonId: currentSeason.id,
      seasons: player.seasons || [currentSeason.id]
    };
    
    setPlayers([...players, newPlayer]);
  };
  
  const updatePlayer = (player: Player) => {
    setPlayers(players.map(p => p.id === player.id ? player : p));
  };
  
  const deletePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };
  
  const getPlayerById = (id: string): Player | undefined => {
    return players.find(p => p.id === id);
  };
  
  const getPlayersByTeam = (teamId: string): Player[] => {
    return players.filter(p => p.teamId === teamId && p.status === 'active');
  };
  
  const getPlayersByseason = (seasonId: string): Player[] => {
    return players.filter(p => p.seasons.includes(seasonId));
  };
  
  const transferPlayer = (playerId: string, toTeamId: string) => {
    // Find the player
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Update player's team
    const updatedPlayer = {
      ...player,
      teamId: toTeamId
    };
    
    // Add transfer record - Added seasonId property to fix TypeScript error
    const currentSeason = getCurrentSeason();
    const transfer: PlayerTransfer = {
      id: crypto.randomUUID(),
      playerId,
      fromTeamId: player.teamId,
      toTeamId,
      date: new Date().toISOString(),
      seasonId: currentSeason.id // Added the required seasonId property
    };
    
    setTransfers([...transfers, transfer]);
    updatePlayer(updatedPlayer);
  };
  
  const retirePlayer = (playerId: string) => {
    // Find the player
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Update player's status
    const updatedPlayer = {
      ...player,
      status: 'retired' as const
    };
    
    updatePlayer(updatedPlayer);
  };
  
  const progressSeasons = (): Season => {
    // Find current season
    const currentSeason = getCurrentSeason();
    
    // Create new season based on current
    const nextYear = currentSeason.year + 1;
    const newSeason: Season = {
      id: `spring-${nextYear}`,
      name: `Spring ${nextYear}`,
      year: nextYear,
      isCurrent: true
    };
    
    // Update current season to not be current
    const updatedSeasons = seasons.map(s => {
      if (s.id === currentSeason.id) {
        return { ...s, isCurrent: false };
      }
      return s;
    });
    
    // Add new season
    setSeasons([...updatedSeasons, newSeason]);
    
    return newSeason;
  };
  
  return {
    players,
    setPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerById,
    getPlayersByTeam,
    transfers,
    seasons,
    transferPlayer,
    retirePlayer,
    progressSeasons,
    getCurrentSeason,
    loadPlayersData,
    getArchivedSeasons,
    getPlayersByseason
  };
};
