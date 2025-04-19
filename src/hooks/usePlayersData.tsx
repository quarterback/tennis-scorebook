import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useData } from '@/context/DataContext';
import { Player, Team, School, PlayerTransfer } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const usePlayersData = () => {
  const { players, setPlayers, teams, schools, currentSeason, playerTransfers, setPlayerTransfers } = useData();
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
  
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'Unknown Team';
    const school = schools.find(s => s.id === team.schoolId);
    return `${school?.name || 'Unknown School'} ${team.gender}`;
  };
  
  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerFormData.teamId) {
      toast({
        title: "Error",
        description: "Please select a team",
        variant: "destructive"
      });
      return;
    }
    
    const selectedTeam = teams.find(t => t.id === playerFormData.teamId);
    if (!selectedTeam) {
      toast({
        title: "Error",
        description: "Selected team not found",
        variant: "destructive"
      });
      return;
    }
    
    // Create new player with current team ID
    const newPlayer: Player = {
      id: uuidv4(),
      name: playerFormData.name,
      grade: playerFormData.grade,
      teamId: playerFormData.teamId,
      gender: selectedTeam.gender,
      previousTeams: [],
      seasons: [currentSeason?.id || '']
    };
    
    setPlayers([...players, newPlayer]);
    
    // Reset form
    setPlayerFormData({
      name: '',
      grade: '9',
      teamId: '',
      gender: 'Boys',
      previousTeams: [],
      seasons: []
    });
    
    setIsPlayerDialogOpen(false);
    
    toast({
      title: "Player Added",
      description: `${playerFormData.name} has been added to the team roster`,
    });
  };
  
  const updatePlayer = (updatedPlayer: Player) => {
    const updatedPlayers = players.map(player =>
      player.id === updatedPlayer.id ? updatedPlayer : player
    );
    setPlayers(updatedPlayers);
  };
  
  const deletePlayer = (playerId: string) => {
    setPlayers(players.filter(player => player.id !== playerId));
    toast({
      title: "Player Deleted",
      description: "Player has been removed from the team.",
    });
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
      approved: false,
      seasonId: currentSeason?.id
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
    handleAddPlayer,
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
    submitTransferRequest
  };
};
