
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
    
    // Get the team's school and gender
    const team = teams.find(t => t.id === teamId);
    const school = team ? schools.find(s => s.id === team.schoolId) : null;
    
    // Apply a strength modifier for historically strong schools with increased values
    let strengthModifier = 1.0;
    
    if (school && team) {
      const schoolKey = school.name.toLowerCase().replace(/\s+/g, '-');
      const gender = team.gender;
      
      // Enhanced modifiers for historically dominant programs
      if (gender === 'Girls') {
        if (school.name === 'Jesuit') {
          strengthModifier = 1.25; // Increased from 1.1 for Jesuit Girls
        } else if (
          historicalData.topSchools.includes(schoolKey) ||
          school.name === 'Oregon Episcopal' || 
          school.name === 'Catlin Gabel' || 
          school.name === 'Marist Catholic' || 
          school.name === "St. Mary's (Medford)"
        ) {
          strengthModifier = 1.15; // Increased from 1.1 for other top programs
        }
      } else {
        // Boys programs
        if (school.name === 'Jesuit' || school.name === 'Lincoln') {
          strengthModifier = 1.2; // Dominant boys programs
        } else if (historicalData.topSchools.includes(schoolKey)) {
          strengthModifier = 1.1; // Other top boys programs
        }
      }
      
      // Additional classification adjustment - higher classifications deserve a boost
      if (school.classification === '6A') {
        strengthModifier *= 1.05; // 5% bonus for 6A schools
      } else if (school.classification === '5A') {
        strengthModifier *= 1.03; // 3% bonus for 5A schools
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
