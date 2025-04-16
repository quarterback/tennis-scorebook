
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { PlayerSkillTier } from '@/types';
import { Team, School, District, Match, Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Users, Calendar, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Import UI components for the new design
import DateRangePicker from './components/DateRangePicker';
import RoundRobinToggle from './components/RoundRobinToggle';

interface SimulationControlsProps {
  onSimulationComplete?: (results: any) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ 
  onSimulationComplete = () => {} 
}) => {
  const {
    teams,
    players,
    addPlayer,
    addMatch,
    schools,
    districts,
    deleteAllMatches,
    deleteAllPlayers
  } = useData();
  
  const { toast } = useToast();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() + 1);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(selectedYear, 8, 1)); // September 1st
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(selectedYear + 1, 4, 31)); // May 31st
  const [doubleRoundRobin, setDoubleRoundRobin] = useState(true);
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [isGeneratingPlayers, setIsGeneratingPlayers] = useState(false);
  
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
  };
  
  const handleDoubleRoundRobinChange = (value: boolean) => {
    setDoubleRoundRobin(value);
  };
  
  const handleGenerateMatches = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date Selection Required",
        description: "Please select both start and end dates for the season.",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingMatches(true);
    
    // Clear existing matches first
    deleteAllMatches();
    
    // Import needed hook dynamically to avoid circular dependencies
    import('@/hooks/useMatchGeneration').then(({ useMatchGeneration }) => {
      const { generateMatchData } = useMatchGeneration();
      
      try {
        const matches = generateMatchData(
          teams,
          schools,
          districts,
          players,
          [], // Empty ladders array as it's not actually used in the simulation logic
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            doubleRoundRobin: doubleRoundRobin
          }
        );
        
        // Add all generated matches to the state
        matches.forEach(match => {
          addMatch(match);
        });
        
        toast({
          title: "Match Generation Complete",
          description: `Generated ${matches.length} matches successfully`,
          variant: "success"
        });
        
        console.log(`Generated ${matches.length} matches successfully`);
        
        // Call onSimulationComplete with matches
        onSimulationComplete(matches);
      } catch (error) {
        console.error('Error generating matches:', error);
        toast({
          title: "Error Generating Matches",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      } finally {
        setGeneratingMatches(false);
      }
    });
  };
  
  const handleGeneratePlayers = () => {
    setIsGeneratingPlayers(true);
    
    // Clear existing players first
    deleteAllPlayers();
    
    const currentSeason = {
      id: crypto.randomUUID(),
      year: new Date().getFullYear(),
      name: `Fall ${new Date().getFullYear()}`,
      isCurrent: true
    };
    
    // Import needed hook dynamically
    import('@/hooks/usePlayerGeneration').then(({ usePlayerGeneration }) => {
      const { generatePlayerData } = usePlayerGeneration();
      
      try {
        const { players: generatedPlayers } = generatePlayerData(teams, schools, currentSeason.id);
        
        // Add all generated players to the state
        generatedPlayers.forEach(player => {
          addPlayer(player);
        });
        
        toast({
          title: "Player Generation Complete",
          description: `Generated ${generatedPlayers.length} players successfully`,
          variant: "success"
        });
        
        console.log(`Generated ${generatedPlayers.length} players successfully`);
      } catch (error) {
        console.error('Error generating players:', error);
        toast({
          title: "Error Generating Players",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      } finally {
        setIsGeneratingPlayers(false);
      }
    });
  };
  
  const handleAddPlayersToAllTeams = () => {
    const currentSeason = {
      id: crypto.randomUUID(),
      year: new Date().getFullYear(),
      name: `Fall ${new Date().getFullYear()}`,
      isCurrent: true
    };
    
    teams.forEach(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      const playersNeeded = 12 - teamPlayers.length;
      
      if (playersNeeded > 0) {
        for (let i = 0; i < playersNeeded; i++) {
          addPlayer({
            id: crypto.randomUUID(),
            name: `${team.gender === 'Boys' ? 'Player' : 'Player'} ${Math.floor(Math.random() * 100)}`,
            grade: Math.floor(Math.random() * 4) + 9,
            teamId: team.id,
            seasons: [currentSeason.id],
            skillTier: 'developmental' as PlayerSkillTier,
            gender: team.gender
          });
        }
      }
    });
    
    toast({
      title: "Players Added",
      description: "Added players to all teams that needed them",
      variant: "success"
    });
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          selectedYear={selectedYear}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          disabled={generatingMatches || isGeneratingPlayers}
        />
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <RoundRobinToggle
            doubleRoundRobin={doubleRoundRobin}
            onDoubleRoundRobinChange={handleDoubleRoundRobinChange}
            disabled={generatingMatches}
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="default" 
              onClick={handleGenerateMatches} 
              disabled={generatingMatches || !startDate || !endDate}
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              {generatingMatches ? 'Generating Matches...' : 'Generate Matches'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGeneratePlayers} 
              disabled={isGeneratingPlayers}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {isGeneratingPlayers ? 'Generating Players...' : 'Generate Players'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleAddPlayersToAllTeams}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Add Players to All Teams
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
