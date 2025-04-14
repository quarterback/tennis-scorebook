
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Save, Trophy } from 'lucide-react';
import { Gender, Classification } from '@/types';
import BracketParticipantSelector, { BracketParticipant } from './BracketParticipantSelector';
import BracketPositionGrid, { BracketPosition } from './BracketPositionGrid';
import BracketSizeSelector from './BracketSizeSelector';
import BracketDisplay from './BracketDisplay';

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
              
              <div className="flex justify-end mt-4">
                <Button onClick={saveBracket} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Bracket
                </Button>
              </div>
            </div>
          ) : (
            <BracketDisplay 
              bracketSize={bracketSize}
              bracketPositions={bracketPositions}
              type={type}
              onEditClick={() => setIsEditing(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentBracketEditor;
