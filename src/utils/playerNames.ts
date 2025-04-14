
import { Gender } from '@/types';

// First names dataset with more diverse options
export const girlsFirstNames = [
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
  "Isabelle", "Julia", "Valentina", "Nova", "Clara", "Vivian", "Reagan", "Mackenzie",
  "Mei", "Yuna", "Hana", "Sakura", "Jin", "Soo-jin", "Eun", "Jia", "Ling", "Yuki",
  "Astrid", "Freya", "Ingrid", "Mathilde", "Greta", "Katarina", "Isolde", "Annika",
  "Nia", "Amara", "Adanna", "Kesi",
  "Aisha", "Lakshmi", "Fatima", "Zara"
];

export const boysFirstNames = [
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
  "Axel", "Everett", "Kayden", "Miles", "Sawyer", "Jason", "Maxwell", "Juan",
  "Kai", "Hiroshi", "Jin", "Ming", "Tao", "Ryu", "Kenji", "Jian", "Sung", "Wei",
  "Magnus", "Henrik", "Lars", "Sven", "Bjorn", "Klaus", "Nikolai", "Matthias",
  "Kofi", "Kwame", "Sekou", "Abeo",
  "Hassan", "Raj", "Omar", "Zahir"
];

// Gender-neutral names (can be added to either list based on the team's gender)
export const genderNeutralNames = [
  "Alex", "Jordan", "Taylor", "Casey", "Riley", "Avery", "Quinn", "Skyler", 
  "Dakota", "Rowan", "Charlie", "Finley", "Sage", "Jamie", "Drew", "Reese", 
  "Robin", "Kendall", "Morgan", "Blake", "Cameron", "Hayden", "Emerson", "Parker"
];

// Last names dataset with diverse diaspora representation
export const lastNames = [
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
  "Wang", "Li", "Zhang", "Chen", "Liu", "Huang", "Wu", "Xu", "Sun", "Zhu", 
  "Yang", "Zhao", "Zhou", "Lu", "Kim", "Park", "Lee", "Choi", "Kang", "Nguyen",
  "Tran", "Pham", "Hoang", "Vu", "Dang",
  "Schmidt", "Müller", "Fischer", "Weber", "Schneider", "Meyer", "Wagner", "Becker",
  "Hoffmann", "Schulz", "Kowalski", "Nowak", "Wójcik", "Kowalczyk", "Kamiński",
  "Adebayo", "Okafor", "Mensah", "Osei", "Abara", "Diallo", "Afolayan",
  "Khan", "Singh", "Gupta", "Patel", "Ali", "Kumar", "Sharma", "Hassan", "Malhotra"
];

/**
 * Generate a random player name based on gender
 */
export const generatePlayerName = (gender: Gender): string => {
  // Decide whether to use a gender-neutral name (20% chance)
  const useGenderNeutral = Math.random() < 0.2;
  
  let firstName;
  if (useGenderNeutral) {
    firstName = genderNeutralNames[Math.floor(Math.random() * genderNeutralNames.length)];
  } else {
    const firstNames = gender === 'Girls' ? girlsFirstNames : boysFirstNames;
    firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  }
  
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};
