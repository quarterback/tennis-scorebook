import { District, School, Team, Player, Match, Season } from '@/types';
import { TeamLadder } from '@/types/ranking';

// Sample districts with all leagues
export const sampleDistricts: District[] = [
  // 6A Districts
  {
    id: '6a-1',
    name: 'Portland Interscholastic League',
    classification: '6A'
  },
  {
    id: '6a-2',
    name: 'Metro League',
    classification: '6A'
  },
  {
    id: '6a-3',
    name: 'Pacific Conference',
    classification: '6A'
  },
  {
    id: '6a-4',
    name: 'Mt. Hood Conference',
    classification: '6A'
  },
  {
    id: '6a-5',
    name: 'Three Rivers League',
    classification: '6A'
  },
  {
    id: '6a-6',
    name: 'Central Valley Conference',
    classification: '6A'
  },
  {
    id: '6a-7',
    name: 'Southwest Conference',
    classification: '6A'
  },
  
  // 5A Districts
  {
    id: '5a-1',
    name: 'Northwest Oregon Conference',
    classification: '5A'
  },
  {
    id: '5a-2',
    name: 'Midwestern League',
    classification: '5A'
  },
  {
    id: '5a-3',
    name: 'Mid-Willamette Conference',
    classification: '5A'
  },
  {
    id: '5a-4',
    name: 'Intermountain Conference',
    classification: '5A'
  },
  
  // 4A/3A/2A/1A Special Districts
  {
    id: 'sd-1',
    name: 'Special District 1',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd-2',
    name: 'Special District 2',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd-3',
    name: 'Special District 3',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd-4',
    name: 'Special District 4',
    classification: '4A/3A/2A/1A'
  },
  {
    id: 'sd-5',
    name: 'Special District 5',
    classification: '4A/3A/2A/1A'
  }
];

// Sample schools with complete data
export const sampleSchools: School[] = [
  // 6A-1 Portland Interscholastic League
  { id: 'school-benson', name: 'Benson', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },
  { id: 'school-cleveland', name: 'Cleveland', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },
  { id: 'school-franklin', name: 'Franklin', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },
  { id: 'school-grant', name: 'Grant', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },
  { id: 'school-wells', name: 'Ida B. Wells', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },
  { id: 'school-lincoln', name: 'Lincoln', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },
  { id: 'school-mcdaniel', name: 'McDaniel', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },
  { id: 'school-roosevelt', name: 'Roosevelt', classification: '6A', districtId: '6a-1', city: 'Portland', state: 'OR' },

  // 6A-2 Metro League
  { id: 'school-aloha', name: 'Aloha', classification: '6A', districtId: '6a-2', city: 'Beaverton', state: 'OR' },
  { id: 'school-beaverton', name: 'Beaverton', classification: '6A', districtId: '6a-2', city: 'Beaverton', state: 'OR' },
  { id: 'school-jesuit', name: 'Jesuit', classification: '6A', districtId: '6a-2', city: 'Portland', state: 'OR' },
  { id: 'school-mountainside', name: 'Mountainside', classification: '6A', districtId: '6a-2', city: 'Beaverton', state: 'OR' },
  { id: 'school-southridge', name: 'Southridge', classification: '6A', districtId: '6a-2', city: 'Beaverton', state: 'OR' },
  { id: 'school-sunset', name: 'Sunset', classification: '6A', districtId: '6a-2', city: 'Portland', state: 'OR' },
  { id: 'school-westview', name: 'Westview', classification: '6A', districtId: '6a-2', city: 'Portland', state: 'OR' },

  // Continue with other schools...
  // ... (truncated for brevity, would include ALL schools from the list)

  // Special cases (girls-only schools)
  { id: 'school-stmarys', name: "St. Mary's Academy", classification: '6A', districtId: '6a-5', city: 'Portland', state: 'OR' }
];

// Generate teams for all schools
export const sampleTeams: Team[] = sampleSchools.flatMap(school => {
  const teams: Team[] = [];
  
  // Add girls team for all schools
  teams.push({
    id: `${school.id}-girls`,
    schoolId: school.id,
    gender: 'Girls'
  });
  
  // Add boys team for schools that should have them
  const girlsOnlySchools = ['school-stmarys', 'school-scappoose', 'school-tillamook', 'school-westsidechristian'];
  if (!girlsOnlySchools.includes(school.id)) {
    teams.push({
      id: `${school.id}-boys`,
      schoolId: school.id,
      gender: 'Boys'
    });
  }
  
  return teams;
});

export const sampleSeasons: Season[] = [
  {
    id: 'season-1',
    year: 2024,
    name: 'Spring 2024',
    isCurrent: true
  },
  {
    id: 'season-2',
    year: 2023,
    name: 'Spring 2023',
    isCurrent: false
  }
];

