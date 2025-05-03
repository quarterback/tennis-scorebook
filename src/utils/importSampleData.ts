
import { Match, Team, School, District } from "@/types";
import { toast } from "@/hooks/use-toast";

// Generate a sample match between two teams
function generateSampleMatch(
  homeTeam: Team,
  awayTeam: Team,
  date: string,
  isLeague: boolean
): Match {
  // Randomly determine winner
  const homeWins = Math.floor(Math.random() * 4) + 1; // 1-4 wins for home
  const awayWins = 5 - homeWins; // Total should be 5
  
  // Generate flight results based on randomly determined winner
  const flights = [];
  
  // Singles flights
  for (let i = 1; i <= 3; i++) {
    // Distribute wins, ensuring they sum to the predetermined total
    const homeWon = (i <= homeWins);
    
    flights.push({
      id: crypto.randomUUID(),
      type: 'singles' as const,
      position: i,
      level: 'varsity' as const,
      homePlayers: [],
      awayPlayers: [],
      homePlayerWon: homeWon,
      sets: [
        {
          homeScore: homeWon ? 6 : 2,
          awayScore: homeWon ? 2 : 6
        }
      ]
    });
  }
  
  // Doubles flights
  for (let i = 1; i <= 2; i++) {
    const remainingHomeWins = homeWins - flights.filter(f => f.homePlayerWon === true).length;
    const homeWon = remainingHomeWins > 0;
    
    flights.push({
      id: crypto.randomUUID(),
      type: 'doubles' as const,
      position: i,
      level: 'varsity' as const,
      homePlayers: [],
      awayPlayers: [],
      homePlayerWon: homeWon,
      sets: [
        {
          homeScore: homeWon ? 6 : 3,
          awayScore: homeWon ? 3 : 6
        }
      ]
    });
  }
  
  return {
    id: crypto.randomUUID(),
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    date,
    isComplete: true,
    isLeagueMatch: isLeague,
    homeTeamWon: (homeWins > awayWins),
    isTie: (homeWins === awayWins),
    homeTeamScore: homeWins,
    awayTeamScore: awayWins,
    homeCoachApproved: true,
    awayCoachApproved: true,
    flights
  };
}

// Generate a series of matches between teams
export function generateSampleMatches(
  teams: Team[],
  schools: School[],
  startDate: Date = new Date(2025, 2, 1), // March 1, 2025
  endDate: Date = new Date(2025, 4, 15),  // May 15, 2025
  matchCount: number = 50
): Match[] {
  const sampleMatches: Match[] = [];
  
  // Group teams by classification and gender
  const groupedTeams: Record<string, Team[]> = {};
  
  teams.forEach(team => {
    const school = schools.find(s => s.id === team.schoolId);
    if (!school) return;
    
    const key = `${school.classification}-${team.gender}`;
    if (!groupedTeams[key]) {
      groupedTeams[key] = [];
    }
    groupedTeams[key].push(team);
  });
  
  // Generate matches for each group
  Object.entries(groupedTeams).forEach(([groupKey, groupTeams]) => {
    if (groupTeams.length < 2) return; // Need at least 2 teams to make matches
    
    // Generate matches within the group
    const matchesForGroup = Math.floor(matchCount / Object.keys(groupedTeams).length);
    
    for (let i = 0; i < matchesForGroup; i++) {
      // Select two random teams
      const homeTeamIndex = Math.floor(Math.random() * groupTeams.length);
      let awayTeamIndex;
      do {
        awayTeamIndex = Math.floor(Math.random() * groupTeams.length);
      } while (awayTeamIndex === homeTeamIndex); // Ensure different teams
      
      const homeTeam = groupTeams[homeTeamIndex];
      const awayTeam = groupTeams[awayTeamIndex];
      
      // Generate a random date between start and end dates
      const randomDays = Math.floor(
        Math.random() * ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      const matchDate = new Date(startDate.getTime());
      matchDate.setDate(matchDate.getDate() + randomDays);
      
      // 70% chance of being a league match
      const isLeagueMatch = Math.random() < 0.7;
      
      // Create the match
      const match = generateSampleMatch(
        homeTeam,
        awayTeam,
        matchDate.toISOString().split('T')[0],
        isLeagueMatch
      );
      
      sampleMatches.push(match);
    }
  });
  
  return sampleMatches;
}

// Import sample matches
export function importSampleMatches(
  teams: Team[],
  schools: School[],
  setMatches: (matches: Match[]) => void,
  existingMatches: Match[] = []
) {
  try {
    // Generate 100 sample matches
    const sampleMatches = generateSampleMatches(teams, schools, undefined, undefined, 100);
    
    // Combine with existing matches
    setMatches([...existingMatches, ...sampleMatches]);
    
    toast({
      title: "Sample Data Imported",
      description: `Successfully imported ${sampleMatches.length} sample matches.`
    });
    
    return sampleMatches;
  } catch (error) {
    console.error("Error importing sample data:", error);
    toast({
      title: "Import Failed",
      description: "Failed to import sample data. See console for details.",
      variant: "destructive"
    });
    return [];
  }
}
