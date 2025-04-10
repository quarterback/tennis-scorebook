
import { MatchFormData } from '@/types';

export const usePlayerManagement = (
  matchFormData: MatchFormData,
  setMatchFormData: React.Dispatch<React.SetStateAction<MatchFormData>>
) => {
  const handleFlightPlayerChange = (
    flightIndex: number, 
    team: 'home' | 'away', 
    playerIndex: number, 
    playerId: string
  ) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (!newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers']) {
        newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers'] = [];
      }
      
      const players = [...newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers']];
      players[playerIndex] = playerId;
      
      newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers'] = players;
      
      return { ...prev, flights: newFlights };
    });
  };

  return {
    handleFlightPlayerChange
  };
};
