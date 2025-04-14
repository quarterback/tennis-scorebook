
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  progress: number;
  isVisible: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Generating data...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};

export default ProgressIndicator;
