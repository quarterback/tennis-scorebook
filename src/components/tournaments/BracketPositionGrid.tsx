
import React from 'react';
import { Button } from '@/components/ui/button';
import { MinusCircle, MoveHorizontal } from 'lucide-react';
import { BracketParticipant } from './BracketParticipantSelector';

export interface BracketPosition {
  slot: number;
  participant: BracketParticipant | null;
}

interface BracketPositionGridProps {
  bracketPositions: BracketPosition[];
  onDragOver: (e: React.DragEvent, position: BracketPosition) => void;
  onDrop: (e: React.DragEvent, position: BracketPosition) => void;
  onRemoveParticipant: (participant: BracketParticipant) => void;
}

const BracketPositionGrid: React.FC<BracketPositionGridProps> = ({
  bracketPositions,
  onDragOver,
  onDrop,
  onRemoveParticipant
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Bracket Positions</h3>
      <div className="border rounded-lg p-3 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {bracketPositions.map((position) => (
            <div 
              key={position.slot}
              className={`border rounded-lg p-2 ${position.participant ? 'bg-blue-50' : 'bg-gray-50'}`}
              onDragOver={(e) => onDragOver(e, position)}
              onDrop={(e) => onDrop(e, position)}
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
                      onClick={() => onRemoveParticipant(position.participant!)}
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
  );
};

export default BracketPositionGrid;
