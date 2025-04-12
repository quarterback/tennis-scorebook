
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
    id: 'central-valley',
    name: 'Central Valley Conference',
    classification: '6A'
  },
  {
    id: 'southwest',
    name: 'Southwest Conference',
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
    id: 'intermountain',
    name: 'Intermountain Conference',
    classification: '5A'
  },
  {
    id: 'sd1',
    name: 'Special District 1',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd2',
    name: 'Special District 2',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd3',
    name: 'Special District 3',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd4',
    name: 'Special District 4',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd5',
    name: 'Special District 5',
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
  {
    id: 'westview',
    name: 'Westview',
    classification: '6A',
    districtId: 'metro',
    teams: []
  },
  {
    id: 'mountainside',
    name: 'Mountainside',
    classification: '6A',
    districtId: 'metro',
    teams: []
  },
  {
    id: 'aloha',
    name: 'Aloha',
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
  {
    id: 'franklin',
    name: 'Franklin',
    classification: '6A',
    districtId: 'pil',
    teams: []
  },
  {
    id: 'cleveland',
    name: 'Cleveland',
    classification: '6A',
    districtId: 'pil',
    teams: []
  },
  {
    id: 'roosevelt',
    name: 'Roosevelt',
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
  {
    id: 'west-linn',
    name: 'West Linn',
    classification: '6A',
    districtId: 'three-rivers',
    teams: []
  },
  {
    id: 'tigard',
    name: 'Tigard',
    classification: '6A',
    districtId: 'three-rivers',
    teams: []
  },
  {
    id: 'tualatin',
    name: 'Tualatin',
    classification: '6A',
    districtId: 'three-rivers',
    teams: []
  },
  
  // 6A Schools - Pacific
  {
    id: 'century',
    name: 'Century',
    classification: '6A',
    districtId: 'pacific',
    teams: []
  },
  {
    id: 'glencoe',
    name: 'Glencoe',
    classification: '6A',
    districtId: 'pacific',
    teams: []
  },
  {
    id: 'liberty',
    name: 'Liberty',
    classification: '6A',
    districtId: 'pacific',
    teams: []
  },
  {
    id: 'mcminnville',
    name: 'McMinnville',
    classification: '6A',
    districtId: 'pacific',
    teams: []
  },
  {
    id: 'sherwood',
    name: 'Sherwood',
    classification: '6A',
    districtId: 'pacific',
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
  {
    id: 'summit',
    name: 'Summit',
    classification: '5A',
    districtId: 'intermountain',
    teams: []
  },
  {
    id: 'wilsonville',
    name: 'Wilsonville',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'corvallis',
    name: 'Corvallis',
    classification: '5A',
    districtId: 'mid-willamette',
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
  },
  {
    id: 'valley-catholic',
    name: 'Valley Catholic',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  {
    id: 'north-bend',
    name: 'North Bend',
    classification: '4A/3A/2A/1A',
    districtId: 'sd2',
    teams: []
  },
  {
    id: 'marist',
    name: 'Marist Catholic',
    classification: '4A/3A/2A/1A',
    districtId: 'sd3',
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
  {
    id: 'beaverton-girls',
    schoolId: 'beaverton',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  {
    id: 'westview-boys',
    schoolId: 'westview',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'westview-girls',
    schoolId: 'westview',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  {
    id: 'mountainside-boys',
    schoolId: 'mountainside',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'aloha-boys',
    schoolId: 'aloha',
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
  {
    id: 'grant-girls',
    schoolId: 'grant',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  {
    id: 'franklin-boys',
    schoolId: 'franklin',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'cleveland-girls',
    schoolId: 'cleveland',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  {
    id: 'roosevelt-boys',
    schoolId: 'roosevelt',
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
    id: 'lake-oswego-girls',
    schoolId: 'lake-oswego',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  {
    id: 'lakeridge-boys',
    schoolId: 'lakeridge',
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
  {
    id: 'west-linn-boys',
    schoolId: 'west-linn',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'tigard-boys',
    schoolId: 'tigard',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'tualatin-girls',
    schoolId: 'tualatin',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  
  // Pacific Teams
  {
    id: 'century-boys',
    schoolId: 'century',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'liberty-boys',
    schoolId: 'liberty',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'sherwood-girls',
    schoolId: 'sherwood',
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
    id: 'summit-boys',
    schoolId: 'summit',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'wilsonville-girls',
    schoolId: 'wilsonville',
    gender: 'Girls',
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
  {
    id: 'corvallis-boys',
    schoolId: 'corvallis',
    gender: 'Boys',
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
  },
  {
    id: 'valley-catholic-boys',
    schoolId: 'valley-catholic',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'north-bend-boys',
    schoolId: 'north-bend',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: 'marist-girls',
    schoolId: 'marist',
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
  {
    id: 'jb-player5',
    name: 'Thomas Rodriguez',
    grade: 11,
    teamId: 'jesuit-boys'
  },
  {
    id: 'jb-player6',
    name: 'Alex Kim',
    grade: 12,
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
  {
    id: 'jg-player3',
    name: 'Olivia Johnson',
    grade: 12,
    teamId: 'jesuit-girls'
  },
  {
    id: 'jg-player4',
    name: 'Isabella Taylor',
    grade: 10,
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
  {
    id: 'sb-player3',
    name: 'Jack Anderson',
    grade: 12,
    teamId: 'sunset-boys'
  },
  {
    id: 'sb-player4',
    name: 'Brandon Williams',
    grade: 11,
    teamId: 'sunset-boys'
  },
  
  // Sunset Girls
  {
    id: 'sg-player1',
    name: 'Sarah Miller',
    grade: 12,
    teamId: 'sunset-girls'
  },
  {
    id: 'sg-player2',
    name: 'Rachel White',
    grade: 11,
    teamId: 'sunset-girls'
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
  {
    id: 'lb-player3',
    name: 'Ethan Phillips',
    grade: 12,
    teamId: 'lincoln-boys'
  },
  {
    id: 'lb-player4',
    name: 'Joshua Baker',
    grade: 10,
    teamId: 'lincoln-boys'
  },
  
  // Lincoln Girls
  {
    id: 'lg-player1',
    name: 'Ava Thomas',
    grade: 12,
    teamId: 'lincoln-girls'
  },
  {
    id: 'lg-player2',
    name: 'Madison Chen',
    grade: 11,
    teamId: 'lincoln-girls'
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
  {
    id: 'lob-player3',
    name: 'Logan Evans',
    grade: 10,
    teamId: 'lake-oswego-boys'
  },
  {
    id: 'lob-player4',
    name: 'William Turner',
    grade: 12,
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
  
  // South Eugene Girls
  {
    id: 'seg-player1',
    name: 'Harper Wilson',
    grade: 12,
    teamId: 'south-eugene-girls'
  },
  {
    id: 'seg-player2',
    name: 'Maya Campbell',
    grade: 11,
    teamId: 'south-eugene-girls'
  },
  
  // Summit Boys
  {
    id: 'sub-player1',
    name: 'Benjamin Hill',
    grade: 12,
    teamId: 'summit-boys'
  },
  {
    id: 'sub-player2',
    name: 'Nicholas Adams',
    grade: 11,
    teamId: 'summit-boys'
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
  },
  {
    id: 'cgb-player3',
    name: 'Matthew Green',
    grade: 10,
    teamId: 'catlin-gabel-boys'
  },
  {
    id: 'cgb-player4',
    name: 'Aiden Scott',
    grade: 12,
    teamId: 'catlin-gabel-boys'
  },
  
  // Oregon Episcopal Girls
  {
    id: 'oeg-player1',
    name: 'Charlotte Lewis',
    grade: 12,
    teamId: 'oregon-episcopal-girls'
  },
  {
    id: 'oeg-player2',
    name: 'Ella Robinson',
    grade: 11,
    teamId: 'oregon-episcopal-girls'
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

// Generate a full season of matches (more realistic match generation)
export const sampleMatches: Match[] = [
  // Metro League Matches - Jesuit Boys dominance
  createFullMatch('match1', generateMatchDate(0), 'jesuit-boys', 'sunset-boys', true, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4']),
  
  createFullMatch('match2', generateMatchDate(1), 'jesuit-boys', 'beaverton-boys', true, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['sb-player1', 'sb-player2']), // Using sunset players as placeholders
  
  createFullMatch('match3', generateMatchDate(2), 'jesuit-boys', 'westview-boys', true, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['sb-player1', 'sb-player2']),
    
  createFullMatch('match4', generateMatchDate(3), 'jesuit-boys', 'mountainside-boys', true, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['sb-player1', 'sb-player2']),
    
  createFullMatch('match5', generateMatchDate(4), 'jesuit-boys', 'aloha-boys', true, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['sb-player1', 'sb-player2']),
  
  // Sunset Boys matches
  createFullMatch('match6', generateMatchDate(5), 'sunset-boys', 'beaverton-boys', true, true, 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4'], 
    ['jb-player5', 'jb-player6']), // Using jesuit players as placeholders
  
  createFullMatch('match7', generateMatchDate(6), 'sunset-boys', 'westview-boys', true, true, 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4'], 
    ['jb-player5', 'jb-player6']),
    
  createFullMatch('match8', generateMatchDate(7), 'sunset-boys', 'mountainside-boys', true, true, 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4'], 
    ['jb-player5', 'jb-player6']),
    
  createFullMatch('match9', generateMatchDate(8), 'sunset-boys', 'aloha-boys', true, true, 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4'], 
    ['jb-player5', 'jb-player6']),
  
  // PIL Matches
  createFullMatch('match10', generateMatchDate(9), 'lincoln-boys', 'grant-boys', true, true, 
    ['lb-player1', 'lb-player2', 'lb-player3', 'lb-player4'], 
    ['jb-player5', 'jb-player6']), // Using jesuit players as placeholders
    
  createFullMatch('match11', generateMatchDate(10), 'lincoln-boys', 'franklin-boys', true, true, 
    ['lb-player1', 'lb-player2', 'lb-player3', 'lb-player4'], 
    ['jb-player5', 'jb-player6']),
    
  createFullMatch('match12', generateMatchDate(11), 'lincoln-boys', 'roosevelt-boys', true, true, 
    ['lb-player1', 'lb-player2', 'lb-player3', 'lb-player4'], 
    ['jb-player5', 'jb-player6']),
    
  createFullMatch('match13', generateMatchDate(12), 'grant-boys', 'franklin-boys', true, true, 
    ['jb-player5', 'jb-player6'], 
    ['jb-player3', 'jb-player4']),
    
  createFullMatch('match14', generateMatchDate(13), 'grant-boys', 'roosevelt-boys', true, true, 
    ['jb-player5', 'jb-player6'], 
    ['jb-player3', 'jb-player4']),
  
  // Three Rivers League Matches
  createFullMatch('match15', generateMatchDate(14), 'lake-oswego-boys', 'lakeridge-boys', true, true, 
    ['lob-player1', 'lob-player2', 'lob-player3', 'lob-player4'], 
    ['jb-player5', 'jb-player6']),
    
  createFullMatch('match16', generateMatchDate(15), 'lake-oswego-boys', 'west-linn-boys', true, true, 
    ['lob-player1', 'lob-player2', 'lob-player3', 'lob-player4'], 
    ['jb-player5', 'jb-player6']),
    
  createFullMatch('match17', generateMatchDate(16), 'lake-oswego-boys', 'tigard-boys', true, true, 
    ['lob-player1', 'lob-player2', 'lob-player3', 'lob-player4'], 
    ['jb-player5', 'jb-player6']),
    
  createFullMatch('match18', generateMatchDate(17), 'lakeridge-boys', 'west-linn-boys', true, false, 
    ['jb-player5', 'jb-player6'], 
    ['jb-player3', 'jb-player4']),
    
  createFullMatch('match19', generateMatchDate(18), 'lakeridge-boys', 'tigard-boys', true, true, 
    ['jb-player5', 'jb-player6'], 
    ['jb-player3', 'jb-player4']),
  
  // Pacific Conference Matches
  createFullMatch('match20', generateMatchDate(19), 'century-boys', 'liberty-boys', true, true, 
    ['jb-player5', 'jb-player6'], 
    ['jb-player3', 'jb-player4']),
  
  // Cross-League Matches - 6A
  createFullMatch('match21', generateMatchDate(20), 'jesuit-boys', 'lincoln-boys', false, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['lb-player1', 'lb-player2', 'lb-player3', 'lb-player4']),
    
  createFullMatch('match22', generateMatchDate(21), 'sunset-boys', 'lake-oswego-boys', false, false, 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4'], 
    ['lob-player1', 'lob-player2', 'lob-player3', 'lob-player4']),
    
  createFullMatch('match23', generateMatchDate(22), 'jesuit-boys', 'lake-oswego-boys', false, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['lob-player1', 'lob-player2', 'lob-player3', 'lob-player4']),
  
  // 5A Matches
  createFullMatch('match24', generateMatchDate(23), 'crescent-valley-boys', 'summit-boys', false, true, 
    ['cvb-player1', 'cvb-player2'], 
    ['sub-player1', 'sub-player2']),
    
  createFullMatch('match25', generateMatchDate(24), 'crescent-valley-boys', 'corvallis-boys', true, true, 
    ['cvb-player1', 'cvb-player2'], 
    ['sub-player1', 'sub-player2']),
    
  createFullMatch('match26', generateMatchDate(25), 'summit-boys', 'corvallis-boys', false, true, 
    ['sub-player1', 'sub-player2'], 
    ['sub-player1', 'sub-player2']),
  
  // 4A/3A/2A/1A Matches
  createFullMatch('match27', generateMatchDate(26), 'catlin-gabel-boys', 'valley-catholic-boys', true, true, 
    ['cgb-player1', 'cgb-player2', 'cgb-player3', 'cgb-player4'], 
    ['sub-player1', 'sub-player2']),
    
  createFullMatch('match28', generateMatchDate(27), 'catlin-gabel-boys', 'north-bend-boys', false, true, 
    ['cgb-player1', 'cgb-player2', 'cgb-player3', 'cgb-player4'], 
    ['sub-player1', 'sub-player2']),
    
  createFullMatch('match29', generateMatchDate(28), 'valley-catholic-boys', 'north-bend-boys', true, false, 
    ['sub-player1', 'sub-player2'], 
    ['cgb-player3', 'cgb-player4']),
  
  // Cross-Classification Matches
  createFullMatch('match30', generateMatchDate(29), 'jesuit-boys', 'catlin-gabel-boys', false, true, 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6'], 
    ['cgb-player1', 'cgb-player2', 'cgb-player3', 'cgb-player4']),
    
  createFullMatch('match31', generateMatchDate(30), 'crescent-valley-boys', 'lake-oswego-boys', false, false, 
    ['cvb-player1', 'cvb-player2'], 
    ['lob-player1', 'lob-player2', 'lob-player3', 'lob-player4']),
  
  // Additional Metro League matches
  createFullMatch('match32', generateMatchDate(31), 'sunset-boys', 'jesuit-boys', true, false, 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4'], 
    ['jb-player1', 'jb-player2', 'jb-player3', 'jb-player4', 'jb-player5', 'jb-player6']),
  
  createFullMatch('match33', generateMatchDate(32), 'beaverton-boys', 'sunset-boys', true, false, 
    ['jb-player3', 'jb-player4'], // Using jesuit players as placeholders 
    ['sb-player1', 'sb-player2', 'sb-player3', 'sb-player4']),
  
  // Girls tennis matches 
  createFullMatch('match34', generateMatchDate(33), 'jesuit-girls', 'sunset-girls', true, true, 
    ['jg-player1', 'jg-player2', 'jg-player3', 'jg-player4'], 
    ['sg-player1', 'sg-player2']),
    
  createFullMatch('match35', generateMatchDate(34), 'lincoln-girls', 'jesuit-girls', false, false, 
    ['lg-player1', 'lg-player2'], 
    ['jg-player1', 'jg-player2', 'jg-player3', 'jg-player4']),
    
  createFullMatch('match36', generateMatchDate(35), 'south-eugene-girls', 'wilsonville-girls', false, true, 
    ['seg-player1', 'seg-player2'], 
    ['jg-player3', 'jg-player4']),
    
  createFullMatch('match37', generateMatchDate(36), 'oregon-episcopal-girls', 'marist-girls', true, true, 
    ['oeg-player1', 'oeg-player2'], 
    ['jg-player3', 'jg-player4']),
    
  createFullMatch('match38', generateMatchDate(37), 'lake-oswego-girls', 'lakeridge-girls', true, true, 
    ['jg-player1', 'jg-player2'], // Using jesuit girls as placeholders
    ['jg-player3', 'jg-player4']),
  
  createFullMatch('match39', generateMatchDate(38), 'tualatin-girls', 'sherwood-girls', true, false, 
    ['jg-player1', 'jg-player2'], 
    ['jg-player3', 'jg-player4']),
  
  createFullMatch('match40', generateMatchDate(39), 'cleveland-girls', 'grant-girls', true, true, 
    ['jg-player1', 'jg-player2'], 
    ['jg-player3', 'jg-player4']),
  
  // More matches to ensure minimum match requirements
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
      `match${41 + i}`,
      generateMatchDate(40 + i),
      homeTeam.id,
      awayTeam.id,
      isLeague,
      Math.random() > 0.5, // Random winner
      homePlayers,
      awayPlayers
    );
  })
];
