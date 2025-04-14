
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
        <MatchesTabs />
        <MatchDialogs />
      </div>
    </MatchesProvider>
  );
};

export default Matches;
