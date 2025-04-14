
import { useState, useEffect } from 'react';

interface SeasonCalculationsResult {
  calculateWeeks: () => number;
  calculateMaxMatches: () => number;
  seasonWeeks: number;
  theoreticalMaxMatches: number;
}

export const useSeasonCalculations = (
  startDate: Date | undefined,
  endDate: Date | undefined
): SeasonCalculationsResult => {
  const [seasonWeeks, setSeasonWeeks] = useState(0);
  const [theoreticalMaxMatches, setTheoreticalMaxMatches] = useState(0);

  // Calculate season duration in weeks to show info to the user
  const calculateWeeks = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.ceil(days / 7);
  };
  
  // Calculate theoretical max matches based on season length
  const calculateMaxMatches = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(days / 7);
    // 3 regular matches per week, plus some weekend tournaments
    return (weeks * 3) - 1; // Subtract 1 week for spring break
  };

  useEffect(() => {
    setSeasonWeeks(calculateWeeks());
    setTheoreticalMaxMatches(calculateMaxMatches());
  }, [startDate, endDate]);

  return {
    calculateWeeks,
    calculateMaxMatches,
    seasonWeeks,
    theoreticalMaxMatches
  };
};
