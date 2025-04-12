
import React from 'react';
import { TeamRanking } from '@/types/ranking';
import { AlertCircle } from 'lucide-react';
import { LeagueStandingsCard } from './LeagueStandingsCard';

interface LeagueStandingsViewProps {
  teamsByDistrict: Record<string, TeamRanking[]>;
  qualifiedTeams: TeamRanking[];
}

export const LeagueStandingsView: React.FC<LeagueStandingsViewProps> = ({ 
  teamsByDistrict, 
  qualifiedTeams 
}) => {
  if (Object.keys(teamsByDistrict).length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-lg">
        <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No league standings available</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          There are no qualified teams in any leagues for this selection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.keys(teamsByDistrict).map(district => (
        <LeagueStandingsCard 
          key={district} 
          district={district} 
          teams={teamsByDistrict[district]} 
          qualifiedTeams={qualifiedTeams} 
        />
      ))}
    </div>
  );
};
