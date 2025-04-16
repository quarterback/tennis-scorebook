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
        matchDetails?: Match;
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

  const getQualificationRules = useCallback((): ClassificationQualifications => {
    return qualificationRules.find(rule => rule.classification === classification) || {
      classification,
      totalSpots: 8,
      automaticBids: 4,
      atLargeBids: 4
    };
  }, [classification, qualificationRules]);

  const generateQualifiedTeams = useCallback(() => {
    const rankings = getRankingsByGenderAndClassification(gender, classification);
    
    const qualified = rankings.filter(
      team => team.qualificationStatus === 'automatic' || team.qualificationStatus === 'at-large'
    );
    
    const sortedQualified = qualified.sort((a, b) => 
      (a.qualificationSeed || 999) - (b.qualificationSeed || 999)
    );
    
    const qualifiedTeamsResult: QualifiedTeam[] = sortedQualified.map(team => ({
      team: team,
      seed: team.qualificationSeed || 999,
      qualificationType: team.qualificationStatus as "automatic" | "at-large",
      
      teamId: team.teamId,
      teamName: team.teamName,
      schoolName: team.schoolName,
      districtName: team.districtName,
      gender: team.gender as Gender,
      compositeScore: team.compositeScore
    }));
    
    setQualifiedTeams(qualifiedTeamsResult);
    return qualifiedTeamsResult;
  }, [gender, classification, getRankingsByGenderAndClassification]);

  const generateBracket = useCallback((qualifiedTeams: QualifiedTeam[]) => {
    const rules = getQualificationRules();
    const totalTeams = qualifiedTeams.length;
    
    if (totalTeams === 0) return { rounds: [] };
    
    const roundCount = Math.ceil(Math.log2(totalTeams));
    const rounds = [];
    
    const firstRoundMatches = [];
    
    for (let i = 0; i < totalTeams / 2; i++) {
      const topSeedIndex = i;
      const bottomSeedIndex = totalTeams - i - 1;
      
      const topSeed = qualifiedTeams[topSeedIndex];
      const bottomSeed = qualifiedTeams[bottomSeedIndex];
      
      firstRoundMatches.push({
        id: `match-round1-${i}`,
        team1: {
          id: topSeed.team.teamId,
          name: topSeed.teamName || topSeed.team.teamName,
          school: topSeed.schoolName || topSeed.team.schoolName,
          seed: topSeed.seed
        },
        team2: {
          id: bottomSeed.team.teamId,
          name: bottomSeed.teamName || bottomSeed.team.teamName,
          school: bottomSeed.schoolName || bottomSeed.team.schoolName,
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
    setPlayoffTiebreakers([]);
    
    return { rounds };
  }, [getQualificationRules]);

  const assignPlayersToPositions = useCallback((
    teamId: string,
    positionsCount: number = 4,
    positionType: 'singles' | 'doubles' = 'singles'
  ) => {
    const teamPlayers = players.filter(p => p.teamId === teamId);
    
    if (teamPlayers.length === 0) {
      return Array(positionsCount).fill('unknown');
    }
    
    const shuffledPlayers = [...teamPlayers].sort(() => Math.random() - 0.5);
    
    if (positionType === 'singles') {
      const result: string[] = [];
      for (let i = 0; i < positionsCount; i++) {
        const playerIndex = i % shuffledPlayers.length;
        result.push(shuffledPlayers[playerIndex].id);
      }
      return result;
    } else {
      const result: string[][] = [];
      const totalPlayersNeeded = positionsCount * 2;
      
      for (let i = 0; i < positionsCount; i++) {
        const pair: string[] = [];
        for (let j = 0; j < 2; j++) {
          const playerIndex = (i * 2 + j) % shuffledPlayers.length;
          pair.push(shuffledPlayers[playerIndex].id);
        }
        result.push(pair);
      }
      return result;
    }
  }, [players]);

  const simulateFlightMatch = useCallback((
    homeTeamId: string, 
    awayTeamId: string, 
    flightType: 'singles' | 'doubles',
    position: number,
    homePlayerIds: string[],
    awayPlayerIds: string[]
  ) => {
    const homeWinProbability = Math.random() < 0.55 ? true : false;
    
    const sets: { homeScore: number; awayScore: number }[] = [];
    
    for (let i = 0; i < 2; i++) {
      const homeScore = Math.floor(Math.random() * 4) + 3;
      const awayScore = homeWinProbability ? 
        Math.max(0, homeScore - Math.floor(Math.random() * 4) - 1) : 
        Math.min(6, homeScore + Math.floor(Math.random() * 4) + 1);
      
      sets.push({ homeScore, awayScore });
    }
    
    if ((sets[0].homeScore > sets[0].awayScore && sets[1].awayScore > sets[1].homeScore) ||
        (sets[0].awayScore > sets[0].homeScore && sets[1].homeScore > sets[1].homeScore)) {
      const homeScore = Math.floor(Math.random() * 4) + 3;
      const awayScore = homeWinProbability ? 
        Math.max(0, homeScore - Math.floor(Math.random() * 4) - 1) : 
        Math.min(6, homeScore + Math.floor(Math.random() * 4) + 1);
      
      sets.push({ homeScore, awayScore });
    }
    
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

  const generateDetailedMatch = useCallback((
    homeTeamId: string,
    awayTeamId: string,
    date: string,
    isPlayoff: boolean = true
  ): Match => {
    const homeTeam = teams.find(t => t.id === homeTeamId);
    const awayTeam = teams.find(t => t.id === awayTeamId);
    
    if (!homeTeam || !awayTeam) {
      throw new Error("Teams not found");
    }
    
    const homeSinglesIds = assignPlayersToPositions(homeTeamId, 4, 'singles');
    const awaySinglesIds = assignPlayersToPositions(awayTeamId, 4, 'singles');
    
    const homeDoublesIds = assignPlayersToPositions(homeTeamId, 4, 'doubles') as string[][];
    const awayDoublesIds = assignPlayersToPositions(awayTeamId, 4, 'doubles') as string[][];
    
    const flights: Flight[] = [];
    
    for (let i = 0; i < 4; i++) {
      const homePlayer = [homeSinglesIds[i] || 'unknown'];
      const awayPlayer = [awaySinglesIds[i] || 'unknown'];
      
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
        matchId: uuidv4(),
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
    
    for (let i = 0; i < 4; i++) {
      const homePlayerIds = homeDoublesIds[i] || ['unknown', 'unknown'];
      const awayPlayerIds = awayDoublesIds[i] || ['unknown', 'unknown'];
      
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
        matchId: uuidv4(),
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
    
    const homeWins = flights.filter(f => f.homePlayerWon).length;
    const awayWins = flights.filter(f => !f.homePlayerWon).length;
    
    const homeSchool = schools.find(s => s.id === homeTeam.schoolId);
    
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
        matchId
      }))
    };
    
    return match;
  }, [teams, schools, assignPlayersToPositions, simulateFlightMatch]);

  const setupPlayoffTiebreaker = useCallback((
    matchId: string,
    team1Id: string,
    team2Id: string
  ) => {
    const team1Players = players.filter(p => p.teamId === team1Id);
    const team2Players = players.filter(p => p.teamId === team2Id);
    
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

  const simulatePlayoffTiebreaker = useCallback((
    matchId: string,
    team1Id: string,
    team2Id: string
  ): 'team1' | 'team2' => {
    const tiebreaker = playoffTiebreakers.find(t => t.matchId === matchId);
    
    if (!tiebreaker) {
      const newTiebreaker = setupPlayoffTiebreaker(matchId, team1Id, team2Id);
      return simulatePlayoffTiebreaker(matchId, team1Id, team2Id);
    }
    
    const team1Wins = Math.random() < 0.6 ? 2 : 1;
    const winnerValue = team1Wins >= 2 ? 'team1' as const : 'team2' as const;
    
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

  const handleWinnerSelect = useCallback((matchId: string, winner: 'team1' | 'team2') => {
    const updatedBracket = { ...bracket };
    
    let matchFound = false;
    let winningTeam;
    let losingTeam;
    let roundIndex = -1;
    let matchIndex = -1;
    
    for (let i = 0; i < updatedBracket.rounds.length; i++) {
      const roundMatches = updatedBracket.rounds[i].matches;
      
      for (let j = 0; j < roundMatches.length; j++) {
        if (roundMatches[j].id === matchId) {
          updatedBracket.rounds[i].matches[j].winner = winner;
          updatedBracket.rounds[i].matches[j].completed = true;
          
          const team1Id = updatedBracket.rounds[i].matches[j].team1.id;
          const team2Id = updatedBracket.rounds[i].matches[j].team2.id;
          
          if (team1Id && team2Id) {
            const simulatedMatch = generateDetailedMatch(
              team1Id,
              team2Id,
              new Date().toISOString().split('T')[0]
            );
            
            updatedBracket.rounds[i].matches[j].matchDetails = simulatedMatch;
            
            addMatch(simulatedMatch);
            
            updatedBracket.rounds[i].matches[j].score = 
              `${simulatedMatch.homeTeamScore}-${simulatedMatch.awayTeamScore}`;
          }
          
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
    
    if (matchFound && roundIndex < updatedBracket.rounds.length - 1 && winningTeam) {
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      
      const isTeam1Slot = matchIndex % 2 === 0;
      
      if (isTeam1Slot) {
        updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex].team1 = winningTeam;
      } else {
        updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex].team2 = winningTeam;
      }
    }
    
    setBracket(updatedBracket);
  }, [bracket, generateDetailedMatch, addMatch]);

  const simulateTiebreaker = useCallback((matchId: string) => {
    for (let i = 0; i < bracket.rounds.length; i++) {
      for (let j = 0; j < bracket.rounds[i].matches.length; j++) {
        const match = bracket.rounds[i].matches[j];
        if (match.id === matchId) {
          if (match.team1.id && match.team2.id) {
            const winner = simulatePlayoffTiebreaker(matchId, match.team1.id, match.team2.id);
            handleWinnerSelect(matchId, winner);
            return winner;
          }
        }
      }
    }
    return null;
  }, [bracket, simulatePlayoffTiebreaker, handleWinnerSelect]);

  const autoGenerateBracket = useCallback(() => {
    const teams = generateQualifiedTeams();
    return generateBracket(teams);
  }, [generateQualifiedTeams, generateBracket]);

  const simulateRound = useCallback((roundIndex: number) => {
    const round = bracket.rounds[roundIndex];
    if (!round) return;
    
    round.matches.forEach(match => {
      if (match.team1.id && match.team2.id && !match.completed) {
        const higherSeedWins = Math.random() < 0.6;
        const team1IsHigherSeed = match.team1.seed < match.team2.seed;
        const winner = (team1IsHigherSeed && higherSeedWins) || 
                      (!team1IsHigherSeed && !higherSeedWins) ? 'team1' : 'team2';
                    
        handleWinnerSelect(match.id, winner);
      }
    });
  }, [bracket, handleWinnerSelect]);

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
    simulateRound,
    qualificationRules: getQualificationRules()
  };
};
