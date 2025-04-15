
import { useData } from '@/context/DataContext';
import { TeamRanking, RankingConfig } from '@/types/ranking';
import { useRankingsBase } from './useRankingsBase';
import { useQualificationStatus } from './useQualificationStatus';
import { useRankingInsights } from './useRankingInsights';
import { getDefaultConfig, getHistoricalData } from '@/utils/rankingConstants';

const qualificationRules = [
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
  const { calculateBaseRankings } = useRankingsBase(teams, schools, matches, districts);
  const { calculateQualificationStatus } = useQualificationStatus();
  const { generateInsights, findKeyMatchups } = useRankingInsights();
  const defaultConfig = getDefaultConfig();
  const historicalData = getHistoricalData();
  
  const calculateRankings = (config: RankingConfig = defaultConfig): TeamRanking[] => {
    const baseRankings = calculateBaseRankings(config);
    return calculateQualificationStatus(baseRankings, qualificationRules);
  };

  return {
    calculateRankings,
    defaultConfig,
    historicalData,
    qualificationRules,
    generateInsights,
    findKeyMatchups
  };
};
