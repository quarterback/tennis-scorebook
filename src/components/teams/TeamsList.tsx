
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';
import { Team, School, Player } from '@/types';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface TeamsListProps {
  teams: Team[];
  players: Player[];
  selectedTeamId: string | null;
  selectedSchool: School | undefined;
  isAddTeamDialogOpen: boolean;
  setIsAddTeamDialogOpen: (isOpen: boolean) => void;
  canEditTeam: (teamId: string) => boolean;
  handleDeleteTeam: (teamId: string) => void;
  onTeamSelect: (teamId: string) => void;
}

const TeamsList = ({
  teams,
  players,
  selectedTeamId,
  selectedSchool,
  isAddTeamDialogOpen,
  setIsAddTeamDialogOpen,
  canEditTeam,
  handleDeleteTeam,
  onTeamSelect
}: TeamsListProps) => {

  // Log for debugging
  console.log("Teams in list:", teams.length);
  console.log("Selected school:", selectedSchool?.name);

  if (!selectedSchool) {
    return (
      <div className="mt-4 text-center text-gray-500 py-6">
        Select a school to view teams
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="mt-4 text-center text-gray-500 py-6">
        No teams available for this school. 
        {canEditTeam(selectedSchool.id) && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="mx-auto flex items-center"
              onClick={() => setIsAddTeamDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Team
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`border rounded-md ${team.gender === 'Boys' ? 'bg-blue-50' : 'bg-pink-50'} cursor-pointer p-3 ${
            selectedTeamId === team.id ? 'ring-2 ring-primary' : ''
          } hover:bg-gray-100 transition-colors`}
          onClick={() => onTeamSelect(team.id)}
        >
          <div className="flex justify-between items-center">
            <div className="font-medium">{selectedSchool.name} {team.gender}</div>
            
            {canEditTeam(team.id) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTeam(team.id);
                }}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {players.filter(p => p.teamId === team.id).length} Players
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsList;
