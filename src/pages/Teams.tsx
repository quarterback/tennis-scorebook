
import React from 'react';
import TeamsContainer from '@/components/teams/TeamsContainer';

const Teams = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Teams</h1>
      
      {/* Use the TeamsContainer component to manage teams */}
      <TeamsContainer filter={{}} />
    </div>
  );
};

export default Teams;
