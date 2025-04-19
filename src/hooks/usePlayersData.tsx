
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Player, Team, School, PlayerTransfer, Season } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const usePlayersData = (initialPlayers = []) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [playerTransfers, setPlayerTransfers] = useState<PlayerTransfer[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([
    {
      id: 'season-1',
      year: 2024,
      name: 'Spring 2024',
      isCurrent: true
    }
  ]);
  const { toast } = useToast();
  
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  const [playerFormData, setPlayerFormData] = useState<Omit<Player, 'id' | 'status' | 'seasonId'>>({
    name: '',
    grade: '9', // Changed to string to match type
    teamId: '',
    gender: 'Boys',
    previousTeams: [],
    seasons: []
  });
  
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferFormData, setTransferFormData] = useState({
    playerId: '',
    fromTeamId: '',
    toTeamId: '',
    reason: ''
  });
  
  const getTeamName = (teamId: string, teams: Team[], schools: School[]) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'Unknown Team';
    const school = schools.find(s => s.id === team.schoolId);
    return `${school?.name || 'Unknown School'} ${team.gender}`;
  };
  
  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };
  
  const addPlayer = (playerData: Omit<Player, 'id' | 'status' | 'seasonId'>) => {
    // Create new player 
    const newPlayer: Player = {
      id: uuidv4(),
      name: playerData.name,
      grade: playerData.grade,
      teamId: playerData.teamId,
      gender: playerData.gender || 'Boys',
      previousTeams: playerData.previousTeams || [],
      seasons: playerData.seasons || [getCurrentSeason().id]
    };
    
    setPlayers([...players, newPlayer]);
    
    toast({
      title: "Player Added",
      description: `${playerData.name} has been added to the team roster`,
    });
    
    return newPlayer;
  };
  
  const updatePlayer = (updatedPlayer: Player) => {
    const updatedPlayers = players.map(player =>
      player.id === updatedPlayer.id ? updatedPlayer : player
    );
    setPlayers(updatedPlayers);
    return updatedPlayer;
  };
  
  const deletePlayer = (playerId: string) => {
    setPlayers(players.filter(player => player.id !== playerId));
    toast({
      title: "Player Deleted",
      description: "Player has been removed from the team.",
    });
  };
  
  const getPlayerById = (playerId: string) => {
    return players.find(player => player.id === playerId);
  };
  
  const getPlayersByTeam = (teamId: string) => {
    return players.filter(player => player.teamId === teamId);
  };
  
  const loadPlayersData = (initialPlayers: Player[]) => {
    setPlayers(initialPlayers);
  };
  
  const transferPlayer = (playerId: string, toTeamId: string) => {
    // Implementation for transferPlayer
    const player = getPlayerById(playerId);
    if (!player) return;
    
    const updatedPlayer = {
      ...player,
      teamId: toTeamId,
      previousTeams: [...(player.previousTeams || []), player.teamId]
    };
    
    updatePlayer(updatedPlayer);
    
    toast({
      title: "Player Transferred",
      description: `${player.name} has been transferred to a new team.`,
    });
  };
  
  const retirePlayer = (playerId: string) => {
    // Implementation for retirePlayer
    const player = getPlayerById(playerId);
    if (!player) return;
    
    const updatedPlayer = {
      ...player,
      status: 'retired'
    };
    
    updatePlayer(updatedPlayer as Player);
    
    toast({
      title: "Player Retired",
      description: `${player.name} has been retired.`,
    });
  };
  
  const progressSeasons = () => {
    // Create a new season
    const currentSeason = getCurrentSeason();
    const newSeason: Season = {
      id: uuidv4(),
      year: currentSeason.year + 1,
      name: `Spring ${currentSeason.year + 1}`,
      isCurrent: true
    };
    
    // Update current season to not be current
    const updatedSeasons = seasons.map(season => ({
      ...season,
      isCurrent: false
    }));
    
    // Add new season
    setSeasons([...updatedSeasons, newSeason]);
    
    toast({
      title: "Season Progressed",
      description: `New season ${newSeason.name} has been created.`,
    });
    
    return newSeason;
  };
  
  const getCurrentSeason = () => {
    return seasons.find(season => season.isCurrent) || seasons[0];
  };
  
  const getArchivedSeasons = () => {
    return seasons.filter(season => !season.isCurrent);
  };
  
  const getPlayersByseason = (seasonId: string) => {
    return players.filter(player => player.seasons?.includes(seasonId));
  };
  
  const handleInitiateTransfer = (playerId: string) => {
    setTransferFormData({
      playerId: playerId,
      fromTeamId: players.find(p => p.id === playerId)?.teamId || '',
      toTeamId: '',
      reason: ''
    });
    setIsTransferDialogOpen(true);
  };
  
  const handleApproveTransfer = (transferId: string) => {
    const updatedTransfers = playerTransfers.map(transfer => {
      if (transfer.id === transferId) {
        return { ...transfer, approved: true };
      }
      return transfer;
    });
    setPlayerTransfers(updatedTransfers);
    
    const transfer = playerTransfers.find(t => t.id === transferId);
    if (transfer) {
      // Update player's team
      const updatedPlayers = players.map(player => {
        if (player.id === transfer.playerId) {
          return { ...player, teamId: transfer.toTeamId };
        }
        return player;
      });
      setPlayers(updatedPlayers);
    }
    
    toast({
      title: "Transfer Approved",
      description: "Player transfer has been approved.",
    });
  };
  
  const handleRejectTransfer = (transferId: string) => {
    const updatedTransfers = playerTransfers.map(transfer => {
      if (transfer.id === transferId) {
        return { ...transfer, approved: false };
      }
      return transfer;
    });
    setPlayerTransfers(updatedTransfers);
    
    toast({
      title: "Transfer Rejected",
      description: "Player transfer has been rejected.",
    });
  };
  
  const createPlayerTransfer = (
    playerId: string,
    fromTeamId: string,
    toTeamId: string,
    reason: string
  ): PlayerTransfer => {
    return {
      id: uuidv4(),
      playerId,
      fromTeamId,
      toTeamId,
      date: new Date().toISOString(),
      reason,
      approved: false
    };
  };
  
  const submitTransferRequest = () => {
    const { playerId, fromTeamId, toTeamId, reason } = transferFormData;
    
    if (!playerId || !fromTeamId || !toTeamId) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newTransfer = createPlayerTransfer(playerId, fromTeamId, toTeamId, reason);
    setPlayerTransfers([...playerTransfers, newTransfer]);
    setIsTransferDialogOpen(false);
    
    toast({
      title: "Transfer Request Sent",
      description: "Player transfer request has been submitted.",
    });
  };
  
  return {
    players,
    setPlayers,
    isPlayerDialogOpen,
    setIsPlayerDialogOpen,
    playerFormData,
    setPlayerFormData,
    handleAddPlayer: addPlayer,
    updatePlayer,
    deletePlayer,
    getTeamName,
    getPlayerName,
    isTransferDialogOpen,
    setIsTransferDialogOpen,
    transferFormData,
    setTransferFormData,
    handleInitiateTransfer,
    handleApproveTransfer,
    handleRejectTransfer,
    submitTransferRequest,
    transfers: playerTransfers,
    setPlayerTransfers,
    seasons,
    transferPlayer,
    retirePlayer,
    progressSeasons,
    getCurrentSeason,
    getArchivedSeasons,
    getPlayersByseason,
    getPlayerById,
    getPlayersByTeam,
    loadPlayersData,
    addPlayer
  };
};
