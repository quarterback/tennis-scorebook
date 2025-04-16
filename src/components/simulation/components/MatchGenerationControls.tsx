
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/DataContext';
import { Match } from '@/types';
import RoundRobinToggle from './RoundRobinToggle';

interface MatchGenerationControlsProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  doubleRoundRobin: boolean;
  onDoubleRoundRobinChange: (value: boolean) => void;
  generatingMatches: boolean;
  onSimulationComplete?: (results: any) => void;
  disabled?: boolean;
}

const MatchGenerationControls: React.FC<MatchGenerationControlsProps> = ({
  startDate,
  endDate,
  doubleRoundRobin,
  onDoubleRoundRobinChange,
  generatingMatches,
  onSimulationComplete = () => {},
  disabled = false
}) => {
  const { toast } = useToast();
  const { teams, players, schools, districts, addMatch, deleteAllMatches } = useData();
  
  const handleGenerateMatches = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date Selection Required",
        description: "Please select both start and end dates for the season.",
        variant: "destructive"
      });
      return;
    }
    
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
          variant: "default"
        });
        
        console.log(`Generated ${matches.length} matches successfully`);
        
        // Call onSimulationComplete with matches
        onSimulationComplete({
          matches: matches.map(match => {
            const homeTeam = teams.find(t => t.id === match.homeTeamId);
            const awayTeam = teams.find(t => t.id === match.awayTeamId);
            const homeSchool = schools.find(s => s.id === homeTeam?.schoolId);
            const awaySchool = schools.find(s => s.id === awayTeam?.schoolId);
            
            return {
              date: match.date,
              homeTeam: homeSchool?.name || 'Unknown',
              awayTeam: awaySchool?.name || 'Unknown',
              score: match.isTie ? "4-4" : `${match.homeTeamScore}-${match.awayTeamScore}`,
              gender: homeTeam?.gender || 'Unknown'
            };
          })
        });
      } catch (error) {
        console.error('Error generating matches:', error);
        toast({
          title: "Error Generating Matches",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <RoundRobinToggle
        doubleRoundRobin={doubleRoundRobin}
        onDoubleRoundRobinChange={onDoubleRoundRobinChange}
        disabled={generatingMatches || disabled}
      />
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="default" 
          onClick={handleGenerateMatches} 
          disabled={generatingMatches || !startDate || !endDate || disabled}
          className="flex items-center gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          {generatingMatches ? 'Generating Matches...' : 'Generate Matches'}
        </Button>
      </div>
    </div>
  );
};

export default MatchGenerationControls;
