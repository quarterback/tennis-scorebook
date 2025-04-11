
import { School, Team, Player, Match, Flight, Set, District } from '@/types';

export const sampleDistricts: District[] = [
  {
    id: '1',
    name: 'Metro League',
    classification: '6A'
  },
  {
    id: '2',
    name: 'Pacific Conference',
    classification: '6A'
  },
  {
    id: '3',
    name: 'Valley League',
    classification: '5A'
  },
  {
    id: '4',
    name: 'Northwest League',
    classification: '5A'
  },
  {
    id: '5',
    name: 'Rural Conference',
    classification: '4A/3A/2A/1A'
  }
];

export const sampleSchools: School[] = [
  {
    id: '1',
    name: 'Westside High',
    classification: '6A',
    districtId: '1', // Metro League
    teams: []
  },
  {
    id: '2',
    name: 'Eastside High',
    classification: '6A',
    districtId: '1', // Metro League
    teams: []
  },
  {
    id: '3',
    name: 'North County High',
    classification: '5A',
    districtId: '3', // Valley League
    teams: []
  },
  {
    id: '4',
    name: 'South County High',
    classification: '5A',
    districtId: '3', // Valley League
    teams: []
  },
  {
    id: '5',
    name: 'Central Academy',
    classification: '4A/3A/2A/1A',
    districtId: '5', // Rural Conference
    teams: []
  }
];

export const sampleTeams: Team[] = [
  {
    id: '1',
    schoolId: '1',
    gender: 'Boys',
    players: [],
    coaches: ['2']
  },
  {
    id: '2',
    schoolId: '1',
    gender: 'Girls',
    players: [],
    coaches: ['2']
  },
  {
    id: '3',
    schoolId: '2',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: '4',
    schoolId: '2',
    gender: 'Girls',
    players: [],
    coaches: []
  },
  {
    id: '5',
    schoolId: '3',
    gender: 'Boys',
    players: [],
    coaches: []
  },
  {
    id: '6',
    schoolId: '4',
    gender: 'Girls',
    players: [],
    coaches: []
  }
];

export const samplePlayers: Player[] = [
  {
    id: '1',
    name: 'John Smith',
    grade: 12,
    teamId: '1'
  },
  {
    id: '2',
    name: 'Michael Johnson',
    grade: 11,
    teamId: '1'
  },
  {
    id: '3',
    name: 'Robert Davis',
    grade: 12,
    teamId: '1'
  },
  {
    id: '4',
    name: 'William Brown',
    grade: 10,
    teamId: '1'
  },
  {
    id: '5',
    name: 'Emma Wilson',
    grade: 12,
    teamId: '2'
  },
  {
    id: '6',
    name: 'Olivia Martinez',
    grade: 11,
    teamId: '2'
  },
  {
    id: '7',
    name: 'Sophia Rodriguez',
    grade: 10,
    teamId: '2'
  },
  {
    id: '8',
    name: 'Ava Garcia',
    grade: 9,
    teamId: '2'
  },
  {
    id: '9',
    name: 'James Wilson',
    grade: 12,
    teamId: '3'
  },
  {
    id: '10',
    name: 'Emma Taylor',
    grade: 11,
    teamId: '4'
  }
];

const createSet = (homeScore: number, awayScore: number, hasTiebreak = false): Set => {
  const set: Set = {
    homeScore,
    awayScore
  };
  
  if (hasTiebreak) {
    set.tiebreak = {
      homeScore: 7,
      awayScore: 5
    };
  }
  
  return set;
};

export const sampleMatches: Match[] = [
  {
    id: '1',
    date: '2025-04-05',
    homeTeamId: '1',
    awayTeamId: '3',
    isLeagueMatch: true,
    isComplete: true,
    homeTeamWon: true,
    flights: [
      {
        id: '1-1',
        matchId: '1',
        type: 'singles',
        position: 1,
        level: 'varsity',
        homePlayers: ['1'],
        awayPlayers: ['9'],
        sets: [
          createSet(6, 4),
          createSet(6, 2)
        ],
        homePlayerWon: true
      },
      {
        id: '1-2',
        matchId: '1',
        type: 'singles',
        position: 2,
        level: 'varsity',
        homePlayers: ['2'],
        awayPlayers: ['9'],
        sets: [
          createSet(6, 3),
          createSet(6, 3)
        ],
        homePlayerWon: true
      },
      {
        id: '1-3',
        matchId: '1',
        type: 'doubles',
        position: 1,
        level: 'varsity',
        homePlayers: ['3', '4'],
        awayPlayers: ['9', '9'],
        sets: [
          createSet(6, 7, true),
          createSet(6, 4),
          createSet(6, 2)
        ],
        homePlayerWon: true
      }
    ]
  },
  {
    id: '2',
    date: '2025-04-10',
    homeTeamId: '2',
    awayTeamId: '4',
    isLeagueMatch: true,
    isComplete: true,
    homeTeamWon: false,
    flights: [
      {
        id: '2-1',
        matchId: '2',
        type: 'singles',
        position: 1,
        level: 'varsity',
        homePlayers: ['5'],
        awayPlayers: ['10'],
        sets: [
          createSet(4, 6),
          createSet(3, 6)
        ],
        homePlayerWon: false
      },
      {
        id: '2-2',
        matchId: '2',
        type: 'singles',
        position: 2,
        level: 'varsity',
        homePlayers: ['6'],
        awayPlayers: ['10'],
        sets: [
          createSet(6, 2),
          createSet(3, 6),
          createSet(4, 6)
        ],
        homePlayerWon: false
      },
      {
        id: '2-3',
        matchId: '2',
        type: 'doubles',
        position: 1,
        level: 'varsity',
        homePlayers: ['7', '8'],
        awayPlayers: ['10', '10'],
        sets: [
          createSet(2, 6),
          createSet(3, 6)
        ],
        homePlayerWon: false
      }
    ]
  }
];
