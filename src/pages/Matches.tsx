
import React from 'react';
import { MatchesProvider } from '@/context/MatchesContext';
import MatchesHeader from '@/components/matches/MatchesHeader';
import MatchesTabs from '@/components/matches/MatchesTabs';
import MatchDialogs from '@/components/matches/MatchDialogs';

const Matches = () => {
  return (
    <MatchesProvider>
      <div className="space-y-6">
        <MatchesHeader />
        <MatchesTabs />
        <MatchDialogs />
      </div>
    </MatchesProvider>
  );
};

export default Matches;
