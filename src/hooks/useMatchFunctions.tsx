
import { useMatchForm } from './useMatchForm';
import { useFlightManagement } from './useFlightManagement';
import { usePlayerManagement } from './usePlayerManagement';
import { useScoreManagement } from './useScoreManagement';
import type { MatchFormData } from '@/types';

export type { MatchFormData };

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

  const {
    handleFlightPlayerChange
  } = usePlayerManagement(matchFormData, setMatchFormData);

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
    updateTeamScores
  };
};

export default useMatchFunctions;
