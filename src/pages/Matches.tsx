
import React, { useState } from 'react';
import { MatchesProvider } from '@/context/MatchesContext';
import MatchesHeader from '@/components/matches/MatchesHeader';
import MatchesTabs from '@/components/matches/MatchesTabs';
import MatchDialogs from '@/components/matches/MatchDialogs';
import SimulationControls from '@/components/simulation/SimulationControls';
import MediaToolbar from '@/components/matches/MediaToolbar';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import CustomMatchTabContent from '@/components/matches/CustomMatchTabContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Matches = () => {
  const [showSimulation, setShowSimulation] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <MatchesProvider>
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <MatchesHeader />
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto justify-between xs:justify-end">
            <MediaToolbar />
            <Button 
              variant={showSimulation ? "default" : "outline"} 
              size="sm"
              onClick={() => setShowSimulation(!showSimulation)}
              className="gap-1.5 text-xs sm:text-sm w-full xs:w-auto"
            >
              <FlaskConical className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              {isMobile ? 'Data' : showSimulation ? 'Hide Simulation' : 'Generate Data'}
            </Button>
          </div>
        </div>
        
        {showSimulation && (
          <>
            <Separator className="my-4" />
            <SimulationControls />
          </>
        )}
        
        <Alert className="bg-blue-50 border-blue-200 mb-4">
          <AlertTitle className="text-blue-700">Match Management Tools</AlertTitle>
          <AlertDescription className="text-blue-600">
            Use the search and filter controls to find specific matches. You can filter by team name, gender, and sort by date.
            Now you can delete any match by clicking the options menu on each match card.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Matches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <CustomMatchTabContent status="upcoming" />
          </TabsContent>
          
          <TabsContent value="completed">
            <CustomMatchTabContent status="completed" />
          </TabsContent>
          
          <TabsContent value="all">
            <CustomMatchTabContent status="all" />
          </TabsContent>
        </Tabs>
        
        <MatchDialogs />
      </div>
    </MatchesProvider>
  );
};

export default Matches;
