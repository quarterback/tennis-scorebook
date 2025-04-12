
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gender, Classification } from '@/types';
import { Medal, Calendar, ChevronRight } from 'lucide-react';

interface TournamentCardProps {
  type: 'Singles' | 'Doubles' | 'Team';
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
  const tournamentDate = isDistrict
    ? new Date(2025, 4, 15) // May 15, 2025 for districts
    : new Date(2025, 4, 30); // May 30, 2025 for state
  
  const formattedDate = tournamentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Placeholder for tournament brackets
  const placeholderData = Array(8).fill(null).map((_, index) => ({
    id: `${type.toLowerCase()}-${index}`,
    position: index + 1,
    name: `Competitor ${index + 1}`,
    school: `School ${index + 1}`
  }));
  
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
        
        {/* Tournament participants */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Tournament Bracket</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placeholderData.map((participant) => (
              <div 
                key={participant.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="bg-tennis-blue text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs">
                    {participant.position}
                  </div>
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    <div className="text-sm text-gray-500">{participant.school}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
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
