import { School, Team, Player, Match, Flight, Set, District } from '@/types';

export const sampleDistricts: District[] = [
  // 6A Districts/Leagues
  {
    id: 'pil',
    name: 'Portland Interscholastic League',
    classification: '6A'
  },
  {
    id: 'metro',
    name: 'Metro League',
    classification: '6A'
  },
  {
    id: 'pacific',
    name: 'Pacific Conference',
    classification: '6A'
  },
  {
    id: 'mt-hood',
    name: 'Mt. Hood Conference',
    classification: '6A'
  },
  {
    id: 'three-rivers',
    name: 'Three Rivers League',
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
  
  // 5A Districts/Leagues
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
  
  // 4A/3A/2A/1A Special Districts
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
  // 6A Schools - Portland Interscholastic League
  {
    id: 'benson',
    name: 'Benson',
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
    id: 'franklin',
    name: 'Franklin',
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
    id: 'wells',
    name: 'Ida B. Wells',
    classification: '6A',
    districtId: 'pil',
    teams: []
  },
  {
    id: 'lincoln',
    name: 'Lincoln',
    classification: '6A',
    districtId: 'pil',
    teams: []
  },
  {
    id: 'mcdaniel',
    name: 'McDaniel',
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
  
  // 6A Schools - Metro League
  {
    id: 'aloha',
    name: 'Aloha',
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
    id: 'jesuit',
    name: 'Jesuit',
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
    id: 'southridge',
    name: 'Southridge',
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
    id: 'westview',
    name: 'Westview',
    classification: '6A',
    districtId: 'metro',
    teams: []
  },
  
  // 6A Schools - Pacific Conference
  {
    id: 'century',
    name: 'Century',
    classification: '6A',
    districtId: 'pacific',
    teams: []
  },
  {
    id: 'forest-grove',
    name: 'Forest Grove',
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
    id: 'newberg',
    name: 'Newberg',
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
  
  // 6A Schools - Mt. Hood Conference
  {
    id: 'barlow',
    name: 'Barlow',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  {
    id: 'central-catholic',
    name: 'Central Catholic',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  {
    id: 'clackamas',
    name: 'Clackamas',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  {
    id: 'david-douglas',
    name: 'David Douglas',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  {
    id: 'gresham',
    name: 'Gresham',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  {
    id: 'nelson',
    name: 'Nelson',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  {
    id: 'reynolds',
    name: 'Reynolds',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  {
    id: 'sandy',
    name: 'Sandy',
    classification: '6A',
    districtId: 'mt-hood',
    teams: []
  },
  
  // 6A Schools - Three Rivers League
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
    id: 'st-marys',
    name: "St. Mary's Academy",
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
  {
    id: 'west-linn',
    name: 'West Linn',
    classification: '6A',
    districtId: 'three-rivers',
    teams: []
  },
  
  // 6A Schools - Central Valley Conference
  {
    id: 'mcnary',
    name: 'McNary',
    classification: '6A',
    districtId: 'central-valley',
    teams: []
  },
  {
    id: 'north-salem',
    name: 'North Salem',
    classification: '6A',
    districtId: 'central-valley',
    teams: []
  },
  {
    id: 'south-salem',
    name: 'South Salem',
    classification: '6A',
    districtId: 'central-valley',
    teams: []
  },
  {
    id: 'sprague',
    name: 'Sprague',
    classification: '6A',
    districtId: 'central-valley',
    teams: []
  },
  {
    id: 'west-salem',
    name: 'West Salem',
    classification: '6A',
    districtId: 'central-valley',
    teams: []
  },
  
  // 6A Schools - Southwest Conference
  {
    id: 'grants-pass',
    name: 'Grants Pass',
    classification: '6A',
    districtId: 'southwest',
    teams: []
  },
  {
    id: 'north-medford',
    name: 'North Medford',
    classification: '6A',
    districtId: 'southwest',
    teams: []
  },
  {
    id: 'roseburg',
    name: 'Roseburg',
    classification: '6A',
    districtId: 'southwest',
    teams: []
  },
  {
    id: 'sheldon',
    name: 'Sheldon',
    classification: '6A',
    districtId: 'southwest',
    teams: []
  },
  {
    id: 'south-eugene',
    name: 'South Eugene',
    classification: '6A',
    districtId: 'southwest',
    teams: []
  },
  {
    id: 'south-medford',
    name: 'South Medford',
    classification: '6A',
    districtId: 'southwest',
    teams: []
  },
  {
    id: 'willamette',
    name: 'Willamette',
    classification: '6A',
    districtId: 'southwest',
    teams: []
  },
  
  // 5A Schools - Northwest Oregon Conference
  {
    id: 'canby',
    name: 'Canby',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'centennial',
    name: 'Centennial',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'hillsboro',
    name: 'Hillsboro',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'hood-river',
    name: 'Hood River Valley',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'la-salle',
    name: 'La Salle Prep',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'milwaukie',
    name: 'Milwaukie',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'parkrose',
    name: 'Parkrose',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'putnam',
    name: 'Putnam',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  {
    id: 'wilsonville',
    name: 'Wilsonville',
    classification: '5A',
    districtId: 'northwest-oregon',
    teams: []
  },
  
  // 5A Schools - Midwestern League
  {
    id: 'ashland',
    name: 'Ashland',
    classification: '5A',
    districtId: 'midwestern',
    teams: []
  },
  {
    id: 'churchill',
    name: 'Churchill',
    classification: '5A',
    districtId: 'midwestern',
    teams: []
  },
  {
    id: 'north-eugene',
    name: 'North Eugene',
    classification: '5A',
    districtId: 'midwestern',
    teams: []
  },
  {
    id: 'springfield',
    name: 'Springfield',
    classification: '5A',
    districtId: 'midwestern',
    teams: []
  },
  {
    id: 'thurston',
    name: 'Thurston',
    classification: '5A',
    districtId: 'midwestern',
    teams: []
  },
  
  // 5A Schools - Mid-Willamette Conference
  {
    id: 'central',
    name: 'Central',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'corvallis',
    name: 'Corvallis',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'crescent-valley',
    name: 'Crescent Valley',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'dallas',
    name: 'Dallas',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'lebanon',
    name: 'Lebanon',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'mckay',
    name: 'McKay',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'silverton',
    name: 'Silverton',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'south-albany',
    name: 'South Albany',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'west-albany',
    name: 'West Albany',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  {
    id: 'woodburn',
    name: 'Woodburn',
    classification: '5A',
    districtId: 'mid-willamette',
    teams: []
  },
  
  // 5A Schools - Intermountain Conference
  {
    id: 'bend',
    name: 'Bend',
    classification: '5A',
    districtId: 'intermountain',
    teams: []
  },
  {
    id: 'caldera',
    name: 'Caldera',
    classification: '5A',
    districtId: 'intermountain',
    teams: []
  },
  {
    id: 'mountain-view',
    name: 'Mountain View',
    classification: '5A',
    districtId: 'intermountain',
    teams: []
  },
  {
    id: 'redmond',
    name: 'Redmond',
    classification: '5A',
    districtId: 'intermountain',
    teams: []
  },
  {
    id: 'ridgeview',
    name: 'Ridgeview',
    classification: '5A',
    districtId: 'intermountain',
    teams: []
  },
  {
    id: 'summit',
    name: 'Summit',
    classification: '5A',
    districtId: 'intermountain',
    teams: []
  },
  
  // 4A/3A/2A/1A Schools - Special District 1
  {
    id: 'blanchet',
    name: 'Blanchet Catholic',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
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
    id: 'riverdale',
    name: 'Riverdale',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  {
    id: 'riverside-wlwv',
    name: 'Riverside, WLWV',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  {
    id: 'scappoose',
    name: 'Scappoose',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  {
    id: 'st-helens',
    name: 'St. Helens',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  {
    id: 'tillamook',
    name: 'Tillamook',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  {
    id: 'trinity-academy',
    name: 'Trinity Academy',
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
    id: 'westside-christian',
    name: 'Westside Christian',
    classification: '4A/3A/2A/1A',
    districtId: 'sd1',
    teams: []
  },
  
  // Just adding a few key schools from SD2-5 for brevity, would expand this in a real implementation
  {
    id: 'marist',
    name: 'Marist Catholic',
    classification: '4A/3A/2A/1A',
    districtId: 'sd2',
    teams: []
  },
  {
    id: 'north-bend',
    name: 'North Bend',
    classification: '4A/3A/2A/1A',
    districtId: 'sd3',
    teams: []
  },
  {
    id: 'sisters',
    name: 'Sisters',
    classification: '4A/3A/2A/1A',
    districtId: 'sd4',
    teams: []
  },
  {
    id: 'la-grande',
    name: 'La Grande',
    classification: '4A/3A/2A/1A',
    districtId: 'sd5',
    teams: []
  }
];

// Create teams for all schools - focused on girls teams per your requirements
export const sampleTeams: Team[] = [
  // Generate girls teams for all schools
  ...sampleSchools.map(school => ({
    id: `${school.id}-girls`,
    schoolId: school.id,
    gender: 'Girls' as const,
    players: [],
    coaches: []
  })),
  
  // Generate some boys teams too for variety and cross-match possibilities
  ...sampleSchools.filter((_, index) => index % 3 === 0).map(school => ({
    id: `${school.id}-boys`,
    schoolId: school.id,
    gender: 'Boys' as const,
    players: [],
    coaches: []
  }))
];

// Create basic player data for each team
export const samplePlayers: Player[] = [
  // Generate placeholder players for teams (just a few per team for simulation)
  ...sampleTeams.flatMap(team => {
    // Generate 4-6 players per team
    const numPlayers = 4 + Math.floor(Math.random() * 3);
    return Array.from({ length: numPlayers }, (_, index) => ({
      id: `${team.id}-player${index + 1}`,
      name: `Player ${index + 1}`,
      grade: 9 + Math.floor(Math.random() * 4), // Random grade 9-12
      teamId: team.id,
      seasonId: 'current-season', // Using the ID from initialSeasonsData in usePlayersData
      status: 'active' as PlayerStatus,
      seasons: ['current-season'] // Include the current season in the seasons array
    }));
  })
];

// Helper functions for match generation
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
                          isLeague: boolean, homeTeamWins: boolean): Match => {
  // Get team players
  const homePlayers = samplePlayers.filter(p => p.teamId === homeTeamId).map(p => p.id);
  const awayPlayers = samplePlayers.filter(p => p.teamId === awayTeamId).map(p => p.id);
  
  // If no players found, generate placeholder IDs
  const homePlayerIds = homePlayers.length > 0 ? 
    homePlayers : Array.from({ length: 4 }, (_, i) => `${homeTeamId}-placeholder${i}`);
  const awayPlayerIds = awayPlayers.length > 0 ? 
    awayPlayers : Array.from({ length: 4 }, (_, i) => `${awayTeamId}-placeholder${i}`);
  
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

// Generate dates between March 1 and May 10, 2025
const generateMatchDate = (index: number, totalMatches: number) => {
  const start = new Date(2025, 2, 1); // March 1, 2025
  const end = new Date(2025, 4, 10);   // May 10, 2025
  const dayRange = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  
  // Distribute dates evenly across the season
  const dayOffset = Math.floor((dayRange * (index / totalMatches)) + (Math.random() * 5));
  const matchDate = new Date(start);
  matchDate.setDate(matchDate.getDate() + dayOffset);
  
  // Format as YYYY-MM-DD
  return matchDate.toISOString().split('T')[0];
};

// Generate matches for all teams
export const sampleMatches: Match[] = (() => {
  const matches: Match[] = [];
  const girlsTeams = sampleTeams.filter(team => team.gender === 'Girls');
  let matchIndex = 0;
  
  // For each league, generate league matches
  const leagueMatchesByDistrict: Record<string, Team[][]> = {};
  
  sampleDistricts.forEach(district => {
    // Get all teams in this district
    const teamsInDistrict = girlsTeams.filter(team => {
      const school = sampleSchools.find(s => s.id === team.schoolId);
      return school && school.districtId === district.id;
    });
    
    // Generate all possible league matchups (each team plays every other team in league)
    const leagueMatchups: Team[][] = [];
    for (let i = 0; i < teamsInDistrict.length; i++) {
      for (let j = i + 1; j < teamsInDistrict.length; j++) {
        leagueMatchups.push([teamsInDistrict[i], teamsInDistrict[j]]);
      }
    }
    
    leagueMatchesByDistrict[district.id] = leagueMatchups;
  });
  
  // Calculate total matches to generate
  const totalLeagueMatches = Object.values(leagueMatchesByDistrict)
    .reduce((sum, matchups) => sum + matchups.length, 0);
  
  // Generate all league matches
  Object.entries(leagueMatchesByDistrict).forEach(([districtId, matchups]) => {
    matchups.forEach(([teamA, teamB]) => {
      // Generate a unique match ID
      const matchId = `match-${matchIndex++}`;
      
      // Create the match
      const match = createFullMatch(
        matchId,
        generateMatchDate(matchIndex, totalLeagueMatches + 100), // Add buffer for non-league matches
        teamA.id,
        teamB.id,
        true, // League match
        Math.random() > 0.5 // Random winner
      );
      
      matches.push(match);
    });
  });
  
  // Generate non-league matches (cross-league play)
  // Each team should have 10-18 matches (approx 5-8 league, 5-10 non-league)
  const teamMatchCounts: Record<string, number> = {};
  
  // Initialize match counts from league matches
  matches.forEach(match => {
    teamMatchCounts[match.homeTeamId] = (teamMatchCounts[match.homeTeamId] || 0) + 1;
    teamMatchCounts[match.awayTeamId] = (teamMatchCounts[match.awayTeamId] || 0) + 1;
  });
  
  // Add non-league matches until each team has at least 10 matches
  girlsTeams.forEach(team => {
    const currentMatches = teamMatchCounts[team.id] || 0;
    const targetMatches = 10 + Math.floor(Math.random() * 9); // Random between 10-18 matches
    const additionalMatchesNeeded = Math.max(0, targetMatches - currentMatches);
    
    if (additionalMatchesNeeded > 0) {
      // Find opponent teams from different leagues
      const teamSchool = sampleSchools.find(s => s.id === team.schoolId);
      if (!teamSchool) return;
      
      const potentialOpponents = girlsTeams.filter(opponent => {
        if (opponent.id === team.id) return false;
        
        const opponentSchool = sampleSchools.find(s => s.id === opponent.schoolId);
        if (!opponentSchool) return false;
        
        // Different league but similar classification is preferred
        return opponentSchool.districtId !== teamSchool.districtId;
      });
      
      // Sort by least matches played to balance the schedule
      potentialOpponents.sort((a, b) => 
        (teamMatchCounts[a.id] || 0) - (teamMatchCounts[b.id] || 0)
      );
      
      // Add matches
      for (let i = 0; i < additionalMatchesNeeded && i < potentialOpponents.length; i++) {
        const opponent = potentialOpponents[i];
        
        // Check if they already played this opponent
        const alreadyPlayed = matches.some(match => 
          (match.homeTeamId === team.id && match.awayTeamId === opponent.id) ||
          (match.homeTeamId === opponent.id && match.awayTeamId === team.id)
        );
        
        if (!alreadyPlayed) {
          const matchId = `match-${matchIndex++}`;
          const isHome = Math.random() > 0.5;
          
          const match = createFullMatch(
            matchId,
            generateMatchDate(totalLeagueMatches + i, totalLeagueMatches + 100),
            isHome ? team.id : opponent.id,
            isHome ? opponent.id : team.id,
            false, // Non-league match
            Math.random() > 0.5 // Random winner
          );
          
          matches.push(match);
          
          // Update match counts
          teamMatchCounts[team.id] = (teamMatchCounts[team.id] || 0) + 1;
          teamMatchCounts[opponent.id] = (teamMatchCounts[opponent.id] || 0) + 1;
        }
      }
    }
  });
  
  return matches;
})();
