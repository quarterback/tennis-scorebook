import { useState } from 'react';
import { Match, Flight, Set } from '@/types';

export interface MatchFormData {
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  isLeagueMatch: boolean;
  isComplete: boolean;
  hasJvMatches?: boolean;
  homeTeamWon?: boolean;
  homeCoachApproved?: boolean;
  awayCoachApproved?: boolean;
  homeTeamScore?: number;
  awayTeamScore?: number;
  flights: Array<{
    type: 'singles' | 'doubles';
    position: number;
    level: 'varsity' | 'jv';
    homePlayers: string[];
    awayPlayers: string[];
    sets: Set[];
    homePlayerWon?: boolean;
    retired?: boolean;
    defaulted?: boolean;
  }>;
}

const useMatchFunctions = (initialFlights: Array<{
  type: 'singles' | 'doubles';
  position: number;
  level: 'varsity' | 'jv';
  homePlayers: string[];
  awayPlayers: string[];
  sets: Set[];
}>) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [matchFormData, setMatchFormData] = useState<MatchFormData>({
    date: today,
    homeTeamId: '',
    awayTeamId: '',
    isLeagueMatch: true,
    isComplete: false,
    hasJvMatches: false,
    flights: initialFlights
  });

  const emptyFlight = (type: 'singles' | 'doubles', position: number, level: 'varsity' | 'jv'): {
    type: 'singles' | 'doubles';
    position: number;
    level: 'varsity' | 'jv';
    homePlayers: string[];
    awayPlayers: string[];
    sets: Set[];
  } => ({
    type,
    position,
    level,
    homePlayers: [],
    awayPlayers: [],
    sets: [{ homeScore: 0, awayScore: 0 }]
  });
  
  const addNewFlight = (type: 'singles' | 'doubles', level: 'varsity' | 'jv') => {
    setMatchFormData(prev => {
      const existingFlights = prev.flights.filter(f => f.type === type && f.level === level);
      const highestPosition = Math.max(...existingFlights.map(f => f.position), 0);
      const newPosition = highestPosition + 1;
      
      const newFlight = emptyFlight(type, newPosition, level);
      
      return {
        ...prev,
        flights: [...prev.flights, newFlight]
      };
    });
  };

  const toggleJvMatches = () => {
    setMatchFormData(prev => ({
      ...prev,
      hasJvMatches: !prev.hasJvMatches
    }));
  };

  const toggleFlightRetired = (flightIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      newFlights[flightIndex].retired = !newFlights[flightIndex].retired;
      
      if (newFlights[flightIndex].retired) {
        newFlights[flightIndex].defaulted = false;
      }
      
      return { ...prev, flights: newFlights };
    });
  };

  const toggleFlightDefaulted = (flightIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      newFlights[flightIndex].defaulted = !newFlights[flightIndex].defaulted;
      
      if (newFlights[flightIndex].defaulted) {
        newFlights[flightIndex].retired = false;
      }
      
      return { ...prev, flights: newFlights };
    });
  };

  const updateTeamScores = (homeScore: number, awayScore: number) => {
    setMatchFormData(prev => ({
      ...prev,
      homeTeamScore: homeScore,
      awayTeamScore: awayScore
    }));
  };

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
  
  const calculateTeamWinner = () => {
    if (matchFormData.homeTeamScore !== undefined && 
        matchFormData.awayTeamScore !== undefined) {
      setMatchFormData(prev => ({ 
        ...prev, 
        homeTeamWon: prev.homeTeamScore! > prev.awayTeamScore!
      }));
    }
  };

  const resetMatchForm = (today: string) => {
    setMatchFormData({
      date: today,
      homeTeamId: '',
      awayTeamId: '',
      isLeagueMatch: true,
      isComplete: false,
      hasJvMatches: false,
      flights: initialFlights.map(f => ({
        ...f,
        homePlayers: [],
        awayPlayers: [],
        sets: [{ homeScore: 0, awayScore: 0 }],
        retired: false,
        defaulted: false
      }))
    });
  };

  const toggleApproval = (team: 'home' | 'away') => {
    setMatchFormData(prev => ({
      ...prev,
      [team === 'home' ? 'homeCoachApproved' : 'awayCoachApproved']: 
        !prev[team === 'home' ? 'homeCoachApproved' : 'awayCoachApproved']
    }));
  };

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
