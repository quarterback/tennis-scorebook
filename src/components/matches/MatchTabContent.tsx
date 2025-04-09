
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Match, Team, School, Player } from '@/types';
import MatchCard from './MatchCard';

interface MatchTabContentProps {
  tabValue: 'upcoming' | 'completed' | 'all';
  matches: Match[];
  expandedMatchId: string | null;
  setExpandedMatchId: (id: string | null) => void;
  getTeamName: (teamId: string) => string;
  canEditMatch: (match: Match) => boolean;
  openEditDialog: (match: Match) => void;
  players: Player[];
}

const MatchTabContent: React.FC<MatchTabContentProps> = ({
  tabValue,
  matches,
  expandedMatchId,
  setExpandedMatchId,
  getTeamName,
  canEditMatch,
  openEditDialog,
  players
}) => {
  const filteredMatches = matches
    .filter(match => {
      if (tabValue === 'all') return true;
      if (tabValue === 'upcoming') return !match.isComplete;
      return match.isComplete;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <TabsContent value={tabValue} className="space-y-4">
      {filteredMatches.length > 0 ? (
        filteredMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            expandedMatchId={expandedMatchId}
            setExpandedMatchId={setExpandedMatchId}
            getTeamName={getTeamName}
            canEditMatch={canEditMatch}
            openEditDialog={openEditDialog}
            players={players}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 py-10">
          No {tabValue === 'upcoming' ? 'upcoming' : tabValue === 'completed' ? 'completed' : ''} matches found
        </div>
      )}
    </TabsContent>
  );
};

export default MatchTabContent;
