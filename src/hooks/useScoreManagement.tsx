
import { MatchFormData } from '@/types';

export const useScoreManagement = (
  matchFormData: MatchFormData,
  setMatchFormData: React.Dispatch<React.SetStateAction<MatchFormData>>
) => {
  
  const handleSetScoreChange = (
    flightIndex: number,
    setIndex: number,
    team: 'home' | 'away',
    score: number
  ) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (!newFlights[flightIndex].sets[setIndex]) {
        newFlights[flightIndex].sets[setIndex] = { homeScore: 0, awayScore: 0 };
      }
      
      newFlights[flightIndex].sets[setIndex] = {
        ...newFlights[flightIndex].sets[setIndex],
        [team === 'home' ? 'homeScore' : 'awayScore']: score
      };
      
      const sets = newFlights[flightIndex].sets;
      let homeWins = 0;
      let awayWins = 0;
      
      sets.forEach(set => {
        if (set.homeScore > set.awayScore) homeWins++;
        else if (set.homeScore < set.awayScore) awayWins++;
      });
      
      newFlights[flightIndex].homePlayerWon = homeWins > awayWins;
      
      return { ...prev, flights: newFlights };
    });
  };
  
  const handleTiebreakScoreChange = (
    flightIndex: number,
    setIndex: number,
    team: 'home' | 'away',
    score: number
  ) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (!newFlights[flightIndex].sets[setIndex].tiebreak) {
        newFlights[flightIndex].sets[setIndex].tiebreak = { homeScore: 0, awayScore: 0 };
      }
      
      if (newFlights[flightIndex].sets[setIndex].tiebreak) {
        newFlights[flightIndex].sets[setIndex].tiebreak = {
          ...newFlights[flightIndex].sets[setIndex].tiebreak!,
          [team === 'home' ? 'homeScore' : 'awayScore']: score
        };
      }
      
      return { ...prev, flights: newFlights };
    });
  };
  
  const toggleTiebreak = (flightIndex: number, setIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (newFlights[flightIndex].sets[setIndex].tiebreak) {
        delete newFlights[flightIndex].sets[setIndex].tiebreak;
      } else {
        newFlights[flightIndex].sets[setIndex].tiebreak = { homeScore: 0, awayScore: 0 };
      }
      
      return { ...prev, flights: newFlights };
    });
  };
  
  const addSet = (flightIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      newFlights[flightIndex].sets.push({ homeScore: 0, awayScore: 0 });
      return { ...prev, flights: newFlights };
    });
  };
  
  const removeSet = (flightIndex: number, setIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      if (newFlights[flightIndex].sets.length > 1) {
        newFlights[flightIndex].sets.splice(setIndex, 1);
      }
      return { ...prev, flights: newFlights };
    });
  };

  return {
    handleSetScoreChange,
    handleTiebreakScoreChange,
    toggleTiebreak,
    addSet,
    removeSet
  };
};
