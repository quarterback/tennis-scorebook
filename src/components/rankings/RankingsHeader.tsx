
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface RankingsHeaderProps {
  daysUntilCutoff: number;
  cutoffDate: Date;
}

export const RankingsHeader: React.FC<RankingsHeaderProps> = ({ 
  daysUntilCutoff, 
  cutoffDate 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold flex items-center">
        <BarChart3 className="h-7 w-7 mr-2 text-tennis-blue" />
        Tennis Rankings
      </h1>
      
      <div className="text-right">
        <p className="text-sm text-gray-500">Current Season: Spring 2025</p>
        <p className="text-sm text-gray-500">
          {daysUntilCutoff > 0 
            ? `${daysUntilCutoff} days until rankings cutoff`
            : `Rankings cutoff: ${cutoffDate.toLocaleDateString()}`
          }
        </p>
      </div>
    </div>
  );
};
