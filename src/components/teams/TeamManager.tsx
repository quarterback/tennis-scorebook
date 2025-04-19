
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Plus } from 'lucide-react';
import { Player } from '@/types';
import TeamRoster from './TeamRoster';
import AddPlayerDialog from './AddPlayerDialog';
import { useData } from '@/context/DataContext';

interface TeamManagerProps {
  selectedTeamId: string | null;
  canEditTeam: (teamId: string) => boolean;
  isAddPlayerDialogOpen: boolean;
  setIsAddPlayerDialogOpen: (isOpen: boolean) => void;
  playerFormData: Omit<Player, 'id' | 'status' | 'seasonId'>;
  setPlayerFormData: React.Dispatch<React.SetStateAction<Omit<Player, 'id' | 'status' | 'seasonId'>>>;
  handleAddPlayer: (e: React.FormEvent) => void;
}

const TeamManager = ({
  selectedTeamId,
  canEditTeam,
  isAddPlayerDialogOpen,
  setIsAddPlayerDialogOpen,
  playerFormData,
  setPlayerFormData,
  handleAddPlayer
}: TeamManagerProps) => {
  const { getPlayersByTeam, deletePlayer } = useData();
  
  // Get players for the selected team
  const teamPlayers = selectedTeamId ? getPlayersByTeam(selectedTeamId) : [];
  
  // Log the player count for debugging
  console.log("Team players count:", teamPlayers.length);
  if (teamPlayers.length > 0) {
    console.log("First player:", teamPlayers[0]);
  }
  
  // Handle removing a player
  const handleRemovePlayer = (playerId: string) => {
    if (confirm("Are you sure you want to remove this player from the team?")) {
      deletePlayer(playerId);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-tennis-green" />
            {selectedTeamId ? 'Team Roster' : 'Select a Team'}
          </span>
          
          {selectedTeamId && canEditTeam(selectedTeamId) && (
            <Dialog open={isAddPlayerDialogOpen} onOpenChange={setIsAddPlayerDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-tennis-green hover:bg-green-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Player
                </Button>
              </DialogTrigger>
              <AddPlayerDialog 
                playerFormData={playerFormData}
                setPlayerFormData={setPlayerFormData}
                handleAddPlayer={handleAddPlayer}
              />
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <TeamRoster
          selectedTeamId={selectedTeamId}
          teamPlayers={teamPlayers}
          canEditTeam={canEditTeam}
          handleRemovePlayer={handleRemovePlayer}
          isAddPlayerDialogOpen={isAddPlayerDialogOpen}
          setIsAddPlayerDialogOpen={setIsAddPlayerDialogOpen}
        />
      </CardContent>
    </Card>
  );
};

export default TeamManager;
