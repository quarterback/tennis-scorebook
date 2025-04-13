
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Map } from 'lucide-react';
import { Gender, Classification, TeamStanding } from '@/types';
import TournamentCard from './TournamentCard';
import { useData } from '@/context/DataContext';

interface TournamentSectionProps {
  gender: Gender;
  classification: Classification;
  districtId?: string;
  districtName?: string;
}

const TournamentSection: React.FC<TournamentSectionProps> = ({
  gender,
  classification,
  districtId,
  districtName
}) => {
  const { getStandings, getStateQualifiers } = useData();
  
  // Get qualifiers for team tournament
  let qualifiers: TeamStanding[] = [];
  if (districtId) {
    // For district tournaments, get the top 4 teams from that district
    qualifiers = getStandings(gender, classification, districtId).slice(0, 4);
  } else {
    // For state tournaments, get the top N teams overall
    qualifiers = getStateQualifiers ? getStateQualifiers(gender, classification) : [];
  }
  
  return (
    <Card className="mb-6">
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="flex items-center text-lg">
          {districtName ? (
            <Map className="h-5 w-5 mr-2 text-tennis-blue" />
          ) : (
            <Trophy className="h-5 w-5 mr-2 text-tennis-blue" />
          )}
          {districtName ? `${districtName} Tournaments` : `${classification} ${gender} State Tournaments`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <TournamentCard
            type="Team"
            gender={gender}
            classification={classification}
            districtName={districtName}
            qualifiers={qualifiers}
          />
          <TournamentCard
            type="Singles"
            gender={gender}
            classification={classification}
            districtName={districtName}
          />
          <TournamentCard
            type="Doubles"
            gender={gender}
            classification={classification}
            districtName={districtName}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentSection;
