
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface BracketDisplayProps {
  rounds: Array<{
    name: string;
    matches: Array<{
      id: string;
      team1: { id: string; name: string; school: string; seed: number };
      team2: { id: string; name: string; school: string; seed: number };
      winner?: 'team1' | 'team2';
      roundIndex: number;
      matchIndex: number;
      completed: boolean;
      score?: string;
      matchDetails?: any;
    }>;
  }>;
  onViewMatch?: (match: any) => void;
}

const BracketDisplay: React.FC<BracketDisplayProps> = ({ 
  rounds,
  onViewMatch 
}) => {
  return (
    <div className="flex overflow-x-auto pb-4 space-x-4">
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="flex-shrink-0 w-64">
          <div className="font-bold text-center mb-4 bg-gray-100 py-2 rounded">
            {round.name}
          </div>
          <div className="space-y-6">
            {round.matches.map((match, matchIndex) => (
              <Card 
                key={match.id} 
                className={`relative ${match.completed ? 'border-green-300' : 'border-gray-200'}`}
              >
                <CardContent className="p-3">
                  <div className="space-y-4">
                    <div 
                      className={`p-2 rounded ${
                        match.winner === 'team1' 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                            {match.team1.seed || '?'}
                          </span>
                          <span className="font-medium truncate max-w-[120px]">{match.team1.name}</span>
                        </div>
                        {match.winner === 'team1' && (
                          <span className="text-green-600 font-bold">W</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-8 truncate">{match.team1.school}</div>
                    </div>

                    <div 
                      className={`p-2 rounded ${
                        match.winner === 'team2' 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">
                            {match.team2.seed || '?'}
                          </span>
                          <span className="font-medium truncate max-w-[120px]">{match.team2.name}</span>
                        </div>
                        {match.winner === 'team2' && (
                          <span className="text-green-600 font-bold">W</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-8 truncate">{match.team2.school}</div>
                    </div>

                    {match.score && (
                      <div className="text-center border-t pt-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Score: {match.score}</span>
                        
                        {onViewMatch && match.completed && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-auto"
                            onClick={() => onViewMatch(match)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BracketDisplay;
