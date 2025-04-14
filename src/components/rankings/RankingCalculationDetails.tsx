import React from 'react';
import { TeamRanking } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BarChart3, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
                  <TableHead className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center">
                            FWS
                            <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Flight-Weighted Score: Points earned from match wins, weighted by position importance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center">
                            LSC
                            <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">League Strength Coefficient: Calculated from historical league performance at state tournaments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center">
                            OSI
                            <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Opponent Strength Index: Based on the strength of opponents faced</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center">
                            APR
                            <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Athletic Power Ranking: Overall rating on a 0-100 scale based on team performance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifiedTeams.map((team, index) => (
                  <TableRow key={team.teamId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{team.teamName}</div>
                        <div className="text-xs text-gray-500">
                          {team.wins}-{team.losses} overall, {team.leagueWins}-{team.leagueLosses} league
                        </div>
                      </div>
                    </TableCell>
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
                      {team.apr.toFixed(1)}
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
              Teams must play at least 6 matches to qualify for rankings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
