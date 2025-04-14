
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMatches } from '@/context/MatchesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useData } from '@/context/DataContext';

const MatchesHeader: React.FC = () => {
  const { setIsAddDialogOpen, resetMatchForm, filteredMatches } = useMatches();
  const isMobile = useIsMobile();
  
  // Count matches by gender
  const boysMatches = filteredMatches.filter(match => {
    // This assumes team names contain "Boys" or "Girls"
    const teamName = match.homeTeamName?.toLowerCase() || '';
    return teamName.includes('boys');
  });
  
  const girlsMatches = filteredMatches.filter(match => {
    const teamName = match.homeTeamName?.toLowerCase() || '';
    return teamName.includes('girls');
  });
  
  return (
    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 w-full">
      <div>
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold">Matches</h1>
        <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
          <p>{filteredMatches.length} total matches</p>
          <div className="flex space-x-4">
            <p className="text-xs">{boysMatches.length} boys matches</p>
            <p className="text-xs">{girlsMatches.length} girls matches</p>
          </div>
        </div>
      </div>
      
      <Button 
        className="bg-tennis-blue hover:bg-tennis-darkBlue w-full xs:w-auto text-sm sm:text-base"
        onClick={() => {
          resetMatchForm();
          setIsAddDialogOpen(true);
        }}
      >
        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        {isMobile ? 'Add' : 'Add Match'}
      </Button>
    </div>
  );
};

export default MatchesHeader;
