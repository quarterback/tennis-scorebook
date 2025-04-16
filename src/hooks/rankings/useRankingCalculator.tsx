
import { useData } from '@/context/DataContext';
import { TeamRanking, RankingConfig, ClassificationQualifications } from '@/types/ranking';
import { useRankingsBase } from './useRankingsBase';
import { useQualificationStatus } from './useQualificationStatus';
import { useRankingInsights } from './useRankingInsights';
import { getDefaultConfig, getHistoricalData } from '@/utils/rankingConstants';

// Qualification rules for state tournaments by classification
const qualificationRules: ClassificationQualifications[] = [
  {
    classification: '6A',
    totalSpots: 16,
    automaticBids: 7, // 7 leagues, 1 automatic bid each
    atLargeBids: 9
  },
  {
    classification: '5A',
    totalSpots: 12,
    automaticBids: 4, // 4 conferences, 1 automatic bid each
    atLargeBids: 8
  },
  {
    classification: '4A/3A/2A/1A',
    totalSpots: 8,
    automaticBids: 5, // 5 special districts, 1 automatic bid each
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
    
    // Apply qualification status by gender and classification
    const rankingsWithQualification = calculateQualificationStatus(baseRankings, qualificationRules);
    
    // Calculate APR values for each classification separately
    // This ensures rankings are not conflated across classifications
    const classifications = [...new Set(rankingsWithQualification.map(r => r.classification))];
    
    let finalRankings: TeamRanking[] = [];
    
    classifications.forEach(classification => {
      // Get teams of this classification
      const classificationTeams = rankingsWithQualification.filter(
        team => team.classification === classification
      );
      
      // Sort by composite score
      const sortedTeams = [...classificationTeams].sort((a, b) => b.compositeScore - a.compositeScore);
      
      // Normalize APR to 0-100 scale within each classification
      if (sortedTeams.length > 0) {
        const highestScore = sortedTeams[0].compositeScore;
        
        sortedTeams.forEach((team, index) => {
          // Calculate APR (0-100 scale) relative to the highest score in this classification
          team.apr = highestScore > 0 
            ? Math.round((team.compositeScore / highestScore) * 100) 
            : 0;
            
          // Also store the rank within classification for display purposes
          team.classificationRank = index + 1;
        });
      }
      
      finalRankings = [...finalRankings, ...sortedTeams];
    });
    
    return finalRankings;
  };
  
  const getRankingsByGenderAndClassification = (
    gender: string,
    classification: string
  ): TeamRanking[] => {
    const allRankings = calculateRankings();
    return allRankings.filter(
      team => team.gender === gender && team.classification === classification
    ).sort((a, b) => b.compositeScore - a.compositeScore);
  };
  
  const getRankingsByDistrict = (
    gender: string,
    districtName: string
  ): TeamRanking[] => {
    const allRankings = calculateRankings();
    return allRankings.filter(
      team => team.gender === gender && team.districtName === districtName
    ).sort((a, b) => b.compositeScore - a.compositeScore);
  };

  return {
    calculateRankings,
    getRankingsByGenderAndClassification,
    getRankingsByDistrict,
    defaultConfig,
    historicalData,
    qualificationRules,
    generateInsights,
    findKeyMatchups
  };
};
