import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import UI components
import DateRangePicker from './components/DateRangePicker';
import SeasonSelector from './components/SeasonSelector';
import MatchGenerationControls from './components/MatchGenerationControls';
import PlayerGenerationControls from './components/PlayerGenerationControls';

// Import seasons data
import { extendedSeasonsList } from './constants/seasons';

interface SimulationControlsProps {
  onSimulationComplete?: (results: any) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ 
  onSimulationComplete = () => {} 
}) => {
  const { schools, deleteAllMatches, deleteAllPlayers } = useData();
  const { toast } = useToast();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSeasonId, setSelectedSeasonId] = useState(extendedSeasonsList[3].id); // Default to current season
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(selectedYear, 8, 1)); // September 1st
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(selectedYear + 1, 4, 31)); // May 31st
  const [doubleRoundRobin, setDoubleRoundRobin] = useState(true);
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [isGeneratingPlayers, setIsGeneratingPlayers] = useState(false);
  const [isErasingData, setIsErasingData] = useState(false);
  
  // Update dates when season changes
  useEffect(() => {
    const selectedSeason = extendedSeasonsList.find(s => s.id === selectedSeasonId);
    if (selectedSeason) {
      setSelectedYear(selectedSeason.year);
      setStartDate(new Date(selectedSeason.year, 2, 1)); // March 1st
      setEndDate(new Date(selectedSeason.year, 4, 31)); // May 31st
    }
  }, [selectedSeasonId]);
  
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
  };
  
  const handleDoubleRoundRobinChange = (value: boolean) => {
    setDoubleRoundRobin(value);
  };
  
  // Track loading states for matches and players
  const handleGenerateMatches = () => {
    setGeneratingMatches(true);
    // Clear existing matches first
    deleteAllMatches();
    
    // This component will call the onSimulationComplete after matches are generated
    // We'll set generatingMatches to false in the component when complete
  };
  
  const handleGeneratePlayers = () => {
    setIsGeneratingPlayers(true);
    // Clear existing players first
    deleteAllPlayers();
    
    // We'll set isGeneratingPlayers to false in the component when complete
  };

  const handleEraseData = async () => {
    setIsErasingData(true);
    try {
      // Delete all matches and players
      await deleteAllMatches();
      await deleteAllPlayers();
      
      // Log success message
      console.log("All simulation data has been erased");
      
      // Show toast notification
      toast({
        title: "Data Erased",
        description: "All match and player data has been successfully removed",
        variant: "default"
      });
    } catch (error) {
      console.error("Error erasing data:", error);
      toast({
        title: "Error",
        description: "Failed to erase data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsErasingData(false);
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleEraseData}
            disabled={isErasingData || generatingMatches || isGeneratingPlayers}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isErasingData ? 'Erasing...' : 'Erase All Data'}
          </Button>
        </div>

        <SeasonSelector
          seasons={extendedSeasonsList}
          selectedSeasonId={selectedSeasonId}
          setSelectedSeasonId={setSelectedSeasonId}
          disabled={generatingMatches || isGeneratingPlayers}
        />
        
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          selectedYear={selectedYear}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          disabled={generatingMatches || isGeneratingPlayers}
        />
        
        <Separator className="my-4" />
        
        <MatchGenerationControls 
          startDate={startDate}
          endDate={endDate}
          doubleRoundRobin={doubleRoundRobin}
          onDoubleRoundRobinChange={handleDoubleRoundRobinChange}
          generatingMatches={generatingMatches}
          onSimulationComplete={(results) => {
            setGeneratingMatches(false);
            onSimulationComplete(results);
          }}
          disabled={isGeneratingPlayers}
        />
        
        <Separator className="my-4" />
        
        <PlayerGenerationControls
          isGeneratingPlayers={isGeneratingPlayers}
          selectedSeasonId={selectedSeasonId}
          seasons={extendedSeasonsList}
          disabled={generatingMatches}
          setIsGeneratingPlayers={setIsGeneratingPlayers}
        />
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
