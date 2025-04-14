
import React from 'react';
import { Check, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TournamentMatchWithWinnerProps {
  id: string;
  team1: {
    name: string;
    school: string;
    seed?: number;
  };
  team2: {
    name: string;
    school: string;
    seed?: number;
  };
  winner?: 'team1' | 'team2';
  onSelectWinner: (matchId: string, winner: 'team1' | 'team2') => void;
  isActive?: boolean;
}

const TournamentMatchWithWinner: React.FC<TournamentMatchWithWinnerProps> = ({
  id,
  team1,
  team2,
  winner,
  onSelectWinner,
  isActive = true
}) => {
  const handleWinnerSelect = (winner: 'team1' | 'team2') => {
    if (isActive) {
      onSelectWinner(id, winner);
    }
  };

  return (
    <div className="border rounded-md p-2 mb-2 text-sm bg-white">
      <div className={`flex justify-between items-center p-1 ${winner === 'team1' ? 'bg-green-50 rounded' : ''}`}>
        <div className="flex items-center gap-2">
          {team1.seed && <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{team1.seed}</span>}
          <div>
            <div className="font-medium">{team1.name}</div>
            <div className="text-xs text-gray-500">{team1.school}</div>
          </div>
        </div>
        {isActive && (
          <Button 
            size="sm" 
            variant={winner === 'team1' ? "default" : "outline"} 
            className="px-2 h-7"
            onClick={() => handleWinnerSelect('team1')}
          >
            {winner === 'team1' ? <Check className="h-4 w-4" /> : "Win"}
          </Button>
        )}
        {!isActive && winner === 'team1' && (
          <Trophy className="h-4 w-4 text-green-600" />
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center my-1">vs</div>
      
      <div className={`flex justify-between items-center p-1 ${winner === 'team2' ? 'bg-green-50 rounded' : ''}`}>
        <div className="flex items-center gap-2">
          {team2.seed && <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{team2.seed}</span>}
          <div>
            <div className="font-medium">{team2.name}</div>
            <div className="text-xs text-gray-500">{team2.school}</div>
          </div>
        </div>
        {isActive && (
          <Button 
            size="sm" 
            variant={winner === 'team2' ? "default" : "outline"} 
            className="px-2 h-7"
            onClick={() => handleWinnerSelect('team2')}
          >
            {winner === 'team2' ? <Check className="h-4 w-4" /> : "Win"}
          </Button>
        )}
        {!isActive && winner === 'team2' && (
          <Trophy className="h-4 w-4 text-green-600" />
        )}
      </div>
    </div>
  );
};

export default TournamentMatchWithWinner;
