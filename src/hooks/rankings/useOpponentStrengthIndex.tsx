
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
   * OSI = Average opponent FWS score × historical strength modifier
   */
  const calculateOpponentStrengthIndex = (teamId: string, teamScores: Map<string, number>): number => {
    // Get all matches for this team
    const teamMatches = matches.filter(
      m => (m.homeTeamId === teamId || m.awayTeamId === teamId) && m.isComplete
    );
    
    if (teamMatches.length === 0) {
      return 1.0; // Default if no matches
    }
    
    // Get opponent IDs and calculate weighted opponent scores
    let totalOpponentScore = 0;
    let totalOpponentWeight = 0;
    
    teamMatches.forEach(match => {
      const opponentId = match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId;
      const opponentScore = teamScores.get(opponentId);
      
      if (opponentScore !== undefined) {
        // Weight more recent matches higher
        const matchDate = new Date(match.date).getTime();
        const now = new Date().getTime();
        const daysDiff = Math.ceil((now - matchDate) / (1000 * 60 * 60 * 24));
        const recencyWeight = Math.max(0.5, 1 - (daysDiff / 365)); // Higher weight for recent matches
        
        // Apply weight based on match significance (league vs non-league)
        const matchTypeWeight = match.isLeagueMatch ? 1.2 : 1.0;
        
        // Combined weight
        const weight = recencyWeight * matchTypeWeight;
        
        totalOpponentScore += opponentScore * weight;
        totalOpponentWeight += weight;
      }
    });
    
    // Get the team's school
    const team = teams.find(t => t.id === teamId);
    const school = team ? schools.find(s => s.id === team.schoolId) : null;
    
    // Apply a strength modifier for historically strong schools
    let strengthModifier = 1.0;
    if (school) {
      const schoolKey = school.name.toLowerCase().replace(/\s+/g, '-');
      if (historicalData.topSchools.includes(schoolKey)) {
        strengthModifier = 1.1; // 10% boost for historically strong programs
      }
    }
    
    // Calculate weighted average OSI
    const baseOSI = totalOpponentWeight > 0 ? 
      totalOpponentScore / totalOpponentWeight : 1.0;
    
    // Apply historical strength modifier and ensure minimum value of 1.0
    return Math.max(1.0, baseOSI * strengthModifier);
  };
  
  return { calculateOpponentStrengthIndex };
};
