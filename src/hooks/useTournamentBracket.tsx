
import { useState, useEffect, useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { TeamRanking, QualifiedTeam, ClassificationQualifications } from '@/types/ranking';
import { Gender, Classification, TeamStanding, Match, Flight, Set } from '@/types';
import { useRankingCalculator } from '@/hooks/rankings/useRankingCalculator';
import { v4 as uuidv4 } from 'uuid';

export const useTournamentBracket = (gender: Gender, classification: Classification) => {
  const { teams, schools, districts, getStandings, players, addMatch } = useData();
  const { getRankingsByGenderAndClassification, qualificationRules } = useRankingCalculator();
  
  const [bracket, setBracket] = useState<{
    rounds: Array<{
      name: string;
      matches: Array<{
        id: string;
        team1: { id: string; name: string; school: string; seed: number };
        team2: { id: string; name: string; school: string; seed: number };
        winner?: 'team1' | 'team2';
        roundIndex: number;
        matchIndex: number;
        completed: boolean;
        score?: string;
      }>;
    }>;
  }>({ rounds: [] });
  
  const [qualifiedTeams, setQualifiedTeams] = useState<QualifiedTeam[]>([]);
  const [playoffTiebreakers, setPlayoffTiebreakers] = useState<{
    matchId: string;
    singles1PlayerId?: string;
    singles2PlayerId?: string;
    doubles1Players?: string[];
    tiebreakersCompleted: boolean;
    winner?: 'team1' | 'team2';
  }[]>([]);

  // Get qualification rules for the selected classification
  const getQualificationRules = useCallback((): ClassificationQualifications => {
    return qualificationRules.find(rule => rule.classification === classification) || {
      classification,
      totalSpots: 8,
      automaticBids: 4,
      atLargeBids: 4
    };
  }, [classification, qualificationRules]);

  // Generate qualified teams based on rankings
  const generateQualifiedTeams = useCallback(() => {
    // Get rankings specific to this gender and classification
    const rankings = getRankingsByGenderAndClassification(gender, classification);
    
    // Get qualified teams (those marked as automatic or at-large)
    const qualified = rankings.filter(
      team => team.qualificationStatus === 'automatic' || team.qualificationStatus === 'at-large'
    );
    
    // Sort by seed
    const sortedQualified = qualified.sort((a, b) => 
      (a.qualificationSeed || 999) - (b.qualificationSeed || 999)
    );
    
    // Convert to QualifiedTeam format
    const qualifiedTeamsResult = sortedQualified.map(team => ({
      teamId: team.teamId,
      teamName: team.teamName,
      schoolName: team.schoolName,
      gender: team.gender as Gender,
      districtName: team.districtName,
      qualificationType: team.qualificationStatus as "automatic" | "at-large",
      seed: team.qualificationSeed || 999,
      compositeScore: team.compositeScore
    }));
    
    setQualifiedTeams(qualifiedTeamsResult);
    return qualifiedTeamsResult;
  }, [gender, classification, getRankingsByGenderAndClassification]);

  // Generate bracket based on qualified teams
  const generateBracket = useCallback((qualifiedTeams: QualifiedTeam[]) => {
    const rules = getQualificationRules();
    const totalTeams = qualifiedTeams.length;
    
    // If no teams, return empty bracket
    if (totalTeams === 0) return { rounds: [] };
    
    // Calculate number of rounds needed
    const roundCount = Math.ceil(Math.log2(totalTeams));
    const rounds = [];
    
    // Generate first round with matchups
    const firstRoundMatches = [];
    for (let i = 0; i < totalTeams / 2; i++) {
      const topSeed = qualifiedTeams[i];
      const bottomSeed = qualifiedTeams[totalTeams - i - 1]; // Match highest vs lowest seed
      
      firstRoundMatches.push({
        id: `match-round1-${i}`,
        team1: {
          id: topSeed.teamId,
          name: topSeed.teamName,
          school: topSeed.schoolName,
          seed: topSeed.seed
        },
        team2: {
          id: bottomSeed.teamId,
          name: bottomSeed.teamName,
          school: bottomSeed.schoolName,
          seed: bottomSeed.seed
        },
        roundIndex: 0,
        matchIndex: i,
        completed: false
      });
    }
    
    rounds.push({
      name: totalTeams === 16 ? "First Round" : 
            totalTeams === 8 ? "Quarterfinals" : 
            totalTeams === 4 ? "Semifinals" : "Opening Round",
      matches: firstRoundMatches
    });
    
    // Generate subsequent rounds with placeholders
    for (let i = 1; i < roundCount; i++) {
      const matchesInRound = Math.pow(2, roundCount - i - 1);
      const matches = [];
      
      for (let j = 0; j < matchesInRound; j++) {
        matches.push({
          id: `match-round${i+1}-${j}`,
          team1: { id: "", name: "TBD", school: "", seed: 0 },
          team2: { id: "", name: "TBD", school: "", seed: 0 },
          roundIndex: i,
          matchIndex: j,
          completed: false
        });
      }
      
      rounds.push({
        name: i === roundCount - 1 ? "Championship" :
              i === roundCount - 2 ? "Semifinals" :
              i === roundCount - 3 ? "Quarterfinals" : `Round ${i+1}`,
        matches
      });
    }
    
    setBracket({ rounds });
    // Clear any previous tiebreakers
    setPlayoffTiebreakers([]);
    
    return { rounds };
  }, [getQualificationRules]);

  // Simulate a full flight between two teams
  const simulateFlightMatch = useCallback((
    homeTeamId: string, 
    awayTeamId: string, 
    flightType: 'singles' | 'doubles',
    position: number,
    homePlayerIds: string[],
    awayPlayerIds: string[]
  ) => {
    // Basic simulation - home team slightly favored
    const homeWinProbability = Math.random() < 0.55 ? true : false;
    
    // Generate flight score (simplified)
    const sets: { homeScore: number; awayScore: number }[] = [];
    
    for (let i = 0; i < 2; i++) { // Best of 3 sets
      const homeScore = Math.floor(Math.random() * 4) + 3; // 3-6
      const awayScore = homeWinProbability ? 
        Math.max(0, homeScore - Math.floor(Math.random() * 4) - 1) : // Home team likely wins
        Math.min(6, homeScore + Math.floor(Math.random() * 4) + 1);  // Away team likely wins
      
      sets.push({ homeScore, awayScore });
    }
    
    // Add third set if needed
    if ((sets[0].homeScore > sets[0].awayScore && sets[1].awayScore > sets[1].homeScore) ||
        (sets[0].awayScore > sets[0].homeScore && sets[1].homeScore > sets[1].awayScore)) {
      const homeScore = Math.floor(Math.random() * 4) + 3; // 3-6
      const awayScore = homeWinProbability ? 
        Math.max(0, homeScore - Math.floor(Math.random() * 4) - 1) : // Home team likely wins
        Math.min(6, homeScore + Math.floor(Math.random() * 4) + 1);  // Away team likely wins
      
      sets.push({ homeScore, awayScore });
    }
    
    // Count sets won
    const homeSetsWon = sets.filter(set => set.homeScore > set.awayScore).length;
    const awaySetsWon = sets.filter(set => set.awayScore > set.homeScore).length;
    
    const homeWon = homeSetsWon > awaySetsWon;
    
    return {
      flightType,
      position,
      homePlayers: homePlayerIds,
      awayPlayers: awayPlayerIds,
      sets,
      homeWon
    };
  }, []);

  // Generate detailed match for the tournament
  const generateDetailedMatch = useCallback((
    homeTeamId: string,
    awayTeamId: string,
    date: string,
    isPlayoff: boolean = true
  ): Match => {
    // Get team rosters
    const homeTeam = teams.find(t => t.id === homeTeamId);
    const awayTeam = teams.find(t => t.id === awayTeamId);
    
    if (!homeTeam || !awayTeam) {
      throw new Error("Teams not found");
    }
    
    // Get players for each team
    const homePlayers = players.filter(p => p.teamId === homeTeamId);
    const awayPlayers = players.filter(p => p.teamId === awayTeamId);
    
    // Simple roster selection - just use the first players we find
    const flights: Flight[] = [];
    
    // Generate singles flights (1-4)
    for (let i = 0; i < 4; i++) {
      const homePlayer = homePlayers[i] ? [homePlayers[i].id] : ['unknown'];
      const awayPlayer = awayPlayers[i] ? [awayPlayers[i].id] : ['unknown'];
      
      const flight = simulateFlightMatch(
        homeTeamId, 
        awayTeamId, 
        'singles', 
        i + 1, 
        homePlayer, 
        awayPlayer
      );
      
      const sets: Set[] = flight.sets.map(s => ({
        homeScore: s.homeScore,
        awayScore: s.awayScore
      }));
      
      flights.push({
        id: uuidv4(),
        matchId: uuidv4(), // Will be updated later
        type: 'singles',
        level: 'varsity',
        position: i + 1,
        homePlayers: flight.homePlayers,
        awayPlayers: flight.awayPlayers,
        homePlayerWon: flight.homeWon,
        sets: sets,
        retired: false,
        defaulted: false
      });
    }
    
    // Generate doubles flights (1-4)
    for (let i = 0; i < 4; i++) {
      const homePlayerIds = homePlayers.slice(4 + i*2, 6 + i*2).map(p => p.id);
      const awayPlayerIds = awayPlayers.slice(4 + i*2, 6 + i*2).map(p => p.id);
      
      // If we don't have enough players, use placeholders
      while (homePlayerIds.length < 2) homePlayerIds.push('unknown');
      while (awayPlayerIds.length < 2) awayPlayerIds.push('unknown');
      
      const flight = simulateFlightMatch(
        homeTeamId, 
        awayTeamId, 
        'doubles', 
        i + 1, 
        homePlayerIds, 
        awayPlayerIds
      );
      
      const sets: Set[] = flight.sets.map(s => ({
        homeScore: s.homeScore,
        awayScore: s.awayScore
      }));
      
      flights.push({
        id: uuidv4(),
        matchId: uuidv4(), // Will be updated later
        type: 'doubles',
        level: 'varsity',
        position: i + 1,
        homePlayers: flight.homePlayers,
        awayPlayers: flight.awayPlayers,
        homePlayerWon: flight.homeWon,
        sets: sets,
        retired: false,
        defaulted: false
      });
    }
    
    // Count home wins vs away wins
    const homeWins = flights.filter(f => f.homePlayerWon).length;
    const awayWins = flights.filter(f => !f.homePlayerWon).length;
    
    // Get the school names for the location
    const homeSchool = schools.find(s => s.id === homeTeam.schoolId);
    const homeSchoolName = homeSchool ? homeSchool.name : "Unknown School";
    
    // Create match object
    const matchId = uuidv4();
    const match: Match = {
      id: matchId,
      date: date,
      homeTeamId,
      awayTeamId,
      isLeagueMatch: false,
      isComplete: true,
      hasJvMatches: false,
      homeTeamWon: homeWins > awayWins,
      homeCoachApproved: true,
      awayCoachApproved: true,
      homeTeamScore: homeWins,
      awayTeamScore: awayWins,
      flights: flights.map(flight => ({
        ...flight,
        matchId // Update all flights with the correct match ID
      }))
    };
    
    return match;
  }, [teams, schools, players, simulateFlightMatch]);

  // Handle playoff tiebreaker setup
  const setupPlayoffTiebreaker = useCallback((
    matchId: string,
    team1Id: string,
    team2Id: string
  ) => {
    // Get team rosters
    const team1Players = players.filter(p => p.teamId === team1Id);
    const team2Players = players.filter(p => p.teamId === team2Id);
    
    // Default to the top players for each position (can be changed by user)
    const tiebreaker = {
      matchId,
      singles1PlayerId: team1Players[0]?.id,
      singles2PlayerId: team1Players[1]?.id,
      doubles1Players: [team1Players[2]?.id, team1Players[3]?.id].filter(Boolean) as string[],
      tiebreakersCompleted: false
    };
    
    setPlayoffTiebreakers(prev => [...prev, tiebreaker]);
    
    return tiebreaker;
  }, [players]);

  // Simulate a playoff tiebreaker
  const simulatePlayoffTiebreaker = useCallback((
    matchId: string,
    team1Id: string,
    team2Id: string
  ): 'team1' | 'team2' => {
    // Find the tiebreaker setup for this match
    const tiebreaker = playoffTiebreakers.find(t => t.matchId === matchId);
    
    if (!tiebreaker) {
      const newTiebreaker = setupPlayoffTiebreaker(matchId, team1Id, team2Id);
      return simulatePlayoffTiebreaker(matchId, team1Id, team2Id);
    }
    
    // Simulate the tiebreaker matches (2 singles, 1 doubles)
    // For simplicity, team1 wins 60% of the time
    const team1Wins = Math.random() < 0.6 ? 2 : 1;
    const winnerValue = team1Wins >= 2 ? 'team1' as const : 'team2' as const;
    
    // Update the tiebreaker result
    const updatedTiebreakers = playoffTiebreakers.map(t => {
      if (t.matchId === matchId) {
        return {
          ...t,
          tiebreakersCompleted: true,
          winner: winnerValue
        };
      }
      return t;
    });
    
    setPlayoffTiebreakers(updatedTiebreakers);
    
    return winnerValue;
  }, [playoffTiebreakers, setupPlayoffTiebreaker]);

  // Handle winner selection and update bracket
  const handleWinnerSelect = useCallback((matchId: string, winner: 'team1' | 'team2') => {
    const updatedBracket = { ...bracket };
    
    // Find the match in the bracket
    let matchFound = false;
    let winningTeam;
    let losingTeam;
    let roundIndex = -1;
    let matchIndex = -1;
    
    for (let i = 0; i < updatedBracket.rounds.length; i++) {
      const roundMatches = updatedBracket.rounds[i].matches;
      
      for (let j = 0; j < roundMatches.length; j++) {
        if (roundMatches[j].id === matchId) {
          // Update the winner
          updatedBracket.rounds[i].matches[j].winner = winner;
          updatedBracket.rounds[i].matches[j].completed = true;
          
          // Simulate a detailed match and generate score
          const team1Id = updatedBracket.rounds[i].matches[j].team1.id;
          const team2Id = updatedBracket.rounds[i].matches[j].team2.id;
          
          if (team1Id && team2Id) {
            const simulatedMatch = generateDetailedMatch(
              team1Id,
              team2Id,
              new Date().toISOString().split('T')[0]
            );
            
            // Add the match to the database
            addMatch(simulatedMatch);
            
            // Update the score display
            updatedBracket.rounds[i].matches[j].score = 
              `${simulatedMatch.homeTeamScore}-${simulatedMatch.awayTeamScore}`;
          }
          
          // Store the winning team info
          winningTeam = winner === 'team1' 
            ? updatedBracket.rounds[i].matches[j].team1 
            : updatedBracket.rounds[i].matches[j].team2;
          
          losingTeam = winner === 'team1' 
            ? updatedBracket.rounds[i].matches[j].team2 
            : updatedBracket.rounds[i].matches[j].team1;
          
          roundIndex = i;
          matchIndex = j;
          matchFound = true;
          break;
        }
      }
      
      if (matchFound) break;
    }
    
    // If match is found and it's not the final round, update the next round
    if (matchFound && roundIndex < updatedBracket.rounds.length - 1 && winningTeam) {
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      
      // Determine if this winner goes into team1 or team2 slot
      const isTeam1Slot = matchIndex % 2 === 0;
      
      // Update the appropriate slot in the next round
      if (isTeam1Slot) {
        updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex].team1 = winningTeam;
      } else {
        updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex].team2 = winningTeam;
      }
    }
    
    setBracket(updatedBracket);
  }, [bracket, generateDetailedMatch, addMatch]);

  // Simulate a tournament tiebreaker
  const simulateTiebreaker = useCallback((matchId: string) => {
    // Find the match in the bracket
    for (let i = 0; i < bracket.rounds.length; i++) {
      for (let j = 0; j < bracket.rounds[i].matches.length; j++) {
        const match = bracket.rounds[i].matches[j];
        if (match.id === matchId) {
          // Make sure we have valid teams
          if (match.team1.id && match.team2.id) {
            // Simulate the tiebreaker
            const winner = simulatePlayoffTiebreaker(matchId, match.team1.id, match.team2.id);
            
            // Update the bracket with the winner
            handleWinnerSelect(matchId, winner);
            return winner;
          }
        }
      }
    }
    return null;
  }, [bracket, simulatePlayoffTiebreaker, handleWinnerSelect]);

  // Auto-generate bracket with qualified teams
  const autoGenerateBracket = useCallback(() => {
    const teams = generateQualifiedTeams();
    return generateBracket(teams);
  }, [generateQualifiedTeams, generateBracket]);

  return {
    bracket,
    qualifiedTeams,
    playoffTiebreakers,
    generateQualifiedTeams,
    generateBracket,
    handleWinnerSelect,
    setupPlayoffTiebreaker,
    simulateTiebreaker,
    autoGenerateBracket,
    qualificationRules: getQualificationRules()
  };
};
