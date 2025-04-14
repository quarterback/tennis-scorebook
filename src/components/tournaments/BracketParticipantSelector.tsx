
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grip, MinusCircle } from 'lucide-react';
import { Gender, Classification, Team, Player } from '@/types';

export interface BracketParticipant {
  seed: number | null;
  name: string;
  school: string;
  playerId?: string;
  teamId?: string;
}

interface BracketParticipantSelectorProps {
  type: 'Singles' | 'Doubles' | 'Team';
  gender: Gender;
  classification: Classification;
  teams: Team[];
  getPlayersByTeam: (teamId: string) => Player[];
  participants: BracketParticipant[];
  onAddParticipant: (participant: BracketParticipant) => void;
  onRemoveParticipant: (participant: BracketParticipant) => void;
  onDragStart: (participant: BracketParticipant) => void;
}

const BracketParticipantSelector: React.FC<BracketParticipantSelectorProps> = ({
  type,
  gender,
  teams,
  getPlayersByTeam,
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onDragStart,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  // Filter teams by gender
  const filteredTeams = teams.filter(team => team.gender === gender);
  
  // Get available players from selected team
  const availablePlayers = selectedTeamId ? getPlayersByTeam(selectedTeamId) : [];
  
  const addPlayer = (player: Player) => {
    const team = teams.find(t => t.id === player.teamId);
    const teamSchool = team ? team.schoolId : '';
    
    const newParticipant: BracketParticipant = {
      seed: null,
      name: player.name,
      school: teamSchool,
      playerId: player.id,
      teamId: player.teamId
    };
    
    onAddParticipant(newParticipant);
  };
  
  const addTeam = (team: Team) => {
    const newParticipant: BracketParticipant = {
      seed: null,
      name: team.gender,
      school: team.schoolId,
      teamId: team.id
    };
    
    onAddParticipant(newParticipant);
  };
  
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Available {type === 'Team' ? 'Teams' : 'Players'}</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Team</label>
        <Select 
          value={selectedTeamId} 
          onValueChange={setSelectedTeamId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {filteredTeams.map(team => (
              <SelectItem key={team.id} value={team.id}>
                {team.schoolId} {team.gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-lg p-3 max-h-96 overflow-y-auto bg-gray-50">
        {type === 'Team' ? (
          <div className="space-y-2">
            {filteredTeams.map(team => (
              <div 
                key={team.id} 
                className="flex items-center justify-between p-2 border bg-white rounded cursor-move"
                draggable
                onDragStart={() => onDragStart({
                  seed: null,
                  name: team.gender,
                  school: team.schoolId,
                  teamId: team.id
                })}
              >
                <div>
                  <div className="font-medium">{team.schoolId}</div>
                  <div className="text-xs text-gray-500">{team.gender}</div>
                </div>
                <Grip className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {selectedTeamId ? (
              availablePlayers.length > 0 ? (
                availablePlayers.map(player => (
                  <div 
                    key={player.id} 
                    className="flex items-center justify-between p-2 border bg-white rounded cursor-move"
                    draggable
                    onDragStart={() => {
                      const team = teams.find(t => t.id === player.teamId);
                      onDragStart({
                        seed: null,
                        name: player.name,
                        school: team ? team.schoolId : '',
                        playerId: player.id,
                        teamId: player.teamId
                      });
                    }}
                  >
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-gray-500">Grade: {player.grade}</div>
                    </div>
                    <Grip className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No players available for this team
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 py-4">
                Select a team to view available players
              </div>
            )}
          </div>
        )}
      </div>
      
      {participants.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Participants</h3>
          <div className="border rounded-lg p-3 max-h-64 overflow-y-auto bg-gray-50">
            <div className="space-y-2">
              {participants.map((participant, idx) => (
                <div 
                  key={`${participant.playerId || participant.teamId}-${idx}`}
                  className="flex items-center justify-between p-2 border bg-white rounded cursor-move"
                  draggable
                  onDragStart={() => onDragStart(participant)}
                >
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    <div className="text-xs text-gray-500">{participant.school}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onRemoveParticipant(participant)}
                  >
                    <MinusCircle className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BracketParticipantSelector;
