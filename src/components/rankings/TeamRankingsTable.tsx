
import React from 'react';
import { TeamRanking, RankingConfig } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Award, Medal, Calendar } from 'lucide-react';

interface TeamRankingsTableProps {
  qualifiedTeams: TeamRanking[];
  defaultConfig: RankingConfig;
}

export const TeamRankingsTable: React.FC<TeamRankingsTableProps> = ({ qualifiedTeams, defaultConfig }) => {
  // Get current date and cutoff date for comparison
  const today = new Date();
  const cutoffDate = new Date(defaultConfig.cutoffDate);
  const isBeforeCutoff = today < cutoffDate;

  return (
    <Card>
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-tennis-blue" />
            Overall Rankings
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Minimum {defaultConfig.minimumMatches} matches required)
            </span>
          </div>
          <div className="flex items-center text-sm font-normal text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {isBeforeCutoff ? 'Projected Rankings' : 'Final Rankings'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {qualifiedTeams.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">League</TableHead>
                  <TableHead className="text-center">Record</TableHead>
                  <TableHead className="text-center">Win %</TableHead>
                  <TableHead className="text-center">Matches</TableHead>
                  <TableHead className="text-center">Composite Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifiedTeams.map((team, index) => (
                  <TableRow key={team.teamId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className={`min-w-8 h-8 flex items-center justify-center rounded-full 
                          ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                            index === 1 ? 'bg-gray-100 text-gray-800' : 
                            index === 2 ? 'bg-amber-100 text-amber-800' : ''}`}>
                          {index + 1}
                        </span>
                        {index < 3 && (
                          <Medal className={`h-4 w-4 ml-1 ${
                            index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-500' : 'text-amber-700'
                          }`} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{team.teamName}</TableCell>
                    <TableCell className="text-center">{team.districtName}</TableCell>
                    <TableCell className="text-center">{team.wins}-{team.losses}</TableCell>
                    <TableCell className="text-center">
                      {(team.winPercentage || 0).toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center">{team.matchesPlayed}</TableCell>
                    <TableCell className="text-center font-medium">{team.compositeScore.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <Award className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No qualified teams found</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              There are no teams that have played the minimum required {defaultConfig.minimumMatches} matches.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
