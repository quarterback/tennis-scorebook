
import React, { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Plus, MinusCircle, Save, Trophy, MoveHorizontal, Grip } from 'lucide-react';
import TournamentRound from './TournamentRound';
import { Gender, Classification, Team, Player } from '@/types';

interface TournamentBracketEditorProps {
  type: 'Singles' | 'Doubles' | 'Team';
  gender: Gender;
  classification: Classification;
  districtName?: string;
  qualifiers?: Array<{
    seed: number;
    name: string;
    school: string;
  }>;
}

interface BracketParticipant {
  seed: number | null;
  name: string;
  school: string;
  playerId?: string;
  teamId?: string;
}

interface BracketPosition {
  slot: number;
  participant: BracketParticipant | null;
}

const TournamentBracketEditor: React.FC<TournamentBracketEditorProps> = ({
  type,
  gender,
  classification,
  districtName,
  qualifiers
}) => {
  const { teams, players, getPlayersByTeam } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [bracketSize, setBracketSize] = useState<number>(8);
  const [participants, setParticipants] = useState<BracketParticipant[]>(
    qualifiers 
      ? qualifiers.map(q => ({
          seed: q.seed,
          name: q.name,
          school: q.school
        })) 
      : []
  );
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [draggedParticipant, setDraggedParticipant] = useState<BracketParticipant | null>(null);
  const [bracketPositions, setBracketPositions] = useState<BracketPosition[]>([]);
  
  // Initialize bracket positions
  React.useEffect(() => {
    // Create empty bracket positions based on bracketSize
    const positions: BracketPosition[] = [];
    for (let i = 0; i < bracketSize; i++) {
      // Check if there's already a participant in this position
      const existingParticipant = participants.find(p => p.seed === i + 1);
      positions.push({
        slot: i + 1,
        participant: existingParticipant || null
      });
    }
    setBracketPositions(positions);
  }, [bracketSize, participants]);
  
  // Filter teams by gender and classification
  const filteredTeams = teams.filter(team => {
    return team.gender === gender;
  });
  
  // Get available players from selected team
  const availablePlayers = selectedTeamId ? getPlayersByTeam(selectedTeamId) : [];
  
  // Calculate number of rounds
  const numRounds = Math.ceil(Math.log2(bracketSize));
  
  const handleBracketSizeChange = (size: string) => {
    const newSize = parseInt(size);
    // Only allow sizes 2, 4, 8, 16, 32, 48
    if ([2, 4, 8, 16, 32, 48].includes(newSize)) {
      setBracketSize(newSize);
      
      // Reset participants if decreasing bracket size
      if (newSize < participants.length) {
        setParticipants(prev => prev.slice(0, newSize));
      }
    }
  };
  
  const handleDragStart = (participant: BracketParticipant) => {
    setDraggedParticipant(participant);
  };
  
  const handleDragOver = (e: React.DragEvent, position: BracketPosition) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, position: BracketPosition) => {
    e.preventDefault();
    if (!draggedParticipant) return;
    
    // If dropping on an already filled position, swap them
    const newPositions = [...bracketPositions];
    const draggedPositionIndex = newPositions.findIndex(p => 
      p.participant && (
        (p.participant.playerId && p.participant.playerId === draggedParticipant.playerId) ||
        (p.participant.teamId && p.participant.teamId === draggedParticipant.teamId)
      )
    );
    
    // Update the position where we're dropping
    const dropPositionIndex = newPositions.findIndex(p => p.slot === position.slot);
    
    // If dragged participant was already in the bracket
    if (draggedPositionIndex >= 0) {
      // If dropping onto an occupied slot, swap them
      if (position.participant) {
        newPositions[draggedPositionIndex].participant = position.participant;
      } else {
        // If dropping onto an empty slot, just remove from original position
        newPositions[draggedPositionIndex].participant = null;
      }
    }
    
    // Place dragged participant in new position
    newPositions[dropPositionIndex].participant = {
      ...draggedParticipant,
      seed: position.slot
    };
    
    setBracketPositions(newPositions);
    
    // Update participants array for consistency
    const updatedParticipants = newPositions
      .filter(pos => pos.participant !== null)
      .map(pos => ({
        ...pos.participant!,
        seed: pos.slot
      }));
      
    setParticipants(updatedParticipants);
    setDraggedParticipant(null);
  };
  
  const addParticipant = (player: Player) => {
    const team = teams.find(t => t.id === player.teamId);
    const teamSchool = team ? team.schoolId : '';
    
    const newParticipant: BracketParticipant = {
      seed: null,
      name: player.name,
      school: teamSchool,
      playerId: player.id,
      teamId: player.teamId
    };
    
    setParticipants([...participants, newParticipant]);
  };
  
  const addTeamParticipant = (team: Team) => {
    const newParticipant: BracketParticipant = {
      seed: null,
      name: team.gender,
      school: team.schoolId,
      teamId: team.id
    };
    
    setParticipants([...participants, newParticipant]);
  };
  
  const removeParticipant = (participant: BracketParticipant) => {
    // Remove from participants array
    setParticipants(participants.filter(p => 
      (p.playerId && participant.playerId) ? p.playerId !== participant.playerId :
      (p.teamId && participant.teamId) ? p.teamId !== participant.teamId :
      false
    ));
    
    // Also remove from any bracket position
    const newPositions = [...bracketPositions];
    const posIndex = newPositions.findIndex(pos => 
      pos.participant && (
        (pos.participant.playerId && participant.playerId && pos.participant.playerId === participant.playerId) ||
        (pos.participant.teamId && participant.teamId && pos.participant.teamId === participant.teamId)
      )
    );
    
    if (posIndex >= 0) {
      newPositions[posIndex].participant = null;
      setBracketPositions(newPositions);
    }
  };
  
  const generateBracketView = () => {
    // Generate round names
    const getRoundName = (roundIndex: number, totalRounds: number) => {
      if (roundIndex === totalRounds - 1) return "Finals";
      if (roundIndex === totalRounds - 2) return "Semi-Finals";
      if (roundIndex === totalRounds - 3) return "Quarter-Finals";
      return `Round of ${Math.pow(2, totalRounds - roundIndex)}`;
    };
    
    // Generate rounds for the bracket
    const rounds = Array.from({ length: numRounds }, (_, roundIndex) => {
      const matchesInRound = Math.pow(2, numRounds - roundIndex - 1);
      const roundName = getRoundName(roundIndex, numRounds);
      
      // Generate matches for this round
      const matches = Array.from({ length: matchesInRound }, (_, matchIndex) => {
        // First round has actual participants
        if (roundIndex === 0) {
          const seedNumber = matchIndex * 2 + 1;
          const opponent = seedNumber + 1;
          
          const participant1 = bracketPositions.find(p => p.slot === seedNumber)?.participant || {
            seed: seedNumber,
            name: "TBD",
            school: ""
          };
          
          const participant2 = bracketPositions.find(p => p.slot === opponent)?.participant || {
            seed: opponent,
            name: "TBD",
            school: ""
          };
          
          return {
            id: `${type.toLowerCase()}-r${roundIndex}-m${matchIndex}`,
            player1: participant1,
            player2: participant2,
            result: null
          };
        } else {
          // Later rounds have TBD participants
          return {
            id: `${type.toLowerCase()}-r${roundIndex}-m${matchIndex}`,
            player1: { seed: null, name: "TBD", school: "" },
            player2: { seed: null, name: "TBD", school: "" },
            result: null
          };
        }
      });
      
      return {
        name: roundName,
        matches
      };
    });
    
    return rounds;
  };
  
  const saveBracket = () => {
    // This would save the bracket to the database in a real implementation
    setIsEditing(false);
    console.log('Bracket saved:', {
      type,
      gender,
      classification,
      districtName,
      bracketSize,
      bracketPositions
    });
  };
  
  // Generate the bracket for display
  const bracketRounds = generateBracketView();
  
  // Different UI based on singles/doubles/team
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center">
            {type === 'Singles' ? (
              <User className="h-5 w-5 mr-2" />
            ) : type === 'Doubles' ? (
              <Users className="h-5 w-5 mr-2" />
            ) : (
              <Trophy className="h-5 w-5 mr-2" />
            )}
            {type} Tournament Bracket Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium mb-1">Bracket Size</label>
                  <Select 
                    value={bracketSize.toString()} 
                    onValueChange={handleBracketSizeChange}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium mb-1">Select Team</label>
                  <Select 
                    value={selectedTeamId} 
                    onValueChange={setSelectedTeamId}
                  >
                    <SelectTrigger className="w-64">
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Players/Teams Panel */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Available {type === 'Team' ? 'Teams' : 'Players'}</h3>
                  <div className="border rounded-lg p-3 max-h-96 overflow-y-auto bg-gray-50">
                    {type === 'Team' ? (
                      <div className="space-y-2">
                        {filteredTeams.map(team => (
                          <div 
                            key={team.id} 
                            className="flex items-center justify-between p-2 border bg-white rounded cursor-move"
                            draggable
                            onDragStart={() => handleDragStart({
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
                                  handleDragStart({
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
                </div>
                
                {/* Bracket Positions Panel */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Bracket Positions</h3>
                  <div className="border rounded-lg p-3 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {bracketPositions.map((position) => (
                        <div 
                          key={position.slot}
                          className={`border rounded-lg p-2 ${position.participant ? 'bg-blue-50' : 'bg-gray-50'}`}
                          onDragOver={(e) => handleDragOver(e, position)}
                          onDrop={(e) => handleDrop(e, position)}
                        >
                          <div className="flex items-center">
                            <div className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full font-medium mr-2">
                              {position.slot}
                            </div>
                            {position.participant ? (
                              <div className="flex-1 flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{position.participant.name}</div>
                                  <div className="text-xs text-gray-500">{position.participant.school}</div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => removeParticipant(position.participant!)}
                                >
                                  <MinusCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 flex items-center">
                                <MoveHorizontal className="h-4 w-4 mr-1" />
                                Drop player here
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={saveBracket} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Bracket
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">{bracketSize}-Player Bracket</h4>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Bracket
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                {bracketRounds.map((round) => (
                  <TournamentRound 
                    key={round.name}
                    name={round.name}
                    matches={round.matches}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentBracketEditor;