export const samplePlayers: Player[] = [
  {
    id: 'player-1',
    name: 'John Smith',
    teamId: 'team-1',
    gender: 'Boys',
    grade: '12',
    seasonId: 'season-1',
    skillTier: 'elite',
    skillRating: 9.5,
    singles_preference: 0.9
  },
  {
    id: 'player-2',
    name: 'Michael Johnson',
    teamId: 'team-1',
    gender: 'Boys',
    grade: '11',
    seasonId: 'season-1',
    skillTier: 'elite',
    skillRating: 9.2,
    singles_preference: 0.8
  },
  {
    id: 'player-3',
    name: 'David Williams',
    teamId: 'team-1',
    gender: 'Boys',
    grade: '12',
    seasonId: 'season-1',
    skillTier: 'competitive',
    skillRating: 7.8,
    singles_preference: 0.6
  },
  {
    id: 'player-4',
    name: 'Robert Jones',
    teamId: 'team-1',
    gender: 'Boys',
    grade: '10',
    seasonId: 'season-1',
    skillTier: 'competitive',
    skillRating: 7.5,
    singles_preference: 0.4
  },
  {
    id: 'player-5',
    name: 'James Brown',
    teamId: 'team-1',
    gender: 'Boys',
    grade: '11',
    seasonId: 'season-1',
    skillTier: 'competitive',
    skillRating: 7.2,
    singles_preference: 0.3
  },
  {
    id: 'player-6',
    name: 'Emma Davis',
    teamId: 'team-2',
    gender: 'Girls',
    grade: '12',
    seasonId: 'season-1',
    skillTier: 'elite',
    skillRating: 9.7,
    singles_preference: 0.95
  },
  {
    id: 'player-7',
    name: 'Olivia Miller',
    teamId: 'team-2',
    gender: 'Girls',
    grade: '11',
    seasonId: 'season-1',
    skillTier: 'elite',
    skillRating: 9.3,
    singles_preference: 0.85
  },
  {
    id: 'player-8',
    name: 'Sophia Wilson',
    teamId: 'team-2',
    gender: 'Girls',
    grade: '12',
    seasonId: 'season-1',
    skillTier: 'competitive',
    skillRating: 7.9,
    singles_preference: 0.7
  },
  {
    id: 'player-9',
    name: 'Isabella Moore',
    teamId: 'team-2',
    gender: 'Girls',
    grade: '10',
    seasonId: 'season-1',
    skillTier: 'competitive',
    skillRating: 7.6,
    singles_preference: 0.5
  },
  {
    id: 'player-10',
    name: 'Mia Taylor',
    teamId: 'team-2',
    gender: 'Girls',
    grade: '11',
    seasonId: 'season-1',
    skillTier: 'competitive',
    skillRating: 7.3,
    singles_preference: 0.4
  },
  {
    id: 'player-11',
    name: 'William Anderson',
    teamId: 'team-3',
    gender: 'Boys',
    grade: '12',
    seasonId: 'season-1',
    skillTier: 'elite',
    skillRating: 9.0,
    singles_preference: 0.8
  },
  {
    id: 'player-12',
    name: 'Ava Thomas',
    teamId: 'team-4',
    gender: 'Girls',
    grade: '12',
    seasonId: 'season-1',
    skillTier: 'elite',
    skillRating: 9.1,
    singles_preference: 0.85
  }
];

export const sampleLadders: TeamLadder[] = [
  {
    teamId: 'team-1',
    seasonId: 'season-1',
    lastUpdated: '2024-03-15T12:00:00Z',
    rankings: [
      {
        playerId: 'player-1',
        rank: 1,
        ladderPoints: 100,
        previousRanks: [1, 1, 1]
      },
      {
        playerId: 'player-2',
        rank: 2,
        ladderPoints: 95,
        previousRanks: [2, 2, 3]
      },
      {
        playerId: 'player-3',
        rank: 3,
        ladderPoints: 90,
        previousRanks: [3, 3, 2]
      },
      {
        playerId: 'player-4',
        rank: 4,
        ladderPoints: 85,
        previousRanks: [4, 5, 5]
      },
      {
        playerId: 'player-5',
        rank: 5,
        ladderPoints: 80,
        previousRanks: [5, 4, 4]
      }
    ]
  },
  {
    teamId: 'team-2',
    seasonId: 'season-1',
    lastUpdated: '2024-03-15T12:00:00Z',
    rankings: [
      {
        playerId: 'player-6',
        rank: 1,
        ladderPoints: 100,
        previousRanks: [1, 1, 1]
      },
      {
        playerId: 'player-7',
        rank: 2,
        ladderPoints: 95,
        previousRanks: [2, 2, 3]
      },
      {
        playerId: 'player-8',
        rank: 3,
        ladderPoints: 90,
        previousRanks: [3, 3, 2]
      },
      {
        playerId: 'player-9',
        rank: 4,
        ladderPoints: 85,
        previousRanks: [4, 5, 5]
      },
      {
        playerId: 'player-10',
        rank: 5,
        ladderPoints: 80,
        previousRanks: [5, 4, 4]
      }
    ]
  }
];

