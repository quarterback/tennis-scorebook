
import { Player, Team, School, Gender, PlayerSkillTier } from '@/types';
import { generatePlayerName, generatePlayerGrade, assignPlayerSkillTier } from '@/utils/playerSimulation';
import { TeamLadder, PlayerLadderPosition } from '@/types/ranking';
import { determineTeamArchetype, determineTeamSize } from '@/utils/playerGeneration';

// Moved outside of the hook function
const createTeamLadder = (team: Team, players: Player[], seasonId: string): TeamLadder => {
  // Sort players by skill for ladder creation
  const sortedPlayers = [...players].sort((a, b) => 
    (b.skillRating || 0) - (a.skillRating || 0)
  );
  
  return {
    teamId: team.id,
    seasonId: seasonId,
    lastUpdated: new Date().toISOString(),
    rankings: sortedPlayers.map((player, index) => ({
      playerId: player.id,
      rank: index + 1, // 1-based ranking
      ladderPoints: Math.round((10 - (index / sortedPlayers.length) * 10) * 10), // 0-100 scale
      previousRanks: [] // Initialize with empty array for previous ranks
    }))
  };
};

export const usePlayerGeneration = () => {
  /**
   * Generate player data for all teams
   */
  const generatePlayerData = (
    teams: Team[],
    schools: School[],
    seasonId: string
  ): { players: Player[], ladders: TeamLadder[] } => {
    if (!teams || teams.length === 0) {
      console.error("No teams provided for player generation");
      return { players: [], ladders: [] };
    }

    if (!schools || schools.length === 0) {
      console.error("No schools provided for player generation");
      return { players: [], ladders: [] };
    }

    const players: Player[] = [];
    const ladders: TeamLadder[] = [];
    
    // Sort teams by school and gender for consistency
    const sortedTeams = [...teams].sort((a, b) => {
      const schoolA = schools.find(s => s.id === a.schoolId)?.name || '';
      const schoolB = schools.find(s => s.id === b.schoolId)?.name || '';
      if (schoolA !== schoolB) return schoolA.localeCompare(schoolB);
      return a.gender.localeCompare(b.gender);
    });
    
    console.log(`Starting player generation for ${sortedTeams.length} teams`);
    
    for (const team of sortedTeams) {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) {
        console.warn(`School not found for team ${team.id}, skipping`);
        continue;
      }
      
      // Determine team archetype and size more deterministically based on school and classification
      const teamArchetype = determineTeamArchetype(team.id);
      
      // Get appropriate roster size for this team type and classification
      const rosterSize = determineTeamSize(teamArchetype, school.classification);
      
      // Set elite player ratio based on team archetype
      const elitePlayerRatio = 
        teamArchetype === 'dominant' ? 0.3 :  // 30% elite players for dominant teams (was 0.2)
        teamArchetype === 'strong' ? 0.2 :    // 20% elite players for strong teams
        teamArchetype === 'mid-tier' ? 0.1 :  // 10% elite players for mid-tier teams
        0.05;                                 // 5% elite players for weak teams
      
      const competitivePlayerRatio = 
        teamArchetype === 'dominant' ? 0.5 :  // 50% competitive for dominant teams (was 0.4)
        teamArchetype === 'strong' ? 0.4 :    // 40% competitive for strong teams 
        teamArchetype === 'mid-tier' ? 0.3 :  // 30% competitive for mid-tier teams
        0.2;                                  // 20% competitive for weak teams
      
      console.log(`Generating ${rosterSize} players for team: ${team.id} (${team.gender})`);
      
      // Generate players for this team
      const teamPlayers: Player[] = [];
      
      for (let i = 0; i < rosterSize; i++) {
        const playerName = generatePlayerName(team.gender === 'Girls' ? 'female' : 'male');
        const playerGrade = generatePlayerGrade();
        
        // Calculate player skill tier based on team archetype
        // This determines if they're elite/competitive/developmental
        let skillTier: PlayerSkillTier;
        const rand = Math.random();
        
        if (rand < elitePlayerRatio) {
          skillTier = 'elite';
        } else if (rand < (elitePlayerRatio + competitivePlayerRatio)) {
          skillTier = 'competitive';
        } else {
          skillTier = 'developmental';
        }
        
        // Generate a base skill rating from 1.0-10.0, influenced by skill tier
        let baseSkill: number;
        if (skillTier === 'elite') {
          // Elite players: 7.5-10.0
          baseSkill = 7.5 + (Math.random() * 2.5);
        } else if (skillTier === 'competitive') {
          // Competitive players: 5.0-8.0
          baseSkill = 5.0 + (Math.random() * 3.0);
        } else {
          // Developmental players: 1.0-6.0
          baseSkill = 1.0 + (Math.random() * 5.0);
        }
        
        // Increase skill variance based on player's grade
        // Seniors are more consistent, freshmen have wider variance
        let skillVariance: number;
        if (playerGrade === 12) { // Senior
          skillVariance = 0.5;
        } else if (playerGrade === 11) { // Junior
          skillVariance = 1.0;
        } else if (playerGrade === 10) { // Sophomore
          skillVariance = 1.5;
        } else { // Freshman
          skillVariance = 2.0;
        }
        
        // Apply small random adjustment to skill
        const finalSkill = Math.max(1.0, Math.min(10.0, 
          baseSkill + (Math.random() * skillVariance * 2 - skillVariance)
        ));
        
        // Generate singles vs doubles preference
        // Elite players tend to prefer singles more
        const singlesPreference = skillTier === 'elite' 
          ? 0.6 + (Math.random() * 0.4) // 0.6-1.0 for elite
          : 0.2 + (Math.random() * 0.8); // 0.2-1.0 for others
        
        const player: Player = {
          id: crypto.randomUUID(),
          name: playerName,
          teamId: team.id,
          gender: team.gender,
          grade: playerGrade,
          skillTier,
          skillRating: finalSkill,
          singles_preference: singlesPreference,
          seasonId: seasonId,
          seasons: [seasonId]
        };
        
        teamPlayers.push(player);
      }
      
      // Sort players by skill for ladder creation
      const sortedPlayers = [...teamPlayers].sort((a, b) => 
        (b.skillRating || 0) - (a.skillRating || 0)
      );
      players.push(...sortedPlayers);
      
      // Create ladder for this team using the helper function
      const ladder = createTeamLadder(team, teamPlayers, seasonId);
      ladders.push(ladder);
    }
    
    console.log(`Generated ${players.length} players and ${ladders.length} ladders for ${sortedTeams.length} teams`);
    return { players, ladders };
  };
  
  return {
    generatePlayerData,
    generatingPlayers: false
  };
};
