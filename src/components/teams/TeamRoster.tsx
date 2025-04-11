
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Plus, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  return (
    <Tabs defaultValue="12">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="12">Seniors</TabsTrigger>
        <TabsTrigger value="11">Juniors</TabsTrigger>
        <TabsTrigger value="10">Sophomores</TabsTrigger>
        <TabsTrigger value="9">Freshmen</TabsTrigger>
      </TabsList>
      
      {[12, 11, 10, 9].map((grade) => (
        <TabsContent key={grade} value={grade.toString()} className="space-y-2 mt-4">
          {teamPlayers.filter(p => p.grade === grade).length > 0 ? (
            teamPlayers
              .filter(p => p.grade === grade)
              .map((player) => (
                <div key={player.id} className="tennis-card p-3">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{player.name}</div>
                    
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
                  <div className="text-sm text-gray-500">
                    Grade {player.grade}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-gray-500 py-6">
              No {grade === 12 ? 'seniors' : grade === 11 ? 'juniors' : grade === 10 ? 'sophomores' : 'freshmen'} on this team
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TeamRoster;
