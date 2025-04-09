
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchTabContent from './MatchTabContent';
import { useMatches } from '@/context/MatchesContext';

const MatchesTabs: React.FC = () => {
  const { 
    filteredMatches, 
    expandedMatchId, 
    setExpandedMatchId, 
    getTeamName, 
    canEditMatch, 
    openEditDialog,
    players 
  } = useMatches();

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="all">All Matches</TabsTrigger>
      </TabsList>
      
      {(['upcoming', 'completed', 'all'] as const).map((tabValue) => (
        <MatchTabContent
          key={tabValue}
          tabValue={tabValue}
          matches={filteredMatches}
          expandedMatchId={expandedMatchId}
          setExpandedMatchId={setExpandedMatchId}
          getTeamName={getTeamName}
          canEditMatch={canEditMatch}
          openEditDialog={openEditDialog}
          players={players}
        />
      ))}
    </Tabs>
  );
};

export default MatchesTabs;
