
import React, { useState } from 'react';
import TournamentSection from '@/components/tournaments/TournamentSection';
import { Gender, Classification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, User } from 'lucide-react';
import TournamentBracketEditor from '@/components/tournaments/TournamentBracketEditor';

interface TournamentDisplayProps {
  gender: Gender;
  classification: Classification;
  selectedDistrictId?: string;
  availableDistricts: Array<{ id: string; name: string }>;
}

const TournamentDisplay: React.FC<TournamentDisplayProps> = ({
  gender,
  classification,
  selectedDistrictId,
  availableDistricts
}) => {
  // Find the selected district name
  const selectedDistrictName = selectedDistrictId 
    ? availableDistricts.find(d => d.id === selectedDistrictId)?.name
    : undefined;
  
  const [activeTab, setActiveTab] = useState<string>("team");
    
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            {classification} {gender} State Tournament
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="mb-4">
              <TabsTrigger value="team">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Team
                </div>
              </TabsTrigger>
              <TabsTrigger value="singles">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Singles
                </div>
              </TabsTrigger>
              <TabsTrigger value="doubles">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Doubles
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="team">
              <TournamentBracketEditor 
                type="Team"
                gender={gender}
                classification={classification}
              />
            </TabsContent>
            
            <TabsContent value="singles">
              <TournamentBracketEditor 
                type="Singles"
                gender={gender}
                classification={classification}
              />
            </TabsContent>
            
            <TabsContent value="doubles">
              <TournamentBracketEditor 
                type="Doubles"
                gender={gender}
                classification={classification}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Display District Tournaments */}
      {selectedDistrictId ? (
        <Card className="mb-6">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-blue-500" />
              {selectedDistrictName} District Tournament ({classification} {gender})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="mb-4">
                <TabsTrigger value="team">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Team
                  </div>
                </TabsTrigger>
                <TabsTrigger value="singles">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Singles
                  </div>
                </TabsTrigger>
                <TabsTrigger value="doubles">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Doubles
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="team">
                <TournamentBracketEditor 
                  type="Team"
                  gender={gender}
                  classification={classification}
                  districtName={selectedDistrictName}
                />
              </TabsContent>
              
              <TabsContent value="singles">
                <TournamentBracketEditor 
                  type="Singles"
                  gender={gender}
                  classification={classification}
                  districtName={selectedDistrictName}
                />
              </TabsContent>
              
              <TabsContent value="doubles">
                <TournamentBracketEditor 
                  type="Doubles"
                  gender={gender}
                  classification={classification}
                  districtName={selectedDistrictName}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        availableDistricts.map(district => (
          <Card key={district.id} className="mb-6">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-blue-500" />
                {district.name} District Tournament ({classification} {gender})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="mb-4">
                  <TabsTrigger value="team">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      Team
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="singles">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Singles
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="doubles">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Doubles
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="team">
                  <TournamentBracketEditor 
                    type="Team"
                    gender={gender}
                    classification={classification}
                    districtName={district.name}
                  />
                </TabsContent>
                
                <TabsContent value="singles">
                  <TournamentBracketEditor 
                    type="Singles"
                    gender={gender}
                    classification={classification}
                    districtName={district.name}
                  />
                </TabsContent>
                
                <TabsContent value="doubles">
                  <TournamentBracketEditor 
                    type="Doubles"
                    gender={gender}
                    classification={classification}
                    districtName={district.name}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
};

export default TournamentDisplay;
