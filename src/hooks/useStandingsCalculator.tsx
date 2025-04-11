
import { Team, School, Match, District, Gender, Classification, TeamStanding } from '@/types';

export const useStandingsCalculator = (
  teams: Team[], 
  schools: School[], 
  matches: Match[],
  districts: District[]
) => {
  
  const getStandings = (gender: Gender, classification: Classification, districtId?: string): TeamStanding[] => {
    const relevantTeams = teams.filter(team => {
      const school = schools.find(s => s.id === team.schoolId);
      return team.gender === gender 
        && school?.classification === classification
        && (!districtId || school?.districtId === districtId);
    });
    
    const standings: TeamStanding[] = relevantTeams.map(team => {
      const school = schools.find(s => s.id === team.schoolId)!;
      const district = districts.find(d => d.id === school.districtId)!;
      
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      const overallWins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const overallLosses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      const leagueMatches = teamMatches.filter(m => m.isLeagueMatch);
      
      const leagueWins = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon) || (m.awayTeamId === team.id && !m.homeTeamWon)
      ).length;
      
      const leagueLosses = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && !m.homeTeamWon) || (m.awayTeamId === team.id && m.homeTeamWon)
      ).length;
      
      return {
        teamId: team.id,
        teamName: `${school.name} ${team.gender}`,
        schoolName: school.name,
        gender: team.gender,
        classification: school.classification,
        districtName: district?.name || 'Unknown District',
        overallWins,
        overallLosses,
        leagueWins,
        leagueLosses
      };
    });
    
    // Sort by league record first (wins), then overall record
    return standings.sort((a, b) => {
      if (a.leagueWins !== b.leagueWins) {
        return b.leagueWins - a.leagueWins;
      }
      if (a.leagueLosses !== b.leagueLosses) {
        return a.leagueLosses - b.leagueLosses;
      }
      if (a.overallWins !== b.overallWins) {
        return b.overallWins - a.overallWins;
      }
      return a.overallLosses - b.overallLosses;
    });
  };

  return { getStandings };
};
