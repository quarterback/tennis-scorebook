
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Medal, FlaskConical, ArrowRightCircle, Info, Trophy, Shield } from 'lucide-react';
import { TeamStanding } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StandingsTableProps {
  standings: TeamStanding[];
  selectedGender: string;
  selectedClassification: string;
  selectedDistrictName?: string;
}

const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  selectedGender,
  selectedClassification,
  selectedDistrictName
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCoach = user?.role === 'coach';
  const is4A3A2A1A = selectedClassification === '4A/3A/2A/1A';

  // Determine qualification statuses based on classification and standings
  const determineQualificationStatus = () => {
    // Create a copy of standings to avoid mutating the original
    const standingsWithQualification = [...standings];
    
    // If no district is selected, can't determine automatic qualifiers
    if (!selectedDistrictName) return standingsWithQualification;
    
    // Determine automatic qualifier (top team from district)
    if (standings.length > 0) {
      // The first team in district standings is the automatic qualifier
      if (standingsWithQualification[0]) {
        standingsWithQualification[0].qualificationStatus = 'automatic';
        standingsWithQualification[0].qualificationSeed = 1; // Placeholder seed
      }
    }
    
    return standingsWithQualification;
  };
  
  const standingsWithQualification = determineQualificationStatus();

  const navigateToSimulation = () => {
    navigate('/');
  };

  return (
    <Card>
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-tennis-blue" />
            {selectedGender} {selectedClassification} {selectedDistrictName ? `- ${selectedDistrictName}` : ''} Standings
          </div>
          {is4A3A2A1A && !selectedDistrictName && (
            <div className="flex items-center text-sm font-normal text-gray-500">
              <Info className="h-4 w-4 mr-1" />
              All teams from all Special Districts are shown. Select a specific district for detailed standings.
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {standingsWithQualification.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">League W-L</TableHead>
                <TableHead className="text-center">League %</TableHead>
                <TableHead className="text-center">Overall W-L</TableHead>
                <TableHead className="text-center">Overall %</TableHead>
                {selectedDistrictName && (
                  <TableHead className="text-center">Qualification</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {standingsWithQualification.map((standing, index) => {
                const leagueTotal = standing.leagueWins + standing.leagueLosses;
                const leagueWinPct = leagueTotal > 0 ? standing.leagueWins / leagueTotal : 0;
                
                const overallTotal = standing.overallWins + standing.overallLosses;
                const overallWinPct = overallTotal > 0 ? standing.overallWins / overallTotal : 0;
                
                return (
                  <TableRow key={standing.teamId}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`font-medium min-w-8 h-8 flex items-center justify-center rounded-full 
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
                    <TableCell>
                      <div>
                        <div className="font-medium">{standing.teamName}</div>
                        <div className="text-sm text-gray-500">{standing.districtName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {standing.leagueWins}-{standing.leagueLosses}
                    </TableCell>
                    <TableCell className="text-center">
                      {leagueTotal > 0 ? leagueWinPct.toFixed(3) : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {standing.overallWins}-{standing.overallLosses}
                    </TableCell>
                    <TableCell className="text-center">
                      {overallTotal > 0 ? overallWinPct.toFixed(3) : '-'}
                    </TableCell>
                    {selectedDistrictName && (
                      <TableCell className="text-center">
                        {standing.qualificationStatus === 'automatic' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-center">
                                  <Trophy className="h-4 w-4 text-blue-500" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                Automatic Qualifier
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 px-4">
            <FlaskConical className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No standings data available</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              There are no teams found for {selectedGender} {selectedClassification} 
              {selectedDistrictName ? ` in ${selectedDistrictName}` : ''}. 
            </p>
            <div className="mt-4">
              <p className="text-sm text-blue-600 mb-3">
                You need to generate match data first using the simulation tool on the Dashboard.
              </p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={navigateToSimulation}
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                Go to Data Simulation
                <ArrowRightCircle className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandingsTable;
