
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamRanking } from '@/types/ranking';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ItaRankingsTableProps {
  rankings: TeamRanking[];
  displayLimit?: number;
}

export function ItaRankingsTable({ rankings, displayLimit }: ItaRankingsTableProps) {
  // Apply display limit if specified
  const displayRankings = displayLimit ? rankings.slice(0, displayLimit) : rankings;
  
  // Find the maximum points to scale the progress bars
  const maxPoints = rankings.length > 0 ? Math.max(...rankings.map(r => r.compositeScore)) : 1;
  
  // Define qualification status based on rankings
  const getQualificationStatus = (rank: number, classification: string): {
    status: 'automatic' | 'at-large' | 'none';
    badge: React.ReactNode;
  } => {
    // Different qualification rules by classification
    if (classification === '6A') {
      if (rank <= 7) {
        return { 
          status: 'automatic',
          badge: <Badge className="bg-green-500">Auto Qualifier</Badge>
        };
      } else if (rank <= 16) {
        return { 
          status: 'at-large',
          badge: <Badge className="bg-blue-500">At-Large</Badge>
        };
      }
    } else if (classification === '5A') {
      if (rank <= 4) {
        return { 
          status: 'automatic',
          badge: <Badge className="bg-green-500">Auto Qualifier</Badge>
        };
      } else if (rank <= 12) {
        return { 
          status: 'at-large',
          badge: <Badge className="bg-blue-500">At-Large</Badge>
        };
      }
    } else if (classification === '4A/3A/2A/1A') {
      if (rank <= 5) {
        return { 
          status: 'automatic',
          badge: <Badge className="bg-green-500">Auto Qualifier</Badge>
        };
      } else if (rank <= 8) {
        return { 
          status: 'at-large',
          badge: <Badge className="bg-blue-500">At-Large</Badge>
        };
      }
    }
    
    return { 
      status: 'none',
      badge: null
    };
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Record</TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      ITA Points <Info className="h-3 w-3 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Points calculated based on opponent ranking, home/away status, and match type. Only the best wins count.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRankings.length > 0 ? (
              displayRankings.map((team, index) => {
                const { badge } = getQualificationStatus(index + 1, team.classification);
                
                return (
                  <TableRow key={team.teamId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell>{team.districtName}</TableCell>
                    <TableCell>
                      {team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''}
                    </TableCell>
                    <TableCell>{team.compositeScore.toFixed(1)}</TableCell>
                    <TableCell>{badge}</TableCell>
                    <TableCell className="text-right">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (team.compositeScore / maxPoints) * 100)}%` }}
                        ></div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No rankings data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
