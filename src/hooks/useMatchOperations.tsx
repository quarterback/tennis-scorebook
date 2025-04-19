
import { useState, useEffect } from 'react';
import { Match } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useMatchOperations = (initialMatches: Match[] = []) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const { toast } = useToast();
  
  // Load matches from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedMatches = localStorage.getItem('matches');
      if (savedMatches) {
        const parsedMatches = JSON.parse(savedMatches);
        if (Array.isArray(parsedMatches) && parsedMatches.length > 0) {
          console.log(`Loaded ${parsedMatches.length} matches from localStorage`);
          setMatches(parsedMatches);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading matches from localStorage:', error);
    }
    
    // If no matches in localStorage or error loading, initialize with provided data
    if (initialMatches.length > 0) {
      setMatches(initialMatches);
      localStorage.setItem('matches', JSON.stringify(initialMatches));
    }
  }, [initialMatches]);
  
  // Save matches to localStorage whenever they change
  useEffect(() => {
    if (matches.length > 0) {
      localStorage.setItem('matches', JSON.stringify(matches));
      console.log(`Saved ${matches.length} matches to localStorage`);
    }
  }, [matches]);
  
  const addMatch = (match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...match,
      id: crypto.randomUUID()
    };
    setMatches(prevMatches => [...prevMatches, newMatch]);
    toast({
      title: 'Match Added',
      description: `New match has been scheduled successfully.`
    });
    return newMatch;
  };
  
  const updateMatch = (match: Match) => {
    setMatches(prevMatches => prevMatches.map(m => m.id === match.id ? match : m));
    toast({
      title: 'Match Updated',
      description: `Match details have been updated successfully.`
    });
    return match;
  };
  
  const deleteMatch = (id: string) => {
    const match = matches.find(m => m.id === id);
    setMatches(prevMatches => prevMatches.filter(m => m.id !== id));
    toast({
      title: 'Match Deleted',
      description: `Match has been deleted successfully.`
    });
  };
  
  const deleteAllMatches = () => {
    setMatches([]);
    localStorage.removeItem('matches');
    toast({
      title: 'All Matches Deleted',
      description: `All matches have been deleted successfully.`
    });
  };

  return {
    matches,
    setMatches,
    addMatch,
    updateMatch,
    deleteMatch,
    deleteAllMatches
  };
};
