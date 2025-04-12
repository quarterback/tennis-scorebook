
import React from 'react';
import { BarChart3, Trophy, Award, Medal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Classification } from '@/types';

interface RankingsHeaderProps {
  daysUntilCutoff: number;
  cutoffDate: Date;
  selectedClassification: Classification;
}

export const RankingsHeader: React.FC<RankingsHeaderProps> = ({ 
  daysUntilCutoff, 
  cutoffDate,
  selectedClassification
}) => {
  const isMobile = useIsMobile();

  // Determine icon and title based on classification
  const getClassificationIcon = () => {
    switch (selectedClassification) {
      case '6A':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case '5A':
        return <Award className="h-5 w-5 text-blue-500" />;
      case '4A/3A/2A/1A':
        return <Medal className="h-5 w-5 text-green-500" />;
      default:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  return (
    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between'} items-start sm:items-center mb-4`}>
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
        <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-tennis-blue" />
        {selectedClassification} Tennis Rankings
      </h1>
      
      <div className={`${isMobile ? 'w-full' : 'text-right'} flex items-center ${isMobile ? '' : 'gap-2'}`}>
        <div className="text-xs md:text-sm">
          <p className="text-gray-500">Current Season: Spring 2025</p>
          <p className="text-gray-500">
            {daysUntilCutoff > 0 
              ? `${daysUntilCutoff} days until rankings cutoff`
              : `Rankings cutoff: ${cutoffDate.toLocaleDateString()}`
            }
          </p>
        </div>
        <div className="hidden md:block">
          {getClassificationIcon()}
        </div>
      </div>
    </div>
  );
};
