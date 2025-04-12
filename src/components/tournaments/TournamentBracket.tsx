
import React from 'react';
import TournamentRound from './TournamentRound';
import { Gender, Classification } from '@/types';

interface TournamentBracketProps {
  type: 'Singles' | 'Doubles';
  gender: Gender;
  classification: Classification;
  districtName?: string;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ 
  type, 
  gender, 
  classification, 
  districtName 
}) => {
  const isDistrict = !!districtName;
  
  // Calculate bracket size based on tournament type
  const bracketSize = isDistrict ? 32 : 48; // 32 for district, 48 for state
  
  // Calculate the number of rounds needed for the bracket
  const numRounds = Math.ceil(Math.log2(bracketSize));
  
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
      // First round has actual participants, other rounds have TBD
      if (roundIndex === 0) {
        const seedNumber = matchIndex + 1;
        return {
          id: `${type.toLowerCase()}-r${roundIndex}-m${matchIndex}`,
          player1: {
            seed: seedNumber,
            name: isDistrict ? `Player ${seedNumber}` : `District ${Math.floor((seedNumber-1)/4) + 1} Qualifier ${((seedNumber-1) % 4) + 1}`,
            school: `School ${seedNumber}`
          },
          player2: {
            seed: bracketSize - seedNumber + 1 > bracketSize / 2 ? bracketSize - seedNumber + 1 : null, 
            name: bracketSize - seedNumber + 1 > bracketSize / 2 ? 
              (isDistrict ? `Player ${bracketSize - seedNumber + 1}` : `District ${Math.floor((bracketSize - seedNumber)/4) + 1} Qualifier ${((bracketSize - seedNumber) % 4) + 1}`) : 
              "Bye",
            school: bracketSize - seedNumber + 1 > bracketSize / 2 ? `School ${bracketSize - seedNumber + 1}` : ""
          },
          result: null // No result yet
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
  
  return (
    <div className="space-y-4 mt-4">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Tournament Bracket</h4>
      
      <div className="border rounded-lg overflow-hidden">
        {rounds.map((round) => (
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

export default TournamentBracket;
