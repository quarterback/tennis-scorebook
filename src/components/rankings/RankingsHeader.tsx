
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RankingsHeaderProps {
  daysUntilCutoff: number;
  cutoffDate: Date;
}

export const RankingsHeader: React.FC<RankingsHeaderProps> = ({ 
  daysUntilCutoff, 
  cutoffDate 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-start sm:items-center`}>
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
        <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-tennis-blue" />
        Tennis Rankings
      </h1>
      
      <div className={`${isMobile ? 'w-full' : 'text-right'}`}>
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
