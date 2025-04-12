
import React from 'react';
import { TeamRanking, RankingConfig } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Award, AlertCircle } from 'lucide-react';

interface UnqualifiedTeamsTableProps {
  unqualifiedTeams: TeamRanking[];
  defaultConfig: RankingConfig;
}

export const UnqualifiedTeamsTable: React.FC<UnqualifiedTeamsTableProps> = ({ 
  unqualifiedTeams, 
  defaultConfig 
}) => {
  if (unqualifiedTeams.length === 0) {
    return null;
  }
  
  // Current date for comparison with cutoff date
  const currentDate = new Date();
  const cutoffDate = new Date(defaultConfig.cutoffDate);
  const daysUntilCutoff = Math.ceil((cutoffDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  
  return (
    <Card className="mt-6">
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
          Unqualified Teams (Less than {defaultConfig.minimumMatches} matches)
          {daysUntilCutoff > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({daysUntilCutoff} days until cutoff)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">League</TableHead>
                <TableHead className="text-center">Record</TableHead>
                <TableHead className="text-center">Matches</TableHead>
                <TableHead className="text-center">Projected Composite</TableHead>
                <TableHead className="text-center">Matches Needed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unqualifiedTeams.map((team, index) => (
                <TableRow key={team.teamId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <TableCell className="font-medium">{team.teamName}</TableCell>
                  <TableCell className="text-center">{team.districtName}</TableCell>
                  <TableCell className="text-center">{team.wins}-{team.losses}</TableCell>
                  <TableCell className="text-center">{team.matchesPlayed}</TableCell>
                  <TableCell className="text-center font-medium">{team.compositeScore.toFixed(2)}</TableCell>
                  <TableCell className="text-center text-red-500 font-medium">
                    {defaultConfig.minimumMatches - team.matchesPlayed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
