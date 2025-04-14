
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Season } from '@/types';

interface SimulationWarningProps {
  selectedSeason: Season | undefined;
}

const SimulationWarning: React.FC<SimulationWarningProps> = ({ selectedSeason }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm flex items-start space-x-2.5">
      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Warning: Simulation will generate historical data</p>
        <p className="mt-1">This will create players and matches for the selected season ({selectedSeason?.name || ''}).</p>
      </div>
    </div>
  );
};

export default SimulationWarning;
