import { useData } from '@/context/DataContext';
import { Team, School, Match, Flight, District } from '@/types';
import { TeamRanking, RankingConfig, ClassificationQualifications } from '@/types/ranking';
import { useFlightWeightedScore } from './useFlightWeightedScore';
import { useLeagueStrengthCoefficient } from './useLeagueStrengthCoefficient';
import { useOpponentStrengthIndex } from './useOpponentStrengthIndex';
import { useRankingInsights } from './useRankingInsights';
import { getDefaultConfig, getHistoricalData } from '@/utils/rankingConstants';
import { useAprCalculator } from './useAprCalculator';

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
    automaticBids: 5,
    atLargeBids: 3
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
  const { calculateTeamAprs } = useAprCalculator();
  
  const calculateRankings = (config: RankingConfig = defaultConfig): TeamRanking[] => {
    const teamScores = new Map<string, number>();
    
    teams.forEach(team => {
      const fws = calculateFlightWeightedScore(team.id, config);
      teamScores.set(team.id, fws);
    });
    
    const rankings: TeamRanking[] = teams.map(team => {
      const school = schools.find(s => s.id === team.schoolId)!;
      const district = districts.find(d => d.id === school.districtId)!;
      
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      const wins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || 
        (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const losses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || 
        (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      const leagueMatches = teamMatches.filter(m => {
        const opponentTeamId = m.homeTeamId === team.id ? m.awayTeamId : m.homeTeamId;
        const opponentTeam = teams.find(t => t.id === opponentTeamId);
        if (!opponentTeam) return false;
        
        const opponentSchool = schools.find(s => s.id === opponentTeam.schoolId);
        if (!opponentSchool) return false;
        
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
      
      const fws = teamScores.get(team.id) || 0;
      const lsc = calculateLeagueStrengthCoefficient(school.districtId);
      const osi = calculateOpponentStrengthIndex(team.id, teamScores);
      
      const compositeScore = fws * lsc * osi;
      
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
        leagueWinPercentage,
        apr: 0
      };
    });
    
    const sortedRankings = rankings.sort((a, b) => b.compositeScore - a.compositeScore);
    
    const rankingsWithApr = calculateTeamAprs(sortedRankings);
    
    return calculateQualificationStatus(rankingsWithApr);
  };
  
  const calculateQualificationStatus = (rankings: TeamRanking[]): TeamRanking[] => {
    const teamsByClassAndGender: Record<string, TeamRanking[]> = {};
    
    rankings.forEach(team => {
      const key = `${team.classification}-${team.gender}`;
      if (!teamsByClassAndGender[key]) {
        teamsByClassAndGender[key] = [];
      }
      teamsByClassAndGender[key].push(team);
    });
    
    Object.entries(teamsByClassAndGender).forEach(([key, teamsInClass]) => {
      const [classification, gender] = key.split('-');
      
      const rules = qualificationRules.find(r => r.classification === classification) || {
        classification,
        totalSpots: 8,
        automaticBids: 4,
        atLargeBids: 4
      };
      
      const topTeamByDistrict: Map<string, TeamRanking> = new Map();
      
      const teamsByDistrict: Record<string, TeamRanking[]> = {};
      teamsInClass.forEach(team => {
        if (!teamsByDistrict[team.districtName]) {
          teamsByDistrict[team.districtName] = [];
        }
        teamsByDistrict[team.districtName].push(team);
      });
      
      Object.entries(teamsByDistrict).forEach(([district, districtTeams]) => {
        const sortedTeams = [...districtTeams].sort((a, b) => b.compositeScore - a.compositeScore);
        
        if (sortedTeams.length > 0) {
          topTeamByDistrict.set(district, sortedTeams[0]);
        }
      });
      
      let automaticQualifiers = Array.from(topTeamByDistrict.values());
      
      automaticQualifiers.sort((a, b) => b.compositeScore - a.compositeScore);
      
      automaticQualifiers = automaticQualifiers.slice(0, rules.automaticBids);
      
      automaticQualifiers.forEach((team, index) => {
        const teamInRankings = teamsInClass.find(t => t.teamId === team.teamId);
        if (teamInRankings) {
          teamInRankings.qualificationStatus = 'automatic';
          teamInRankings.qualificationSeed = index + 1;
        }
      });
      
      const eligibleForAtLarge = teamsInClass.filter(team => 
        !automaticQualifiers.some(aq => aq.teamId === team.teamId)
      );
      
      const sortedForAtLarge = [...eligibleForAtLarge].sort((a, b) => 
        b.compositeScore - a.compositeScore
      );
      
      const atLargeQualifiers = sortedForAtLarge.slice(0, rules.atLargeBids);
      
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
