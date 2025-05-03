
import { Match, Team, Flight } from "@/types";
import { TeamRanking } from "@/types/ranking";

// Constants for ITA-style ranking system
export const ITA_CONSTANTS = {
  LEAGUE_MATCH_WEIGHT: 1.0,      // 100% weight
  NON_LEAGUE_MATCH_WEIGHT: 0.5,  // 50% weight
  AWAY_MATCH_BONUS: 0.1,         // 10% bonus for away wins
  MAX_COUNTED_WINS: {
    EARLY_SEASON: 4,    // Weeks 1-3
    MID_SEASON: 6,      // Weeks 4-6
    LATE_SEASON: 8,     // Week 7+
  },
  OPPONENT_RANK_POINTS: {
    TOP_10: 10,       // Points for beating top 10 opponent
    TOP_25: 7,        // Points for beating 11-25 opponent
    TOP_50: 5,        // Points for beating 26-50 opponent
    OTHER: 3,         // Points for beating anyone else
  }
};

// Calculate the week of season based on a start date (typically early March)
export function getWeekOfSeason(date: Date, seasonStartDate: Date = new Date(date.getFullYear(), 2, 1)): number {
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weekDifference = Math.floor((date.getTime() - seasonStartDate.getTime()) / millisecondsPerWeek) + 1;
  return Math.max(1, weekDifference);
}

// Get maximum number of wins to count based on week of season
export function getMaxCountedWins(date: Date): number {
  const weekOfSeason = getWeekOfSeason(date);
  
  if (weekOfSeason <= 3) {
    return ITA_CONSTANTS.MAX_COUNTED_WINS.EARLY_SEASON;
  } else if (weekOfSeason <= 6) {
    return ITA_CONSTANTS.MAX_COUNTED_WINS.MID_SEASON;
  } else {
    return ITA_CONSTANTS.MAX_COUNTED_WINS.LATE_SEASON;
  }
}

// Calculate points for a win based on opponent's ranking
export function calculateWinPoints(opponentRanking: number): number {
  if (opponentRanking <= 10) {
    return ITA_CONSTANTS.OPPONENT_RANK_POINTS.TOP_10;
  } else if (opponentRanking <= 25) {
    return ITA_CONSTANTS.OPPONENT_RANK_POINTS.TOP_25;
  } else if (opponentRanking <= 50) {
    return ITA_CONSTANTS.OPPONENT_RANK_POINTS.TOP_50;
  } else {
    return ITA_CONSTANTS.OPPONENT_RANK_POINTS.OTHER;
  }
}

// Calculate ITA-style points for a team
export function calculateItaPoints(
  teamId: string,
  matches: Match[],
  allTeamRankings: TeamRanking[],
  cutoffDate: Date = new Date()
): { totalPoints: number; bestWins: Array<{ match: Match, points: number }> } {
  // Filter to completed matches up to cutoff date
  const teamMatches = matches.filter(match => {
    const matchDate = new Date(match.date);
    return (
      match.isComplete &&
      (match.homeTeamId === teamId || match.awayTeamId === teamId) &&
      matchDate <= cutoffDate
    );
  });
  
  // Calculate points for each win
  const wins = teamMatches.map(match => {
    // Determine if this team won the match
    const isHomeTeam = match.homeTeamId === teamId;
    const didWin = isHomeTeam ? match.homeTeamWon : !match.homeTeamWon;
    
    if (!didWin) {
      return null; // This wasn't a win
    }
    
    // Get opponent team ID and find their ranking
    const opponentId = isHomeTeam ? match.awayTeamId : match.homeTeamId;
    const opponentRanking = allTeamRankings.find(r => r.teamId === opponentId);
    const opponentRank = opponentRanking?.classificationRank || 99; // Default high number if not ranked
    
    // Calculate base points for this win
    let points = calculateWinPoints(opponentRank);
    
    // Apply league/non-league weight
    points *= match.isLeagueMatch 
      ? ITA_CONSTANTS.LEAGUE_MATCH_WEIGHT 
      : ITA_CONSTANTS.NON_LEAGUE_MATCH_WEIGHT;
    
    // Apply away match bonus
    if (!isHomeTeam) {
      points *= (1 + ITA_CONSTANTS.AWAY_MATCH_BONUS);
    }
    
    return {
      match,
      points
    };
  }).filter(Boolean) as Array<{ match: Match, points: number }>;
  
  // Sort wins by points (highest first)
  const sortedWins = wins.sort((a, b) => b.points - a.points);
  
  // Get max number of wins to count based on week of season
  const maxWins = getMaxCountedWins(cutoffDate);
  
  // Take only the best N wins
  const bestWins = sortedWins.slice(0, maxWins);
  
  // Sum up the points
  const totalPoints = bestWins.reduce((sum, win) => sum + win.points, 0);
  
  return {
    totalPoints,
    bestWins
  };
}

// Calculate ITA-style points for all teams
export function calculateAllTeamPoints(
  teams: Team[],
  matches: Match[],
  cutoffDate: Date = new Date()
): Map<string, number> {
  // First do a basic calculation of team rankings (to get opponent ranks)
  const basicRankings = teams.map(team => {
    const teamMatches = matches.filter(m => 
      m.isComplete && (m.homeTeamId === team.id || m.awayTeamId === team.id)
    );
    
    const wins = teamMatches.filter(m => 
      (m.homeTeamId === team.id && m.homeTeamWon === true) || 
      (m.awayTeamId === team.id && m.homeTeamWon === false)
    ).length;
    
    const losses = teamMatches.filter(m => 
      (m.homeTeamId === team.id && m.homeTeamWon === false) || 
      (m.awayTeamId === team.id && m.homeTeamWon === true)
    ).length;
    
    return {
      teamId: team.id,
      wins,
      losses,
      winPercentage: teamMatches.length > 0 ? wins / teamMatches.length : 0,
      classificationRank: 0 // Will be populated after sorting
    };
  });
  
  // Sort by win percentage to get initial rankings
  const sortedRankings = [...basicRankings].sort((a, b) => b.winPercentage - a.winPercentage);
  
  // Assign classification ranks
  sortedRankings.forEach((team, index) => {
    team.classificationRank = index + 1;
  });
  
  // Now calculate ITA points using these rankings
  const teamPoints = new Map<string, number>();
  
  teams.forEach(team => {
    const { totalPoints } = calculateItaPoints(team.id, matches, sortedRankings, cutoffDate);
    teamPoints.set(team.id, totalPoints);
  });
  
  return teamPoints;
}
