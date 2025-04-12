
import React from 'react';
import { ChevronRight, Trophy } from 'lucide-react';

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
  significance?: string; // Added match significance field
}

const TournamentMatch: React.FC<MatchProps> = ({ 
  id, 
  player1, 
  player2, 
  result,
  significance 
}) => {
  return (
    <div key={id} className="py-1.5">
      <div className="flex flex-col space-y-0.5 shadow-sm rounded-md overflow-hidden border border-gray-100">
        {/* Player 1 */}
        <div className={`flex justify-between items-center p-1.5 ${
          result === 'player1' ? 'bg-green-50 border-l-2 border-l-green-500' : 'bg-white'
        }`}>
          <div className="flex items-center">
            {player1.seed && (
              <div className="bg-tennis-blue text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs font-medium">
                {player1.seed}
              </div>
            )}
            <div>
              <div className="font-medium text-sm">{player1.name}</div>
              {player1.school && (
                <div className="text-xs text-gray-500">{player1.school}</div>
              )}
            </div>
          </div>
          {result === 'player1' && <ChevronRight className="h-4 w-4 text-green-600" />}
        </div>
        
        <div className="h-[1px] bg-gray-100 w-full"></div>
        
        {/* Player 2 */}
        <div className={`flex justify-between items-center p-1.5 ${
          result === 'player2' ? 'bg-green-50 border-l-2 border-l-green-500' : 'bg-white'
        }`}>
          <div className="flex items-center">
            {player2.seed && (
              <div className="bg-tennis-blue text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs font-medium">
                {player2.seed}
              </div>
            )}
            <div>
              <div className="font-medium text-sm">{player2.name}</div>
              {player2.school && (
                <div className="text-xs text-gray-500">{player2.school}</div>
              )}
            </div>
          </div>
          {result === 'player2' && <ChevronRight className="h-4 w-4 text-green-600" />}
        </div>
      </div>
      
      {/* Match significance note */}
      {significance && (
        <div className="mt-1 px-2 py-1 bg-amber-50 rounded-md border border-amber-100 text-xs text-amber-800">
          <div className="flex items-center">
            <Trophy className="h-3 w-3 mr-1 text-amber-500" />
            <span>{significance}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentMatch;
