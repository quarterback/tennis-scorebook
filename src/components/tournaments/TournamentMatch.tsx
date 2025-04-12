
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Player {
  seed: number | null;
  name: string;
  school: string;
}

interface MatchProps {
  id: string;
  player1: Player;
  player2: Player;
  result: 'player1' | 'player2' | null;
}

const TournamentMatch: React.FC<MatchProps> = ({ id, player1, player2, result }) => {
  return (
    <div key={id} className="py-2">
      <div className="flex flex-col space-y-1">
        <div className={`flex justify-between items-center p-2 rounded ${
          result === 'player1' ? 'bg-green-50' : ''
        }`}>
          <div className="flex items-center">
            {player1.seed && (
              <div className="bg-tennis-blue text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                {player1.seed}
              </div>
            )}
            <div>
              <div className="font-medium">{player1.name}</div>
              {player1.school && (
                <div className="text-xs text-gray-500">{player1.school}</div>
              )}
            </div>
          </div>
          {result === 'player1' && <ChevronRight className="h-4 w-4 text-green-600" />}
        </div>
        
        <div className="text-xs text-center text-gray-400 my-1">vs</div>
        
        <div className={`flex justify-between items-center p-2 rounded ${
          result === 'player2' ? 'bg-green-50' : ''
        }`}>
          <div className="flex items-center">
            {player2.seed && (
              <div className="bg-tennis-blue text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                {player2.seed}
              </div>
            )}
            <div>
              <div className="font-medium">{player2.name}</div>
              {player2.school && (
                <div className="text-xs text-gray-500">{player2.school}</div>
              )}
            </div>
          </div>
          {result === 'player2' && <ChevronRight className="h-4 w-4 text-green-600" />}
        </div>
      </div>
    </div>
  );
};

export default TournamentMatch;
