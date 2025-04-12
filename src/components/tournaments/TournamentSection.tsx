
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gender, Classification } from '@/types';
import { Trophy, Flag } from 'lucide-react';
import TournamentCard from './TournamentCard';

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
  const isDistrictTournament = !!districtId;
  
  return (
    <Card className="bg-white mt-6">
      <CardHeader className="bg-tennis-gray pb-2">
        <CardTitle className="text-lg flex items-center">
          {isDistrictTournament ? (
            <Flag className="h-5 w-5 mr-2 text-tennis-blue" />
          ) : (
            <Trophy className="h-5 w-5 mr-2 text-tennis-blue" />
          )}
          {isDistrictTournament 
            ? `${districtName} ${gender} ${classification} District Tournament`
            : `${gender} ${classification} State Tournament`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="singles" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="singles">Singles</TabsTrigger>
            <TabsTrigger value="doubles">Doubles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="singles" className="space-y-4">
            <TournamentCard 
              type="Singles"
              gender={gender}
              classification={classification}
              districtName={districtName}
            />
          </TabsContent>
          
          <TabsContent value="doubles" className="space-y-4">
            <TournamentCard 
              type="Doubles"
              gender={gender}
              classification={classification}
              districtName={districtName}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TournamentSection;