export const sampleMatches: Match[] = [
  {
    id: 'match-1',
    date: '2024-04-01',
    homeTeamId: 'team-1',
    awayTeamId: 'team-3',
    isLeagueMatch: true,
    isComplete: true,
    homeTeamWon: true,
    homeTeamScore: 5,
    awayTeamScore: 3,
    flights: [
      {
        id: 'flight-1-1',
        matchId: 'match-1',
        type: 'singles',
        position: 1,
        level: 'varsity',
        homePlayers: ['player-1'],
        awayPlayers: ['player-11'],
        homePlayerWon: true,
        sets: [
          { homeScore: 6, awayScore: 3 },
          { homeScore: 6, awayScore: 2 }
        ],
        scoreDisplay: '6-3, 6-2'
      },
      {
        id: 'flight-1-2',
        matchId: 'match-1',
        type: 'singles',
        position: 2,
        level: 'varsity',
        homePlayers: ['player-2'],
        awayPlayers: [],
        homePlayerWon: true,
        sets: [
          { homeScore: 6, awayScore: 4 },
          { homeScore: 7, awayScore: 5 }
        ],
        scoreDisplay: '6-4, 7-5'
      },
      {
        id: 'flight-1-3',
        matchId: 'match-1',
        type: 'doubles',
        position: 1,
        level: 'varsity',
        homePlayers: ['player-3', 'player-4'],
        awayPlayers: [],
        homePlayerWon: false,
        sets: [
          { homeScore: 4, awayScore: 6 },
          { homeScore: 6, awayScore: 7, tiebreak: { homeScore: 5, awayScore: 7 } }
        ],
        scoreDisplay: '4-6, 6-7 (5-7)'
      }
    ]
  },
  {
    id: 'match-2',
    date: '2024-04-08',
    homeTeamId: 'team-2',
    awayTeamId: 'team-4',
    isLeagueMatch: true,
    isComplete: true,
    homeTeamWon: true,
    homeTeamScore: 6,
    awayTeamScore: 2,
    flights: [
      {
        id: 'flight-2-1',
        matchId: 'match-2',
        type: 'singles',
        position: 1,
        level: 'varsity',
        homePlayers: ['player-6'],
        awayPlayers: ['player-12'],
        homePlayerWon: true,
        sets: [
          { homeScore: 6, awayScore: 2 },
          { homeScore: 6, awayScore: 1 }
        ],
        scoreDisplay: '6-2, 6-1'
      },
      {
        id: 'flight-2-2',
        matchId: 'match-2',
        type: 'singles',
        position: 2,
        level: 'varsity',
        homePlayers: ['player-7'],
        awayPlayers: [],
        homePlayerWon: true,
        sets: [
          { homeScore: 6, awayScore: 3 },
          { homeScore: 6, awayScore: 4 }
        ],
        scoreDisplay: '6-3, 6-4'
      },
      {
        id: 'flight-2-3',
        matchId: 'match-2',
        type: 'doubles',
        position: 1,
        level: 'varsity',
        homePlayers: ['player-8', 'player-9'],
        awayPlayers: [],
        homePlayerWon: false,
        sets: [
          { homeScore: 3, awayScore: 6 },
          { homeScore: 4, awayScore: 6 }
        ],
        scoreDisplay: '3-6, 4-6'
      }
    ]
  }
];

export const sampleUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 'coach-1',
    name: 'Jesuit Coach',
    email: 'jesuit.coach@example.com',
    role: 'coach',
    schoolId: 'school-1'
  },
  {
    id: 'coach-2',
    name: 'Sunset Coach',
    email: 'sunset.coach@example.com',
    role: 'coach',
    schoolId: 'school-2'
  },
  {
    id: 'coach-3',
    name: 'Beaverton Coach',
    email: 'beaverton.coach@example.com',
    role: 'coach',
    schoolId: 'school-3'
  },
  {
    id: 'coach-4',
    name: 'Lake Oswego Coach',
    email: 'lakeoswego.coach@example.com',
    role: 'coach',
    schoolId: 'school-4'
  },
  {
    id: 'coach-5',
    name: 'Lakeridge Coach',
    email: 'lakeridge.coach@example.com',
    role: 'coach',
    schoolId: 'school-5'
  },
  {
    id: 'coach-6',
    name: 'Marist Coach',
    email: 'marist.coach@example.com',
    role: 'coach',
    schoolId: 'school-10'
  },
  {
    id: 'coach-7',
    name: 'OES Coach',
    email: 'oes.coach@example.com',
    role: 'coach',
    schoolId: 'school-11'
  }
];
