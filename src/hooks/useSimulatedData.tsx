import { useState } from 'react';
import { Player, Team, School, Match, District, Season } from '@/types';
import { TeamLadder, MatchGenerationConfig } from '@/types/ranking';
import { useToast } from '@/components/ui/use-toast';

import { 
  generateTeamRoster, 
  generateTeamLadder,
  updateTeamLadder 
} from '@/utils/playerSimulation';

import {
  generateDistrictMatches
} from '@/utils/matchSimulation';

export const useSimulatedData = () => {
  const [generatingData, setGeneratingData] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  /**
   * Generate team rosters and ladders for all teams
   */
  const generatePlayerData = (
    teams: Team[],
    schools: School[],
    seasonId: string
  ): { players: Player[], ladders: TeamLadder[] } => {
    const allPlayers: Player[] = [];
    const ladders: TeamLadder[] = [];
    
    teams.forEach(team => {
      // Generate roster - ensure at least 12 players for a complete dual match
      const teamPlayers = generateTeamRoster(team.id, team.schoolId, seasonId);
      allPlayers.push(...teamPlayers);
      
      // Generate ladder
      const ladder = generateTeamLadder(team.id, seasonId, teamPlayers);
      ladders.push(ladder);
    });
    
    return { players: allPlayers, ladders };
  };
  
  /**
   * Generate matches for teams based on district assignments
   */
  const generateMatchData = (
    teams: Team[],
    schools: School[],
    districts: District[],
    players: Player[],
    ladders: TeamLadder[],
    config: MatchGenerationConfig
  ): Match[] => {
    const allMatches: Match[] = [];
    
    // Group teams by district
    const districtTeams: Record<string, Team[]> = {};
    
    teams.forEach(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return;
      
      if (!districtTeams[school.districtId]) {
        districtTeams[school.districtId] = [];
      }
      
      districtTeams[school.districtId].push(team);
    });
    
    // Generate matches for each district
    Object.entries(districtTeams).forEach(([districtId, teamsInDistrict]) => {
      // Skip districts with fewer than 2 teams
      if (teamsInDistrict.length < 2) {
        console.log(`Skipping district ${districtId}: Not enough teams (${teamsInDistrict.length})`);
        return;
      }
      
      // Get district details
      const district = districts.find(d => d.id === districtId);
      if (!district) {
        console.log(`District ${districtId} not found in districts data`);
        return;
      }
      
      // Calculate matches per team based on district size
      // Oregon high school leagues typically have 6-14 teams, so scale accordingly
      const teamCount = teamsInDistrict.length;
      const isLargeDistrict = teamCount >= 8;
      
      // Calculate matches per team 
      // Double round robin for smaller districts/leagues (each team plays every other team twice)
      // Single round robin for larger districts/leagues
      const matchesPerTeam = config.doubleRoundRobin && !isLargeDistrict
        ? Math.min(2 * (teamCount - 1), config.maxRegularSeasonMatches)
        : Math.min(teamCount - 1, config.maxRegularSeasonMatches);
      
      console.log(`Generating matches for ${district.name} (${teamCount} teams): ${matchesPerTeam} matches per team`);
      
      try {
        const districtMatches = generateDistrictMatches(
          teamsInDistrict,
          schools,
          players,
          ladders,
          {
            startDate: config.startDate,
            endDate: config.endDate,
            isLeagueMatch: true,
            matchesPerTeam
          }
        );
        
        allMatches.push(...districtMatches);
      } catch (error) {
        console.error(`Error generating matches for district ${districtId} (${district.name}):`, error);
      }
    });
    
    return allMatches;
  };
  
  /**
   * Generate all simulated data for the application
   */
  const generateAllData = async (
    teams: Team[],
    schools: School[],
    districts: District[],
    currentSeason: Season,
    config: MatchGenerationConfig,
    callbacks: {
      onPlayersGenerated: (players: Player[]) => void;
      onMatchesGenerated: (matches: Match[]) => void;
    }
  ) => {
    setGeneratingData(true);
    setProgress(0);
    
    try {
      // Verify we have enough teams to generate matches
      const districtHasEnoughTeams = verifyTeamsForSimulation(teams, schools);
      
      if (!districtHasEnoughTeams) {
        throw new Error("No districts have enough teams (minimum 2 per district) to generate matches");
      }
      
      // Step 1: Generate players and ladders
      const { players, ladders } = generatePlayerData(teams, schools, currentSeason.id);
      setProgress(25);
      
      // Call callback with generated players
      callbacks.onPlayersGenerated(players);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(50);
      
      // Step 2: Generate matches
      const matches = generateMatchData(teams, schools, districts, players, ladders, config);
      setProgress(75);
      
      // Call callback with generated matches
      callbacks.onMatchesGenerated(matches);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(100);
      
      toast({
        title: "Data Generation Complete",
        description: `Generated ${players.length} players and ${matches.length} matches.`
      });
    } catch (error) {
      console.error("Error generating data:", error);
      toast({
        title: "Error Generating Data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setGeneratingData(false);
    }
  };
  
  /**
   * Verify that we have enough teams to generate matches
   */
  const verifyTeamsForSimulation = (teams: Team[], schools: School[]): boolean => {
    // Group teams by district to check if any districts have enough teams
    const districtTeams: Record<string, Team[]> = {};
    
    teams.forEach(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return;
      
      if (!districtTeams[school.districtId]) {
        districtTeams[school.districtId] = [];
      }
      
      districtTeams[school.districtId].push(team);
    });
    
    // Check if any district has at least 2 teams
    return Object.values(districtTeams).some(teamsInDistrict => teamsInDistrict.length >= 2);
  };
  
  return {
    generateAllData,
    generatingData,
    progress,
    verifyTeamsForSimulation
  };
};
