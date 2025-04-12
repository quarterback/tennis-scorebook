
import React from 'react';
import { TeamRanking } from '@/types/ranking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Award } from 'lucide-react';

interface LeagueStandingsCardProps {
  district: string;
  teams: TeamRanking[];
  qualifiedTeams: TeamRanking[];
}

export const LeagueStandingsCard: React.FC<LeagueStandingsCardProps> = ({ 
  district, 
  teams, 
  qualifiedTeams 
}) => {
  return (
    <Card key={district}>
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="flex items-center text-lg">
          <Award className="h-5 w-5 mr-2 text-tennis-blue" />
          {district} Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">League Record</TableHead>
              <TableHead className="text-center">League Win %</TableHead>
              <TableHead className="text-center">Overall Record</TableHead>
              <TableHead className="text-center">Overall Rank</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => {
              // Find overall ranking
              const overallRank = qualifiedTeams.findIndex(t => t.teamId === team.teamId) + 1;
              
              return (
                <TableRow key={team.teamId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <span className="min-w-8 h-8 flex items-center justify-center rounded-full 
                        bg-yellow-100 text-yellow-800">1</span>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{team.teamName}</TableCell>
                  <TableCell className="text-center">{team.leagueWins}-{team.leagueLosses}</TableCell>
                  <TableCell className="text-center">
                    {(team.leagueWinPercentage || 0).toFixed(3)}
                  </TableCell>
                  <TableCell className="text-center">{team.wins}-{team.losses}</TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 bg-tennis-blue text-white rounded-full text-xs">
                      #{overallRank}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
