
import { useState } from 'react';
import { Match } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useMatchOperations = (initialMatches: Match[]) => {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const { toast } = useToast();
  
  const addMatch = (match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...match,
      id: crypto.randomUUID()
    };
    setMatches([...matches, newMatch]);
    toast({
      title: 'Match Added',
      description: `New match has been scheduled successfully.`
    });
  };
  
  const updateMatch = (match: Match) => {
    setMatches(matches.map(m => m.id === match.id ? match : m));
    toast({
      title: 'Match Updated',
      description: `Match details have been updated successfully.`
    });
  };
  
  const deleteMatch = (id: string) => {
    setMatches(matches.filter(m => m.id !== id));
    toast({
      title: 'Match Deleted',
      description: `Match has been deleted successfully.`
    });
  };

  return {
    matches,
    setMatches,
    addMatch,
    updateMatch,
    deleteMatch
  };
};
