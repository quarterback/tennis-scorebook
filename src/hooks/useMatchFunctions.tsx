
import { useMatchForm } from './useMatchForm';
import { useFlightManagement } from './useFlightManagement';
import { usePlayerManagement } from './usePlayerManagement';
import { useScoreManagement } from './useScoreManagement';
import type { MatchFormData } from '@/types';

export type { MatchFormData };

// Create a new helper function to handle flight player changes
const useFlightPlayerHandler = (
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
      
      if (!newFlights[flightIndex][`${team}Players`]) {
        newFlights[flightIndex][`${team}Players`] = [];
      }
      
      const playersList = [...newFlights[flightIndex][`${team}Players`]];
      playersList[playerIndex] = playerId;
      
      newFlights[flightIndex] = {
        ...newFlights[flightIndex],
        [`${team}Players`]: playersList
      };
      
      return { ...prev, flights: newFlights };
    });
  };
  
  return { handleFlightPlayerChange };
};

const useMatchFunctions = (initialFlights: Array<{
  type: 'singles' | 'doubles';
  position: number;
  level: 'varsity' | 'jv';
  homePlayers: string[];
  awayPlayers: string[];
  sets: {
    homeScore: number;
    awayScore: number;
    tiebreak?: {
      homeScore: number;
      awayScore: number;
    };
  }[];
}>) => {
  const {
    matchFormData,
    setMatchFormData,
    resetMatchForm,
    toggleJvMatches,
    updateTeamScores,
    toggleApproval,
    calculateTeamWinner
  } = useMatchForm(initialFlights);

  const {
    emptyFlight,
    addNewFlight,
    toggleFlightRetired,
    toggleFlightDefaulted
  } = useFlightManagement(matchFormData, setMatchFormData);

  // Use our new helper function
  const { handleFlightPlayerChange } = useFlightPlayerHandler(matchFormData, setMatchFormData);

  // Pass only the selectedTeamId to usePlayerManagement
  const selectedTeamId = matchFormData.homeTeamId; // Default to home team or could be null
  const {
    isAddPlayerDialogOpen,
    setIsAddPlayerDialogOpen,
    playerFormData,
    setPlayerFormData,
    handleAddPlayer
  } = usePlayerManagement(selectedTeamId);

  const {
    handleSetScoreChange,
    handleTiebreakScoreChange,
    toggleTiebreak,
    addSet,
    removeSet
  } = useScoreManagement(matchFormData, setMatchFormData);

  return {
    matchFormData,
    setMatchFormData,
    emptyFlight,
    handleFlightPlayerChange,
    handleSetScoreChange,
    handleTiebreakScoreChange,
    toggleTiebreak,
    addSet,
    removeSet,
    calculateTeamWinner,
    resetMatchForm,
    addNewFlight,
    toggleJvMatches,
    toggleApproval,
    toggleFlightRetired,
    toggleFlightDefaulted,
    updateTeamScores,
    isAddPlayerDialogOpen,
    setIsAddPlayerDialogOpen,
    playerFormData,
    setPlayerFormData,
    handleAddPlayer
  };
};

export default useMatchFunctions;
