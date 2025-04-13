
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Plus, MinusCircle, Save } from 'lucide-react';
import TournamentRound from './TournamentRound';
import { Gender, Classification, Team, Player } from '@/types';

interface TournamentBracketEditorProps {
  type: 'Singles' | 'Doubles';
  gender: Gender;
  classification: Classification;
  districtName?: string;
}

interface BracketParticipant {
  seed: number | null;
  name: string;
  school: string;
  playerId?: string;
  teamId?: string;
}

const TournamentBracketEditor: React.FC<TournamentBracketEditorProps> = ({
  type,
  gender,
  classification,
  districtName
}) => {
  const { teams, players, getPlayersByTeam } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [bracketSize, setBracketSize] = useState<number>(8);
  const [participants, setParticipants] = useState<BracketParticipant[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  
  // Filter teams by gender and classification
  const filteredTeams = teams.filter(team => {
    // Find the school for this team
    const school = team.schoolId;
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
  
  const addParticipant = (player: Player, seed: number) => {
    const team = teams.find(t => t.id === player.teamId);
    const teamSchool = team ? team.schoolId : '';
    
    // Check if we're updating an existing seed or adding a new one
    const existingIndex = participants.findIndex(p => p.seed === seed);
    
    if (existingIndex >= 0) {
      // Update existing participant
      const updatedParticipants = [...participants];
      updatedParticipants[existingIndex] = {
        seed,
        name: player.name,
        school: teamSchool,
        playerId: player.id,
        teamId: player.teamId
      };
      setParticipants(updatedParticipants);
    } else {
      // Add new participant
      setParticipants([...participants, {
        seed,
        name: player.name,
        school: teamSchool,
        playerId: player.id,
        teamId: player.teamId
      }]);
    }
  };
  
  const removeParticipant = (seed: number) => {
    setParticipants(participants.filter(p => p.seed !== seed));
  };
  
  const generateEmptyBracket = () => {
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
          const seedNumber = matchIndex + 1;
          const opponent = bracketSize - seedNumber + 1;
          
          const participant1 = participants.find(p => p.seed === seedNumber) || {
            seed: seedNumber,
            name: "TBD",
            school: ""
          };
          
          const participant2 = participants.find(p => p.seed === opponent) || {
            seed: opponent <= bracketSize / 2 ? opponent : null,
            name: opponent <= bracketSize / 2 ? "TBD" : "Bye",
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
      participants
    });
  };
  
  // Generate the bracket for display
  const bracketRounds = generateEmptyBracket();
  
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center">
            {type === 'Singles' ? <User className="h-5 w-5 mr-2" /> : <Users className="h-5 w-5 mr-2" />}
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
                
                {selectedTeamId && (
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-1">Select Player & Seed</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availablePlayers.map(player => (
                        <div key={player.id} className="flex items-center gap-2 border p-2 rounded">
                          <div className="flex-1">
                            <div className="font-medium">{player.name}</div>
                            <div className="text-xs text-gray-500">Grade: {player.grade}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              min="1" 
                              max={bracketSize} 
                              placeholder="Seed"
                              className="w-16"
                              onChange={(e) => {
                                const seed = parseInt(e.target.value);
                                if (seed > 0 && seed <= bracketSize) {
                                  addParticipant(player, seed);
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Current Entries ({participants.length}/{bracketSize})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Array.from({ length: bracketSize }, (_, i) => i + 1).map(seed => {
                    const participant = participants.find(p => p.seed === seed);
                    return (
                      <div key={seed} className="flex items-center gap-2 border p-2 rounded">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full font-bold">
                          {seed}
                        </div>
                        <div className="flex-1">
                          {participant ? (
                            <>
                              <div className="font-medium">{participant.name}</div>
                              <div className="text-xs text-gray-500">{participant.school}</div>
                            </>
                          ) : (
                            <div className="text-gray-400">Not assigned</div>
                          )}
                        </div>
                        {participant && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeParticipant(seed)}
                          >
                            <MinusCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
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
