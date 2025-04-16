
// Common first names by gender
const boysFirstNames = [
  'Aiden', 'Jackson', 'Lucas', 'Liam', 'Noah', 
  'Ethan', 'Mason', 'Logan', 'Jacob', 'Michael',
  'Matthew', 'Daniel', 'Oliver', 'Henry', 'James',
  'Benjamin', 'Alexander', 'William', 'Elijah', 'Samuel',
  'David', 'Joseph', 'Anthony', 'Andrew', 'Jack',
  'Ryan', 'Nathan', 'Joshua', 'Christian', 'Owen',
  'Dylan', 'Isaac', 'Gabriel', 'Caleb', 'Luke',
  'Tyler', 'Aaron', 'John', 'Jonathan', 'Connor',
  'Nicholas', 'Eli', 'Justin', 'Brandon', 'Adam',
  'Thomas', 'Zachary', 'Alex', 'Isaiah', 'Austin',
  'Kevin', 'Jason', 'Sean', 'Dominic', 'Ian',
  'Max', 'Xavier', 'Evan', 'Carlos', 'Santiago',
  'Marcus', 'Brian', 'Mateo', 'Juan', 'Miguel',
  'Diego', 'Luis', 'Kai', 'Jayden', 'Omar',
  'Kyle', 'Seth', 'Ricardo', 'Jorge', 'Alejandro'
];

const girlsFirstNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia',
  'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
  'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
  'Ella', 'Scarlett', 'Grace', 'Victoria', 'Riley',
  'Aria', 'Lily', 'Aubrey', 'Zoey', 'Hannah',
  'Lillian', 'Addison', 'Layla', 'Natalie', 'Camila',
  'Madison', 'Chloe', 'Maya', 'Penelope', 'Madelyn',
  'Nora', 'Hailey', 'Lucy', 'Sarah', 'Anna',
  'Audrey', 'Savannah', 'Aaliyah', 'Gabriella', 'Claire',
  'Sadie', 'Naomi', 'Zoe', 'Eva', 'Kennedy',
  'Ellie', 'Skylar', 'Caroline', 'Maria', 'Stella',
  'Kylie', 'Peyton', 'Leila', 'Nevaeh', 'Jasmine',
  'Violet', 'Alice', 'Julia', 'Morgan', 'Cora',
  'Kate', 'Diana', 'Leah', 'Gabriela', 'Valeria',
  'Clara', 'Melanie', 'Tiana', 'Jane', 'Mackenzie'
];

// Common last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
  'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
  'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez',
  'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
  'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark',
  'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall',
  'Young', 'Allen', 'Sanchez', 'Wright', 'King',
  'Scott', 'Green', 'Baker', 'Adams', 'Nelson',
  'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts',
  'Carter', 'Phillips', 'Evans', 'Turner', 'Torres',
  'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores',
  'Morris', 'Nguyen', 'Murphy', 'Rivera', 'Cook',
  'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed',
  'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard',
  'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood',
  'Watson', 'Brooks', 'Bennett', 'Gray', 'James',
  'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers',
  'Long', 'Foster', 'Sanders', 'Ross', 'Morales',
  'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins',
  'Gutierrez', 'Perry', 'Butler', 'Barnes', 'Fisher'
];

// Pacific Northwest names (Oregon/Washington specific)
const pnwLastNames = [
  'Chen', 'Nguyen', 'Singh', 'Patel', 'Kim',
  'Park', 'Wu', 'Zhang', 'Wong', 'Lin',
  'Benson', 'Powell', 'Yamamoto', 'Choi', 'Lee',
  'Sharma', 'Ahmed', 'Gupta', 'Das', 'Kaur',
  'Chang', 'Jensen', 'Olsen', 'Larson', 'Peterson',
  'Stevenson', 'McAllister', 'Lindgren', 'Rasmussen', 'Sorensen'
];

/**
 * Generate a random name for a player based on gender
 */
export const generatePlayerName = (gender: string): string => {
  const firstNames = gender === 'Boys' ? boysFirstNames : girlsFirstNames;
  
  // Combine traditional and PNW last names with PNW having higher weight
  const combinedLastNames = [...lastNames, ...pnwLastNames, ...pnwLastNames];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = combinedLastNames[Math.floor(Math.random() * combinedLastNames.length)];
  
  return `${firstName} ${lastName}`;
};
