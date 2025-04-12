
import { RankingConfig, HistoricalData } from '@/types/ranking';

/**
 * Default ranking configuration with current season cutoff
 */
export const getDefaultConfig = (): RankingConfig => ({
  minimumMatches: 6,
  cutoffDate: '2025-05-12', // Updated cutoff date for current season
  weights: {
    singles1: 1.0,  // First singles has highest weight
    singles2: 0.75, // Second singles
    doubles1: 1.0,  // First doubles equal to first singles
    doubles2: 0.5   // Second doubles
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
    
    // 5A Leagues - Added more detailed 5A historical data
    { leagueId: 'northwest-oregon', firstPlaceFinishes: 0, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 4 },
    { leagueId: 'midwestern', firstPlaceFinishes: 2, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 12 },
    { leagueId: 'mid-willamette', firstPlaceFinishes: 3, secondPlaceFinishes: 1, yearRange: '2022-2025', totalPoints: 17 },
    { leagueId: 'intermountain', firstPlaceFinishes: 1, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 9 },
    { leagueId: 'portland-area', firstPlaceFinishes: 4, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 22 },
    
    // 4A/3A/2A/1A Special Districts - Enhanced with more historical context
    { leagueId: 'sd1', firstPlaceFinishes: 5, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 31 },
    { leagueId: 'sd2', firstPlaceFinishes: 2, secondPlaceFinishes: 3, yearRange: '2022-2025', totalPoints: 17 },
    { leagueId: 'sd3', firstPlaceFinishes: 1, secondPlaceFinishes: 2, yearRange: '2022-2025', totalPoints: 9 },
    { leagueId: 'sd4', firstPlaceFinishes: 1, secondPlaceFinishes: 3, yearRange: '2022-2025', totalPoints: 11 },
    { leagueId: 'sd5', firstPlaceFinishes: 1, secondPlaceFinishes: 0, yearRange: '2022-2025', totalPoints: 5 }
  ],
  topSchools: [
    // 6A top schools
    'jesuit', 'sunset', 'lincoln', 'lake-oswego', 'west-linn', 'central-catholic', 'sprague',
    'south-eugene', 'lakeridge', 'southridge', 'tigard', 'grant', 'wells', 'beaverton',
    
    // 5A top schools
    'crescent-valley', 'summit', 'churchill', 'corvallis', 'north-bend', 'wilsonville',
    
    // 4A/3A/2A/1A top schools
    'catlin-gabel', 'valley-catholic', 'oregon-episcopal', 'riverdale', 'marist', 'north-marion'
  ]
});

/**
 * 6A Power Rankings - For the current 2025 season
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
 * 5A Power Rankings - For the current 2025 season
 */
export const get5APowerRankings = () => {
  return [
    { teamId: 'crescent-valley-girls', preseasonRank: 1, expectedFinish: 'State Champion', strengthRating: 9.7 },
    { teamId: 'summit-girls', preseasonRank: 2, expectedFinish: 'Final Four', strengthRating: 9.5 },
    { teamId: 'churchill-girls', preseasonRank: 3, expectedFinish: 'Final Four', strengthRating: 9.2 },
    { teamId: 'corvallis-girls', preseasonRank: 4, expectedFinish: 'Final Four', strengthRating: 9.0 },
    { teamId: 'wilsonville-girls', preseasonRank: 5, expectedFinish: 'Quarterfinalist', strengthRating: 8.7 },
    { teamId: 'north-bend-girls', preseasonRank: 6, expectedFinish: 'Quarterfinalist', strengthRating: 8.5 },
    { teamId: 'summit-boys', preseasonRank: 1, expectedFinish: 'State Champion', strengthRating: 9.8 },
    { teamId: 'crescent-valley-boys', preseasonRank: 2, expectedFinish: 'Final Four', strengthRating: 9.6 },
    { teamId: 'corvallis-boys', preseasonRank: 3, expectedFinish: 'Final Four', strengthRating: 9.3 },
    { teamId: 'churchill-boys', preseasonRank: 4, expectedFinish: 'Final Four', strengthRating: 9.1 }
  ];
};

/**
 * 4A/3A/2A/1A Power Rankings - For the current 2025 season
 */
export const get4A3A2A1APowerRankings = () => {
  return [
    { teamId: 'catlin-gabel-girls', preseasonRank: 1, expectedFinish: 'State Champion', strengthRating: 9.9 },
    { teamId: 'oregon-episcopal-girls', preseasonRank: 2, expectedFinish: 'Final Four', strengthRating: 9.7 },
    { teamId: 'valley-catholic-girls', preseasonRank: 3, expectedFinish: 'Final Four', strengthRating: 9.5 },
    { teamId: 'riverdale-girls', preseasonRank: 4, expectedFinish: 'Final Four', strengthRating: 9.2 },
    { teamId: 'catlin-gabel-boys', preseasonRank: 1, expectedFinish: 'State Champion', strengthRating: 9.8 },
    { teamId: 'valley-catholic-boys', preseasonRank: 2, expectedFinish: 'Final Four', strengthRating: 9.6 },
    { teamId: 'oregon-episcopal-boys', preseasonRank: 3, expectedFinish: 'Final Four', strengthRating: 9.4 },
    { teamId: 'marist-boys', preseasonRank: 4, expectedFinish: 'Final Four', strengthRating: 9.1 }
  ];
};

/**
 * Key 6A season matches to watch
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

/**
 * Key 5A season matches to watch
 */
export const get5AKeyMatches = () => {
  return [
    { id: 'match-crescent-valley-summit', homeTeam: 'Crescent Valley', awayTeam: 'Summit', date: '2025-04-21', significance: 'Top 5A programs clash' },
    { id: 'match-churchill-corvallis', homeTeam: 'Churchill', awayTeam: 'Corvallis', date: '2025-04-25', significance: 'Midwestern vs Mid-Willamette' },
    { id: 'match-wilsonville-north-bend', homeTeam: 'Wilsonville', awayTeam: 'North Bend', date: '2025-04-19', significance: 'Portland area vs Coast showdown' }
  ];
};

/**
 * Key 4A/3A/2A/1A season matches to watch
 */
export const get4A3A2A1AKeyMatches = () => {
  return [
    { id: 'match-catlin-oec', homeTeam: 'Catlin Gabel', awayTeam: 'Oregon Episcopal', date: '2025-04-22', significance: 'Private school rivalry' },
    { id: 'match-valley-riverdale', homeTeam: 'Valley Catholic', awayTeam: 'Riverdale', date: '2025-04-26', significance: 'SD1 championship implications' },
    { id: 'match-marist-north-marion', homeTeam: 'Marist', awayTeam: 'North Marion', date: '2025-04-18', significance: 'SD3 vs SD2 crossover' }
  ];
};
