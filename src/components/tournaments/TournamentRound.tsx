
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import TournamentMatch from './TournamentMatch';

interface Player {
  seed: number | null;
  name: string;
  school: string;
}

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  result: 'player1' | 'player2' | null;
  significance?: string; // Added significance field
}

interface TournamentRoundProps {
  name: string;
  matches: Match[];
  isFinalRound?: boolean; // Indicates if this is the championship round
}

const TournamentRound: React.FC<TournamentRoundProps> = ({ 
  name, 
  matches,
  isFinalRound = false
}) => {
  const [expanded, setExpanded] = useState(true); // Default to expanded for better visibility
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="border-b last:border-b-0">
      <div 
        className={`flex justify-between items-center p-1.5 cursor-pointer hover:bg-gray-100 transition-colors ${
          isFinalRound ? 'bg-amber-50' : 'bg-gray-50'
        }`}
        onClick={toggleExpanded}
      >
        <h3 className={`font-medium text-xs flex items-center ${isFinalRound ? 'text-amber-900' : ''}`}>
          {isFinalRound && <Trophy className="h-3 w-3 mr-1 text-amber-500" />}
          {name}
        </h3>
        <div className="flex items-center text-gray-500">
          <span className="mr-1 text-xs">{matches.length} matches</span>
          {expanded ? 
            <ChevronUp className="h-3 w-3" /> : 
            <ChevronDown className="h-3 w-3" />
          }
        </div>
      </div>
      
      {expanded && (
        <div className="p-1 space-y-1 bg-white">
          {matches.map((match) => (
            <TournamentMatch 
              key={match.id}
              id={match.id}
              player1={match.player1}
              player2={match.player2}
              result={match.result}
              significance={match.significance}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentRound;
