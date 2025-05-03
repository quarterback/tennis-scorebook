
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  calculateWinPoints, 
  ITA_CONSTANTS 
} from '@/utils/itaRankingCalculations';
import { Badge } from '@/components/ui/badge';

interface MatchPointsCalculatorProps {
  opponentRank: number;
  isLeagueMatch: boolean;
  isHomeTeam: boolean;
}

export function MatchPointsCalculator({ 
  opponentRank, 
  isLeagueMatch, 
  isHomeTeam 
}: MatchPointsCalculatorProps) {
  // Calculate base points based on opponent rank
  const basePoints = calculateWinPoints(opponentRank);
  
  // Apply league/non-league weight
  const weightedPoints = basePoints * (isLeagueMatch 
    ? ITA_CONSTANTS.LEAGUE_MATCH_WEIGHT 
    : ITA_CONSTANTS.NON_LEAGUE_MATCH_WEIGHT);
  
  // Apply away match bonus if applicable
  const finalPoints = !isHomeTeam 
    ? weightedPoints * (1 + ITA_CONSTANTS.AWAY_MATCH_BONUS) 
    : weightedPoints;
  
  return (
    <Card className="bg-white mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Potential Points Preview</span>
          <Badge className="ml-2">{finalPoints.toFixed(1)} pts</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Base opponent value:</span>
            <span>{basePoints.toFixed(1)} pts</span>
          </div>
          
          <div className="flex justify-between">
            <span>
              {isLeagueMatch ? 'League match (100%)' : 'Non-league match (50%)'}:
            </span>
            <span>{weightedPoints.toFixed(1)} pts</span>
          </div>
          
          {!isHomeTeam && (
            <div className="flex justify-between text-green-600">
              <span>Away match bonus (10%):</span>
              <span>+{(weightedPoints * ITA_CONSTANTS.AWAY_MATCH_BONUS).toFixed(1)} pts</span>
            </div>
          )}
          
          <div className="border-t pt-2 font-medium flex justify-between">
            <span>Total potential points:</span>
            <span>{finalPoints.toFixed(1)} pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
