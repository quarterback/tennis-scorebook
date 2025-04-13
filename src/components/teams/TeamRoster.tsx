
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Plus, Trash } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Player } from '@/types';

interface TeamRosterProps {
  selectedTeamId: string | null;
  teamPlayers: Player[];
  canEditTeam: (teamId: string) => boolean;
  handleRemovePlayer: (playerId: string) => void;
  isAddPlayerDialogOpen: boolean;
  setIsAddPlayerDialogOpen: (isOpen: boolean) => void;
}

const TeamRoster = ({
  selectedTeamId,
  teamPlayers,
  canEditTeam,
  handleRemovePlayer,
  isAddPlayerDialogOpen,
  setIsAddPlayerDialogOpen
}: TeamRosterProps) => {
  if (!selectedTeamId) {
    return (
      <div className="text-center text-gray-500 py-10">
        Select a team to view and manage players
      </div>
    );
  }

  if (teamPlayers.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No players added to this team yet
      </div>
    );
  }

  // Sort players by name
  const sortedPlayers = [...teamPlayers].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-2 mt-4">
      {sortedPlayers.map((player) => (
        <div key={player.id} className="tennis-card p-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{player.name}</div>
              <div className="text-sm text-gray-500">
                Grade {player.grade}
              </div>
            </div>
            
            {canEditTeam(selectedTeamId) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                onClick={() => handleRemovePlayer(player.id)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamRoster;
