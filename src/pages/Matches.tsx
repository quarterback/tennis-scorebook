
import React, { useState } from 'react';
import { MatchesProvider } from '@/context/MatchesContext';
import MatchesHeader from '@/components/matches/MatchesHeader';
import MatchesTabs from '@/components/matches/MatchesTabs';
import MatchDialogs from '@/components/matches/MatchDialogs';
import SimulationControls from '@/components/simulation/SimulationControls';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';

const Matches = () => {
  const [showSimulation, setShowSimulation] = useState(false);
  
  return (
    <MatchesProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <MatchesHeader />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSimulation(!showSimulation)}
            className="gap-1.5"
          >
            <FlaskConical className="h-4 w-4 text-purple-500" />
            {showSimulation ? 'Hide Simulation' : 'Show Simulation'}
          </Button>
        </div>
        
        {showSimulation && <SimulationControls />}
        <MatchesTabs />
        <MatchDialogs />
      </div>
    </MatchesProvider>
  );
};

export default Matches;
