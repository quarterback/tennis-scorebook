
import { Team, School, Match } from '@/types';
import { HistoricalData } from '@/types/ranking';

export const useOpponentStrengthIndex = (
  teams: Team[], 
  schools: School[], 
  matches: Match[], 
  historicalData: HistoricalData
) => {
  /**
   * Calculate Opponent Strength Index with improved algorithm
   */
  const calculateOpponentStrengthIndex = (teamId: string, teamScores: Map<string, number>): number => {
    // Get all matches for this team
    const teamMatches = matches.filter(
      m => (m.homeTeamId === teamId || m.awayTeamId === teamId) && m.isComplete
    );
    
    if (teamMatches.length === 0) {
      return 1.0; // Default if no matches
    }
    
    // Get opponent IDs
    const opponentIds = teamMatches.map(m => 
      m.homeTeamId === teamId ? m.awayTeamId : m.homeTeamId
    );
    
    // Calculate average opponent score
    let totalOpponentScore = 0;
    let validOpponents = 0;
    
    opponentIds.forEach(id => {
      const opponentScore = teamScores.get(id);
      if (opponentScore) {
        totalOpponentScore += opponentScore;
        validOpponents++;
      }
    });
    
    // Get the team's school
    const team = teams.find(t => t.id === teamId);
    const school = team ? schools.find(s => s.id === team.schoolId) : null;
    
    // Apply a strength modifier for historically strong schools
    let strengthModifier = 1.0;
    if (school && historicalData.topSchools.includes(school.id.toLowerCase())) {
      strengthModifier = 1.1; // 10% boost for historically strong programs
    }
    
    // Return adjusted OSI with minimum of 1.0
    return validOpponents > 0 ? 
      Math.max(1.0, (totalOpponentScore / validOpponents) * strengthModifier) : 1.0;
  };
  
  return { calculateOpponentStrengthIndex };
};
