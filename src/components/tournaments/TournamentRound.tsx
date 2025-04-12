
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
}

interface TournamentRoundProps {
  name: string;
  matches: Match[];
}

const TournamentRound: React.FC<TournamentRoundProps> = ({ name, matches }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="border-b last:border-b-0">
      <div 
        className="flex justify-between items-center p-1.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={toggleExpanded}
      >
        <h3 className="font-medium text-xs">{name}</h3>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentRound;
