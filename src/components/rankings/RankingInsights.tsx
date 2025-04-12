
import React from 'react';
import { TeamRanking } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, ActivitySquare } from 'lucide-react';
import { Gender, Classification } from '@/types';

interface RankingInsightsProps {
  insights: {
    avgMatches: number;
    avgWinPct: number;
    classificationCounts: Record<string, number>;
    districtStrength: Array<{
      district: string;
      teams: number;
      avgComposite: number;
      lsc: number;
    }>;
    totalQualifiedTeams: number;
    totalTeams: number;
    leagueInsights?: {
      avgLeagueMatches: number;
      avgLeagueWinPct: number;
    };
  };
  keyMatchups: Array<{
    teamA: TeamRanking;
    teamB: TeamRanking;
    scoreDiff: number;
  }>;
  selectedGender: Gender;
  selectedClassification: Classification;
  selectedDistrict: string;
}

export const RankingInsights: React.FC<RankingInsightsProps> = ({ 
  insights, 
  keyMatchups,
  selectedGender,
  selectedClassification,
  selectedDistrict
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="bg-tennis-gray pb-2">
          <CardTitle className="text-lg flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-tennis-blue" />
            Season Statistics
            {selectedDistrict !== 'all' && (
              <span className="ml-2 text-sm font-normal">({selectedDistrict} League)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm text-gray-500">Qualified Teams</h4>
                <p className="text-2xl font-bold">{insights.totalQualifiedTeams}</p>
                <p className="text-xs text-gray-500">
                  of {insights.totalTeams} total teams ({Math.round(insights.totalQualifiedTeams / Math.max(1, insights.totalTeams) * 100)}%)
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm text-gray-500">Avg. Matches Played</h4>
                <p className="text-2xl font-bold">{insights.avgMatches.toFixed(1)}</p>
                <p className="text-xs text-gray-500">per qualified team</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm text-gray-500">Overall Win %</h4>
                <p className="text-2xl font-bold">{(insights.avgWinPct * 100).toFixed(1)}%</p>
                <p className="text-xs text-gray-500">
                  {selectedGender} {selectedClassification} teams
                  {selectedDistrict !== 'all' && ` in ${selectedDistrict}`}
                </p>
              </div>
              
              {insights.leagueInsights && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm text-gray-500">League Win %</h4>
                  <p className="text-2xl font-bold">{(insights.leagueInsights.avgLeagueWinPct * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">in league matches only</p>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Strongest Districts by Average Composite Score:</h4>
              <ul className="space-y-2">
                {insights.districtStrength.slice(0, 3).map((district, i) => (
                  <li key={i} className="bg-gray-50 p-2 rounded-md flex justify-between">
                    <span className="font-medium">{district.district}</span>
                    <span className="text-tennis-blue font-bold">{district.avgComposite.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-tennis-gray pb-2">
          <CardTitle className="text-lg flex items-center">
            <ActivitySquare className="h-5 w-5 mr-2 text-tennis-blue" />
            Closest Rankings & Key Matchups
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              These teams have very close composite scores, meaning their rankings could easily change based on upcoming match results:
            </p>
            
            {keyMatchups.length > 0 ? (
              <div className="space-y-3 mt-3">
                {keyMatchups.map((matchup, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">#{i+1} Close Ranking</span>
                      <span className="text-xs text-gray-500">
                        Difference: {matchup.scoreDiff.toFixed(2)} pts
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border-r pr-2">
                        <p className="font-bold text-sm">{matchup.teamA.teamName}</p>
                        <p className="text-xs">
                          {matchup.teamA.wins}-{matchup.teamA.losses} ({(matchup.teamA.winPercentage || 0).toFixed(3)})
                        </p>
                        <p className="text-xs text-tennis-blue font-medium">
                          Score: {matchup.teamA.compositeScore.toFixed(2)}
                        </p>
                      </div>
                      <div className="pl-2">
                        <p className="font-bold text-sm">{matchup.teamB.teamName}</p>
                        <p className="text-xs">
                          {matchup.teamB.wins}-{matchup.teamB.losses} ({(matchup.teamB.winPercentage || 0).toFixed(3)})
                        </p>
                        <p className="text-xs text-tennis-blue font-medium">
                          Score: {matchup.teamB.compositeScore.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-sm text-gray-500">
                No close matchups found for the current selection.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
