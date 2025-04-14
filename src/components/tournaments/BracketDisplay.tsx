
import React from 'react';
import { Button } from '@/components/ui/button';
import TournamentRound from './TournamentRound';
import { BracketPosition } from './BracketPositionGrid';

interface BracketDisplayProps {
  bracketSize: number;
  bracketPositions: BracketPosition[];
  type: 'Singles' | 'Doubles' | 'Team';
  onEditClick: () => void;
}

const BracketDisplay: React.FC<BracketDisplayProps> = ({
  bracketSize,
  bracketPositions,
  type,
  onEditClick
}) => {
  // Calculate number of rounds
  const numRounds = Math.ceil(Math.log2(bracketSize));
  
  // Generate round names
  const getRoundName = (roundIndex: number, totalRounds: number) => {
    if (roundIndex === totalRounds - 1) return "Finals";
    if (roundIndex === totalRounds - 2) return "Semi-Finals";
    if (roundIndex === totalRounds - 3) return "Quarter-Finals";
    return `Round of ${Math.pow(2, totalRounds - roundIndex)}`;
  };
  
  // Generate rounds for the bracket
  const generateBracketView = () => {
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
  
  const bracketRounds = generateBracketView();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">{bracketSize}-Player Bracket</h4>
        <Button variant="outline" size="sm" onClick={onEditClick}>
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
  );
};

export default BracketDisplay;
