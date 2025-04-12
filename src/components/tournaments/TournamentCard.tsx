
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gender, Classification } from '@/types';
import { Medal, Calendar, Info } from 'lucide-react';
import TournamentBracket from './TournamentBracket';

interface TournamentCardProps {
  type: 'Singles' | 'Doubles';
  gender: Gender;
  classification: Classification;
  districtName?: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  type,
  gender,
  classification,
  districtName
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
    "Top 4 qualifiers from each district tournament advance to state" : "";
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Medal className="h-5 w-5 mr-2 text-tennis-blue" />
            <h3 className="font-medium text-lg">{type} Tournament</h3>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {!isDistrict && qualificationInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-100 text-sm">
            <div className="flex items-start">
              <Info className="h-4 w-4 mr-2 text-tennis-blue mt-0.5" />
              <p>{qualificationInfo}</p>
            </div>
          </div>
        )}
        
        <TournamentBracket 
          type={type}
          gender={gender}
          classification={classification}
          districtName={districtName}
        />
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
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
