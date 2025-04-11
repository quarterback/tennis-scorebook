
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Plus } from 'lucide-react';
import { Player } from '@/types';
import TeamRoster from './TeamRoster';
import AddPlayerDialog from './AddPlayerDialog';

interface TeamManagerProps {
  selectedTeamId: string | null;
  teamPlayers: Player[];
  canEditTeam: (teamId: string) => boolean;
  handleRemovePlayer: (playerId: string) => void;
  isAddPlayerDialogOpen: boolean;
  setIsAddPlayerDialogOpen: (isOpen: boolean) => void;
  playerFormData: Omit<Player, 'id'>;
  setPlayerFormData: React.Dispatch<React.SetStateAction<Omit<Player, 'id'>>>;
  handleAddPlayer: (e: React.FormEvent) => void;
}

const TeamManager = ({
  selectedTeamId,
  teamPlayers,
  canEditTeam,
  handleRemovePlayer,
  isAddPlayerDialogOpen,
  setIsAddPlayerDialogOpen,
  playerFormData,
  setPlayerFormData,
  handleAddPlayer
}: TeamManagerProps) => {
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
