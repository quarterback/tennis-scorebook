
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
    // 6A Leagues - Updated with more realistic historical data
    { leagueId: 'pil', firstPlaceFinishes: 1, secondPlaceFinishes: 3, yearRange: '2022-2025', totalPoints: 14 },
    { leagueId: 'metro', firstPlaceFinishes: 5, secondPlaceFinishes: 4, yearRange: '2022-2025', totalPoints: 37 },
    { leagueId: 'pacific', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    { leagueId: 'mt-hood', firstPlaceFinishes: 0, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 2 },
    { leagueId: 'three-rivers', firstPlaceFinishes: 3, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 21 },
    { leagueId: 'central-valley', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 5 },
    { leagueId: 'southwest', firstPlaceFinishes: 1, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 7 },
    
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
    // Updated list of top 6A schools based on historical performance
    'jesuit', 'sunset', 'lincoln', 'lake-oswego', 'west-linn', 'central-catholic', 'sprague',
    'south-eugene', 'lakeridge', 'southridge', 'tigard', 'grant', 'wells', 'beaverton'
  ]
});

/**
 * 6A Power Rankings - For the current 2025 season
 * These are the preseason rankings used for early season comparisons
 */
export const get6APowerRankings = () => {
  return [
    { teamId: 'jesuit-girls', preseasonRank: 1, expectedFinish: 'State Champion', strengthRating: 9.8 },
    { teamId: 'lake-oswego-girls', preseasonRank: 2, expectedFinish: 'Final Four', strengthRating: 9.5 },
    { teamId: 'lincoln-girls', preseasonRank: 3, expectedFinish: 'Final Four', strengthRating: 9.3 },
    { teamId: 'sunset-girls', preseasonRank: 4, expectedFinish: 'Final Four', strengthRating: 9.1 },
    { teamId: 'west-linn-girls', preseasonRank: 5, expectedFinish: 'Quarterfinalist', strengthRating: 8.9 },
    { teamId: 'lakeridge-girls', preseasonRank: 6, expectedFinish: 'Quarterfinalist', strengthRating: 8.7 },
    { teamId: 'wells-girls', preseasonRank: 7, expectedFinish: 'Quarterfinalist', strengthRating: 8.6 },
    { teamId: 'grant-girls', preseasonRank: 8, expectedFinish: 'Quarterfinalist', strengthRating: 8.4 },
    { teamId: 'jesuit-boys', preseasonRank: 1, expectedFinish: 'State Champion', strengthRating: 9.9 },
    { teamId: 'sunset-boys', preseasonRank: 2, expectedFinish: 'Final Four', strengthRating: 9.6 },
    { teamId: 'lincoln-boys', preseasonRank: 3, expectedFinish: 'Final Four', strengthRating: 9.2 },
    { teamId: 'central-catholic-boys', preseasonRank: 4, expectedFinish: 'Final Four', strengthRating: 9.0 },
    { teamId: 'sprague-boys', preseasonRank: 5, expectedFinish: 'Quarterfinalist', strengthRating: 8.8 },
    { teamId: 'south-eugene-boys', preseasonRank: 6, expectedFinish: 'Quarterfinalist', strengthRating: 8.6 },
    { teamId: 'lake-oswego-boys', preseasonRank: 7, expectedFinish: 'Quarterfinalist', strengthRating: 8.5 },
    { teamId: 'westview-boys', preseasonRank: 8, expectedFinish: 'Quarterfinalist', strengthRating: 8.3 }
  ];
};

/**
 * Key 6A season matches to watch
 * These are the matches that are expected to have significant impact on rankings
 */
export const get6AKeyMatches = () => {
  return [
    { id: 'match-jesuit-lo', homeTeam: 'Jesuit', awayTeam: 'Lake Oswego', date: '2025-04-23', significance: 'Potential state championship preview' },
    { id: 'match-sunset-lincoln', homeTeam: 'Sunset', awayTeam: 'Lincoln', date: '2025-04-18', significance: 'Top Metro League vs PIL showdown' },
    { id: 'match-lakeridge-west-linn', homeTeam: 'Lakeridge', awayTeam: 'West Linn', date: '2025-04-27', significance: 'Three Rivers rivalry match' },
    { id: 'match-grant-wells', homeTeam: 'Grant', awayTeam: 'Ida B. Wells', date: '2025-04-15', significance: 'PIL standings implications' },
    { id: 'match-westview-beaverton', homeTeam: 'Westview', awayTeam: 'Beaverton', date: '2025-04-20', significance: 'Metro League positioning' }
  ];
};

