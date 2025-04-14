
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMatches } from '@/context/MatchesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useData } from '@/context/DataContext';

const MatchesHeader: React.FC = () => {
  const { setIsAddDialogOpen, resetMatchForm } = useMatches();
  const { matches } = useData();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 w-full">
      <div>
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold">Matches</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {matches.length} total matches
        </p>
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
