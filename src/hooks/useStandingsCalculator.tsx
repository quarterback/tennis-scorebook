import { Team, School, Match, District, Gender, Classification, TeamStanding } from '@/types';

export const useStandingsCalculator = (
  teams: Team[], 
  schools: School[], 
  matches: Match[],
  districts: District[]
) => {
  
  const getStandings = (gender: Gender, classification: Classification, districtId?: string): TeamStanding[] => {
    // Filter teams by gender and classification
    const relevantTeams = teams.filter(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return false;
      
      // For 4A/3A/2A/1A, we need special handling
      if (classification === '4A/3A/2A/1A') {
        // If districtId is provided, filter by that specific district
        if (districtId) {
          return team.gender === gender && school.districtId === districtId;
        } 
        // Otherwise, include ALL teams that are in 4A/3A/2A/1A classification
        else {
          return team.gender === gender && 
                 ['4A', '3A', '2A', '1A'].includes(school.classification);
        }
      }
      
      // For other classifications, use exact match
      return team.gender === gender && 
             school.classification === classification && 
             (!districtId || school.districtId === districtId);
    });
    
    const standings: TeamStanding[] = relevantTeams.map(team => {
      const school = schools.find(s => s.id === team.schoolId)!;
      const district = districts.find(d => d.id === school.districtId)!;
      
      // All matches for this team (league and non-league)
      const teamMatches = matches.filter(
        m => (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.isComplete
      );
      
      // Count wins, losses, and ties
      const wins = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === true) || 
        (m.awayTeamId === team.id && m.homeTeamWon === false)
      ).length;
      
      const ties = teamMatches.filter(m => 
        m.isTie === true || (m.homeTeamWon === undefined && m.isComplete)
      ).length;
      
      const losses = teamMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === false) || 
        (m.awayTeamId === team.id && m.homeTeamWon === true)
      ).length;
      
      // League matches (only matches within the same district/league)
      const leagueMatches = teamMatches.filter(m => {
        if (!m.isLeagueMatch) return false;
        
        // Check if both teams are from the same district/league
        const otherTeamId = m.homeTeamId === team.id ? m.awayTeamId : m.homeTeamId;
        const otherTeam = teams.find(t => t.id === otherTeamId);
        if (!otherTeam) return false;
        
        const otherSchool = schools.find(s => s.id === otherTeam.schoolId);
        if (!otherSchool) return false;
        
        return otherSchool.districtId === school.districtId;
      });
      
      const leagueWins = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === true) || 
        (m.awayTeamId === team.id && m.homeTeamWon === false)
      ).length;
      
      const leagueTies = leagueMatches.filter(m => 
        m.isTie === true || (m.homeTeamWon === undefined && m.isComplete)
      ).length;
      
      const leagueLosses = leagueMatches.filter(m => 
        (m.homeTeamId === team.id && m.homeTeamWon === false) || 
        (m.awayTeamId === team.id && m.homeTeamWon === true)
      ).length;
      
      // Calculate winning percentages with ties counting as half-wins
      const winPercentage = (wins + (ties * 0.5)) / 
                           Math.max(1, wins + losses + ties);
      
      const leagueWinPercentage = (leagueWins + (leagueTies * 0.5)) / 
                          Math.max(1, leagueWins + leagueLosses + leagueTies);
      
      return {
        teamId: team.id,
        teamName: `${school.name} ${team.gender}`,
        schoolName: school.name,
        gender: team.gender,
        classification: school.classification,
        districtName: district?.name || 'Unknown District',
        wins,
        losses,
        ties,
        leagueWins,
        leagueLosses,
        leagueTies,
        winPercentage,
        leagueWinPercentage,
        leagueStanding: 0,
        // For backward compatibility with existing code
        overallWins: wins,
        overallLosses: losses,
        overallTies: ties,
        overallWinPct: winPercentage,
        leagueWinPct: leagueWinPercentage,
        matchesPlayed: wins + losses + ties
      };
    });
    
    // Sort by league record first (wins percentage), then overall record
    const sortedStandings = standings.sort((a, b) => {
      // First tiebreaker: League win percentage
      if (a.leagueWinPercentage !== b.leagueWinPercentage) {
        return b.leagueWinPercentage! - a.leagueWinPercentage!;
      }
      
      // Second tiebreaker: Head-to-head results (would require additional lookup)
      
      // Third tiebreaker: Overall win percentage
      if (a.winPercentage !== b.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      
      // Fourth tiebreaker: League wins
      if (a.leagueWins !== b.leagueWins) {
        return b.leagueWins! - a.leagueWins!;
      }
      
      // Fifth tiebreaker: Overall wins
      if (a.wins !== b.wins) {
        return b.wins - a.wins;
      }
      
      // If still tied, sort alphabetically by school name
      return a.schoolName.localeCompare(b.schoolName);
    });
    
    // Now add the leagueStanding property based on sorted order
    sortedStandings.forEach((team, index) => {
      team.leagueStanding = index + 1;
    });
    
    return sortedStandings;
  };

  // Get qualifying teams for tournaments based on standings
  const getQualifyingTeams = (gender: Gender, classification: Classification, districtId: string, limit: number = 4) => {
    const standings = getStandings(gender, classification, districtId);
    return standings.slice(0, limit);
  };

  // Get top teams for state tournament bracket based on classification
  const getStateQualifiers = (gender: Gender, classification: Classification): TeamStanding[] => {
    // Get all teams for the classification regardless of district
    const allTeams = getStandings(gender, classification);
    
    let qualifierLimit = 8; // Default
    
    // Set different limits based on classification
    if (classification === '6A') {
      qualifierLimit = 16;
    } else if (classification === '5A') {
      qualifierLimit = 12;
    } else if (classification === '4A/3A/2A/1A') {
      qualifierLimit = 8;
    }
    
    // First determine automatic qualifiers from each district
    const districtQualifiers: TeamStanding[] = [];
    const teamsByDistrict: Record<string, TeamStanding[]> = {};
    
    // Group teams by district
    allTeams.forEach(team => {
      if (!teamsByDistrict[team.districtName!]) {
        teamsByDistrict[team.districtName!] = [];
      }
      teamsByDistrict[team.districtName!].push(team);
    });
    
    // Get top team from each district as automatic qualifier
    Object.values(teamsByDistrict).forEach(districtTeams => {
      if (districtTeams.length > 0) {
        districtQualifiers.push(districtTeams[0]);
      }
    });
    
    // Get at-large bids from remaining teams
    const atLargeCandidates = allTeams.filter(team => 
      !districtQualifiers.some(qualifier => qualifier.teamId === team.teamId)
    );
    
    // Sort by overall record
    const sortedAtLarge = [...atLargeCandidates].sort((a, b) => {
      if (a.winPercentage !== b.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      return b.wins - a.wins;
    });
    
    // Combine automatic qualifiers with at-large bids up to the limit
    const atLargeCount = qualifierLimit - districtQualifiers.length;
    const atLargeBids = sortedAtLarge.slice(0, Math.max(0, atLargeCount));
    
    const allQualifiers = [...districtQualifiers, ...atLargeBids];
    
    // Final sort by overall record for seeding
    return allQualifiers.sort((a, b) => {
      if (a.winPercentage !== b.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      return b.wins - a.wins;
    }).slice(0, qualifierLimit);
  };

  // Get playoff projections based on current standings
  const getPlayoffProjections = (gender: Gender, classification: Classification): {
    automaticQualifiers: TeamStanding[];
    atLargeBids: TeamStanding[];
    firstFourOut: TeamStanding[];
  } => {
    // Get all teams in classification
    const allTeams = getStandings(gender, classification);
    
    // Group by district and get automatic qualifiers
    const teamsByDistrict: Record<string, TeamStanding[]> = {};
    allTeams.forEach(team => {
      if (!teamsByDistrict[team.districtName!]) {
        teamsByDistrict[team.districtName!] = [];
      }
      teamsByDistrict[team.districtName!].push(team);
    });
    
    const automaticQualifiers: TeamStanding[] = [];
    
    // Get top team from each district
    Object.values(teamsByDistrict).forEach(districtTeams => {
      if (districtTeams.length > 0) {
        automaticQualifiers.push(districtTeams[0]);
      }
    });
    
    // Set at-large bid count based on classification
    let atLargeBidCount = 0;
    let totalSpots = 0;
    
    if (classification === '6A') {
      totalSpots = 16;
      atLargeBidCount = totalSpots - automaticQualifiers.length;
    } else if (classification === '5A') {
      totalSpots = 12;
      atLargeBidCount = totalSpots - automaticQualifiers.length;
    } else {
      totalSpots = 8;
      atLargeBidCount = totalSpots - automaticQualifiers.length;
    }
    
    // Get remaining teams for at-large consideration
    const atLargeCandidates = allTeams.filter(team => 
      !automaticQualifiers.some(qualifier => qualifier.teamId === team.teamId)
    );
    
    // Sort by criteria
    const sortedAtLarge = [...atLargeCandidates].sort((a, b) => {
      // First by league win percentage
      if (a.leagueWinPercentage !== b.leagueWinPercentage) {
        return b.leagueWinPercentage! - a.leagueWinPercentage!;
      }
      
      // Then by overall win percentage
      if (a.winPercentage !== b.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      
      // Then by total wins
      return b.wins - a.wins;
    });
    
    // Get at-large bids and first four out
    const atLargeBids = sortedAtLarge.slice(0, atLargeBidCount);
    const firstFourOut = sortedAtLarge.slice(atLargeBidCount, atLargeBidCount + 4);
    
    return {
      automaticQualifiers,
      atLargeBids,
      firstFourOut
    };
  };

  return { 
    getStandings, 
    getQualifyingTeams, 
    getStateQualifiers,
    getPlayoffProjections
  };
};
