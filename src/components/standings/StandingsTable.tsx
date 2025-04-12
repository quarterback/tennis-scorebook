
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Medal } from 'lucide-react';
import { TeamStanding } from '@/types';
import { useAuth } from '@/context/AuthContext';

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
  const isCoach = user?.role === 'coach';

  return (
    <Card>
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-tennis-blue" />
          {selectedGender} {selectedClassification} {selectedDistrictName ? `- ${selectedDistrictName}` : ''} Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {standings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Team</th>
                  <th className="text-center py-3 px-4">League W-L</th>
                  <th className="text-center py-3 px-4">League %</th>
                  <th className="text-center py-3 px-4">Overall W-L</th>
                  <th className="text-center py-3 px-4">Overall %</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((standing, index) => {
                  const leagueTotal = standing.leagueWins + standing.leagueLosses;
                  const leagueWinPct = leagueTotal > 0 ? standing.leagueWins / leagueTotal : 0;
                  
                  const overallTotal = standing.overallWins + standing.overallLosses;
                  const overallWinPct = overallTotal > 0 ? standing.overallWins / overallTotal : 0;
                  
                  return (
                    <tr key={standing.teamId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
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
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{standing.teamName}</div>
                          {!isCoach && (
                            <div className="text-sm text-gray-500">{standing.districtName}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {standing.leagueWins}-{standing.leagueLosses}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {leagueTotal > 0 ? leagueWinPct.toFixed(3) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {standing.overallWins}-{standing.overallLosses}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {overallTotal > 0 ? overallWinPct.toFixed(3) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <Award className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No standings data available</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              There are no teams found for {selectedGender} {selectedClassification} 
              {selectedDistrictName ? ` in ${selectedDistrictName}` : ''}. 
              Try changing your filters or add some matches to see standings here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandingsTable;
