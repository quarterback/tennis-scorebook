
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Calendar, TrendingUp, Award, Zap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Types for our player data
interface PlayerStats {
  id: string;
  name: string;
  school: string;
  wins: number;
  losses: number;
  powerRating: number;
}

interface DoublesTeam {
  id: string;
  players: string; // Format: "LastName/LastName"
  school: string;
  wins: number;
  losses: number;
  powerRating: number;
}

interface TournamentSchedule {
  districtName: string;
  dates: string;
  location: string;
}

interface PlayerLeaderboardProps {
  topSingles: PlayerStats[];
  topDoubles: DoublesTeam[];
  insights: {
    undefeatedCount: number;
    upsetOfSeason: string;
    longestStreak: string;
    crossClassSuccess: string;
    mostImproved: string;
  };
  tournaments: TournamentSchedule[];
}

const PlayerLeaderboard: React.FC<PlayerLeaderboardProps> = ({
  topSingles,
  topDoubles,
  insights,
  tournaments
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-tennis-gray pb-2">
            <CardTitle className="text-lg flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-tennis-blue" />
              1st Singles Standouts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Record</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSingles.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.school}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{player.wins}-{player.losses}</TableCell>
                    <TableCell className="text-right font-medium">{player.powerRating.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-tennis-gray pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-tennis-blue" />
              1st Doubles Dominance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Record</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDoubles.map((team, index) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{team.players}</div>
                        <div className="text-xs text-muted-foreground">{team.school}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{team.wins}-{team.losses}</TableCell>
                    <TableCell className="text-right font-medium">{team.powerRating.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-tennis-gray pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-tennis-green" />
              Key Season Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Award className="h-5 w-5 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Undefeated Players:</span> {insights.undefeatedCount} players remain undefeated in 1st Singles with 10+ matches
                </div>
              </li>
              <li className="flex items-start">
                <Zap className="h-5 w-5 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Upset of the Season:</span> {insights.upsetOfSeason}
                </div>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Longest Win Streak:</span> {insights.longestStreak}
                </div>
              </li>
              <li className="flex items-start">
                <Trophy className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Cross-Classification Success:</span> {insights.crossClassSuccess}
                </div>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Most Improved Program:</span> {insights.mostImproved}
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-tennis-gray pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-tennis-blue" />
              District Tournament Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.districtName}>
                    <TableCell className="font-medium">{tournament.districtName}</TableCell>
                    <TableCell>{tournament.dates}</TableCell>
                    <TableCell>{tournament.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerLeaderboard;
