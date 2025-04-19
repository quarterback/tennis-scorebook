
import { TeamRanking } from '@/types/ranking';
import { Team, School, Match } from '@/types';
import { useFlightWeightedScore } from './useFlightWeightedScore';
import { useLeagueStrengthCoefficient } from './useLeagueStrengthCoefficient';
import { useOpponentStrengthIndex } from './useOpponentStrengthIndex';
import { useAprCalculator } from './useAprCalculator';
import { getHistoricalData } from '@/utils/rankingConstants';

export const useRankingsBase = (
  teams: Team[], 
  schools: School[], 
  matches: Match[], 
  districts: any[]
) => {
  const historicalData = getHistoricalData();
  const { calculateFlightWeightedScore } = useFlightWeightedScore(teams, matches);
  const { calculateLeagueStrengthCoefficient } = useLeagueStrengthCoefficient(districts, historicalData);
  const { calculateOpponentStrengthIndex } = useOpponentStrengthIndex(teams, schools, matches, historicalData);
  const { calculateTeamAprs } = useAprCalculator();

  const calculateBaseRankings = (config: any): TeamRanking[] => {
    const teamScores = new Map<string, number>();
    
    teams.forEach(team => {
      // Fix: Pass the team and config to the function
      const result = calculateFlightWeightedScore(team.id, config);
      // Fix: Extract just the score from the returned object
      teamScores.set(team.id, result.flightWeightedScore);
    });
    
    const rankings: TeamRanking[] = teams.map(team => {
      // Find the school, and properly handle if it doesn't exist
      const school = schools.find(s => s.id === team.schoolId);
      
      // Skip this team if the school doesn't exist
      if (!school) {
        console.warn(`School not found for team ${team.id}`);
        return {
          teamId: team.id,
          teamName: `Unknown Team (${team.gender})`,
          schoolName: "Unknown School",
          schoolId: "",
          gender: team.gender,
          classification: "Unknown",
          districtName: "Unknown District",
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          ties: 0,
          leagueWins: 0,
          leagueLosses: 0,
          leagueTies: 0,
          leagueMatchesPlayed: 0,
          flightWeightedScore: 0,
          leagueStrengthCoefficient: 1,
          opponentStrengthIndex: 1,
          compositeScore: 0,
          qualifiedForRanking: false,
          winPercentage: 0,
          leagueWinPercentage: 0,
          apr: 0,
          classificationRank: 0
        };
      }
      
      // Get district info and handle if it doesn't exist
      const district = districts.find(d => d.id === school.districtId);
      const districtName = district ? district.name : "Unknown District";
      
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      // Count wins, losses, and ties
      const wins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === true) || 
        (m.awayTeamId === team.id && m.homeTeamWon === false)
      ).length;
      
      const ties = teamMatches.filter(m => 
        m.isTie === true || (m.homeTeamWon === undefined && m.isComplete)
      ).length;
      
      const losses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === false) || 
        (m.awayTeamId === team.id && m.homeTeamWon === true)
      ).length;
      
      // League matches only
      const leagueMatches = teamMatches.filter(m => {
        const opponentTeamId = m.homeTeamId === team.id ? m.awayTeamId : m.homeTeamId;
        const opponentTeam = teams.find(t => t.id === opponentTeamId);
        if (!opponentTeam) return false;
        
        const opponentSchool = schools.find(s => s.id === opponentTeam.schoolId);
        if (!opponentSchool) return false;
        
        return opponentSchool.districtId === school.districtId && m.isLeagueMatch;
      });
      
      const leagueWins = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === true) || 
        (m.awayTeamId === team.id && m.homeTeamWon === false)
      ).length;
      
      const leagueTies = leagueMatches.filter(m => 
        m.isTie === true || (m.homeTeamWon === undefined && m.isComplete)
      ).length;
      
      const leagueLosses = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === false) || 
        (m.awayTeamId === team.id && m.homeTeamWon === true)
      ).length;
      
      // Get APR components - Fix: Extract just the score
      const result = calculateFlightWeightedScore(team.id, config);
      const fws = result.flightWeightedScore;
      const lsc = calculateLeagueStrengthCoefficient(school.districtId);
      const osi = calculateOpponentStrengthIndex(team.id, teamScores);
      
      // APR = FWS × OSI
      const compositeScore = fws * osi;
      
      // Calculate win percentages (counting ties as half wins)
      const totalMatches = wins + losses + ties;
      const winPercentage = totalMatches > 0 ? 
        (wins + (ties * 0.5)) / totalMatches : 0;
      
      const totalLeagueMatches = leagueWins + leagueLosses + leagueTies;
      const leagueWinPercentage = totalLeagueMatches > 0 ? 
        (leagueWins + (leagueTies * 0.5)) / totalLeagueMatches : 0;
      
      return {
        teamId: team.id,
        teamName: `${school.name} ${team.gender}`,
        schoolName: school.name,
        schoolId: school.id,
        gender: team.gender,
        classification: school.classification,
        districtName,
        matchesPlayed: teamMatches.length,
        wins,
        losses,
        ties,
        leagueWins,
        leagueLosses,
        leagueTies,
        leagueMatchesPlayed: leagueMatches.length,
        flightWeightedScore: fws,
        leagueStrengthCoefficient: lsc,
        opponentStrengthIndex: osi,
        compositeScore,
        qualifiedForRanking: teamMatches.length >= config.minimumMatches,
        winPercentage,
        leagueWinPercentage,
        apr: 0, // Will be calculated in calculateTeamAprs
        classificationRank: 0 // Will be updated later
      };
    }).filter(Boolean); // Filter out any undefined entries

    return calculateTeamAprs(rankings);
  };

  return { calculateBaseRankings };
};
