
import React, { useState } from 'react';
import { MatchesProvider } from '@/context/MatchesContext';
import MatchesHeader from '@/components/matches/MatchesHeader';
import MatchesTabs from '@/components/matches/MatchesTabs';
import MatchDialogs from '@/components/matches/MatchDialogs';
import SimulationControls from '@/components/simulation/SimulationControls';
import MediaToolbar from '@/components/matches/MediaToolbar';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';

const Matches = () => {
  const [showSimulation, setShowSimulation] = useState(false);
  
  return (
    <MatchesProvider>
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <MatchesHeader />
          <div className="flex gap-2 flex-wrap">
            <MediaToolbar />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSimulation(!showSimulation)}
              className="gap-1.5"
            >
              <FlaskConical className="h-4 w-4 text-purple-500" />
              {showSimulation ? 'Hide Simulation' : 'Generate Data'}
            </Button>
          </div>
        </div>
        
        {showSimulation && <SimulationControls />}
        <MatchesTabs />
        <MatchDialogs />
      </div>
    </MatchesProvider>
  );
};

export default Matches;
