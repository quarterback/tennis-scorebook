
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Save, Trophy, ArrowRight, RotateCw } from 'lucide-react';
import { Gender, Classification } from '@/types';
import BracketParticipantSelector, { BracketParticipant } from './BracketParticipantSelector';
import BracketPositionGrid, { BracketPosition } from './BracketPositionGrid';
import BracketSizeSelector from './BracketSizeSelector';
import BracketDisplay from './BracketDisplay';
import TournamentMatchWithWinner from './TournamentMatchWithWinner';
import { useTournamentBracket } from '@/hooks/useTournamentBracket';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

const TournamentBracketEditor: React.FC<TournamentBracketEditorProps> = ({
  type,
  gender,
  classification,
  districtName,
  qualifiers
}) => {
  const { teams, players, getPlayersByTeam } = useData();
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
  const [activeTab, setActiveTab] = useState<string>("manual");
  
  // Get tournament bracket functionality
  const {
    bracket,
    qualifiedTeams,
    generateQualifiedTeams,
    handleWinnerSelect,
    autoGenerateBracket,
    qualificationRules
  } = useTournamentBracket(gender, classification);

  // Initialize bracket positions
  useEffect(() => {
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

  // Effect to generate qualifiers
  useEffect(() => {
    if (activeTab === "auto") {
      generateQualifiedTeams();
    }
  }, [activeTab, gender, classification]);
  
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
  
  const addParticipant = (participant: BracketParticipant) => {
    setParticipants([...participants, participant]);
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

  const handleMatchWinnerSelect = (matchId: string, winner: 'team1' | 'team2') => {
    handleWinnerSelect(matchId, winner);
  };

  // Handle auto-generate button click
  const handleAutoGenerate = () => {
    autoGenerateBracket();
  };
  
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center justify-between">
            <div className="flex items-center">
              {type === 'Singles' ? (
                <User className="h-5 w-5 mr-2" />
              ) : type === 'Doubles' ? (
                <Users className="h-5 w-5 mr-2" />
              ) : (
                <Trophy className="h-5 w-5 mr-2" />
              )}
              {type} Tournament Bracket
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-gray-500">
                {isEditing ? 'Edit Mode' : 'View Mode'}
              </span>
              <Switch 
                checked={!isEditing}
                onCheckedChange={() => setIsEditing(!isEditing)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="manual">Manual Setup</TabsTrigger>
                <TabsTrigger value="auto">Auto Generate</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <BracketSizeSelector 
                    bracketSize={bracketSize}
                    onBracketSizeChange={handleBracketSizeChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Available Players/Teams Panel */}
                  <BracketParticipantSelector 
                    type={type}
                    gender={gender}
                    classification={classification}
                    teams={teams}
                    getPlayersByTeam={getPlayersByTeam}
                    participants={participants}
                    onAddParticipant={addParticipant}
                    onRemoveParticipant={removeParticipant}
                    onDragStart={handleDragStart}
                  />
                  
                  {/* Bracket Positions Panel */}
                  <BracketPositionGrid 
                    bracketPositions={bracketPositions}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onRemoveParticipant={removeParticipant}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="auto" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Qualification Rules</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    For {classification} {gender}: {qualificationRules.totalSpots} total spots
                  </p>
                  <ul className="list-disc pl-5 text-sm text-blue-700">
                    <li>{qualificationRules.automaticBids} automatic bids (top team from each district/league)</li>
                    <li>{qualificationRules.atLargeBids} at-large bids (based on highest APR/ranking)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Qualified Teams</h3>
                    <Button 
                      size="sm" 
                      onClick={handleAutoGenerate}
                      className="flex items-center gap-1"
                    >
                      <RotateCw className="h-4 w-4" /> Generate Bracket
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Automatic Qualifiers */}
                    <div>
                      <h4 className="text-xs uppercase font-semibold text-gray-500 mb-2">Automatic Qualifiers</h4>
                      {qualifiedTeams
                        .filter(team => team.qualificationType === 'automatic')
                        .map((team, idx) => (
                          <div key={team.teamId} className="flex items-center gap-2 p-2 border-b">
                            <span className="text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 font-medium">
                              {team.seed}
                            </span>
                            <div>
                              <div className="font-medium">{team.teamName}</div>
                              <div className="text-xs text-gray-500">{team.districtName}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    {/* At-Large Qualifiers */}
                    <div>
                      <h4 className="text-xs uppercase font-semibold text-gray-500 mb-2">At-Large Qualifiers</h4>
                      {qualifiedTeams
                        .filter(team => team.qualificationType === 'at-large')
                        .map((team, idx) => (
                          <div key={team.teamId} className="flex items-center gap-2 p-2 border-b">
                            <span className="text-xs bg-green-100 text-green-800 rounded px-1.5 py-0.5 font-medium">
                              {team.seed}
                            </span>
                            <div>
                              <div className="font-medium">{team.teamName}</div>
                              <div className="text-xs text-gray-500">{team.districtName}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                
                {/* Preview of auto-generated bracket */}
                {bracket.rounds.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Tournament Bracket Preview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bracket.rounds.map((round, roundIdx) => (
                        <div key={roundIdx} className="border rounded-lg p-3">
                          <h4 className="text-sm font-medium mb-2">{round.name}</h4>
                          {round.matches.map((match, matchIdx) => (
                            <TournamentMatchWithWinner 
                              key={match.id}
                              id={match.id}
                              team1={{
                                name: match.team1.name,
                                school: match.team1.school,
                                seed: match.team1.seed
                              }}
                              team2={{
                                name: match.team2.name,
                                school: match.team2.school,
                                seed: match.team2.seed
                              }}
                              winner={match.winner}
                              onSelectWinner={handleMatchWinnerSelect}
                              isActive={match.team1.name !== "TBD" && match.team2.name !== "TBD"}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <div className="flex justify-end mt-4">
                <Button onClick={saveBracket} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Bracket
                </Button>
              </div>
            </Tabs>
          ) : (
            <div className="space-y-6">
              {activeTab === "manual" ? (
                <BracketDisplay 
                  bracketSize={bracketSize}
                  bracketPositions={bracketPositions}
                  type={type}
                  onEditClick={() => setIsEditing(true)}
                />
              ) : (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">{classification} {gender} Tournament Bracket</h3>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Bracket
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bracket.rounds.map((round, roundIdx) => (
                      <div key={roundIdx} className="border rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">{round.name}</h4>
                        {round.matches.map((match, matchIdx) => (
                          <TournamentMatchWithWinner 
                            key={match.id}
                            id={match.id}
                            team1={{
                              name: match.team1.name,
                              school: match.team1.school,
                              seed: match.team1.seed
                            }}
                            team2={{
                              name: match.team2.name,
                              school: match.team2.school,
                              seed: match.team2.seed
                            }}
                            winner={match.winner}
                            onSelectWinner={handleMatchWinnerSelect}
                            isActive={match.team1.name !== "TBD" && match.team2.name !== "TBD"}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentBracketEditor;
