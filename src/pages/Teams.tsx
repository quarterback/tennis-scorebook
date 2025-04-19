
import React from 'react';
import TeamsContainer from '@/components/teams/TeamsContainer';
import { useData } from '@/context/DataContext';

const Teams = () => {
  const { teams } = useData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Teams</h1>
      <p className="mb-4">Total Teams: {teams.length}</p>
      
      {/* Use the TeamsContainer component to manage teams */}
      <TeamsContainer filter={{}} />
    </div>
  );
};

export default Teams;
