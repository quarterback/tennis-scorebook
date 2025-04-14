
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { format } from 'date-fns';

interface SeasonInfoAlertProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  seasonWeeks: number;
  theoreticalMaxMatches: number;
}

const SeasonInfoAlert: React.FC<SeasonInfoAlertProps> = ({
  startDate,
  endDate,
  seasonWeeks,
  theoreticalMaxMatches
}) => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-5 w-5 text-blue-500" />
      <AlertDescription className="text-blue-800 text-sm">
        Season length: <span className="font-medium">{seasonWeeks} weeks</span> ({startDate && endDate ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}` : 'Not set'})
        <br />
        <span>This season can theoretically support up to ~{theoreticalMaxMatches} matches per team</span>
      </AlertDescription>
    </Alert>
  );
};

export default SeasonInfoAlert;
