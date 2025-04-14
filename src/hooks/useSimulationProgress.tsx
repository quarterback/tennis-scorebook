
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useSimulationProgress = () => {
  const [generatingData, setGeneratingData] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const startProgress = () => {
    setGeneratingData(true);
    setProgress(0);
  };

  const updateProgress = (value: number) => {
    setProgress(value);
  };

  const completeProgress = (playersCount: number, matchesCount: number) => {
    setProgress(100);
    toast({
      title: "Data Generation Complete",
      description: `Generated ${playersCount} players and ${matchesCount} matches.`
    });
    setGeneratingData(false);
  };

  const handleError = (error: unknown) => {
    console.error("Error generating data:", error);
    toast({
      title: "Error Generating Data",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    setGeneratingData(false);
  };

  return {
    generatingData,
    progress,
    startProgress,
    updateProgress,
    completeProgress,
    handleError
  };
};
