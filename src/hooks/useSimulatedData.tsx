
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
      
      // Step 1: Generate players and ladders for both genders
      console.log('Generating players for all teams (boys and girls)...');
      const { players, ladders } = generatePlayerData(teams, schools, selectedSeason.id);
      updateProgress(25);
      
      // Call callback with generated players
      callbacks.onPlayersGenerated(players);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      updateProgress(50);
      
      // Step 2: Generate matches for both genders
      console.log('Generating matches for all teams (boys and girls)...');
      const matches = generateMatchData(teams, schools, districts, players, ladders, config);
      
      // Log match count by gender to debug
      const boysMatches = matches.filter(match => {
        const team = teams.find(t => t.id === match.homeTeamId);
        return team && team.gender === 'Boys';
      });
      
      const girlsMatches = matches.filter(match => {
        const team = teams.find(t => t.id === match.homeTeamId);
        return team && team.gender === 'Girls';
      });
      
      console.log(`Generated ${matches.length} total matches: ${boysMatches.length} boys, ${girlsMatches.length} girls`);
      
      updateProgress(75);
      
      // Call callback with generated matches
      callbacks.onMatchesGenerated(matches);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Prepare the results object to return
      const results = {
        teams: teams.map(team => {
          const school = schools.find(s => s.id === team.schoolId);
          const district = districts.find(d => d.id === school?.districtId);
          const teamMatches = matches.filter(m => m.homeTeamId === team.id || m.awayTeamId === team.id);
          
          // Calculate win-loss record
          const wins = teamMatches.filter(m => 
            (m.homeTeamId === team.id && m.homeTeamWon) || 
            (m.awayTeamId === team.id && !m.homeTeamWon)
          ).length;
          
          const losses = teamMatches.filter(m => 
            (m.homeTeamId === team.id && !m.homeTeamWon) || 
            (m.awayTeamId === team.id && m.homeTeamWon)
          ).length;
          
          return {
            id: team.id,
            name: `${school?.name || 'Unknown'} ${team.gender}`,
            classification: district?.classification || 'Unknown',
            record: `${wins}-${losses}`,
            apr: Math.random() * 100  // Placeholder for APR score
          };
        }),
        matches: matches.map(match => {
          const homeTeam = teams.find(t => t.id === match.homeTeamId);
          const awayTeam = teams.find(t => t.id === match.awayTeamId);
          const homeSchool = schools.find(s => s.id === homeTeam?.schoolId);
          const awaySchool = schools.find(s => s.id === awayTeam?.schoolId);
          
          return {
            date: match.date,
            homeTeam: homeSchool?.name || 'Unknown',
            awayTeam: awaySchool?.name || 'Unknown',
            score: `${match.homeTeamScore}-${match.awayTeamScore}`
          };
        }),
        rankings: [] // Will be filled by sorting teams by APR
      };
      
      // Sort teams by APR to create rankings
      results.rankings = [...results.teams].sort((a, b) => b.apr - a.apr);
      
      completeProgress(players.length, matches.length);
      return results;
    } catch (error) {
      handleError(error);
      throw error;
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
