
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMatches } from '@/context/MatchesContext';

const MatchesHeader: React.FC = () => {
  const { setIsAddDialogOpen, resetMatchForm } = useMatches();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Matches</h1>
      
      <Button 
        className="bg-tennis-blue hover:bg-tennis-darkBlue"
        onClick={() => {
          resetMatchForm();
          setIsAddDialogOpen(true);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Match
      </Button>
    </div>
  );
};

export default MatchesHeader;
