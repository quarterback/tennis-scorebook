import { supabase } from '@/integrations/supabase/client';
import { Classification, District } from '@/types';

interface SchoolData {
  name: string;
  district: string;
  classification: Classification;
  city?: string;
}

/** Schools which should only ever have a Girls team (no Boys team) */
const ONLY_GIRLS_SCHOOLS = [
  "Tillamook",
  "Scappoose",
  "Westside Christian",
  "St. Mary's Academy"
];

export const importSchoolsAndTeams = async () => {
  // Schools by League
  const leagueSchools: Record<string, SchoolData[]> = {
    // 6A Districts
    '6a-1': [
      { name: 'Benson', district: '6a-1', classification: '6A' },
      { name: 'Cleveland', district: '6a-1', classification: '6A' },
      { name: 'Franklin', district: '6a-1', classification: '6A' },
      { name: 'Grant', district: '6a-1', classification: '6A' },
      { name: "Ida B. Wells", district: '6a-1', classification: '6A' },
      { name: 'Lincoln', district: '6a-1', classification: '6A' },
      { name: 'McDaniel', district: '6a-1', classification: '6A' },
      { name: 'Roosevelt', district: '6a-1', classification: '6A' }
    ],
    '6a-2': [
      { name: 'Aloha', district: '6a-2', classification: '6A' },
      { name: 'Beaverton', district: '6a-2', classification: '6A' },
      { name: 'Jesuit', district: '6a-2', classification: '6A' },
      { name: 'Mountainside', district: '6a-2', classification: '6A' },
      { name: 'Southridge', district: '6a-2', classification: '6A' },
      { name: 'Sunset', district: '6a-2', classification: '6A' },
      { name: 'Westview', district: '6a-2', classification: '6A' }
    ],
    '6a-3': [
      { name: 'Century', district: '6a-3', classification: '6A' },
      { name: 'Forest Grove', district: '6a-3', classification: '6A' },
      { name: 'Glencoe', district: '6a-3', classification: '6A' },
      { name: 'Liberty', district: '6a-3', classification: '6A' },
      { name: 'McMinnville', district: '6a-3', classification: '6A' },
      { name: 'Newberg', district: '6a-3', classification: '6A' },
      { name: 'Sherwood', district: '6a-3', classification: '6A' }
    ],
    '6a-4': [
      { name: 'Barlow', district: '6a-4', classification: '6A' },
      { name: 'Central Catholic', district: '6a-4', classification: '6A' },
      { name: 'Clackamas', district: '6a-4', classification: '6A' },
      { name: 'David Douglas', district: '6a-4', classification: '6A' },
      { name: 'Gresham', district: '6a-4', classification: '6A' },
      { name: 'Nelson', district: '6a-4', classification: '6A' },
      { name: 'Reynolds', district: '6a-4', classification: '6A' },
      { name: 'Sandy', district: '6a-4', classification: '6A' }
    ],
    '6a-5': [
      { name: 'Lake Oswego', district: '6a-5', classification: '6A' },
      { name: 'Lakeridge', district: '6a-5', classification: '6A' },
      { name: "St. Mary's Academy", district: '6a-5', classification: '6A' },
      { name: 'Tigard', district: '6a-5', classification: '6A' },
      { name: 'Tualatin', district: '6a-5', classification: '6A' },
      { name: 'West Linn', district: '6a-5', classification: '6A' }
    ],
    '6a-6': [
      { name: 'McNary', district: '6a-6', classification: '6A' },
      { name: 'North Salem', district: '6a-6', classification: '6A' },
      { name: 'South Salem', district: '6a-6', classification: '6A' },
      { name: 'Sprague', district: '6a-6', classification: '6A' },
      { name: 'West Salem', district: '6a-6', classification: '6A' }
    ],
    '6a-7': [
      { name: 'Grants Pass', district: '6a-7', classification: '6A' },
      { name: 'North Medford', district: '6a-7', classification: '6A' },
      { name: 'Roseburg', district: '6a-7', classification: '6A' },
      { name: 'Sheldon', district: '6a-7', classification: '6A' },
      { name: 'South Eugene', district: '6a-7', classification: '6A' },
      { name: 'South Medford', district: '6a-7', classification: '6A' },
      { name: 'Willamette', district: '6a-7', classification: '6A' }
    ],

    // 5A Districts
    '5a-1': [
      { name: 'Canby', district: '5a-1', classification: '5A' },
      { name: 'Centennial', district: '5a-1', classification: '5A' },
      { name: 'Hillsboro', district: '5a-1', classification: '5A' },
      { name: 'Hood River Valley', district: '5a-1', classification: '5A' },
      { name: 'La Salle Prep', district: '5a-1', classification: '5A' },
      { name: 'Milwaukie / Milwaukie Acad. of the Arts', district: '5a-1', classification: '5A' },
      { name: 'Parkrose', district: '5a-1', classification: '5A' },
      { name: 'Putnam', district: '5a-1', classification: '5A' },
      { name: 'Wilsonville', district: '5a-1', classification: '5A' }
    ],
    '5a-2': [
      { name: 'Ashland', district: '5a-2', classification: '5A' },
      { name: 'Churchill', district: '5a-2', classification: '5A' },
      { name: 'North Eugene', district: '5a-2', classification: '5A' },
      { name: 'Springfield', district: '5a-2', classification: '5A' },
      { name: 'Thurston', district: '5a-2', classification: '5A' }
    ],
    '5a-3': [
      { name: 'Central', district: '5a-3', classification: '5A' },
      { name: 'Corvallis', district: '5a-3', classification: '5A' },
      { name: 'Crescent Valley', district: '5a-3', classification: '5A' },
      { name: 'Dallas', district: '5a-3', classification: '5A' },
      { name: 'Lebanon', district: '5a-3', classification: '5A' },
      { name: 'McKay', district: '5a-3', classification: '5A' },
      { name: 'Silverton', district: '5a-3', classification: '5A' },
      { name: 'South Albany', district: '5a-3', classification: '5A' },
      { name: 'West Albany', district: '5a-3', classification: '5A' },
      { name: 'Woodburn', district: '5a-3', classification: '5A' }
    ],
    '5a-4': [
      { name: 'Bend', district: '5a-4', classification: '5A' },
      { name: 'Caldera', district: '5a-4', classification: '5A' },
      { name: 'Mountain View', district: '5a-4', classification: '5A' },
      { name: 'Redmond', district: '5a-4', classification: '5A' },
      { name: 'Ridgeview', district: '5a-4', classification: '5A' },
      { name: 'Summit', district: '5a-4', classification: '5A' }
    ],

    // 4A/3A/2A/1A Special Districts
    'sd-1': [
      { name: 'Blanchet Catholic', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Catlin Gabel', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Oregon Episcopal', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Riverdale', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Riverside, WLWV', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Scappoose', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'St. Helens', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Tillamook', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Trinity Academy', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Valley Catholic', district: 'sd-1', classification: '4A/3A/2A/1A' },
      { name: 'Westside Christian', district: 'sd-1', classification: '4A/3A/2A/1A' }
    ],
    'sd-2': [
      { name: 'Cascade', district: 'sd-2', classification: '4A/3A/2A/1A' },
      { name: 'Estacada', district: 'sd-2', classification: '4A/3A/2A/1A' },
      { name: 'Junction City', district: 'sd-2', classification: '4A/3A/2A/1A' },
      { name: 'Marist Catholic', district: 'sd-2', classification: '4A/3A/2A/1A' },
      { name: 'Molalla', district: 'sd-2', classification: '4A/3A/2A/1A' },
      { name: 'North Marion', district: 'sd-2', classification: '4A/3A/2A/1A' },
      { name: 'Philomath', district: 'sd-2', classification: '4A/3A/2A/1A' },
      { name: 'Stayton', district: 'sd-2', classification: '4A/3A/2A/1A' }
    ],
    'sd-3': [
      { name: 'Cascade Christian', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'Creswell', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'Henley', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'Hidden Valley', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'Klamath Union', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'Marshfield', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'Mazama', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'North Bend', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: 'North Valley', district: 'sd-3', classification: '4A/3A/2A/1A' },
      { name: "St. Mary's, Medford", district: 'sd-3', classification: '4A/3A/2A/1A' }
    ],
    'sd-4': [
      { name: 'Arlington', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Condon', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Crook County', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Ione / Heppner', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Irrigon', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Madras', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Riverside', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Sherman', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Sisters', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Stanfield / Echo', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'The Dalles', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Umatilla', district: 'sd-4', classification: '4A/3A/2A/1A' },
      { name: 'Weston-McEwen / Griswold', district: 'sd-4', classification: '4A/3A/2A/1A' }
    ],
    'sd-5': [
      { name: 'Baker / Powder Valley', district: 'sd-5', classification: '4A/3A/2A/1A' },
      { name: 'Four Rivers', district: 'sd-5', classification: '4A/3A/2A/1A' },
      { name: 'La Grande', district: 'sd-5', classification: '4A/3A/2A/1A' },
      { name: 'McLoughlin', district: 'sd-5', classification: '4A/3A/2A/1A' },
      { name: 'Nyssa', district: 'sd-5', classification: '4A/3A/2A/1A' },
      { name: 'Ontario', district: 'sd-5', classification: '4A/3A/2A/1A' },
      { name: 'Pendleton', district: 'sd-5', classification: '4A/3A/2A/1A' },
      { name: 'Vale', district: 'sd-5', classification: '4A/3A/2A/1A' }
    ]
  };

  const importLogs: string[] = [];
  let schoolsAdded = 0;
  let teamsAdded = 0;
  let existingSchools = 0;
  
  // First check if there are existing schools
  const { data: existingSchoolsData, error: checkError } = await supabase
    .from('schools')
    .select('id, name')
    .limit(1);
    
  if (checkError) {
    console.error('Error checking for existing schools:', checkError);
    throw checkError;
  }
  
  // If schools already exist, only add new ones
  const shouldOnlyAddNew = existingSchoolsData && existingSchoolsData.length > 0;

  for (const [districtCode, schools] of Object.entries(leagueSchools)) {
    const { data: districtData, error: districtError } = await supabase
      .from('districts')
      .select('id')
      .eq('code', districtCode)
      .single();

    if (districtError) {
      console.error(`Error finding district ${districtCode}:`, districtError);
      importLogs.push(`Error finding district ${districtCode}`);
      continue;
    }

    for (const school of schools) {
      // Check if school already exists
      if (shouldOnlyAddNew) {
        const { data: existingSchool, error: schoolCheckError } = await supabase
          .from('schools')
          .select('id')
          .eq('name', school.name)
          .maybeSingle();
        
        if (schoolCheckError) {
          console.error(`Error checking if school ${school.name} exists:`, schoolCheckError);
          importLogs.push(`Error checking for ${school.name}`);
          continue;
        }
        
        if (existingSchool) {
          console.log(`School ${school.name} already exists, skipping`);
          existingSchools++;
          continue;
        }
      }

      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: school.name,
          district_id: districtData.id,
          classification: school.classification,
          city: school.city || 'Portland',
          state: 'OR'
        })
        .select()
        .single();

      if (schoolError) {
        console.error(`Error inserting school ${school.name}:`, schoolError);
        importLogs.push(`Failed to add ${school.name}`);
        continue;
      }

      schoolsAdded++;
      
      // Determine whether to add both Boys and Girls teams, or only Girls
      let teamInserts = [];
      const isGirlsOnly = ONLY_GIRLS_SCHOOLS.includes(school.name);

      if (!isGirlsOnly) {
        teamInserts.push({ school_id: schoolData.id, gender: 'Boys' });
      }
      teamInserts.push({ school_id: schoolData.id, gender: 'Girls' });

      const { data: teamsData, error: teamError } = await supabase
        .from('teams')
        .insert(teamInserts)
        .select();

      if (teamError) {
        console.error(`Error inserting teams for ${school.name}:`, teamError);
        importLogs.push(`Failed to add teams for ${school.name}`);
      } else {
        teamsAdded += teamsData.length;
      }
    }
  }

  console.log('School and team data import completed');
  const summary = {
    schoolsAdded,
    teamsAdded,
    existingSchools,
    logs: importLogs
  };
  
  return summary;
};
