
import React from 'react';
import { RankingConfig } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface RankingSystemExplanationProps {
  defaultConfig: RankingConfig;
}

export const RankingSystemExplanation: React.FC<RankingSystemExplanationProps> = ({ defaultConfig }) => {
  return (
    <Card className="mt-6">
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="text-sm flex items-center">
          <Award className="h-5 w-5 mr-2 text-tennis-blue" />
          Ranking System Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <h3 className="font-medium mb-2">How Rankings Are Calculated:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Flight-Weighted Score (FWS):</strong> Points assigned for wins at specific positions:
            <ul className="list-disc pl-5 mt-1">
              <li>1st Singles: {defaultConfig.weights.singles1} points</li>
              <li>1st Doubles: {defaultConfig.weights.doubles1} points</li>
              <li>2nd Singles: {defaultConfig.weights.singles2} points</li>
              <li>2nd Doubles: {defaultConfig.weights.doubles2} points</li>
            </ul>
          </li>
          <li>
            <strong>League Strength Coefficient (LSC):</strong> Calculated using historical state championship 
            performance (1st and 2nd place finishes) from the previous years.
            <ul className="list-disc pl-5 mt-1">
              <li>Formula: LSC = Total League Points / 10.0</li>
              <li>1st Place Finish = 5 points</li>
              <li>2nd Place Finish = 4 points</li>
              <li>Minimum LSC = 1.0</li>
            </ul>
          </li>
          <li>
            <strong>Opponent Strength Index (OSI):</strong> A metric assessing the quality of opponents based 
            on their performance. This encourages teams to schedule tougher matches.
          </li>
          <li>
            <strong>Composite Score:</strong> FWS × LSC × OSI
          </li>
          <li>
            <strong>Minimum Matches:</strong> {defaultConfig.minimumMatches} matches required to qualify for rankings.
          </li>
          <li>
            <strong>Cutoff Date:</strong> Rankings freeze on {new Date(defaultConfig.cutoffDate).toLocaleDateString()}.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
