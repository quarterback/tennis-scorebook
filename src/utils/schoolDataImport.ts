
import { supabase } from '@/integrations/supabase/client';
import { Classification, District } from '@/types';

interface SchoolData {
  name: string;
  district: string;
  classification: Classification;
  city?: string;
}

export const importSchoolsAndTeams = async () => {
  // 6A Schools by League
  const leagueSchools: Record<string, SchoolData[]> = {
    '6a-1': [
      { name: 'Benson', district: '6a-1', classification: '6A' },
      { name: 'Cleveland', district: '6a-1', classification: '6A' },
      { name: 'Franklin', district: '6a-1', classification: '6A' },
      { name: 'Grant', district: '6a-1', classification: '6A' },
      { name: 'Ida B. Wells', district: '6a-1', classification: '6A' },
      { name: 'Lincoln', district: '6a-1', classification: '6A' },
      { name: 'McDaniel', district: '6a-1', classification: '6A' },
      { name: 'Roosevelt', district: '6a-1', classification: '6A' },
    ],
    // Add other leagues similarly...
  };

  for (const [districtCode, schools] of Object.entries(leagueSchools)) {
    const { data: districtData, error: districtError } = await supabase
      .from('districts')
      .select('id')
      .eq('code', districtCode)
      .single();

    if (districtError) {
      console.error(`Error finding district ${districtCode}:`, districtError);
      continue;
    }

    for (const school of schools) {
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
        continue;
      }

      // Create Boys and Girls teams for each school
      const teamInserts = [
        { school_id: schoolData.id, gender: 'Boys' },
        { school_id: schoolData.id, gender: 'Girls' }
      ];

      const { error: teamError } = await supabase
        .from('teams')
        .insert(teamInserts);

      if (teamError) {
        console.error(`Error inserting teams for ${school.name}:`, teamError);
      }
    }
  }

  console.log('School and team data import completed');
};
