
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SimulationErrorProps {
  error: string | null;
}

const SimulationError: React.FC<SimulationErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default SimulationError;
