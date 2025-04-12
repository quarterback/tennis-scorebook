
import React from 'react';
import { TeamRanking } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BarChart3 } from 'lucide-react';

interface RankingCalculationDetailsProps {
  qualifiedTeams: TeamRanking[];
}

export const RankingCalculationDetails: React.FC<RankingCalculationDetailsProps> = ({ qualifiedTeams }) => {
  return (
    <Card>
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-tennis-blue" />
          Calculation Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {qualifiedTeams.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">FWS</TableHead>
                  <TableHead className="text-center">LSC</TableHead>
                  <TableHead className="text-center">OSI</TableHead>
                  <TableHead className="text-center">Composite Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifiedTeams.map((team, index) => (
                  <TableRow key={team.teamId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell className="text-center" title="Flight-Weighted Score">
                      {team.flightWeightedScore.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center" title="League Strength Coefficient">
                      {team.leagueStrengthCoefficient.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center" title="Opponent Strength Index">
                      {team.opponentStrengthIndex.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {team.compositeScore.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No calculation data available</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              There are no qualified teams to display calculation details for.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
