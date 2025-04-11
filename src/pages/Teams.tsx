
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TeamsContainer from '@/components/teams/TeamsContainer';

const Teams = () => {
  const [searchParams] = useSearchParams();
  const schoolIdParam = searchParams.get('school');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teams</h1>
      </div>
      
      <TeamsContainer initialSchoolId={schoolIdParam} />
    </div>
  );
};

export default Teams;
