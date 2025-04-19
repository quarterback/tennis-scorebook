
import { School } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface SchoolFilteringProps {
  schools: School[];
  filter: {
    classification?: string;
  };
}

export const useSchoolFiltering = ({ schools, filter }: SchoolFilteringProps) => {
  const { user } = useAuth();

  const filteredSchools = user?.role === 'coach' && user.schoolId
    ? schools.filter(school => school.id === user.schoolId)
    : schools;
  
  const classificationFilteredSchools = filter.classification 
    ? filteredSchools.filter(school => school.classification === filter.classification)
    : filteredSchools;

  return {
    classificationFilteredSchools
  };
};
