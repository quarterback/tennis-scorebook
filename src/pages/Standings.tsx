
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListOrdered } from 'lucide-react';
import { Gender, Classification } from '@/types';
import StandingsFilter from '@/components/standings/StandingsFilter';
import StandingsTable from '@/components/standings/StandingsTable';
import TournamentDisplay from '@/components/standings/TournamentDisplay';

const Standings = () => {
  const { getStandings, districts, getDistrictsByClassification, getStateQualifiers } = useData();
  const [selectedGender, setSelectedGender] = useState<Gender>('Boys');
  const [selectedClassification, setSelectedClassification] = useState<Classification>('6A');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('standings');
  
  // Get all available districts for the selected classification
  const availableDistricts = getDistrictsByClassification(selectedClassification);
  
  // Get standings
  const standings = getStandings(selectedGender, selectedClassification, selectedDistrictId);
  
  // Get selected district name for display
  const selectedDistrictName = selectedDistrictId 
    ? districts.find(d => d.id === selectedDistrictId)?.name
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <ListOrdered className="h-7 w-7 mr-2 text-tennis-blue" />
          Tennis Program
        </h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standings" className="space-y-6">
          <StandingsFilter 
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedClassification={selectedClassification}
            setSelectedClassification={setSelectedClassification}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
            availableDistricts={availableDistricts}
            activeTab={activeTab}
          />
          
          <StandingsTable 
            standings={standings}
            selectedGender={selectedGender}
            selectedClassification={selectedClassification}
            selectedDistrictName={selectedDistrictName}
          />
        </TabsContent>
        
        <TabsContent value="tournaments" className="space-y-6">
          <StandingsFilter 
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedClassification={selectedClassification}
            setSelectedClassification={setSelectedClassification}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
            availableDistricts={availableDistricts}
            activeTab={activeTab}
          />
          
          <TournamentDisplay 
            gender={selectedGender}
            classification={selectedClassification}
            selectedDistrictId={selectedDistrictId}
            availableDistricts={availableDistricts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Standings;
