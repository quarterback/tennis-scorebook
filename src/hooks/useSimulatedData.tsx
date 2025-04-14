
import { useState } from 'react';
import { Player, Team, School, Match, District, Season } from '@/types';
import { MatchGenerationConfig } from '@/types/ranking';

// Import the refactored modules
import { useSimulationProgress } from './useSimulationProgress';
import { useTeamVerification } from './useTeamVerification';
import { usePlayerGeneration } from './usePlayerGeneration';
import { useMatchGeneration } from './useMatchGeneration';

export const useSimulatedData = () => {
  const { 
    generatingData, 
    progress, 
    startProgress, 
    updateProgress, 
    completeProgress, 
    handleError 
  } = useSimulationProgress();
  
  const { verifyTeamsForSimulation, getSimulationErrorMessage } = useTeamVerification();
  const { generatePlayerData } = usePlayerGeneration();
  const { generateMatchData } = useMatchGeneration();
  
  /**
   * Generate all simulated data for the application
   */
  const generateAllData = async (
    teams: Team[],
    schools: School[],
    districts: District[],
    selectedSeason: Season,
    config: MatchGenerationConfig,
    callbacks: {
      onPlayersGenerated: (players: Player[]) => void;
      onMatchesGenerated: (matches: Match[]) => void;
    }
  ) => {
    startProgress();
    
    try {
      // Verify we have enough teams to generate matches
      const districtHasEnoughTeams = verifyTeamsForSimulation(teams, schools);
      
      if (!districtHasEnoughTeams) {
        throw new Error("No districts have enough teams (minimum 2 per district) to generate matches");
      }
      
      // Step 1: Generate players and ladders
      const { players, ladders } = generatePlayerData(teams, schools, selectedSeason.id);
      updateProgress(25);
      
      // Call callback with generated players
      callbacks.onPlayersGenerated(players);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      updateProgress(50);
      
      // Step 2: Generate matches
      const matches = generateMatchData(teams, schools, districts, players, ladders, config);
      updateProgress(75);
      
      // Call callback with generated matches
      callbacks.onMatchesGenerated(matches);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      
      completeProgress(players.length, matches.length);
    } catch (error) {
      handleError(error);
    }
  };
  
  return {
    generateAllData,
    generatingData,
    progress,
    verifyTeamsForSimulation,
    getSimulationErrorMessage
  };
};
