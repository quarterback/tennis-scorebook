
import React from 'react';
import { TeamRanking } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface EdgeCasesCardProps {
  edgeCases: Array<{
    case: string;
    description: string;
    examples: TeamRanking[];
  }>;
}

export const EdgeCasesCard: React.FC<EdgeCasesCardProps> = ({ edgeCases }) => {
  return (
    <Card className="mt-6">
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="text-sm flex items-center">
          <Zap className="h-5 w-5 mr-2 text-orange-500" />
          Edge Cases & System Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-4">
          {edgeCases.map((edgeCase, index) => (
            <div key={index} className="border p-3 rounded-md">
              <h4 className="font-medium text-base">{edgeCase.case}</h4>
              <p className="text-gray-600 mb-2">{edgeCase.description}</p>
              
              {edgeCase.examples.length > 0 ? (
                <div className="bg-gray-50 p-2 rounded-md">
                  <h5 className="font-medium mb-1 text-sm">Examples:</h5>
                  <ul className="pl-5 list-disc">
                    {edgeCase.examples.map((team, i) => (
                      <li key={i}>
                        {team.teamName} ({team.wins}-{team.losses}), 
                        Composite: {team.compositeScore.toFixed(2)}, 
                        OSI: {team.opponentStrengthIndex.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="italic text-gray-500">No examples found for this scenario.</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
