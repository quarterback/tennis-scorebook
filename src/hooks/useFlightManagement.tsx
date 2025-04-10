
import { useState } from 'react';
import { MatchFormData } from '@/types';

export const useFlightManagement = (
  matchFormData: MatchFormData,
  setMatchFormData: React.Dispatch<React.SetStateAction<MatchFormData>>
) => {
  const emptyFlight = (type: 'singles' | 'doubles', position: number, level: 'varsity' | 'jv'): {
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

  return {
    emptyFlight,
    addNewFlight,
    toggleFlightRetired,
    toggleFlightDefaulted
  };
};
