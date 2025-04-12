
import { RankingConfig, HistoricalData } from '@/types/ranking';

/**
 * Default ranking configuration with current season cutoff
 */
export const getDefaultConfig = (): RankingConfig => ({
  minimumMatches: 6,
  cutoffDate: '2025-05-12', // Updated cutoff date for current season
  weights: {
    singles1: 1.0,
    singles2: 0.75,
    doubles1: 1.0,
    doubles2: 0.5
  }
});

/**
 * Historical data for realistic league strength calculations
 * Based on historical state championship performances
 */
export const getHistoricalData = (): HistoricalData => ({
  leagues: [
    // 6A Leagues
    { leagueId: 'pil', firstPlaceFinishes: 1, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 9 },
    { leagueId: 'metro', firstPlaceFinishes: 3, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 23 },
    { leagueId: 'pacific', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    { leagueId: 'mt-hood', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 },
    { leagueId: 'three-rivers', firstPlaceFinishes: 2, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 14 },
    { leagueId: 'central-valley', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    { leagueId: 'southwest', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 },
    
    // 5A Leagues
    { leagueId: 'northwest-oregon', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    { leagueId: 'midwestern', firstPlaceFinishes: 1, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 9 },
    { leagueId: 'mid-willamette', firstPlaceFinishes: 2, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 10 },
    { leagueId: 'intermountain', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    
    // 4A/3A/2A/1A Special Districts
    { leagueId: 'sd1', firstPlaceFinishes: 3, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 19 },
    { leagueId: 'sd2', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    { leagueId: 'sd3', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 },
    { leagueId: 'sd4', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    { leagueId: 'sd5', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 0 }
  ],
  topSchools: [
    'jesuit', 'sunset', 'lincoln', 'lake-oswego', 'south-eugene', 'crescent-valley', 'catlin-gabel'
  ]
});
