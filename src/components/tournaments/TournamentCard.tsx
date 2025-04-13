
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gender, Classification, TeamStanding } from '@/types';
import { Medal, Calendar, Info, Users } from 'lucide-react';
import TournamentBracket from './TournamentBracket';
import { Badge } from '@/components/ui/badge';

interface TournamentCardProps {
  type: 'Singles' | 'Doubles' | 'Team';
  gender: Gender;
  classification: Classification;
  districtName?: string;
  qualifiers?: TeamStanding[];
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  type,
  gender,
  classification,
  districtName,
  qualifiers
}) => {
  const isDistrict = !!districtName;
  
  // Tournament dates
  const tournamentDate = isDistrict
    ? new Date(2025, 4, 15) // May 15, 2025 for districts
    : new Date(2025, 4, 30); // May 30, 2025 for state
  
  const formattedDate = tournamentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // For state tournaments, we show qualifying information
  const qualificationInfo = !isDistrict ? 
    (type === 'Team' ? 
      `Top ${classification === '6A' ? 16 : classification === '5A' ? 12 : 8} teams qualify for state tournament` :
      "Top 4 qualifiers from each district tournament advance to state") 
    : "";
  
  // Format qualifiers for the bracket
  const formattedQualifiers = qualifiers?.map((team, index) => ({
    seed: index + 1,
    name: team.teamName,
    school: team.schoolName
  }));
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center">
            {type === 'Team' ? (
              <Users className="h-4 w-4 mr-2 text-tennis-blue" />
            ) : (
              <Medal className="h-4 w-4 mr-2 text-tennis-blue" />
            )}
            <h3 className="font-medium text-base">{type} Tournament</h3>
          </div>
          <Badge variant="outline" className="flex items-center text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </Badge>
        </div>
        
        {!isDistrict && qualificationInfo && (
          <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-100 text-xs">
            <div className="flex items-start">
              <Info className="h-3 w-3 mr-1.5 text-tennis-blue mt-0.5 flex-shrink-0" />
              <p>{qualificationInfo}</p>
            </div>
          </div>
        )}
        
        <TournamentBracket 
          type={type}
          gender={gender}
          classification={classification}
          districtName={districtName}
          qualifiers={formattedQualifiers}
        />
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {isDistrict 
              ? `${districtName} qualifier for the ${classification} ${gender} State Championship`
              : `${classification} ${gender} State Championship Tournament`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
