
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface RankingConfig {
  weights: {
    singles1: number;
    singles2: number;
    singles3: number;
    doubles1: number;
    doubles2: number;
    doubles3: number;
  };
  minimumMatches: number;
  cutoffDate: string;
}

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
        <h3 className="font-medium mb-2">How APR Rankings Are Calculated:</h3>
        <div className="mb-3 p-2 bg-gray-50 rounded border">
          <strong>Athletic Power Rating (APR) = WS10 × OSI</strong>
        </div>
        
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>WS10 (Win Score 10):</strong> The sum of your 10 best match scores, where each match score is 
            calculated using the weighted flight values:
            <ul className="list-disc pl-5 mt-1">
              <li>1st Singles: {defaultConfig.weights.singles1} points</li>
              <li>1st Doubles: {defaultConfig.weights.doubles1} points</li>
              <li>2nd Singles: {defaultConfig.weights.singles2} points</li>
              <li>2nd Doubles: {defaultConfig.weights.doubles2} points</li>
              <li>3rd Singles: {defaultConfig.weights.singles3} points</li>
              <li>3rd Doubles: {defaultConfig.weights.doubles3} points</li>
            </ul>
          </li>
          <li>
            <strong>OSI (Opponent Strength Index):</strong> The average of your opponents' WS10 scores (only counting 
            opponents who have played at least 6 matches).
          </li>
          <li>
            <strong>Ties:</strong> 4-4 ties are counted as half a win for APR calculation purposes.
          </li>
          <li>
            <strong>Minimum Matches:</strong> {defaultConfig.minimumMatches} matches required to qualify for rankings.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
