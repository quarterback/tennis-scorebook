import { useData } from '@/context/DataContext';
import { Team, School, Match, Flight, District } from '@/types';
import { TeamRanking, RankingConfig, ClassificationQualifications } from '@/types/ranking';
import { useFlightWeightedScore } from './useFlightWeightedScore';
import { useLeagueStrengthCoefficient } from './useLeagueStrengthCoefficient';
import { useOpponentStrengthIndex } from './useOpponentStrengthIndex';
import { useRankingInsights } from './useRankingInsights';
import { getDefaultConfig, getHistoricalData } from '@/utils/rankingConstants';

const qualificationRules: ClassificationQualifications[] = [
  {
    classification: '6A',
    totalSpots: 16,
    automaticBids: 7,
    atLargeBids: 9
  },
  {
    classification: '5A',
    totalSpots: 12,
    automaticBids: 4,
    atLargeBids: 8
  },
  {
    classification: '4A/3A/2A/1A',
    totalSpots: 8,
    automaticBids: 4,
    atLargeBids: 4
  }
];

export const useRankingCalculator = () => {
  const { teams, schools, matches, districts } = useData();
  const defaultConfig = getDefaultConfig();
  const historicalData = getHistoricalData();
  
  const { calculateFlightWeightedScore } = useFlightWeightedScore(matches);
  const { calculateLeagueStrengthCoefficient } = useLeagueStrengthCoefficient(districts, historicalData);
  const { calculateOpponentStrengthIndex } = useOpponentStrengthIndex(teams, schools, matches, historicalData);
  const { generateInsights, findKeyMatchups } = useRankingInsights();
  
  /**
   * Calculate team rankings with enhanced algorithm and realistic data
   */
  const calculateRankings = (config: RankingConfig = defaultConfig): TeamRanking[] => {
    // Initial calculation of FWS for all teams
    const teamScores = new Map<string, number>();
    
    // First pass: Calculate FWS for all teams
    teams.forEach(team => {
      const fws = calculateFlightWeightedScore(team.id, config);
      teamScores.set(team.id, fws);
    });
    
    // Second pass: Calculate OSI using the initial scores and build rankings
    const rankings: TeamRanking[] = teams.map(team => {
      const school = schools.find(s => s.id === team.schoolId)!;
      const district = districts.find(d => d.id === school.districtId)!;
      
      // Get team matches
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      // Calculate overall team stats
      const wins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || 
        (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const losses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || 
        (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      // Calculate league-specific stats
      const leagueMatches = teamMatches.filter(m => {
        // Get opponent team's school
        const opponentTeamId = m.homeTeamId === team.id ? m.awayTeamId : m.homeTeamId;
        const opponentTeam = teams.find(t => t.id === opponentTeamId);
        if (!opponentTeam) return false;
        
        const opponentSchool = schools.find(s => s.id === opponentTeam.schoolId);
        if (!opponentSchool) return false;
        
        // Match is a league match if both teams are from the same district AND the isLeagueMatch flag is true
        return opponentSchool.districtId === school.districtId && m.isLeagueMatch;
      });
      
      const leagueWins = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || 
        (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const leagueLosses = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || 
        (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      // Calculate components with improved formulas
      const fws = teamScores.get(team.id) || 0;
      const lsc = calculateLeagueStrengthCoefficient(school.districtId);
      const osi = calculateOpponentStrengthIndex(team.id, teamScores);
      
      // Calculate composite score with more balanced weighting
      // The formula is now: CS = FWS × LSC × OSI
      const compositeScore = fws * lsc * osi;
      
      // Calculate win percentages
      const totalMatches = wins + losses;
      const winPercentage = totalMatches > 0 ? wins / totalMatches : 0;
      
      const totalLeagueMatches = leagueWins + leagueLosses;
      const leagueWinPercentage = totalLeagueMatches > 0 ? leagueWins / totalLeagueMatches : 0;
      
      return {
        teamId: team.id,
        teamName: `${school.name} ${team.gender}`,
        schoolName: school.name,
        gender: team.gender,
        classification: school.classification,
        districtName: district.name,
        matchesPlayed: teamMatches.length,
        wins,
        losses,
        leagueWins,
        leagueLosses,
        leagueMatchesPlayed: leagueMatches.length,
        flightWeightedScore: fws,
        leagueStrengthCoefficient: lsc,
        opponentStrengthIndex: osi,
        compositeScore,
        qualifiedForRanking: teamMatches.length >= config.minimumMatches,
        winPercentage,
        leagueWinPercentage
      };
    });
    
    // Sort by composite score, highest first
    const sortedRankings = rankings.sort((a, b) => b.compositeScore - a.compositeScore);
    
    // Now determine qualification status for each team
    return calculateQualificationStatus(sortedRankings);
  };
  
  /**
   * Calculate qualification status for teams based on their classification and ranking
   */
  const calculateQualificationStatus = (rankings: TeamRanking[]): TeamRanking[] => {
    // Group teams by classification and gender
    const teamsByClassAndGender: Record<string, TeamRanking[]> = {};
    
    rankings.forEach(team => {
      const key = `${team.classification}-${team.gender}`;
      if (!teamsByClassAndGender[key]) {
        teamsByClassAndGender[key] = [];
      }
      teamsByClassAndGender[key].push(team);
    });
    
    // Process each classification
    Object.entries(teamsByClassAndGender).forEach(([key, teamsInClass]) => {
      const [classification, gender] = key.split('-');
      
      // Find qualification rules for this classification
      const rules = qualificationRules.find(r => r.classification === classification) || {
        classification,
        totalSpots: 8,
        automaticBids: 4,
        atLargeBids: 4
      };
      
      // Create a map of district to top team for automatic qualifiers
      const topTeamByDistrict: Map<string, TeamRanking> = new Map();
      
      // Group teams by district
      const teamsByDistrict: Record<string, TeamRanking[]> = {};
      teamsInClass.forEach(team => {
        if (!teamsByDistrict[team.districtName]) {
          teamsByDistrict[team.districtName] = [];
        }
        teamsByDistrict[team.districtName].push(team);
      });
      
      // Find top team in each district (automatic qualifiers)
      Object.entries(teamsByDistrict).forEach(([district, districtTeams]) => {
        // Sort district teams by league win percentage
        const sortedTeams = [...districtTeams].sort((a, b) => {
          const aWinPct = a.leagueWinPercentage || 0;
          const bWinPct = b.leagueWinPercentage || 0;
          
          if (aWinPct !== bWinPct) return bWinPct - aWinPct;
          
          // If league win percentages are equal, sort by league wins
          if (a.leagueWins !== b.leagueWins) return b.leagueWins - a.leagueWins;
          
          // If league wins are equal, sort by overall win percentage
          return (b.winPercentage || 0) - (a.winPercentage || 0);
        });
        
        // Top team in district is automatic qualifier
        if (sortedTeams.length > 0) {
          topTeamByDistrict.set(district, sortedTeams[0]);
        }
      });
      
      // Mark automatic qualifiers (up to the automaticBids limit)
      let automaticQualifiers: TeamRanking[] = [];
      topTeamByDistrict.forEach(team => {
        automaticQualifiers.push(team);
      });
      
      // Sort automatic qualifiers by composite score to determine seeding
      automaticQualifiers.sort((a, b) => b.compositeScore - a.compositeScore);
      
      // Keep only the top N automatic qualifiers based on rules
      automaticQualifiers = automaticQualifiers.slice(0, rules.automaticBids);
      
      // Mark these teams as automatic qualifiers
      automaticQualifiers.forEach((team, index) => {
        const teamInRankings = teamsInClass.find(t => t.teamId === team.teamId);
        if (teamInRankings) {
          teamInRankings.qualificationStatus = 'automatic';
          teamInRankings.qualificationSeed = index + 1;
        }
      });
      
      // Now find at-large qualifiers
      // Filter out teams that are already automatic qualifiers
      const eligibleForAtLarge = teamsInClass.filter(team => 
        !automaticQualifiers.some(aq => aq.teamId === team.teamId)
      );
      
      // Sort by composite score
      const sortedForAtLarge = [...eligibleForAtLarge].sort((a, b) => 
        b.compositeScore - a.compositeScore
      );
      
      // Take top N for at-large bids
      const atLargeQualifiers = sortedForAtLarge.slice(0, rules.atLargeBids);
      
      // Mark these teams as at-large qualifiers
      atLargeQualifiers.forEach((team, index) => {
        const teamInRankings = teamsInClass.find(t => t.teamId === team.teamId);
        if (teamInRankings) {
          teamInRankings.qualificationStatus = 'at-large';
          teamInRankings.qualificationSeed = automaticQualifiers.length + index + 1;
        }
      });
    });
    
    return rankings;
  };
  
  return {
    calculateRankings,
    defaultConfig,
    historicalData,
    generateInsights,
    findKeyMatchups,
    qualificationRules
  };
};
