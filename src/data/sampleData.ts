
import { School, Team, Player, Match, Flight, Set, District } from '@/types';

export const sampleDistricts: District[] = [
  {
    id: 'metro',
    name: 'Metro League',
    classification: '6A'
  },
  {
    id: 'pil',
    name: 'Portland Interscholastic League',
    classification: '6A'
  },
  {
    id: 'pacific',
    name: 'Pacific Conference',
    classification: '6A'
  },
  {
    id: 'three-rivers',
    name: 'Three Rivers League',
    classification: '6A'
  },
  {
    id: 'mt-hood',
    name: 'Mt. Hood Conference',
    classification: '6A'
  },
  {
    id: 'northwest-oregon',
    name: 'Northwest Oregon Conference',
    classification: '5A'
  },
  {
    id: 'midwestern',
    name: 'Midwestern League',
    classification: '5A'
  },
  {
    id: 'mid-willamette',
    name: 'Mid-Willamette Conference',
    classification: '5A'
  },
  {
    id: 'sd1',
    name: 'Special District 1',
    classification: '4A/3A/2A/1A'
  }
];

export const sampleSchools: School[] = [
  // 6A Schools - Metro League
  {
    id: 'jesuit',
    name: 'Jesuit',
    classification: '6A',
    districtId: 'metro',
    teams: []
  },
  {
    id: 'sunset',
    name: 'Sunset',
    classification: '6A',
    districtId: 'metro',
    teams: []
  },
  {
    id: 'beaverton',
    name: 'Beaverton',
    classification: '6A',
    districtId: 'metro',
    teams: []
  },
  
  // 6A Schools - PIL
  {
    id: 'lincoln',
    name: 'Lincoln',
    classification: '6A',
    districtId: 'pil',
    teams: []
  },
  {
    id: 'grant',
    name: 'Grant',
    classification: '6A',
    districtId: 'pil',
    teams: []
  },
  
  // 6A Schools - Three Rivers
  {
    id: 'lake-oswego',
    name: 'Lake Oswego',
    classification: '6A',
    districtId: 'three-rivers',
    teams: []
  },
  {
    id: 'lakeridge',
    name: 'Lakeridge',
    classification: '6A',
    districtId: 'three-rivers',
    teams: []
  },
  
  // 5A Schools
  {
    id: 'crescent-valley',
    name: 'Crescent Valley',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'south-eugene',
    name: 'South Eugene',
    classification: '5A',
    districtId: 'midwestern',
    teams: []
  },
  
  // 4A/3A/2A/1A Schools
  {
    id: 'catlin-gabel',
    name: 'Catlin Gabel',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  {
    id: 'oregon-episcopal',
    name: 'Oregon Episcopal',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  }
];

export const sampleTeams: Team[] = [
  // Metro League Teams
  {
    id: 'jesuit-boys',
    schoolId: 'jesuit',
    gender: 'Boys',
    players: [],
    coaches: ['coach1']
  },
  {
    id: 'jesuit-girls',
    schoolId: 'jesuit',
    gender: 'Girls',
    players: [],
    coaches: ['coach1']
  },
  {
    id: 'sunset-boys',
    schoolId: 'sunset',
    gender: 'Boys',
    players: [],
    coaches: ['coach2']
  },
  {
    id: 'sunset-girls',
    schoolId: 'sunset',
    gender: 'Girls',
    players: [],
    coaches: ['coach2']
  },
  {
    id: 'beaverton-boys',
    schoolId: 'beaverton',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  
  // PIL Teams
  {
    id: 'lincoln-boys',
    schoolId: 'lincoln',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'lincoln-girls',
    schoolId: 'lincoln',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  {
    id: 'grant-boys',
    schoolId: 'grant',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  
  // Three Rivers Teams
  {
    id: 'lake-oswego-boys',
    schoolId: 'lake-oswego',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'lakeridge-girls',
    schoolId: 'lakeridge',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  
  // 5A Teams
  {
    id: 'crescent-valley-boys',
    schoolId: 'crescent-valley',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'south-eugene-girls',
    schoolId: 'south-eugene',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  
  // 4A/3A/2A/1A Teams
  {
    id: 'catlin-gabel-boys',
    schoolId: 'catlin-gabel',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'oregon-episcopal-girls',
    schoolId: 'oregon-episcopal',
    gender: 'Girls',
    players: [],
    coaches: []
  }
];

export const samplePlayers: Player[] = [
  // Jesuit Boys
  {
    id: 'jb-player1',
    name: 'Nathan Chen',
    grade: 12,
    teamId: 'jesuit-boys'
  },
  {
    id: 'jb-player2',
    name: 'Michael Wu',
    grade: 11,
    teamId: 'jesuit-boys'
  },
  {
    id: 'jb-player3',
    name: 'David Park',
    grade: 12,
    teamId: 'jesuit-boys'
  },
  {
    id: 'jb-player4',
    name: 'James Smith',
    grade: 10,
    teamId: 'jesuit-boys'
  },
  
  // Jesuit Girls
  {
    id: 'jg-player1',
    name: 'Emma Wilson',
    grade: 12,
    teamId: 'jesuit-girls'
  },
  {
    id: 'jg-player2',
    name: 'Sophia Martinez',
    grade: 11,
    teamId: 'jesuit-girls'
  },
  
  // Sunset Boys
  {
    id: 'sb-player1',
    name: 'Ryan Thompson',
    grade: 12,
    teamId: 'sunset-boys'
  },
  {
    id: 'sb-player2',
    name: 'Andrew Lee',
    grade: 11,
    teamId: 'sunset-boys'
  },
  
  // Lincoln Boys
  {
    id: 'lb-player1',
    name: 'Dylan Carter',
    grade: 12,
    teamId: 'lincoln-boys'
  },
  {
    id: 'lb-player2',
    name: 'Noah Johnson',
    grade: 11,
    teamId: 'lincoln-boys'
  },
  
  // Lake Oswego Boys
  {
    id: 'lob-player1',
    name: 'Ethan Morgan',
    grade: 12,
    teamId: 'lake-oswego-boys'
  },
  {
    id: 'lob-player2',
    name: 'Mason Davis',
    grade: 11,
    teamId: 'lake-oswego-boys'
  },
  
  // Crescent Valley Boys
  {
    id: 'cvb-player1',
    name: 'Tyler Roberts',
    grade: 12,
    teamId: 'crescent-valley-boys'
  },
  {
    id: 'cvb-player2',
    name: 'Jackson Brown',
    grade: 11,
    teamId: 'crescent-valley-boys'
  },
  
  // Catlin Gabel Boys
  {
    id: 'cgb-player1',
    name: 'Caleb Wright',
    grade: 12,
    teamId: 'catlin-gabel-boys'
  },
  {
    id: 'cgb-player2',
    name: 'Leo Zhang',
    grade: 11,
    teamId: 'catlin-gabel-boys'
  }
];

const createSet = (homeScore: number, awayScore: number, hasTiebreak = false): Set => {
  const set: Set = {
    homeScore,
    awayScore
  };
  
  if (hasTiebreak) {
    set.tiebreak = {
      homeScore: Math.floor(Math.random() * 4) + 7,
      awayScore: Math.min(Math.floor(Math.random() * 6) + 1, 6)
    };
  }
  
  return set;
};

// Helper function to create a flight
const createFlight = (id: string, matchId: string, type: 'singles' | 'doubles', position: number, 
                      level: 'varsity' | 'jv', homePlayers: string[], awayPlayers: string[], 
                      homeWins: boolean): Flight => {
  let sets: Set[] = [];
  if (homeWins) {
    sets = type === 'singles' && position === 1 ? 
      [createSet(6, 2), createSet(6, 3)] : 
      [createSet(6, 4), createSet(7, 5, true)];
  } else {
    sets = type === 'singles' && position === 1 ? 
      [createSet(3, 6), createSet(2, 6)] : 
      [createSet(6, 7, true), createSet(4, 6)];
  }
  
  return {
    id,
    matchId,
    type,
    position,
    level,
    homePlayers,
    awayPlayers,
    sets,
    homePlayerWon: homeWins
  };
};

// Create a complete match with all flights
const createFullMatch = (id: string, date: string, homeTeamId: string, awayTeamId: string, 
                          isLeague: boolean, homeTeamWins: boolean, homePlayerIds: string[], 
                          awayPlayerIds: string[]): Match => {
  // Determine flight outcomes based on overall match result
  const flightResults = homeTeamWins ? 
    [true, true, true, false, true, true, false, true] : // 6-2 home win
    [false, false, true, false, false, true, false, false]; // 2-6 away win
  
  // Create all flights for the match
  const flights: Flight[] = [];
  
  // Singles flights
  for (let i = 0; i < 4; i++) {
    flights.push(createFlight(
      `${id}-s${i+1}`,
      id,
      'singles',
      i + 1,
      'varsity',
      [homePlayerIds[i % homePlayerIds.length]],
      [awayPlayerIds[i % awayPlayerIds.length]],
      flightResults[i]
    ));
  }
  
  // Doubles flights
  for (let i = 0; i < 4; i++) {
    const homePair = [
      homePlayerIds[(i*2) % homePlayerIds.length],
      homePlayerIds[(i*2+1) % homePlayerIds.length]
    ];
    const awayPair = [
      awayPlayerIds[(i*2) % awayPlayerIds.length],
      awayPlayerIds[(i*2+1) % awayPlayerIds.length]
    ];
    
    flights.push(createFlight(
      `${id}-d${i+1}`,
      id,
      'doubles',
      i + 1,
      'varsity',
      homePair,
      awayPair,
      flightResults[i+4]
    ));
  }
  
  // Calculate team scores
  const homeTeamScore = flightResults.filter(result => result).length;
  const awayTeamScore = flightResults.filter(result => !result).length;
  
  return {
    id,
    date,
    homeTeamId,
    awayTeamId,
    isLeagueMatch: isLeague,
    isComplete: true,
    homeTeamWon: homeTeamWins,
    flights,
    homeTeamScore,
    awayTeamScore
  };
};

// Generate dates between March 1 and May 1, 2025
const generateMatchDate = (index: number) => {
  const start = new Date(2025, 2, 1); // March 1, 2025
  const end = new Date(2025, 4, 1);   // May 1, 2025
  const dayRange = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  
  // Distribute dates evenly across the season, but add some randomness
  const dayOffset = Math.floor((dayRange * (index / 40)) + (Math.random() * 5));
  const matchDate = new Date(start);
  matchDate.setDate(matchDate.getDate() + dayOffset);
  
  // Format as YYYY-MM-DD
  return matchDate.toISOString().split('T')[0];
};

// Generate a full season of matches
export const sampleMatches: Match[] = [
  // Metro League Matches
  createFullMatch('match1', generateMatchDate(0), 'jesuit-boys', 'sunset-boys', true, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4'], 
    ['sb-player1', 'sb-player2']),
  
  createFullMatch('match2', generateMatchDate(1), 'sunset-boys', 'beaverton-boys', true, true, 
    ['sb-player1', 'sb-player2'], 
    ['jb-player1', 'jb-player2']), // Using jesuit players as placeholders
  
  createFullMatch('match3', generateMatchDate(2), 'beaverton-boys', 'jesuit-boys', true, false, 
    ['jb-player3', 'jb-player4'], 
    ['jb-player1', 'jb-player2']),
  
  // PIL Matches
  createFullMatch('match4', generateMatchDate(3), 'lincoln-boys', 'grant-boys', true, true, 
    ['lb-player1', 'lb-player2'], 
    ['jb-player1', 'jb-player2']), // Using jesuit players as placeholders
  
  // Three Rivers League Matches
  createFullMatch('match5', generateMatchDate(4), 'lake-oswego-boys', 'lakeridge-girls', false, true, 
    ['lob-player1', 'lob-player2'], 
    ['jg-player1', 'jg-player2']),
  
  // Cross-League Matches
  createFullMatch('match6', generateMatchDate(5), 'jesuit-boys', 'lincoln-boys', false, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4'], 
    ['lb-player1', 'lb-player2']),
  
  createFullMatch('match7', generateMatchDate(6), 'sunset-boys', 'lake-oswego-boys', false, false, 
    ['sb-player1', 'sb-player2'], 
    ['lob-player1', 'lob-player2']),
  
  // 5A Matches
  createFullMatch('match8', generateMatchDate(7), 'crescent-valley-boys', 'south-eugene-girls', false, true, 
    ['cvb-player1', 'cvb-player2'], 
    ['jg-player1', 'jg-player2']), // Using jesuit girls as placeholders
  
  // 4A/3A/2A/1A Matches
  createFullMatch('match9', generateMatchDate(8), 'catlin-gabel-boys', 'oregon-episcopal-girls', true, true, 
    ['cgb-player1', 'cgb-player2'], 
    ['jg-player1', 'jg-player2']), // Using jesuit girls as placeholders
  
  // Additional matches for testing minimum match requirements
  createFullMatch('match10', generateMatchDate(9), 'jesuit-boys', 'lake-oswego-boys', false, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4'], 
    ['lob-player1', 'lob-player2']),
  
  createFullMatch('match11', generateMatchDate(10), 'sunset-boys', 'lincoln-boys', false, true, 
    ['sb-player1', 'sb-player2'], 
    ['lb-player1', 'lb-player2']),
  
  // Additional Metro League matches
  createFullMatch('match12', generateMatchDate(11), 'sunset-boys', 'jesuit-boys', true, false, 
    ['sb-player1', 'sb-player2'], 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4']),
  
  createFullMatch('match13', generateMatchDate(12), 'beaverton-boys', 'sunset-boys', true, false, 
    ['jb-player3', 'jb-player4'], // Using jesuit players as placeholders 
    ['sb-player1', 'sb-player2']),
  
  // More PIL Matches
  createFullMatch('match14', generateMatchDate(13), 'grant-boys', 'lincoln-boys', true, false, 
    ['jb-player1', 'jb-player2'], // Using jesuit players as placeholders
    ['lb-player1', 'lb-player2']),
  
  // Additional 5A matches
  createFullMatch('match15', generateMatchDate(14), 'south-eugene-girls', 'crescent-valley-boys', false, false, 
    ['jg-player1', 'jg-player2'], // Using jesuit girls as placeholders
    ['cvb-player1', 'cvb-player2']),
  
  // Generate 30 more matches with varied outcomes to create a full season
  ...Array.from({ length: 30 }, (_, i) => {
    // Randomly select teams
    const teamIndices = [
      Math.floor(Math.random() * sampleTeams.length),
      Math.floor(Math.random() * sampleTeams.length)
    ];
    
    // Ensure teams are different
    while (teamIndices[0] === teamIndices[1]) {
      teamIndices[1] = Math.floor(Math.random() * sampleTeams.length);
    }
    
    const homeTeam = sampleTeams[teamIndices[0]];
    const awayTeam = sampleTeams[teamIndices[1]];
    
    // Get player IDs
    const homePlayerIds = samplePlayers
      .filter(p => p.teamId === homeTeam.id)
      .map(p => p.id);
    
    const awayPlayerIds = samplePlayers
      .filter(p => p.teamId === awayTeam.id)
      .map(p => p.id);
    
    // If no players found, use placeholders
    const homePlayers = homePlayerIds.length > 0 ? 
      homePlayerIds : ['jb-player1', 'jb-player2'];
    
    const awayPlayers = awayPlayerIds.length > 0 ? 
      awayPlayerIds : ['lb-player1', 'lb-player2'];
    
    // Determine if teams are in same league
    const homeSchool = sampleSchools.find(s => s.id === homeTeam.schoolId);
    const awaySchool = sampleSchools.find(s => s.id === awayTeam.schoolId);
    const isLeague = homeSchool?.districtId === awaySchool?.districtId;
    
    // Generate match
    return createFullMatch(
      `match${16 + i}`,
      generateMatchDate(15 + i),
      homeTeam.id,
      awayTeam.id,
      isLeague,
      Math.random() > 0.5, // Random winner
      homePlayers,
      awayPlayers
    );
  })
];
