
import React from 'react';
import { Button } from '@/components/ui/button';
import TournamentRound from './TournamentRound';

export interface BracketPosition {
  slot: number;
  participant: {
    seed: number;
    name: string;
    school: string;
  };
}

export interface BracketMatch {
  id: string;
  player1: {
    seed: number | null;
    name: string;
    school: string;
  };
  player2: {
    seed: number | null;
    name: string;
    school: string;
  };
  result: string | null;
}

export interface BracketRound {
  name: string;
  matches: BracketMatch[];
}

export interface BracketDisplayProps {
  bracketSize?: number;
  bracketPositions?: BracketPosition[];
  type?: 'Singles' | 'Doubles' | 'Team';
  onEditClick?: () => void;
  bracket?: {
    rounds: {
      name: string;
      matches: {
        id: string;
        team1: { id: string; name: string; school: string; seed: number };
        team2: { id: string; name: string; school: string; seed: number };
        winner?: 'team1' | 'team2';
        roundIndex: number;
        matchIndex: number;
        completed: boolean;
        score?: string;
      }[];
    }[];
  };
  onWinnerSelect?: (matchId: string, winner: 'team1' | 'team2') => void;
}

const BracketDisplay: React.FC<BracketDisplayProps> = ({
  bracketSize = 8,
  bracketPositions = [],
  type = 'Singles',
  onEditClick,
  bracket,
  onWinnerSelect
}) => {
  // If we have a bracket object, use that for rendering
  if (bracket && bracket.rounds.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Tournament Bracket</h4>
          {onEditClick && (
            <Button variant="outline" size="sm" onClick={onEditClick}>
              Edit Bracket
            </Button>
          )}
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          {bracket.rounds.map((round, roundIndex) => (
            <div key={round.name} className="p-4 border-b last:border-b-0">
              <h3 className="font-medium mb-4">{round.name}</h3>
              <div className="space-y-4">
                {round.matches.map((match) => (
                  <div 
                    key={match.id} 
                    className="border rounded-md p-3 bg-white"
                  >
                    <div 
                      className={`flex justify-between items-center p-2 ${
                        match.winner === 'team1' ? 'bg-green-50 border-l-4 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                          {match.team1.seed || '?'}
                        </span>
                        <span className="font-medium">{match.team1.name}</span>
                        <span className="text-gray-500 text-sm">{match.team1.school}</span>
                      </div>
                      {match.completed && match.winner === 'team1' && (
                        <span className="text-green-600 text-sm font-medium">Winner</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center text-sm text-gray-500 my-1">
                      vs
                      {match.score && <span className="ml-2 font-mono">{match.score}</span>}
                    </div>
                    
                    <div 
                      className={`flex justify-between items-center p-2 ${
                        match.winner === 'team2' ? 'bg-green-50 border-l-4 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                          {match.team2.seed || '?'}
                        </span>
                        <span className="font-medium">{match.team2.name}</span>
                        <span className="text-gray-500 text-sm">{match.team2.school}</span>
                      </div>
                      {match.completed && match.winner === 'team2' && (
                        <span className="text-green-600 text-sm font-medium">Winner</span>
                      )}
                    </div>
                    
                    {onWinnerSelect && !match.completed && match.team1.id && match.team2.id && (
                      <div className="mt-2 flex gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => onWinnerSelect(match.id, 'team1')}
                        >
                          {match.team1.name} Wins
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => onWinnerSelect(match.id, 'team2')}
                        >
                          {match.team2.name} Wins
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Fall back to the original display if no bracket object is provided
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
        {onEditClick && (
          <Button variant="outline" size="sm" onClick={onEditClick}>
            Edit Bracket
          </Button>
        )}
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
