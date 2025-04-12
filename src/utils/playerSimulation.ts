
import { Player, Team, School, Gender } from '@/types';
import { PlayerStatus } from '@/types';
import { TeamLadder, PlayerLadderPosition } from '@/types/ranking';

// First names dataset
const girlsFirstNames = [
  "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", 
  "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Sofia", "Ella", "Madison", 
  "Scarlett", "Victoria", "Aria", "Grace", "Chloe", "Camila", "Penelope", "Riley",
  "Layla", "Lillian", "Nora", "Zoey", "Mila", "Aubrey", "Hannah", "Lily", "Addison",
  "Eleanor", "Natalie", "Luna", "Savannah", "Brooklyn", "Leah", "Zoe", "Stella", "Hazel",
  "Ellie", "Paisley", "Audrey", "Skylar", "Violet", "Claire", "Bella", "Aurora",
  "Lucy", "Anna", "Samantha", "Caroline", "Genesis", "Aaliyah", "Kennedy", "Kinsley",
  "Allison", "Maya", "Sarah", "Madelyn", "Adeline", "Alexa", "Ariana", "Elena",
  "Gabriella", "Naomi", "Alice", "Sadie", "Hailey", "Eva", "Emilia", "Autumn",
  "Quinn", "Nevaeh", "Piper", "Ruby", "Serenity", "Willow", "Everly", "Cora",
  "Kaylee", "Lydia", "Aubree", "Arianna", "Eliana", "Peyton", "Melanie", "Gianna",
  "Isabelle", "Julia", "Valentina", "Nova", "Clara", "Vivian", "Reagan", "Mackenzie"
];

const boysFirstNames = [
  "Liam", "Noah", "William", "James", "Oliver", "Benjamin", "Elijah", "Lucas",
  "Mason", "Logan", "Alexander", "Ethan", "Jacob", "Michael", "Daniel", "Henry",
  "Jackson", "Sebastian", "Aiden", "Matthew", "Samuel", "David", "Joseph", "Carter",
  "Owen", "Wyatt", "John", "Jack", "Luke", "Jayden", "Dylan", "Grayson", "Levi",
  "Isaac", "Gabriel", "Julian", "Mateo", "Anthony", "Jaxon", "Lincoln", "Joshua",
  "Christopher", "Andrew", "Theodore", "Caleb", "Ryan", "Asher", "Nathan", "Thomas",
  "Leo", "Isaiah", "Charles", "Josiah", "Hudson", "Christian", "Hunter", "Connor",
  "Eli", "Ezra", "Aaron", "Landon", "Adrian", "Jonathan", "Nolan", "Jeremiah",
  "Easton", "Elias", "Colton", "Cameron", "Carson", "Robert", "Angel", "Maverick",
  "Nicholas", "Dominic", "Jace", "Ian", "Austin", "Adam", "Santiago", "Jordan",
  "Cooper", "Brayden", "Roman", "Evan", "Ezekiel", "Xavier", "Jose", "Jaxson",
  "Axel", "Everett", "Kayden", "Miles", "Sawyer", "Jason", "Maxwell", "Juan"
];

// Last names dataset
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
  "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
  "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey",
  "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson",
  "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
  "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross",
  "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell", "Sullivan", "Bell",
  "Coleman", "Butler", "Henderson", "Barnes", "Gonzales", "Fisher", "Vasquez", "Simmons"
];

/**
 * Generate a random player name based on gender
 */
export const generatePlayerName = (gender: Gender): string => {
  const firstNames = gender === 'Girls' ? girlsFirstNames : boysFirstNames;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};

/**
 * Generate a random grade (9-12) with weighted distribution
 * More seniors and juniors on varsity teams
 */
export const generatePlayerGrade = (): number => {
  const weights = [0.2, 0.25, 0.3, 0.25]; // 9th, 10th, 11th, 12th
  const random = Math.random();
  
  let cumulativeWeight = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return i + 9; // grades 9-12
    }
  }
  
  return 9; // default to freshman if something goes wrong
};

/**
 * Generate a roster of players for a team
 */
export const generateTeamRoster = (
  teamId: string, 
  schoolId: string,
  seasonId: string,
  size: number = Math.floor(Math.random() * 8) + 12 // 12-20 players
): Player[] => {
  const players: Player[] = [];
  
  for (let i = 0; i < size; i++) {
    const team = {
      id: teamId,
      schoolId
    } as Team;
    
    const gender = 'Girls'; // For now hardcoding to girls, can be dynamic later
    
    const player: Player = {
      id: crypto.randomUUID(),
      name: generatePlayerName(gender),
      grade: generatePlayerGrade(),
      teamId,
      seasonId,
      status: 'active' as PlayerStatus,
      seasons: [seasonId]
    };
    
    players.push(player);
  }
  
  return players;
};

/**
 * Create an initial ladder ranking for a team based on their roster
 */
export const generateTeamLadder = (
  teamId: string,
  seasonId: string,
  players: Player[]
): TeamLadder => {
  // Sort players by a random skill level (higher grade slightly increases chance of higher skill)
  const rankedPlayers = players.map(player => {
    // Base skill influenced slightly by grade
    const baseSkill = Math.random() * 0.7 + (player.grade - 9) * 0.1;
    return {
      player,
      skill: baseSkill
    };
  }).sort((a, b) => b.skill - a.skill);
  
  // Create ladder positions
  const rankings: PlayerLadderPosition[] = rankedPlayers.map((rankedPlayer, index) => {
    return {
      playerId: rankedPlayer.player.id,
      rank: index + 1, // 1-based ranking (1 is best)
      previousRanks: [index + 1] // Initially only one ranking in history
    };
  });
  
  return {
    teamId,
    seasonId,
    rankings,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Slightly shuffle a team ladder to simulate minor ranking changes over time
 */
export const updateTeamLadder = (ladder: TeamLadder): TeamLadder => {
  const newRankings = [...ladder.rankings];
  
  // Randomly select 0-3 pairs of adjacent players to swap
  const swapsCount = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < swapsCount; i++) {
    // Pick a random position (not the last one)
    const position = Math.floor(Math.random() * (newRankings.length - 1));
    
    // Only swap if players are adjacent in ranking
    const player1 = newRankings[position];
    const player2 = newRankings[position + 1];
    
    // 30% chance of swap if they're adjacent
    if (Math.random() < 0.3) {
      // Swap them
      newRankings[position] = player2;
      newRankings[position + 1] = player1;
      
      // Update rank and history
      newRankings[position].rank = position + 1;
      newRankings[position].previousRanks.push(position + 1);
      
      newRankings[position + 1].rank = position + 2;
      newRankings[position + 1].previousRanks.push(position + 2);
    }
  }
  
  return {
    ...ladder,
    rankings: newRankings,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Get player information by ID with ladder position
 */
export const getPlayerWithRank = (
  playerId: string,
  players: Player[],
  ladder: TeamLadder
): { player: Player, rank: number } | null => {
  const player = players.find(p => p.id === playerId);
  if (!player) return null;
  
  const ladderPosition = ladder.rankings.find(r => r.playerId === playerId);
  if (!ladderPosition) return null;
  
  return {
    player,
    rank: ladderPosition.rank
  };
};
