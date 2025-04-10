
import { useState } from 'react';
import { MatchFormData } from '@/types';

export const useMatchForm = (initialFlights: Array<{
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

  const resetMatchForm = (resetDate: string = today) => {
    setMatchFormData({
      date: resetDate,
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

  const toggleJvMatches = () => {
    setMatchFormData(prev => ({
      ...prev,
      hasJvMatches: !prev.hasJvMatches
    }));
  };

  const updateTeamScores = (homeScore: number, awayScore: number) => {
    setMatchFormData(prev => ({
      ...prev,
      homeTeamScore: homeScore,
      awayTeamScore: awayScore
    }));
  };

  const toggleApproval = (team: 'home' | 'away') => {
    setMatchFormData(prev => ({
      ...prev,
      [team === 'home' ? 'homeCoachApproved' : 'awayCoachApproved']: 
        !prev[team === 'home' ? 'homeCoachApproved' : 'awayCoachApproved']
    }));
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

  return {
    matchFormData,
    setMatchFormData,
    resetMatchForm,
    toggleJvMatches,
    updateTeamScores,
    toggleApproval,
    calculateTeamWinner
  };
};
